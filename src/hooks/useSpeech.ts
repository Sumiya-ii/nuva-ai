import { useEffect, useRef, useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { transcribe } from '../utils/whisperClient';

const SAMPLE_RATE = 16000;
const FRAME_SIZE = 320; // 20ms at 16kHz
const SILENCE_THRESHOLD = 400; // ms
const MIN_SPEECH_FRAMES = 50;
const MAX_CHUNK_MS = 12000;
const OVERLAP_FRAMES = 25; // 0.5s at 20ms frames
const DEBOUNCE_MS = 100;

interface UseSpeechOptions {
  onUtterance: (text: string) => void;
}

export function useSpeech({ onUtterance }: UseSpeechOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recording = useRef<Audio.Recording | null>(null);
  const frameBuffer = useRef<Uint8Array[]>([]);
  const lastFlushTime = useRef<number>(0);
  const silenceStart = useRef<number | null>(null);
  const speechFrames = useRef<number>(0);
  const chunkStartTime = useRef<number>(0);

  const flushBuffer = useCallback(async () => {
    if (frameBuffer.current.length === 0) {
      console.log('No frames to flush');
      return;
    }
    
    const now = Date.now();
    if (now - lastFlushTime.current < DEBOUNCE_MS) {
      console.log('Debouncing flush');
      return;
    }
    
    console.log('Flushing buffer with', frameBuffer.current.length, 'frames');
    
    // Keep last OVERLAP_FRAMES frames for next chunk
    const framesToSend = frameBuffer.current.slice(0, -OVERLAP_FRAMES);
    frameBuffer.current = frameBuffer.current.slice(-OVERLAP_FRAMES);
    
    // Concatenate frames into a single buffer
    const totalLength = framesToSend.reduce((acc, frame) => acc + frame.length, 0);
    const audioData = new Uint8Array(totalLength);
    let offset = 0;
    for (const frame of framesToSend) {
      audioData.set(frame, offset);
      offset += frame.length;
    }

    console.log('Sending audio data for transcription, size:', audioData.length);
    try {
      const text = await transcribe(audioData);
      console.log('Received transcription:', text);
      if (text.trim()) {
        onUtterance(text);
      } else {
        console.log('Empty transcription received');
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setError(err instanceof Error ? err.message : 'Transcription failed');
    }

    lastFlushTime.current = now;
    silenceStart.current = null;
    speechFrames.current = 0;
    chunkStartTime.current = now;
  }, [onUtterance]);

  const processAudioFrame = useCallback((frame: Uint8Array) => {
    console.log('Processing audio frame, size:', frame.length);
    frameBuffer.current.push(frame);
    
    // Simple energy-based VAD
    const energy = frame.reduce((sum, val) => sum + val * val, 0) / frame.length;
    const isSpeech = energy > 1000; // Adjust threshold as needed
    console.log('Frame energy:', energy, 'isSpeech:', isSpeech);

    if (isSpeech) {
      speechFrames.current++;
      silenceStart.current = null;
    } else if (silenceStart.current === null) {
      silenceStart.current = Date.now();
    }

    const now = Date.now();
    const silenceDuration = silenceStart.current ? now - silenceStart.current : 0;
    const chunkDuration = now - chunkStartTime.current;

    if ((silenceDuration >= SILENCE_THRESHOLD && speechFrames.current >= MIN_SPEECH_FRAMES) ||
        chunkDuration >= MAX_CHUNK_MS) {
      console.log('Triggering flush - silence:', silenceDuration, 'ms, speech frames:', speechFrames.current);
      flushBuffer();
    }
  }, [flushBuffer]);

  const startRecording = useCallback(async () => {
    try {
      console.log('Requesting audio permissions...');
      const { status } = await Audio.requestPermissionsAsync();
      console.log('Audio permission status:', status);
      
      if (status !== 'granted') {
        throw new Error('Microphone permission not granted');
      }

      console.log('Setting audio mode...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
      });

      console.log('Creating recording...');
      const { recording: newRecording } = await Audio.Recording.createAsync(
        {
          android: {
            extension: '.wav',
            outputFormat: 2, // MPEG_4
            audioEncoder: 3, // AAC
            sampleRate: SAMPLE_RATE,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.wav',
            outputFormat: 1, // Linear PCM
            audioQuality: 1, // Max quality
            sampleRate: SAMPLE_RATE,
            numberOfChannels: 1,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
          web: {
            mimeType: 'audio/wav',
            bitsPerSecond: 128000,
          },
        },
        (status) => {
          console.log('Recording status update:', status);
          if (status.isRecording) {
            // Get the audio data from the recording
            const uri = newRecording.getURI();
            if (uri) {
              console.log('Reading audio data from:', uri);
              // Read the audio file and process it
              fetch(uri)
                .then(response => response.arrayBuffer())
                .then(buffer => {
                  const audioData = new Uint8Array(buffer);
                  console.log('Read audio data, size:', audioData.length);
                  processAudioFrame(audioData);
                })
                .catch(err => {
                  console.error('Error reading audio data:', err);
                });
            } else {
              console.log('No URI available for recording');
            }
          }
        },
        1000 / (FRAME_SIZE / SAMPLE_RATE)
      );

      recording.current = newRecording;
      setIsRecording(true);
      setError(null);
      frameBuffer.current = [];
      lastFlushTime.current = Date.now();
      silenceStart.current = null;
      speechFrames.current = 0;
      chunkStartTime.current = Date.now();
      console.log('Recording started successfully');
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to start recording');
    }
  }, [processAudioFrame]);

  const stopRecording = useCallback(async () => {
    try {
      console.log('Stopping recording...');
      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
        recording.current = null;
      }
      setIsRecording(false);
      await flushBuffer();
      console.log('Recording stopped successfully');
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to stop recording');
    }
  }, [flushBuffer]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
  };
} 
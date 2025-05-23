import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { ConversationStatus } from './ConversationStatus';
import { ConversationTimer } from './ConversationTimer';

interface VoiceConversationProps {
  onConversationEnd: (transcript: string) => void;
}

export const VoiceConversation: React.FC<VoiceConversationProps> = ({ onConversationEnd }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const recording = useRef<Audio.Recording | null>(null);
  const audioPlayer = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    setupAudio();
    return () => {
      stopRecording();
      if (audioPlayer.current) {
        audioPlayer.current.unloadAsync();
      }
    };
  }, []);

  const setupAudio = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant microphone access to use this feature.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
      });

      startRecording();
    } catch (error) {
      console.error('Error setting up audio:', error);
      Alert.alert('Error', 'Failed to setup audio. Please try again.');
    }
  };

  const startRecording = async () => {
    try {
      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
      }

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording.current = newRecording;
      setIsListening(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    try {
      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
        recording.current = null;
      }
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const handleTimerComplete = () => {
    stopRecording();
    onConversationEnd(transcript);
  };

  return (
    <View style={styles.container}>
      <ConversationTimer duration={180} onComplete={handleTimerComplete} />
      <ConversationStatus
        isListening={isListening}
        isProcessing={isProcessing}
        isAISpeaking={isAISpeaking}
        transcript={transcript}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
}); 
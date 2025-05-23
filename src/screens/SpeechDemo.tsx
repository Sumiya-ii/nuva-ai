import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSpeech } from '../hooks/useSpeech';

export const SpeechDemo: React.FC = () => {
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { isRecording, error, startRecording, stopRecording } = useSpeech({
    onUtterance: (text) => {
      setTranscript((prev) => [...prev, text]);
      setIsProcessing(false);
      // Scroll to bottom when new text arrives
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
  });

  const handleToggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      setIsProcessing(true);
      await startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Speech Recognition Demo</Text>
        <Text style={styles.subtitle}>
          {isRecording ? 'Listening...' : 'Press Start to begin'}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isRecording && styles.buttonRecording]}
        onPress={handleToggleRecording}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.transcriptContainer}>
        <Text style={styles.transcriptHeader}>Transcript:</Text>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.transcriptScroll}
          contentContainerStyle={styles.transcriptContent}
        >
          {transcript.map((text, index) => (
            <Text key={index} style={styles.transcriptText}>
              {text}
            </Text>
          ))}
          {transcript.length === 0 && (
            <Text style={styles.emptyText}>
              No speech detected yet. Start recording and speak clearly.
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonRecording: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  transcriptContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
  },
  transcriptHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  transcriptScroll: {
    flex: 1,
  },
  transcriptContent: {
    paddingBottom: 20,
  },
  transcriptText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
}); 
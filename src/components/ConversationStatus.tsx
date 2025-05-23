import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ConversationStatusProps {
  isListening: boolean;
  isProcessing: boolean;
  isAISpeaking: boolean;
  transcript: string;
}

export const ConversationStatus: React.FC<ConversationStatusProps> = ({
  isListening,
  isProcessing,
  isAISpeaking,
  transcript,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        {isListening && <Text style={styles.statusText}>Listening...</Text>}
        {isProcessing && <Text style={styles.statusText}>Processing...</Text>}
        {isAISpeaking && <Text style={styles.statusText}>AI Speaking...</Text>}
      </View>
      {transcript ? (
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: '#666',
  },
  transcriptContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
  },
  transcriptText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
}); 
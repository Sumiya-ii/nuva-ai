import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface AICharacterProps {
  isSpeaking: boolean;
}

export const AICharacter: React.FC<AICharacterProps> = ({ isSpeaking }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🤖</Text>
      <Text style={styles.name}>Nuva</Text>
      {isSpeaking && <Text style={styles.speaking}>Speaking...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  speaking: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
}); 
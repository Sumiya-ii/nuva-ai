import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { VoiceConversation } from '../components/VoiceConversation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Assessment'>;

export const AssessmentScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setupAudio();
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

      setIsLoading(false);
    } catch (error) {
      console.error('Error setting up audio:', error);
      Alert.alert('Error', 'Failed to setup audio. Please try again.');
    }
  };

  const handleConversationEnd = (transcript: string) => {
    navigation.replace('Results', { transcript });
  };

  if (isLoading) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <VoiceConversation onConversationEnd={handleConversationEnd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 
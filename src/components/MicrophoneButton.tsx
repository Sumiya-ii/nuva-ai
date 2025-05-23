import React from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MicrophoneButtonProps {
  isRecording: boolean;
  onPress: () => void;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  isRecording,
  onPress,
}) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulse,
          {
            transform: [{ scale: pulseAnim }],
            opacity: isRecording ? 0.5 : 0,
          },
        ]}
      />
      <TouchableOpacity
        style={[styles.button, isRecording && styles.buttonActive]}
        onPress={onPress}
      >
        <MaterialIcons
          name={isRecording ? 'mic' : 'mic-none'}
          size={32}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonActive: {
    backgroundColor: '#FF3B30',
  },
  pulse: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF3B30',
  },
}); 
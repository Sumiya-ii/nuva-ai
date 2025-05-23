import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ConversationTimerProps {
  duration: number;
  onComplete: () => void;
}

export const ConversationTimer: React.FC<ConversationTimerProps> = ({
  duration,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
}); 
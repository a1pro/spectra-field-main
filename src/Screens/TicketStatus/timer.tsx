import React from 'react';
import { View, Text } from 'react-native';
import styles from './style'; // Reuse the styles from the main file

interface TimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  formatTime: (time: number) => string;
}

const Timer: React.FC<TimerProps> = ({ hours, minutes, seconds, formatTime }) => {
  return (
    <View style={styles.timer}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(hours)}</Text>
        <Text style={styles.labelText}>hour</Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(minutes)}</Text>
        <Text style={styles.labelText}>min</Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(seconds)}</Text>
        <Text style={styles.labelText}>sec</Text>
      </View>
    </View>
  );
};

export default Timer;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const PhaseHolding = () => (
  <View style={styles.container}>
    <View style={styles.mainCircle}>
      <Text style={styles.circleText}>Pulse found.{"\n"}Please hold still.</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },
  mainCircle: { width: '62%', aspectRatio: 1, borderRadius: 9999, backgroundColor: '#e8e8e8', borderWidth: 6, borderColor: '#5a5b78', justifyContent: 'center', alignItems: 'center' },
  circleText: { fontSize: 16, color: '#1a1a1a', textAlign: 'center', fontWeight: '500', lineHeight: 24 },
});
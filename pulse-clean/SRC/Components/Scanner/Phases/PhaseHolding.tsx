import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const PhaseHolding = () => (
  <View style={styles.container}>
    <View style={styles.mainCircle}>
      <Text style={styles.circleText}>Pulse found.{"\n"}Please hold still.</Text>
    </View>
  </View>
);

// Reuse the same styles object from PhaseDetecting
const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 43 },
  mainCircle: { width: 240, height: 240, borderRadius: 120, backgroundColor: '#e8e8e8', borderWidth: 6, borderColor: '#5a5b78', justifyContent: 'center', alignItems: 'center' },
  circleText: { fontSize: 16, color: '#1a1a1a', textAlign: 'center', fontWeight: '500', lineHeight: 24 },
});
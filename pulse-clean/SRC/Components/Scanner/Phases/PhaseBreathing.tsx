import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const PhaseBreathing = () => (
  <View style={styles.container}>
    <View style={styles.mainCircle}>
      <Text style={styles.circleText}>Breathe naturally{"\n"}and relax.</Text>
    </View>
  </View>
);

// Reuse the same styles object
const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 43 },
  mainCircle: { width: 240, height: 240, borderRadius: 120, backgroundColor: '#e8e8e8', borderWidth: 6, borderColor: '#5a5b78', justifyContent: 'center', alignItems: 'center' },
  circleText: { fontSize: 16, color: '#1a1a1a', textAlign: 'center', fontWeight: '500', lineHeight: 24 },
});
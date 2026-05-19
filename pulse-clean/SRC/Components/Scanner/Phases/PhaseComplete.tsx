import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const PhaseComplete = ({ bpm }: { bpm: number | null }) => (
  <View style={styles.container}>
    <View style={styles.mainCircle}>
      <Text style={styles.bpmNumber}>
        {bpm !== null ? bpm : '--'}<Text style={styles.bpmLabel}>BPM</Text>
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 43 },
  mainCircle: { width: 240, height: 240, borderRadius: 120, backgroundColor: '#e8e8e8', borderWidth: 6, borderColor: '#5a5b78', justifyContent: 'center', alignItems: 'center' },
  bpmNumber: { fontSize: 72, color: '#1a1a1a', fontWeight: '300' },
  bpmLabel: { fontSize: 18, color: '#1a1a1a', fontWeight: 'bold' },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useResponsive } from '../../../Constants/responsive';

export const PhaseComplete = ({ bpm }: { bpm: number | null }) => {
  const { fontSize } = useResponsive();

  return (
    <View style={styles.container}>
      <View style={styles.mainCircle}>
        <Text style={[styles.bpmNumber, { fontSize: fontSize.bpmLarge }]}>
          {bpm !== null ? bpm : '--'}
          <Text style={[styles.bpmLabel, { fontSize: fontSize.xl }]}>BPM</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },
  mainCircle: { width: '62%', aspectRatio: 1, borderRadius: 9999, backgroundColor: '#e8e8e8', borderWidth: 6, borderColor: '#5a5b78', justifyContent: 'center', alignItems: 'center' },
  bpmNumber: { color: '#1a1a1a', fontWeight: '300' },
  bpmLabel: { color: '#1a1a1a', fontWeight: 'bold' },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const PhaseIdle = ({ onStart }: { onStart: () => void }) => (
  <View style={styles.container}>
    <View style={styles.groupedCenter}>
      <Text style={styles.instructionText}>
        Place the tip of your index finger{"\n"}gently on the camera lens
      </Text>
      <TouchableOpacity style={styles.mainCircle} onPress={onStart} activeOpacity={0.8}>
        <Text style={styles.circleText}>Tap to scan{"\n"}your pulse</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' },
  groupedCenter: { alignItems: 'center' },
  instructionText: { color: 'white', fontSize: 12, textAlign: 'center', marginBottom: 25, lineHeight: 18 },
  mainCircle: { width: 240, aspectRatio: 1, borderRadius: 9999, backgroundColor: '#e8e8e8', borderWidth: 6, borderColor: '#5a5b78', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 15, elevation: 10 },
  circleText: { fontSize: 16, color: '#1a1a1a', textAlign: 'center', fontWeight: '500', lineHeight: 24 },
});
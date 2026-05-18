import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const CameraView = ({ onBpmUpdate }: { onBpmUpdate: (bpm: number) => void }) => {
  
  // This simulates finding a pulse after 3 seconds for testing purposes!
  useEffect(() => {
    const timer = setTimeout(() => {
      onBpmUpdate(85); // Fakes reading 85 BPM
    }, 3000);
    return () => clearTimeout(timer);
  }, [onBpmUpdate]);

  return (
    <View style={styles.container}>
      <View style={styles.fakeCamera}>
        <Text style={{color: 'white', textAlign: 'center'}}>
          (Fake Camera) {'\n'} Simulating scan...
        </Text>
      </View>
      <View style={styles.overlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 200, height: 200, borderRadius: 100, overflow: 'hidden' },
  fakeCamera: { ...StyleSheet.absoluteFillObject, backgroundColor: '#333', justifyContent: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26, 26, 46, 0.5)' }
});

export default CameraView;
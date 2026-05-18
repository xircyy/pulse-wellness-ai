import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import HeartScanner from '../Components/Scanner/HeartScanner';
const ScanScreen = () => {
  return (
    <SafeAreaView style={styles.root}>
      <HeartScanner />
      {/* Bottom Navigation Placeholder (from Figma)[cite: 1] */}
      <View style={styles.bottomNavPlaceholder} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A1A2E' },
  bottomNavPlaceholder: { height: 60, backgroundColor: '#252545', width: '100%' }
});

export default ScanScreen;
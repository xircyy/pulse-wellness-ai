import React from 'react';
import { View } from 'react-native';

// 1. Update the import path to point to your new Scanner folder and file
import HeartScanner from '../../SRC/Components/Scanner/HeartScanner'; 

export default function Home() {
  return (
    // 2. Wrap it in a flex: 1 View so the background stretches to the bottom edge
    <View style={{ flex: 1 }}>
      <HeartScanner />
    </View>
  );
}
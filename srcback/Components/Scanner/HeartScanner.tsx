import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { ScanState } from '../../Constants/states';
import CameraView from './CameraView'; 
import ContextGrid from '../Insights/ContextGrid';
import { fetchAIInsight } from '../../API/aiService'; // Import the new service

const { width } = Dimensions.get('window');

const HeartScanner = () => {
  const [currentState, setCurrentState] = useState<ScanState>(ScanState.IDLE);
  const [bpm, setBpm] = useState<number | null>(null);
  const [aiInsight, setAiInsight] = useState<string>('');

  const handleScanFinished = (finalBpm: number) => {
    setBpm(finalBpm);
    setCurrentState(ScanState.SELECTING_CONTEXT);
  };

  const handleContextSelect = async (contextId: string) => {
    setCurrentState(ScanState.AWAITING_AI);
    
    // Call the API service[cite: 1]
    if (bpm) {
      const insight = await fetchAIInsight(bpm, contextId);
      setAiInsight(insight);
      setCurrentState(ScanState.SHOWING_INSIGHT);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER SECTION */}
      <Text style={styles.headerText}>
        {currentState === ScanState.SHOWING_INSIGHT ? "AI Insight" : "Camera"}
      </Text>

      {/* VIEW: SCANNING & IDLE[cite: 1] */}
      {(currentState === ScanState.IDLE || currentState === ScanState.SCANNING) && (
        <View style={styles.mainCircle}>
          {currentState === ScanState.IDLE ? (
            <Text style={styles.centerText} onPress={() => setCurrentState(ScanState.SCANNING)}>
              Tap to scan your pulse
            </Text>
          ) : (
            <CameraView onBpmUpdate={handleScanFinished} />
          )}
        </View>
      )}

      {/* VIEW: SELECTING CONTEXT[cite: 1] */}
      {currentState === ScanState.SELECTING_CONTEXT && (
        <ContextGrid onSelect={handleContextSelect} />
      )}

      {/* VIEW: LOADING AI[cite: 1] */}
      {currentState === ScanState.AWAITING_AI && (
        <View style={styles.loadingBox}>
          <Text style={styles.bpmDisplay}>{bpm} BPM</Text>
          <Text style={styles.loadingText}>Reflecting on your reading...</Text>
        </View>
      )}

      {/* VIEW: FINAL INSIGHT (Matches Figma AI Insight Screen)[cite: 1] */}
      {currentState === ScanState.SHOWING_INSIGHT && (
        <ScrollView contentContainerStyle={styles.insightCard}>
          <Text style={styles.insightBpm}>{bpm} BPM</Text>
          <Text style={styles.insightText}>{aiInsight}</Text>
          <Text style={styles.disclaimer}>
            If feeling unwell, please seek medical attention.[cite: 1]
          </Text>
          <Text style={styles.resetButton} onPress={() => setCurrentState(ScanState.IDLE)}>
            Scan Again
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' },
  headerText: { color: 'white', fontSize: 18, position: 'absolute', top: 50, fontWeight: 'bold' },
  mainCircle: { /* ... same as previous ... */ },
  centerText: { /* ... same as previous ... */ },
  loadingBox: { alignItems: 'center' },
  bpmDisplay: { color: 'white', fontSize: 64, fontWeight: 'bold' },
  loadingText: { color: 'rgba(255,255,255,0.6)', marginTop: 15 },
  insightCard: { 
    width: width * 0.85, 
    backgroundColor: 'rgba(255,255,255,0.08)', 
    borderRadius: 20, 
    padding: 30, 
    alignItems: 'center' 
  },
  insightBpm: { color: '#FF8A8A', fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  insightText: { color: 'white', fontSize: 16, lineHeight: 24, textAlign: 'center' },
  disclaimer: { color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 30, textAlign: 'center' },
  resetButton: { color: '#FF8A8A', fontWeight: 'bold', marginTop: 20, padding: 10 }
});

export default HeartScanner;
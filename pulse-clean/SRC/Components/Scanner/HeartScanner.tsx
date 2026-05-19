import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { Worklets, useSharedValue } from 'react-native-worklets-core';
import { VisionCameraProxy } from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ScanState } from '../../Constants/states'; 
import { fetchAIInsight } from '../../API/aiService'; 

import { PhaseIdle } from './Phases/PhaseIdle';
import { PhaseDetecting } from './Phases/PhaseDetecting';
import { PhaseHolding } from './Phases/PhaseHolding';
import { PhaseBreathing } from './Phases/PhaseBreathing';
import { PhaseComplete } from './Phases/PhaseComplete';

// @ts-ignore
const rednessPlugin = VisionCameraProxy.initFrameProcessorPlugin('getAverageRedness');

export default function HeartScanner() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [currentState, setCurrentState] = useState<ScanState>(ScanState.IDLE);
  const [scanPhase, setScanPhase] = useState(0); 
  const [bpm, setBpm] = useState<number | null>(null);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [selectedContext, setSelectedContext] = useState<string>('');
  const [torchOn, setTorchOn] = useState(false);
  
  // --- DIAGNOSTIC STATES ---
  const [diagRaw, setDiagRaw] = useState<number>(0);
  const [diagVariance, setDiagVariance] = useState<number>(0);
  const [diagStatus, setDiagStatus] = useState<string>("WAITING...");
  const recentReadings = useRef<number[]>([]);

  const beatCount = useSharedValue(0);
  const startTime = useSharedValue(0);
  const lastBeatTime = useSharedValue(0);
  const rollingAverage = useSharedValue(0);
  const frameCount = useSharedValue(0);
  const isAboveAverage = useSharedValue(false);

  const updatePhaseJS = Worklets.createRunOnJS((phase: number) => {
    setScanPhase(phase);
  });

  const finishScanJS = Worklets.createRunOnJS((finalBpm: number) => {
    setTorchOn(false);
    setBpm(finalBpm);
    setCurrentState(ScanState.SELECTING_CONTEXT);
  });

  // --- DIAGNOSTIC ANALYZER ---
  const updateDiagnosticsJS = Worklets.createRunOnJS((val: number) => {
    setDiagRaw(Math.round(val));
    
    // Keep a rolling window of the last 20 frames to check for pulse variance
    recentReadings.current.push(val);
    if (recentReadings.current.length > 20) recentReadings.current.shift();

    const max = Math.max(...recentReadings.current);
    const min = Math.min(...recentReadings.current);
    const variance = max - min;
    setDiagVariance(Number(variance.toFixed(2)));

    // DIAGNOSTIC LOGIC: Proving the suspicions!
    if (val > 250) {
        setDiagStatus("🚨 PRESSING TOO HARD (Sensor Blinded)");
    } else if (val < 15) {
        setDiagStatus("🚨 TOO DARK (Move finger to cover flash)");
    } else if (variance < 0.5) {
        setDiagStatus("⚠️ SIGNAL TOO FLAT (Adjust finger gently)");
    } else {
        setDiagStatus("✅ GOOD SIGNAL (Reading Pulse...)");
    }
  });

  // @ts-ignore
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    if (currentState !== ScanState.SCANNING) return;

    if (startTime.value === 0) startTime.value = Date.now();

    const currentRedness = rednessPlugin?.call(frame) as number;

    // Send data to JS to update the Diagnostic UI every 5 frames
    frameCount.value += 1;
    if (frameCount.value % 5 === 0) {
        updateDiagnosticsJS(currentRedness);
    }

    const elapsedSeconds = (Date.now() - startTime.value) / 1000;

    if (elapsedSeconds > 1.5 && currentRedness > 5) { 
        if (rollingAverage.value === 0) {
            rollingAverage.value = currentRedness; 
        } else {
            rollingAverage.value = (rollingAverage.value * 0.99) + (currentRedness * 0.01);
        }

        if (currentRedness > rollingAverage.value) {
            isAboveAverage.value = true;
        } else if (currentRedness < rollingAverage.value && isAboveAverage.value) {
            isAboveAverage.value = false;
            const now = Date.now();
            if (now - lastBeatTime.value > 300) { 
                beatCount.value += 1;
                lastBeatTime.value = now;
            }
        }
    }
    
    if (elapsedSeconds > 1.5 && elapsedSeconds < 3.5) updatePhaseJS(1); 
    if (elapsedSeconds >= 3.5 && elapsedSeconds < 9.5) updatePhaseJS(2); 
    
    if (elapsedSeconds >= 10) {
        const calculatedBPM = Math.floor((beatCount.value / 8.5) * 60);
        beatCount.value = 0; startTime.value = 0; 
        lastBeatTime.value = 0; rollingAverage.value = 0; isAboveAverage.value = false;
        finishScanJS(calculatedBPM); 
    }
  }, [currentState]);

  const handleStartScan = () => {
    // THE FIX: Completely wipe the hardware memory before starting a new scan!
    startTime.value = 0;
    beatCount.value = 0;
    lastBeatTime.value = 0;
    rollingAverage.value = 0;
    frameCount.value = 0;
    isAboveAverage.value = false;

    setScanPhase(0);
    setCurrentState(ScanState.SCANNING);
    
    // Give the camera 500ms to boot up before firing the flash
    setTimeout(() => {
      setTorchOn(true);
    }, 500);
  };
  
  const handleContextSelect = async (context: string) => {
    setSelectedContext(context);
    setCurrentState(ScanState.AWAITING_AI);
    if (bpm !== null) {
      const insight = await fetchAIInsight(bpm, context);
      setAiInsight(insight);

      // Persist reading to local history for the History tab
      try {
        const existing = await AsyncStorage.getItem('@pulse_history');
        const history = existing ? JSON.parse(existing) : [];
        history.unshift({
          id: Date.now().toString(),
          bpm,
          context,
          insight,
          date: new Date().toISOString(),
        });
        await AsyncStorage.setItem('@pulse_history', JSON.stringify(history));
      } catch (e) {
        console.error('Failed to save reading to history:', e);
      }

      setCurrentState(ScanState.SHOWING_INSIGHT);
    }
  };

  const resetScanner = () => {
    setBpm(null);
    setAiInsight('');
    setSelectedContext('');
    setTorchOn(false);
    recentReadings.current = [];
    setCurrentState(ScanState.IDLE);
  };

  // --- THE RESTORED PERMISSION BLOCK ---
  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Pulse Wellness needs camera access to read your vitals.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  if (device == null) return <View style={styles.permissionContainer}><Text style={{color: 'white'}}>Loading Camera...</Text></View>;

  return (
    <View style={styles.mainContainer}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={currentState === ScanState.SCANNING}
        torch={torchOn ? "on" : "off"} 
        frameProcessor={frameProcessor}
        pixelFormat="yuv" 
      />

      <View style={styles.uiOverlay}>
        <Text style={styles.headerTitle}>Pulse Wellness</Text>

        {currentState === ScanState.IDLE && (
          <PhaseIdle onStart={handleStartScan} />
        )}

        {currentState === ScanState.SCANNING && (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            {scanPhase === 0 && <PhaseDetecting />}
            {scanPhase === 1 && <PhaseHolding />}
            {scanPhase === 2 && <PhaseBreathing />}

            {/* --- LIVE DIAGNOSTIC DASHBOARD --- */}
            <View style={styles.diagnosticCard}>
               <Text style={styles.diagTitle}>ENGINEER DIAGNOSTICS</Text>
               <Text style={styles.diagText}>Raw Light: <Text style={{fontWeight: 'bold'}}>{diagRaw}</Text> / 255</Text>
               <Text style={styles.diagText}>Pulse Variance: <Text style={{fontWeight: 'bold'}}>{diagVariance}</Text></Text>
               <Text style={[styles.diagStatus, { color: diagStatus.includes('✅') ? '#00FF00' : '#FF3333' }]}>
                 {diagStatus}
               </Text>
            </View>
          </View>
        )}

        {currentState === ScanState.SELECTING_CONTEXT && (
          <View style={styles.insightWrapper}>
            <PhaseComplete bpm={bpm} />
            <Text style={styles.sectionTitle}>What were you just doing?</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%', marginTop: 20 }}>
               {['Resting', 'Light Activity', 'Studying', 'Exercising', 'Feeling Stressed'].map((ctx) => (
                 <TouchableOpacity key={ctx} style={styles.contextPill} onPress={() => handleContextSelect(ctx)}>
                   <Text style={styles.contextText}>{ctx}</Text>
                 </TouchableOpacity>
               ))}
            </ScrollView>
          </View>
        )}

        {currentState === ScanState.AWAITING_AI && (
          <View style={[styles.insightWrapper, { justifyContent: 'center' }]}>
            <PhaseComplete bpm={bpm} />
            <ActivityIndicator size="large" color="#4FB2C4" style={{ marginTop: 40 }} />
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Reflecting on your reading...</Text>
          </View>
        )}

        {currentState === ScanState.SHOWING_INSIGHT && (
          <ScrollView contentContainerStyle={styles.insightWrapper} showsVerticalScrollIndicator={false}>
            <PhaseComplete bpm={bpm} />
            <View style={styles.glassCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.insightTitle}>✨ AI Health Insight</Text>
              </View>
              <Text style={styles.selectedContextText}>Context: {selectedContext}</Text>
              <Text style={styles.insightBodyText}>{aiInsight}</Text>
              <TouchableOpacity style={styles.scanAgainButton} onPress={resetScanner}>
                <Text style={styles.scanAgainText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#000' },
  uiOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)', paddingTop: 60, paddingBottom: 20 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  permissionContainer: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionText: { color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 20, lineHeight: 24 },
  permissionButton: { backgroundColor: '#4FB2C4', padding: 15, borderRadius: 10 },
  permissionButtonText: { color: 'white', fontWeight: 'bold' },
  
  // DIAGNOSTIC STYLES
  diagnosticCard: { position: 'absolute', bottom: 30, width: '90%', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.85)', padding: 15, borderRadius: 15, borderWidth: 2, borderColor: '#333' },
  diagTitle: { color: '#aaa', fontSize: 12, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10, textAlign: 'center' },
  diagText: { color: '#fff', fontSize: 14, fontFamily: 'monospace', marginBottom: 5 },
  diagStatus: { fontSize: 14, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },

  insightWrapper: { flex: 1, width: '100%', paddingHorizontal: 20, alignItems: 'center', paddingTop: 20 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: '600', marginTop: 30, textAlign: 'center' },
  contextPill: { backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 15, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 10, width: '100%', alignItems: 'center' },
  contextText: { color: 'white', fontSize: 16, fontWeight: '500' },
  glassCard: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, borderRadius: 16, padding: 24, marginTop: 30 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  insightTitle: { color: '#4FB2C4', fontSize: 20, fontWeight: 'bold' },
  selectedContextText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  insightBodyText: { color: 'white', fontSize: 15, lineHeight: 24, marginBottom: 30 },
  scanAgainButton: { backgroundColor: '#e8e8e8', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 30, alignSelf: 'center' },
  scanAgainText: { color: '#1a1a1a', fontWeight: 'bold', fontSize: 16 }
});
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Make sure these paths point to your SRC folder correctly!
import ScanIcon from '../../SRC/Icons/ScanIcon';
import HistoryIcon from '../../SRC/Icons/HistoryIcon';
import { useResponsive } from '../../SRC/Constants/responsive';

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { fontSize, ms, bottomNavHeight, height } = useResponsive();
  
  // 1. Memory State
  const [history, setHistory] = useState<any[]>([]);

  // 2. The Focus Effect (Checks memory EVERY time you open this tab)
  useFocusEffect(
    useCallback(() => {
      const loadHistory = async () => {
        try {
          const storedHistory = await AsyncStorage.getItem('@pulse_history');
          if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
          }
        } catch (error) {
          console.error("Failed to load history", error);
        }
      };
      
      loadHistory();
    }, [])
  );

  // Helper function to make the timestamp look pretty
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <LinearGradient colors={['#35385d', '#251b36']} style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + ms(10) }]}>
        <Text style={[styles.headerTitle, { fontSize: fontSize.lg }]}>History</Text>
      </View>

      {/* DYNAMIC CONTENT AREA */}
      <View style={[styles.contentArea, { paddingBottom: bottomNavHeight }]}>
        
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
              <HistoryIcon color="rgba(255, 255, 255, 0.2)" width={ms(64)} height={ms(64)} />
            </View>
            <Text style={[styles.emptyTitle, { fontSize: fontSize.xxl }]}>No history yet</Text>
            <Text style={[styles.emptySubtitle, { fontSize: fontSize.md, lineHeight: ms(20) }]}>
              Your past scan results and insights will appear here once you complete a reading.
            </Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={{ padding: ms(20), paddingBottom: ms(40) }}
            showsVerticalScrollIndicator={false}
          >
            {history.map((item) => (
              <View key={item.id} style={[styles.glassCard, { padding: ms(20), marginBottom: ms(16) }]}>
                
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={[styles.cardDate, { fontSize: fontSize.sm + 1, marginBottom: ms(4) }]}>{formatDate(item.date)}</Text>
                    <Text style={[styles.cardContext, { fontSize: fontSize.sm }]}>Context: {item.context}</Text>
                  </View>
                  <Text style={[styles.cardBpm, { fontSize: fontSize.title }]}>{item.bpm}<Text style={{fontSize: fontSize.sm}}>BPM</Text></Text>
                </View>

                <Text style={[styles.insightBodyText, { fontSize: fontSize.md, lineHeight: ms(22) }]}>{item.insight}</Text>
              
              </View>
            ))}
          </ScrollView>
        )}

      </View>

      {/* BOTTOM NAVIGATION */}
      <View style={[styles.bottomNav, { paddingTop: 8, paddingBottom: Math.max(insets.bottom, 24) }]}>
        
        <TouchableOpacity 
          style={styles.navTabInactive} 
          activeOpacity={0.8}
          onPress={() => router.push('/')} 
        >
          <ScanIcon color="rgba(255, 255, 255, 0.5)" width={ms(24)} height={ms(24)} /> 
          <Text style={[styles.navTextInactive, { fontSize: fontSize.sm, marginTop: ms(4) }]}>Scan</Text>
        </TouchableOpacity>

        <View style={styles.navTabActive}>
          <HistoryIcon color="#FFFFFF" width={ms(24)} height={ms(24)} /> 
          <Text style={[styles.navTextActive, { fontSize: fontSize.sm, marginTop: ms(4) }]}>History</Text>
        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    backgroundColor: 'rgba(56, 59, 101, 0.9)', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingBottom: 12,
  },
  headerTitle: { color: 'white', fontWeight: 'bold' },
  
  contentArea: { flex: 1 },

  // Empty State Styles
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIconWrapper: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: { color: 'white', fontWeight: 'bold', marginBottom: 12 },
  emptySubtitle: { color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center' },

  // Populated List Styles
  scrollView: { flex: 1, width: '100%' },
  glassCard: { 
    width: '100%', 
    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
    borderColor: 'rgba(255, 255, 255, 0.15)', 
    borderWidth: 1, 
    borderRadius: 16, 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardDate: { color: '#ff9a9a', fontWeight: '600' },
  cardContext: { color: 'rgba(255, 255, 255, 0.7)', textTransform: 'capitalize' },
  cardBpm: { color: 'white', fontWeight: '300' },
  insightBodyText: { color: 'white' },

  // Bottom Nav Styles
  bottomNav: { flexDirection: 'row' },
  navTabActive: { flex: 1, backgroundColor: '#ff9a9a', justifyContent: 'center', alignItems: 'center' },
  navTabInactive: { flex: 1, backgroundColor: '#383b65', justifyContent: 'center', alignItems: 'center' },
  navTextActive: { color: 'white', fontWeight: 'bold' },
  navTextInactive: { color: 'rgba(255,255,255,0.6)' },
});
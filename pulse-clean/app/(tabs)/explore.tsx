import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Make sure these paths point to your SRC folder correctly!
import ScanIcon from '../../SRC/Icons/ScanIcon';
import HistoryIcon from '../../SRC/Icons/HistoryIcon';

export default function HistoryScreen() {
  const router = useRouter();
  
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      {/* DYNAMIC CONTENT AREA */}
      <View style={styles.contentArea}>
        
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
              <HistoryIcon color="rgba(255, 255, 255, 0.2)" width={64} height={64} />
            </View>
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptySubtitle}>
              Your past scan results and insights will appear here once you complete a reading.
            </Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {history.map((item) => (
              <View key={item.id} style={styles.glassCard}>
                
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
                    <Text style={styles.cardContext}>Context: {item.context}</Text>
                  </View>
                  <Text style={styles.cardBpm}>{item.bpm}<Text style={{fontSize: 12}}>BPM</Text></Text>
                </View>

                <Text style={styles.insightBodyText}>{item.insight}</Text>
              
              </View>
            ))}
          </ScrollView>
        )}

      </View>

      {/* BOTTOM NAVIGATION (REVERSED) */}
      <View style={styles.bottomNav}>
        
        <TouchableOpacity 
          style={styles.navTabInactive} 
          activeOpacity={0.8}
          onPress={() => router.push('/')} 
        >
          <ScanIcon color="rgba(255, 255, 255, 0.5)" width={24} height={24} /> 
          <Text style={styles.navTextInactive}>Scan</Text>
        </TouchableOpacity>

        <View style={styles.navTabActive}>
          <HistoryIcon color="#FFFFFF" width={24} height={24} /> 
          <Text style={styles.navTextActive}>History</Text>
        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    height: 85, 
    backgroundColor: 'rgba(56, 59, 101, 0.9)', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 10 
  },
  headerTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  
  contentArea: { flex: 1 },

  // Empty State Styles
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  emptySubtitle: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, textAlign: 'center', lineHeight: 20 },

  // Populated List Styles
  scrollView: { flex: 1, width: '100%' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  glassCard: { 
    width: '100%', 
    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
    borderColor: 'rgba(255, 255, 255, 0.15)', 
    borderWidth: 1, 
    borderRadius: 16, 
    padding: 20,
    marginBottom: 16
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardDate: { color: '#ff9a9a', fontSize: 13, fontWeight: '600', marginBottom: 4 },
  cardContext: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, textTransform: 'capitalize' },
  cardBpm: { color: 'white', fontSize: 24, fontWeight: '300' },
  insightBodyText: { color: 'white', fontSize: 14, lineHeight: 22 },

  // Bottom Nav Styles
  bottomNav: { flexDirection: 'row', height: 65 },
  navTabActive: { flex: 1, backgroundColor: '#ff9a9a', justifyContent: 'center', alignItems: 'center' },
  navTabInactive: { flex: 1, backgroundColor: '#383b65', justifyContent: 'center', alignItems: 'center' },
  navTextActive: { color: 'white', fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  navTextInactive: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 },
});
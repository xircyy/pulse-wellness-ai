import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

// Activities based on your Figma "Context for Insight" screen
const ACTIVITIES = [
  { id: 'rest', title: 'Resting / Winding Down', desc: 'Sitting down, breathing deeply, or relaxing.', icon: '🧘' },
  { id: 'light', title: 'Light Activity / Daily Routine', desc: 'Movement, light chores, or slow walk.', icon: '🚶' },
  { id: 'study', title: 'Studying / Deep Work', desc: 'Focused brain work, usually at a desk.', icon: '📖' },
  { id: 'workout', title: 'Exercising / Workout', desc: 'Physical exertion or intense activity.', icon: '🏋️' },
  { id: 'stress', title: 'Stressed / Anxious', desc: 'Feeling overwhelmed or physically tense.', icon: '🤯' },
];

interface Props {
  onSelect: (contextId: string) => void;
}

const ContextGrid = ({ onSelect }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>To help us understand this reading, what best describes your current state?</Text>
      <FlatList
        data={ACTIVITIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onSelect(item.id)}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, width: '100%' },
  title: { color: 'white', fontSize: 14, opacity: 0.8, marginBottom: 20, textAlign: 'center' },
  card: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  icon: { fontSize: 24, marginRight: 15 },
  textContainer: { flex: 1 },
  cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  cardDesc: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 12, marginTop: 4 }
});

export default ContextGrid;
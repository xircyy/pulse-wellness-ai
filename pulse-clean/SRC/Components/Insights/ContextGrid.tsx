import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import RestIcon from '../../Icons/RestIcon';
import LightActivityIcon from '../../Icons/LightActivityIcon';
import StudyIcon from '../../Icons/StudyIcon';
import ExerciseIcon from '../../Icons/ExerciseIcon';
import StressIcon from '../../Icons/StressIcon';

const ACTIVITIES = [
  { 
    id: 'rest', 
    title: 'Resting / Winding Down', 
    desc: 'Sitting or lying down; breathing naturally and mentally calm.', 
    icon: <RestIcon color="#14AE5C" width={32} height={32} /> 
  },
  { 
    id: 'light', 
    title: 'Light Activity / Daily Routine', 
    desc: 'Moving around lightly or doing chores; you can easily hold a conversation.', 
    icon: <LightActivityIcon color="#4FB2C4" width={32} height={32} /> 
  },
  { 
    id: 'study', 
    title: 'Studying / Deep Work', 
    desc: 'Physically still, but mentally focused or challenged.', 
    icon: <StudyIcon color="#262084" width={32} height={32} /> 
  },
  { 
    id: 'workout', 
    title: 'Exercising / Workout', 
    desc: 'Physically active; breathing heavily and pushing your physical limits.', 
    icon: <ExerciseIcon color="#D46022" width={32} height={32} /> 
  },
  { 
    id: 'stress', 
    title: 'Stressed / Anxious', 
    desc: 'Not exercising, but feeling overwhelmed, tense, or experiencing a racing chest.', 
    icon: <StressIcon color="#D0021B" width={32} height={32} /> 
  },
];

interface Props {
  bpm: number | null; // Added to receive the BPM from HeartScanner
  onSelect: (contextId: string) => void;
}

const ContextGrid = ({ bpm, onSelect }: Props) => {
  return (
    <View style={styles.container}>
      
      {/* BPM Display matching the Figma design */}
      <View style={styles.bpmContainer}>
        <Text style={styles.bpmNumber}>
          {bpm || '--'}
          <Text style={styles.bpmLabel}>BPM</Text>
        </Text>
      </View>

      <Text style={styles.title}>
        To help us understand this reading, what best describes your current state?
      </Text>

      <FlatList
        data={ACTIVITIES}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => onSelect(item.id)} // Or item.title depending on your API needs
            activeOpacity={0.8}
          >
            {/* Swapped <Text> for <View> to prevent SVG rendering crashes */}
            <View style={styles.iconContainer}>{item.icon}</View>
            
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
  container: { 
    paddingHorizontal: 20, 
    width: '100%', 
    flex: 1, 
    paddingTop: 10 
  },
  // Re-added bpmContainer
  bpmContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  // Renamed to match your JSX
  bpmNumber: { 
    color: 'white', 
    fontSize: 48, 
    fontWeight: '300', 
    textAlign: 'center', 
  },
  // Renamed to match your JSX
  bpmLabel: { 
    fontSize: 16, 
    color: 'white',
    fontWeight: 'normal' 
  },
  title: { 
    color: 'white', 
    fontSize: 14, 
    marginBottom: 15, 
    textAlign: 'center', 
    lineHeight: 20,
    paddingHorizontal: 10
  },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#e8e8e8', 
    borderRadius: 12, 
    paddingVertical: 12, 
    paddingHorizontal: 15,
    marginBottom: 10, 
    alignItems: 'center',
  },
  // Re-added iconContainer to prevent SVG rendering crashes
  iconContainer: { 
    width: 40,
    alignItems: 'center',
    marginRight: 12 
  },
  textContainer: { 
    flex: 1 
  },
  cardTitle: { 
    color: '#1a1a1a', 
    fontWeight: 'bold', 
    fontSize: 14, 
    marginBottom: 2 
  },
  cardDesc: { 
    color: '#4a4a4a', 
    fontSize: 11, 
    lineHeight: 14 
  }
});

export default ContextGrid;
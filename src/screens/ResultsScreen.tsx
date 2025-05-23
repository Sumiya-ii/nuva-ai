import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { RadarChart } from '../components/RadarChart';
import { AssessmentScores } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Onboarding: undefined;
  Assessment: undefined;
  Results: { scores: AssessmentScores };
};

type ResultsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Results'>;
  route: { params: { scores: AssessmentScores } };
};

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ navigation, route }) => {
  const { scores } = route.params;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CD964';
    if (score >= 60) return '#FFCC00';
    return '#FF3B30';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Assessment Results</Text>
        
        <View style={styles.chartContainer}>
          <RadarChart scores={scores} size={300} />
        </View>

        <View style={styles.scoresContainer}>
          {Object.entries(scores).map(([key, value]) => (
            <View key={key} style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
              <View style={styles.scoreDetails}>
                <Text style={[styles.scoreValue, { color: getScoreColor(value) }]}>
                  {value}
                </Text>
                <Text style={styles.scoreDescription}>
                  {getScoreDescription(value)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Onboarding')}
        >
          <Text style={styles.buttonText}>Start New Assessment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoresContainer: {
    marginBottom: 30,
  },
  scoreCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  scoreDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreDescription: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 
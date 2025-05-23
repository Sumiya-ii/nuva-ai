import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Text as SvgText, Circle } from 'react-native-svg';
import { AssessmentScores } from '../types';

interface RadarChartProps {
  scores: AssessmentScores;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ scores, size = 200 }) => {
  try {
    const center = size / 2;
    const categories = ['Vocabulary', 'Fluency', 'Confidence', 'Grammar', 'Pronunciation'];
    
    // Validate scores
    const validScores = Object.values(scores).every(score => 
      typeof score === 'number' && !isNaN(score) && score >= 0 && score <= 100
    );

    if (!validScores) {
      console.warn('Invalid scores provided to RadarChart');
      return null;
    }

    const points = categories.map((_, index) => {
      const angle = (index * 2 * Math.PI) / categories.length - Math.PI / 2;
      const score = Math.min(100, Math.max(0, Object.values(scores)[index]));
      const radius = (score / 100) * (size / 2);
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
      };
    });

    const polygonPoints = points.map(point => `${point.x},${point.y}`).join(' ');

    return (
      <View style={styles.container}>
        <Svg width={size} height={size}>
          {/* Background circles */}
          {[0.25, 0.5, 0.75, 1].map((scale, index) => (
            <Circle
              key={index}
              cx={center}
              cy={center}
              r={center * scale}
              stroke="#ddd"
              strokeWidth="1"
              fill="none"
            />
          ))}

          {/* Category labels */}
          {categories.map((category, index) => {
            const angle = (index * 2 * Math.PI) / categories.length - Math.PI / 2;
            const x = center + (center + 20) * Math.cos(angle);
            const y = center + (center + 20) * Math.sin(angle);
            return (
              <SvgText
                key={category}
                x={x}
                y={y}
                textAnchor="middle"
                fontSize="12"
                fill="#666"
              >
                {category}
              </SvgText>
            );
          })}

          {/* Score polygon */}
          <Polygon
            points={polygonPoints}
            fill="rgba(0, 122, 255, 0.2)"
            stroke="#007AFF"
            strokeWidth="2"
          />
        </Svg>
      </View>
    );
  } catch (error) {
    console.error('Error rendering RadarChart:', error);
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
}); 
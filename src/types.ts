export interface AssessmentScores {
  vocabulary: number;
  fluency: number;
  confidence: number;
  grammar: number;
  pronunciation: number;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Assessment: undefined;
  Results: {
    transcript: string;
  };
}; 
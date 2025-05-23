export interface AssessmentScores {
  vocabulary: number;
  fluency: number;
  confidence: number;
  grammar: number;
  pronunciation: number;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AssessmentState {
  isRecording: boolean;
  timeRemaining: number;
  messages: ConversationMessage[];
  scores: AssessmentScores | null;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Assessment: undefined;
  Results: { scores: AssessmentScores };
}; 
import OpenAI from 'openai';
import { AssessmentScores, ConversationMessage } from '../types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const evaluateConversation = async (
  messages: ConversationMessage[]
): Promise<AssessmentScores> => {
  const conversation = messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an English language assessment expert. Analyze the following conversation and provide scores (0-100) for:
        1. Vocabulary (word choice and range)
        2. Fluency (speech flow and naturalness)
        3. Confidence (speaking pace and hesitation)
        4. Grammar (sentence structure and accuracy)
        5. Pronunciation (clarity and accuracy)
        
        Respond with a JSON object containing these scores.`
      },
      ...conversation
    ],
  });

  const evaluation = JSON.parse(response.choices[0].message.content || '{}');
  
  return {
    vocabulary: evaluation.vocabulary || 0,
    fluency: evaluation.fluency || 0,
    confidence: evaluation.confidence || 0,
    grammar: evaluation.grammar || 0,
    pronunciation: evaluation.pronunciation || 0,
  };
};

export const generateResponse = async (
  messages: ConversationMessage[]
): Promise<string> => {
  const conversation = messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }));

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are Michelle, a friendly and encouraging English language tutor. Keep responses concise and engaging."
      },
      ...conversation
    ],
  });

  return response.choices[0].message.content || "I'm sorry, I didn't catch that.";
}; 
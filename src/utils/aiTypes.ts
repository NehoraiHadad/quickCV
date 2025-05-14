// Types for AI service interfaces
export interface AIRequestOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  systemPrompt?: string;
}

export interface AIResponse {
  content: string;
  model: string;
  finishReason: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIError {
  message: string;
  status?: number;
  type?: string;
}

export enum AIFeatureType {
  TEXT_IMPROVEMENT = "textImprovement",
  GRAMMAR_CHECK = "grammarCheck",
  CONTENT_SUGGESTIONS = "contentSuggestions",
  TEMPLATE_GENERATION = "templateGeneration",
}

// Additional types for specific features
export interface GrammarCheckResult {
  correctedText: string;
  issues: Array<{
    original: string;
    correction: string;
    explanation: string;
  }>;
}

export interface ContentSuggestion {
  text: string;
  section?: string;
  category?: string;
}

export interface ModelAvailability {
  service: string;
  model: string;
  isAvailable: boolean;
}

export interface AIServiceConfig {
  preferred: string;
  fallbacks: string[];
  isAvailable?: (apiKey: string) => Promise<boolean>;
}

export type OperationType = "suggest" | "optimize" | "grammar" | "generate"; 
import { useState, useCallback } from "react";
import { generateAIContent, validateApiKey } from "../utils/aiApi";
import { AIError, OperationType } from "../utils/aiTypes";

interface UseAIResult {
  loading: boolean;
  error: AIError | null;
  content: string[];
  generateContent: (
    text: string,
    field: string,
    context: string,
    operation: OperationType
  ) => Promise<string[]>;
  validateKey: (apiKey: string, service: string) => Promise<boolean>;
  reset: () => void;
}

interface UseAIOptions {
  apiKey?: string;
  service?: string;
  model?: string;
}

interface AIErrorResponse {
  message: string;
  status?: number;
  type?: string;
}

export const useAI = (options: UseAIOptions = {}): UseAIResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AIError | null>(null);
  const [content, setContent] = useState<string[]>([]);
  
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setContent([]);
  }, []);
  
  const generateContent = useCallback(async (
    text: string,
    field: string,
    context: string,
    operation: OperationType
  ): Promise<string[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = options.apiKey || localStorage.getItem("aiApiKey") || "";
      const service = options.service || localStorage.getItem("aiService") || "anthropic";
      const model = options.model || localStorage.getItem("aiCurrentModel") || undefined;
      
      if (!apiKey) {
        throw {
          message: "API key is required",
          type: "auth_error"
        };
      }
      
      const result = await generateAIContent(
        apiKey,
        service,
        text,
        field,
        context,
        operation,
        model
      );
      
      setContent(result);
      setLoading(false);
      return result;
    } catch (err: unknown) {
      const aiError: AIError = {
        message: err instanceof Error ? err.message : "An unknown error occurred",
        status: (err as AIErrorResponse)?.status,
        type: (err as AIErrorResponse)?.type || "unknown_error",
      };
      
      setError(aiError);
      setLoading(false);
      throw aiError;
    }
  }, [options.apiKey, options.service, options.model]);
  
  const validateKey = useCallback(async (
    apiKey: string,
    service: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const isValid = await validateApiKey(apiKey, service);
      setLoading(false);
      return isValid;
    } catch (err: unknown) {
      const aiError: AIError = {
        message: err instanceof Error ? err.message : "Failed to validate API key",
        status: (err as AIErrorResponse)?.status,
        type: (err as AIErrorResponse)?.type || "auth_error",
      };
      
      setError(aiError);
      setLoading(false);
      return false;
    }
  }, []);
  
  return {
    loading,
    error,
    content,
    generateContent,
    validateKey,
    reset,
  };
};

export default useAI; 
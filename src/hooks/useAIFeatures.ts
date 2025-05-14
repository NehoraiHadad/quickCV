import { useState, useCallback } from "react";
import useAI from "./useAI";
import { GrammarCheckResult, ContentSuggestion } from "../utils/aiTypes";
import { parseGrammarCheckResponse } from "../utils/ai";

interface UseAIFeaturesOptions {
  apiKey?: string;
  service?: string;
  model?: string;
}

// Hook for text improvement feature
export const useTextImprovement = (options: UseAIFeaturesOptions = {}) => {
  const { loading, error, generateContent, reset } = useAI(options);
  const [improvedText, setImprovedText] = useState<string>("");
  
  const improveText = useCallback(async (
    originalText: string,
    context: string = "",
    targetAudience: string = ""
  ) => {
    reset();
    
    // Add target audience to context if provided
    const fullContext = targetAudience 
      ? `${context ? context + ". " : ""}Target audience/industry: ${targetAudience}`
      : context;
    
    try {
      const results = await generateContent(
        originalText,
        "text improvement",
        fullContext,
        "optimize"
      );
      
      if (results.length > 0) {
        setImprovedText(results[0]);
        return results[0];
      }
      return "";
    } catch (error) {
      console.error("Text improvement error:", error);
      throw error;
    }
  }, [generateContent, reset]);
  
  return {
    loading,
    error,
    improvedText,
    improveText,
    reset,
  };
};

// Hook for grammar checking feature
export const useGrammarCheck = (options: UseAIFeaturesOptions = {}) => {
  const { loading, error, generateContent, reset } = useAI(options);
  const [grammarResults, setGrammarResults] = useState<GrammarCheckResult | null>(null);
  
  const checkGrammar = useCallback(async (text: string, field: string = "text") => {
    reset();
    
    try {
      const results = await generateContent(
        text,
        field,
        "",
        "grammar"
      );
      
      if (results.length > 0) {
        // Create a fake AIResponse to parse with the existing utility
        const parsedResults = parseGrammarCheckResponse({
          content: results[0],
          model: "",
          finishReason: ""
        });
        
        setGrammarResults(parsedResults);
        return parsedResults;
      }
      
      return {
        correctedText: "",
        issues: []
      };
    } catch (error) {
      console.error("Grammar check error:", error);
      throw error;
    }
  }, [generateContent, reset]);
  
  return {
    loading,
    error,
    grammarResults,
    checkGrammar,
    reset,
  };
};

// Hook for content suggestions feature
export const useContentSuggestions = (options: UseAIFeaturesOptions = {}) => {
  const { loading, error, generateContent, reset } = useAI(options);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  
  const getSuggestions = useCallback(async (
    sectionType: string,
    currentContent: string,
    jobTitle: string = "",
    industry: string = ""
  ) => {
    reset();
    
    // Combine job title and industry into context
    const context = [
      jobTitle && `Position: ${jobTitle}`,
      industry && `Industry: ${industry}`
    ].filter(Boolean).join(". ");
    
    try {
      const results = await generateContent(
        currentContent,
        sectionType,
        context,
        "suggest"
      );
      
      // Convert string array to ContentSuggestion objects
      const contentSuggestions = results.map(text => ({
        text,
        section: sectionType
      }));
      
      setSuggestions(contentSuggestions);
      return contentSuggestions;
    } catch (error) {
      console.error("Content suggestions error:", error);
      throw error;
    }
  }, [generateContent, reset]);
  
  return {
    loading,
    error,
    suggestions,
    getSuggestions,
    reset,
  };
};

// Hook for generating new content
export const useContentGeneration = (options: UseAIFeaturesOptions = {}) => {
  const { loading, error, generateContent, reset } = useAI(options);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  
  const generateNewContent = useCallback(async (
    field: string,
    context: string = ""
  ) => {
    reset();
    
    try {
      const results = await generateContent(
        "",
        field,
        context,
        "generate"
      );
      
      if (results.length > 0) {
        setGeneratedContent(results[0]);
        return results[0];
      }
      return "";
    } catch (error) {
      console.error("Content generation error:", error);
      throw error;
    }
  }, [generateContent, reset]);
  
  return {
    loading,
    error,
    generatedContent,
    generateNewContent,
    reset,
  };
};

// Export all features
const AIFeatures = {
  useTextImprovement,
  useGrammarCheck,
  useContentSuggestions,
  useContentGeneration
};

export default AIFeatures; 
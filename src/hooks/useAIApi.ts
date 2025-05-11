import { useState, useEffect } from "react";
import { AI_MODELS, fetchAvailableModels as fetchModels } from "@/utils/aiModelConfig";

type AIService = 'openai' | 'anthropic' | 'groq' | 'google' | null;

export interface ModelInfo {
  serviceName: string;
  currentModel: string | null;
  availableModels: {
    preferred: string;
    fallbacks: string[];
  };
}

export const useAIApi = () => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [service, setServiceState] = useState<AIService>('openai');
  const [currentModel, setCurrentModel] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("aiApiKey");
    const storedService = localStorage.getItem("aiService");
    const storedModel = localStorage.getItem("aiCurrentModel");
    
    if (storedKey) {
      setApiKeyState(storedKey);
    }
    if (storedService) {
      setServiceState(storedService as AIService);
    }
    if (storedModel) {
      setCurrentModel(storedModel);
    }
    
    // Listen for model change events
    const handleModelChange = (event: CustomEvent<{service: string, model: string}>) => {
      if (event.detail.service === service) {
        setCurrentModel(event.detail.model);
      }
    };
    
    window.addEventListener('aiModelChanged', handleModelChange as EventListener);
    
    return () => {
      window.removeEventListener('aiModelChanged', handleModelChange as EventListener);
    };
  }, [service]);

  // Effect to load available models when service or API key changes
  useEffect(() => {
    const loadAvailableModels = async () => {
      if (service && apiKey) {
        setIsLoadingModels(true);
        try {
          const models = await fetchModels(service, apiKey);
          setAvailableModels(models);
        } catch (error) {
          console.error("Failed to fetch models:", error);
          // Fall back to predefined models
          setAvailableModels([AI_MODELS[service].preferred, ...AI_MODELS[service].fallbacks]);
        } finally {
          setIsLoadingModels(false);
        }
      } else {
        setAvailableModels([]);
      }
    };

    loadAvailableModels();
  }, [service, apiKey]);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem("aiApiKey", key);
  };

  const setService = (newService: AIService) => {
    setServiceState(newService);
    // Reset current model when changing service
    setCurrentModel(null);
    localStorage.removeItem("aiCurrentModel");
    
    if (newService) {
      localStorage.setItem("aiService", newService);
    }
  };
  
  const updateCurrentModel = (model: string) => {
    setCurrentModel(model);
    localStorage.setItem("aiCurrentModel", model);
  };

  const getModelInfo = (): ModelInfo | null => {
    if (!service) return null;
    
    return {
      serviceName: service,
      currentModel: currentModel,
      availableModels: {
        preferred: AI_MODELS[service].preferred,
        fallbacks: AI_MODELS[service].fallbacks
      }
    };
  };

  const fetchAvailableModels = async (): Promise<string[]> => {
    if (!service || !apiKey) return [];
    
    setIsLoadingModels(true);
    try {
      const models = await fetchModels(service, apiKey);
      setAvailableModels(models);
      return models;
    } catch (error) {
      console.error("Failed to fetch models:", error);
      const defaultModels = [AI_MODELS[service].preferred, ...AI_MODELS[service].fallbacks];
      setAvailableModels(defaultModels);
      return defaultModels;
    } finally {
      setIsLoadingModels(false);
    }
  };

  return { 
    apiKey, 
    service,
    currentModel,
    availableModels,
    isLoadingModels,
    modelInfo: getModelInfo(),
    setApiKey,
    setService,
    updateCurrentModel,
    fetchAvailableModels
  };
};

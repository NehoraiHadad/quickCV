import { useState, useEffect } from "react";

type AIService = 'openai' | 'anthropic' | null;

export const useAIApi = () => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [service, setServiceState] = useState<AIService>('openai');

  useEffect(() => {
    const storedKey = localStorage.getItem("aiApiKey");
    const storedService = localStorage.getItem("aiService");
    
    if (storedKey) {
      setApiKeyState(storedKey);
    }
    if (storedService) {
      setServiceState(storedService as AIService);
    }
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem("aiApiKey", key);
  };

  const setService = (newService: AIService) => {
    setServiceState(newService);
    if (newService) {
      localStorage.setItem("aiService", newService);
    }
  };

  return { 
    apiKey, 
    service, 
    setApiKey,
    setService
  };
};

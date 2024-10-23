import { useState, useEffect } from "react";

export const useAIApi = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);

  useEffect(() => {
    setApiKey(localStorage.getItem("aiApiKey"));
    setService(localStorage.getItem("aiService"));
  }, []);

  return { apiKey, service };
};
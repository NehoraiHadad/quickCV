// Define model configuration with preferred and fallback models
export interface ModelConfig {
  preferred: string;
  fallbacks: string[];
  isAvailable?: (apiKey: string) => Promise<boolean>;
}

// Define model interface for API responses
interface ModelData {
  id: string;
  [key: string]: unknown;
}

// Updated model configuration with fallback options
export const AI_MODELS: Record<string, ModelConfig> = {
  openai: {
    preferred: "gpt-4o",
    fallbacks: ["gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
    isAvailable: async (apiKey: string) => {
      try {
        const response = await fetch("https://api.openai.com/v1/models", {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) return false;
        const data = await response.json();
        return data.data.some((model: ModelData) => model.id === "gpt-4o");
      } catch {
        return false;
      }
    }
  },
  anthropic: {
    preferred: "claude-3-5-sonnet-20241022",
    fallbacks: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
  },
  groq: {
    preferred: "llama-3.3-70b-versatile",
    fallbacks: ["llama-3.1-8b-instant", "llama3-70b-8192", "gemma2-9b-it"],
  },
  google: {
    preferred: "gemini-1.5-flash-002",
    fallbacks: ["gemini-1.5-pro-latest", "gemini-pro"],
  },
};

// Helper function to get all models for a service
export const getModelsForService = (service: string): string[] => {
  if (!AI_MODELS[service]) return [];
  return [AI_MODELS[service].preferred, ...AI_MODELS[service].fallbacks];
};

// Helper to get preferred model for a service
export const getPreferredModel = (service: string): string => {
  return AI_MODELS[service]?.preferred || "";
};

// Function to fetch available models from providers
export const fetchAvailableModels = async (service: string, apiKey: string): Promise<string[]> => {
  try {
    switch (service) {
      case 'openai':
        const openaiResponse = await fetch("https://api.openai.com/v1/models", {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        });
        if (!openaiResponse.ok) return getModelsForService(service);
        const openaiData = await openaiResponse.json();
        return openaiData.data
          .filter((model: ModelData) => 
            model.id.includes('gpt') && 
            !model.id.includes('instruct') && 
            !model.id.includes('0301') && 
            !model.id.includes('0314')
          )
          .map((model: ModelData) => model.id)
          .sort();
          
      case 'groq':
        const groqResponse = await fetch("https://api.groq.com/openai/v1/models", {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        });
        if (!groqResponse.ok) return getModelsForService(service);
        const groqData = await groqResponse.json();
        return groqData.data.map((model: ModelData) => model.id).sort();
        
      case 'anthropic':
        // Anthropic doesn't have a public model list API, using the predefined list
        return getModelsForService(service);
        
      case 'google':
        // Google doesn't have a public model list API, using the predefined list
        return getModelsForService(service);
        
      default:
        return getModelsForService(service);
    }
  } catch (error) {
    console.error("Error fetching models:", error);
    return getModelsForService(service);
  }
}; 
// Barrel file to simplify imports
import anthropicService from "./anthropicService";
import generalService from "./generalService";

// Export a unified API
const AIServices = {
  anthropic: anthropicService,
  general: generalService,
};

export default AIServices;

// Re-export commonly used functions
export const { 
  callAnthropicAPI, 
  getAvailableModel,
  validateAnthropicApiKey, 
  cacheModelAvailability 
} = anthropicService;

export const { 
  callGeneralAIService,
  validateGeneralApiKey
} = generalService; 
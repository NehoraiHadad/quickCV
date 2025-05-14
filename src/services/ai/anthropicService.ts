import Anthropic from "@anthropic-ai/sdk";
import { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { AI_MODELS, DEFAULT_PARAMS } from "../../config/aiConfig";
import { AIRequestOptions, AIResponse, AIError } from "../../utils/aiTypes";

// Cache for model availability results
const modelAvailabilityCache: Record<string, Record<string, string>> = {};

// Get available model for a service with an option to specify a model directly
export const getAvailableModel = async (
  service: string, 
  apiKey: string, 
  specificModel?: string
): Promise<string> => {
  // If a specific model is requested, use it directly
  if (specificModel) {
    cacheModelAvailability(service, apiKey, specificModel);
    return specificModel;
  }
  
  // Return from cache if available
  if (modelAvailabilityCache[service]?.[apiKey]) {
    return modelAvailabilityCache[service][apiKey];
  }

  const config = AI_MODELS[service];
  if (!config) {
    throw new Error(`Service ${service} is not supported`);
  }

  // For now, just return the preferred model as default
  cacheModelAvailability(service, apiKey, config.preferred);
  return config.preferred;
};

// Cache model availability results
export const cacheModelAvailability = (service: string, apiKey: string, model: string) => {
  if (!modelAvailabilityCache[service]) {
    modelAvailabilityCache[service] = {};
  }
  modelAvailabilityCache[service][apiKey] = model;
  
  // Update localStorage to inform other components
  if (typeof window !== 'undefined') {
    localStorage.setItem("aiCurrentModel", model);
    
    // Dispatch an event so other components can update
    const event = new CustomEvent("aiModelChanged", { 
      detail: { service, model } 
    });
    window.dispatchEvent(event);
  }
};

// Helper to format the request for Anthropic
const formatAnthropicRequest = (
  systemPrompt: string,
  userPrompt: string,
  options: AIRequestOptions = {}
) => {
  const {
    temperature = DEFAULT_PARAMS.ANTHROPIC.temperature,
    maxTokens = DEFAULT_PARAMS.ANTHROPIC.maxTokens,
    model = AI_MODELS.ANTHROPIC.preferred,
  } = options;

  const messages: MessageParam[] = [
    { role: "user", content: systemPrompt },
    {
      role: "assistant",
      content: "I understand. I'll help with that.",
    },
    { role: "user", content: userPrompt },
  ];

  return {
    model,
    max_tokens: maxTokens,
    temperature,
    messages,
  };
};

// Function to call Anthropic API
export const callAnthropicAPI = async (
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  specificModel?: string
): Promise<AIResponse> => {
  const anthropic = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  // Get the best available model for Anthropic
  const modelToUse = await getAvailableModel("anthropic", apiKey, specificModel);
  
  try {
    const request = formatAnthropicRequest(systemPrompt, userPrompt, {
      model: modelToUse
    });
    
    const response = await anthropic.messages.create(request);

    return {
      content: response.content[0].type === "text" ? response.content[0].text : "",
      model: response.model,
      finishReason: response.stop_reason || "",
      usage: {
        promptTokens: response.usage?.input_tokens || 0,
        completionTokens: response.usage?.output_tokens || 0,
        totalTokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
      }
    };
  } catch (error: unknown) {
    // If the model is not available, try the fallback models
    const typedError = error as { status?: number; message?: string };
    if (typedError.status === 404 || typedError.message?.includes("model")) {
      const config = AI_MODELS.ANTHROPIC;
      
      // Try fallback models
      for (const fallbackModel of config.fallbacks) {
        try {
          const request = formatAnthropicRequest(systemPrompt, userPrompt, {
            model: fallbackModel
          });
          
          const response = await anthropic.messages.create(request);
          
          // If successful, cache this model for future use
          cacheModelAvailability("anthropic", apiKey, fallbackModel);
          
          return {
            content: response.content[0].type === "text" ? response.content[0].text : "",
            model: response.model,
            finishReason: response.stop_reason || "",
            usage: {
              promptTokens: response.usage?.input_tokens || 0,
              completionTokens: response.usage?.output_tokens || 0,
              totalTokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
            }
          };
        } catch (fallbackError) {
          // Continue to the next fallback model
          console.error(`Fallback model ${fallbackModel} failed:`, fallbackError);
        }
      }
    }
    
    const aiError: AIError = {
      message: typedError.message || "An unknown error occurred with Anthropic API",
      status: typedError.status,
      type: "api_error",
    };
    
    console.error("Anthropic API error:", error);
    throw aiError;
  }
};

// Validate if API key is valid
export const validateAnthropicApiKey = async (
  apiKey: string,
  specificModel?: string
): Promise<boolean> => {
  try {
    // Try to make a minimal API call to check if the key works
    await callAnthropicAPI(
      apiKey,
      "You are a helpful assistant",
      "Hello! Please respond with just the word 'valid' to validate this API key.",
      specificModel
    );
    return true;
  } catch (error) {
    console.error("API key validation failed:", error);
    return false;
  }
};

const AnthropicService = {
  callAnthropicAPI,
  getAvailableModel,
  validateAnthropicApiKey,
  cacheModelAvailability
};

export default AnthropicService; 
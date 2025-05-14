import { API_ENDPOINTS, AI_MODELS, DEFAULT_PARAMS } from "../../config/aiConfig";
import { AIResponse, AIError } from "../../utils/aiTypes";
import { cacheModelAvailability, getAvailableModel } from "./anthropicService";

// Create appropriate HTTP headers for the AI service
const createHeaders = (apiKey: string, service: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (service !== "google") {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  return headers;
};

// Format request body according to the service's requirements
const createRequestBody = async (
  service: string,
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  specificModel?: string
) => {
  if (userPrompt.includes("Create a resume template")) {
    systemPrompt = `You are a professional UI/UX designer and React developer specializing in creating beautiful, modern resume templates. 
    While following all technical requirements strictly, your primary focus is on creating visually stunning, professional designs that:
    - Use modern layout techniques with flexbox and grid
    - Implement proper visual hierarchy and whitespace
    - Create elegant section transitions and spacing
    - Use sophisticated typography combinations
    - Apply colors in a refined, professional way
    - Add subtle but effective visual elements like borders, shadows, and hover effects
    
    ${systemPrompt}`;
  }

  // Get an available model for the service
  const modelToUse = await getAvailableModel(service, apiKey, specificModel);

  switch (service) {
    case "openai":
    case "groq":
      return JSON.stringify({
        model: modelToUse,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: DEFAULT_PARAMS.OPENAI.temperature,
        max_tokens: DEFAULT_PARAMS.OPENAI.max_tokens,
      });
    case "google":
      return JSON.stringify({
        contents: [
          { parts: [{ text: systemPrompt }] },
          { parts: [{ text: userPrompt }] },
        ],
      });
    default:
      throw new Error(`Unsupported AI service: ${service}`);
  }
};

// Make API request to non-Anthropic services
export const callGeneralAIService = async (
  apiKey: string,
  service: string,
  systemPrompt: string,
  userPrompt: string,
  specificModel?: string
): Promise<AIResponse> => {
  const headers = createHeaders(apiKey, service);
  const body = await createRequestBody(service, systemPrompt, userPrompt, apiKey, specificModel);
  
  // Determine the appropriate endpoint
  const url =
    service === "google"
      ? `${API_ENDPOINTS.GOOGLE}?key=${apiKey}`
      : API_ENDPOINTS[service.toUpperCase() as keyof typeof API_ENDPOINTS];

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    // Handle model not found error (try fallbacks)
    if (!response.ok && (response.status === 404 || response.status === 400)) {
      const errorText = await response.text();
      const isModelError = errorText.includes("model") || errorText.includes("not found");
      
      if (isModelError && service !== "google") {
        const config = AI_MODELS[service.toUpperCase()];
        
        // Try each fallback model
        for (const fallbackModel of config.fallbacks) {
          const fallbackBody = JSON.stringify({
            ...JSON.parse(body),
            model: fallbackModel
          });
          
          try {
            response = await fetch(url, {
              method: "POST",
              headers: headers,
              body: fallbackBody,
            });
            
            if (response.ok) {
              // If successful, cache this model for future use
              cacheModelAvailability(service, apiKey, fallbackModel);
              break;
            }
          } catch (fallbackError) {
            console.error(`Fallback model ${fallbackModel} failed:`, fallbackError);
          }
        }
      }
    }
    
    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw {
        message: errorJson.error?.message || `${service} API error: ${response.statusText}`,
        status: response.status,
        type: "api_error",
      };
    }

    const data = await response.json();
    
    // Format response based on the service
    if (service === "openai" || service === "groq") {
      return {
        content: data.choices[0]?.message?.content || "",
        model: data.model,
        finishReason: data.choices[0]?.finish_reason || "",
        usage: data.usage,
      };
    } else if (service === "google") {
      return {
        content: data.candidates[0]?.content?.parts[0]?.text || "",
        model: "gemini-pro",
        finishReason: data.candidates[0]?.finishReason || "",
        usage: {
          promptTokens: data.usage?.promptTokenCount || 0,
          completionTokens: data.usage?.candidatesTokenCount || 0,
          totalTokens: data.usage?.totalTokenCount || 0,
        },
      };
    }
    
    throw new Error(`Unsupported service response format: ${service}`);
  } catch (error: unknown) {
    const typedError = error as { message?: string; status?: number; type?: string };
    console.error(`${service} API error:`, error);
    
    const aiError: AIError = {
      message: typedError.message || `An unknown error occurred with ${service}`,
      status: typedError.status,
      type: typedError.type || "unknown_error",
    };
    
    throw aiError;
  }
};

// Validate API key
export const validateGeneralApiKey = async (
  apiKey: string,
  service: string,
  specificModel?: string
): Promise<boolean> => {
  try {
    // Make a minimal API call to check if the key works
    await callGeneralAIService(
      apiKey,
      service,
      "You are a helpful assistant",
      "Hello! Please respond with just the word 'valid' to validate this API key.",
      specificModel
    );
    return true;
  } catch (error) {
    console.error(`${service} API key validation failed:`, error);
    return false;
  }
};

const GeneralAIService = {
  callGeneralAIService,
  validateGeneralApiKey
};

export default GeneralAIService; 
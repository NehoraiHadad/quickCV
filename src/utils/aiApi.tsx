import { 
  callAnthropicAPI, 
  validateAnthropicApiKey,
  callGeneralAIService,
  validateGeneralApiKey
} from "../services/ai";

import { 
  generatePromptByField, 
  cleanAIResponse
} from "./ai";

import { OperationType } from "./aiTypes";

// Generate AI content based on field, context, and operation type
export const generateAIContent = async (
  apiKey: string,
  service: string,
  text: string,
  field: string,
  context: string,
  operation: OperationType,
  specificModel?: string
): Promise<string[]> => {
  try {
    // Special case for skills and title fields - adjust the system prompt
    const fieldLower = field.toLowerCase();
    const isSkill = fieldLower === 'skill';
    const isTitle = fieldLower.includes('title') || fieldLower.includes('name');
    
    // Generate the appropriate prompt based on field and operation
    const userPrompt = generatePromptByField(field, text, context, operation);
    
    // Setup system prompt based on operation
    let systemPrompt = "You are an AI assistant specializing in resume optimization.";
    
    // Add specific instructions for titles and skills
    if (isSkill && operation === "suggest") {
      systemPrompt = "You are a career expert specializing in resume skills. Provide only 1-3 word skill names WITHOUT explanation or context. Each suggestion should be separated by '|||'. Provide only the skill names, no additional text.";
    } else if (isTitle && operation === "suggest") {
      systemPrompt = "You are a resume expert specializing in section titles. Provide only short, professional section titles WITHOUT explanation or context. Each title should be separated by '|||'. Provide only the titles themselves, 1-5 words each, no additional text.";
    } else {
      switch (operation) {
        case "suggest":
          systemPrompt += " Your task is to provide three unique suggestions to improve the given resume text, separated by '|||'. so suggestion1 ||| suggestion2 ||| suggestion3. Each suggestion should enhance the content's impact, relevance, and professionalism while maintaining the original intent. Tailor your suggestions to the specific resume field and context provided. Your answer - without introductions, additions or special markings, just the required answer.";
          break;
        case "optimize":
          systemPrompt += " Your task is to provide three improved versions of the given resume text, separated by '|||'. so optimize1 ||| optimize2 ||| optimize3. Each version should enhance clarity, impact, and relevance to the field while maintaining the core message. Tailor your optimizations to the specific resume field and context provided. Your answer - without introductions, additions or special markings, just the required answer. Provide only the optimized versions separated by |||.";
          break;
        case "grammar":
          systemPrompt += " Your task is to provide a single corrected version of the given resume text, focusing on grammar, spelling, and punctuation. Maintain the original meaning and tone while ensuring the text is polished and professional. Your answer - without introductions, additions or special markings, just the required answer. Provide only the corrected text with no explanations or comments.";
          break;
        case "generate":
          if (userPrompt.includes("Create a resume template") || field.includes("template")) {
            systemPrompt = `You are a senior UI/UX designer and React developer specializing in creating exceptional, customized resume templates.

CRITICAL RESPONSE FORMAT:
- Return ONLY the React.createElement code
- NO imports, NO exports, NO comments
- NO markdown code blocks
- NO explanations or additional text
- Start directly with React.createElement
- End with the closing parenthesis
- NO trailing characters or newlines`;
          }
          break;
      }
    }
    
    // Call the appropriate service based on service name
    let response;
    if (service === "anthropic") {
      response = await callAnthropicAPI(apiKey, systemPrompt, userPrompt, specificModel);
    } else {
      response = await callGeneralAIService(apiKey, service, systemPrompt, userPrompt, specificModel);
    }
    
    // Process the response based on operation
    if (operation === "grammar") {
      // For grammar check, just return the content directly
      return [response.content];
    } else if (operation === "generate") {
      // For template generation, also return content directly
      return [response.content];
    } else {
      // Split by ||| for suggest and optimize operations
      return response.content.split("|||").map((suggestion: string) => {
        // Clean each suggestion with field-specific processing
        const cleaned = cleanAIResponse({ ...response, content: suggestion }, field);
        return cleaned.trim();
      });
    }
  } catch (error) {
    console.error("Error generating AI content:", error);
    throw error;
  }
};

// Validate if API key is valid for the specified service
export const validateApiKey = async (
  apiKey: string,
  service: string,
  specificModel?: string
): Promise<boolean> => {
  try {
    if (service === "anthropic") {
      return await validateAnthropicApiKey(apiKey, specificModel);
    } else {
      return await validateGeneralApiKey(apiKey, service, specificModel);
    }
  } catch (error) {
    console.error("API key validation error:", error);
    return false;
  }
};

const AIApi = {
  generateAIContent,
  validateApiKey
};

export default AIApi; 
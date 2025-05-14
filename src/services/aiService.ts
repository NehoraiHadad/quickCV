import { generateAIContent } from "../utils/aiApi";
import { TemplatePreferences } from "../types/templates";
import AiPromptService from "./aiPromptService";

/**
 * Response type for template generation
 */
export interface AITemplateResponse {
  success: boolean;
  templateCode: string;
  error?: string;
}

/**
 * Generate a resume template using AI based on provided preferences
 */
export const generateResumeTemplate = async (
  preferences: TemplatePreferences,
  apiKey: string,
  service: string,
  specificModel?: string
): Promise<AITemplateResponse> => {
  try {
    if (!apiKey || !service) {
      throw new Error("API key and service are required");
    }

    // Create the prompt using the service
    const prompt = AiPromptService.createTemplatePrompt(preferences);
    
    // Validate the prompt
    const validation = AiPromptService.validateTemplatePrompt(prompt);
    if (!validation.isValid) {
      throw new Error(`Invalid prompt: ${validation.error}`);
    }
    
    // Call the AI API - note: combine context with prompt for the new API format
    const response = await generateAIContent(
      apiKey,
      service,
      "template",
      "template",
      JSON.stringify(preferences) + "\n\n" + prompt,
      "generate",
      specificModel
    );
    
    // Check for valid response
    if (!response || !response[0]) {
      throw new Error("No template generated");
    }

    // Clean up the response
    const templateCode = response[0]
      .replace(/```[a-z]*\n?/g, "") // Remove code block markers
      .trim();

    // Basic validation - check if it uses React.createElement
    if (!templateCode.includes("React.createElement")) {
      return {
        success: false,
        error: "Invalid template structure: Missing React.createElement",
        templateCode // Return the code anyway for editing
      };
    }

    // Validate syntax
    try {
      new Function(
        "React",
        "personalInfo",
        "workExperience",
        "education",
        "skills",
        "projects",
        "templateColors",
        `return (${templateCode});`
      );

      return {
        success: true,
        templateCode,
      };
    } catch (error) {
      return {
        success: false,
        error: `Invalid template code: ${error instanceof Error ? error.message : 'Unknown error'}`,
        templateCode // Return the code anyway for editing
      };
    }
  } catch (error) {
    // Handle any errors that occurred during generation
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      templateCode: "" // Return empty string if no code was generated
    };
  }
}; 
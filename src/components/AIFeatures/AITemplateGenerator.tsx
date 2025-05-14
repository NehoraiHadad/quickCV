import { TemplatePreferences } from "../../types/templates";
import { generateResumeTemplate, AITemplateResponse } from "../../services/aiService";

/**
 * Generate a resume template using AI
 * @param preferences Template preferences
 * @param apiKey API key for the AI service
 * @param service AI service to use (e.g., "openai", "anthropic")
 * @param specificModel Optional specific model to use
 * @returns Response with template code and success status
 */
export const AITemplateGenerator = async (
  preferences: TemplatePreferences,
  apiKey: string,
  service: string,
  specificModel?: string
): Promise<AITemplateResponse> => {
  return generateResumeTemplate(preferences, apiKey, service, specificModel);
};

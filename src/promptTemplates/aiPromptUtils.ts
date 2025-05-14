/**
 * Formats an AI prompt by cleaning up whitespace and ensuring consistent formatting
 * @param prompt The raw prompt template
 * @param replacements Object containing key-value pairs to replace in the template
 * @returns Formatted prompt string
 */
export const formatPrompt = (
  prompt: string,
  replacements?: Record<string, string>
): string => {
  let formattedPrompt = prompt;

  // Replace any variables with their values
  if (replacements) {
    Object.entries(replacements).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      formattedPrompt = formattedPrompt.replace(regex, value);
    });
  }

  // Remove consecutive empty lines
  formattedPrompt = formattedPrompt.replace(/\n{3,}/g, "\n\n");

  return formattedPrompt.trim();
};

/**
 * Creates an augmented prompt that includes system instructions
 * @param basePrompt The main prompt content
 * @param systemInstructions System instructions to prepend
 * @returns Complete prompt with system instructions
 */
export const createAugmentedPrompt = (
  basePrompt: string,
  systemInstructions: string
): string => {
  return `${systemInstructions.trim()}\n\n${basePrompt.trim()}`;
};

/**
 * Validates a prompt to ensure it meets requirements
 * @param prompt The prompt to validate
 * @param minLength Minimum required length
 * @param requiredPhrases Array of phrases that must be included
 * @returns Object with validation result
 */
export const validatePrompt = (
  prompt: string,
  minLength = 10,
  requiredPhrases: string[] = []
): { isValid: boolean; error?: string } => {
  if (prompt.length < minLength) {
    return {
      isValid: false,
      error: `Prompt is too short. Minimum length is ${minLength} characters.`,
    };
  }

  for (const phrase of requiredPhrases) {
    if (!prompt.includes(phrase)) {
      return {
        isValid: false,
        error: `Prompt must include the phrase: "${phrase}"`,
      };
    }
  }

  return { isValid: true };
}; 
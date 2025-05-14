// Export all AI utilities
import promptUtils from "./promptUtils";
import responseUtils from "./responseUtils";

export const {
  createTextImprovementPrompt,
  createGrammarCheckPrompt,
  createContentSuggestionsPrompt,
  generatePromptByField,
  getSystemPromptForFeature
} = promptUtils;

export const {
  parseGrammarCheckResponse,
  parseContentSuggestionsResponse,
  cleanAIResponse,
  processMultipleResults
} = responseUtils;

const AIUtils = {
  ...promptUtils,
  ...responseUtils
};

export default AIUtils; 
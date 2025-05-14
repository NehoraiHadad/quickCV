import { DEFAULT_SYSTEM_PROMPTS, FIELD_PROMPTS } from "../../config/aiConfig";
import { AIFeatureType, OperationType } from "../aiTypes";

// Format a prompt for text improvement
export const createTextImprovementPrompt = (
  originalText: string,
  context: string = "",
  targetAudience: string = ""
): string => {
  let prompt = `Please improve the following resume text:\n\n${originalText}\n\n`;
  
  if (context) {
    prompt += `Context about this section: ${context}\n\n`;
  }
  
  if (targetAudience) {
    prompt += `Target audience/industry: ${targetAudience}\n\n`;
  }
  
  prompt += "Please provide an improved version that is more professional, " +
    "concise, and impactful. Use strong action verbs and quantify achievements where possible.";
  
  return prompt;
};

// Format a prompt for grammar checking
export const createGrammarCheckPrompt = (text: string): string => {
  return `Please check the following text for grammatical errors, spelling mistakes, and awkward phrasing:\n\n${text}\n\n` +
    "For each issue found, provide:\n" +
    "1. The original text with the issue\n" +
    "2. The corrected version\n" +
    "3. A brief explanation of the correction\n\n" +
    "If there are no issues, simply state 'No issues found.'\n\n" +
    "At the end, please provide the complete corrected text under a heading 'Corrected full text:'.";
};

// Format a prompt for content suggestions
export const createContentSuggestionsPrompt = (
  sectionType: string,
  currentContent: string,
  jobTitle: string = "",
  industry: string = ""
): string => {
  let prompt = `Please suggest improvements for the following ${sectionType} section of a resume:\n\n${currentContent}\n\n`;
  
  if (jobTitle) {
    prompt += `The resume is for a ${jobTitle} position.\n`;
  }
  
  if (industry) {
    prompt += `The target industry is: ${industry}.\n`;
  }
  
  prompt += "Please provide 3-5 specific suggestions to enhance this section. " +
    "Focus on content, not formatting. Suggestions should help make the resume more appealing to hiring managers.";
  
  return prompt;
};

// Generate prompt based on field type and operation
export const generatePromptByField = (
  field: string,
  text: string,
  context: string,
  operation: OperationType
): string => {
  // Get the field-specific prompt template
  const fieldKey = field.toLowerCase() as keyof typeof FIELD_PROMPTS;
  const fieldPrompt = FIELD_PROMPTS[fieldKey] || 
    "Improve this content for a resume. Make it more professional, concise, and impactful.";
  
  let prompt = "";
  
  // Special handling for skills and title fields
  const isSkill = fieldKey === 'skill';
  const isTitle = String(fieldKey).includes('title') || String(fieldKey).includes('name');
  
  switch (operation) {
    case "optimize":
      prompt = `Provide three optimized versions of the following ${field} text for a resume. Consider the resume context and job target when optimizing.\n\nResume Context: ${context}\n\nField-specific guidance: ${fieldPrompt}\n\nText to optimize: ${text}\n\nProvide three distinct optimized versions, separated by '|||'. so optimize1 ||| optimize2 ||| optimize3:`;
      break;
      
    case "suggest":
      if (isSkill) {
        prompt = `Suggest three highly relevant skills for a resume targeting ${context || "professional roles"}. Choose skills that are most applicable to the target job or industry, using industry-standard terminology.\n\nProvide ONLY the skill names (1-3 words each), separated by '|||'. No explanations or additional text.`;
      } else if (isTitle) {
        prompt = `Suggest three clear and relevant titles for a resume section about "${text || context || "professional achievements"}". Each title should be 1-5 words, professional, and accurately represent the section content.\n\nProvide ONLY the titles, separated by '|||'. No explanations or additional text.`;
      } else {
        prompt = `Provide three unique suggestions to improve the following ${field} text for a resume. Consider the resume context and job target when making your suggestions.\n\nResume Context: ${context}\n\nField-specific guidance: ${fieldPrompt}\n\nText to improve: ${text}\n\nProvide three distinct suggestions, separated by '|||'. so suggestion1 ||| suggestion2 ||| suggestion3:`;
      }
      break;
      
    case "grammar":
      prompt = `Improve the grammar, spelling, and punctuation of the following ${field} text for a resume. Maintain the original meaning and tone.\n\nResume Context: ${context}\n\nField-specific guidance: ${fieldPrompt}\n\nText to improve: ${text}\n\nProvide the corrected version without explanations, comments, or anything else. Just provide the corrected text directly:`;
      break;
      
    case "generate":
      if (field.includes("template")) {
        prompt = `CREATE A CUSTOM RESUME TEMPLATE

RESPONSE FORMAT REQUIREMENTS:
1. Start directly with React.createElement
2. NO imports, exports, or additional text
3. NO markdown code blocks or backticks
4. End with closing parenthesis
5. NO trailing characters or newlines

USER'S SPECIFIC REQUIREMENTS:
${text}

IMPLEMENTATION CHECKLIST:
1. Use ALL required data structures (personalInfo, workExperience, etc.)
2. Apply templateColors for all color values
3. IMPORTANT: Use unique keys for ALL mapped elements (key={item.id})
4. Handle empty data cases
5. Maintain professional layout and spacing
6. Follow A4 page dimensions
7. Use only inline styles
8. Start with React.createElement and end with )

KEY REQUIREMENT - ARRAY MAPPING:
When mapping arrays, ALWAYS include the unique ID as the key:
✅ CORRECT: workExperience.map((item, index) => React.createElement('div', { key: item.id || index }, ...))
❌ WRONG: workExperience.map(item => React.createElement('div', {}, ...)) // Missing key prop

Generate the template code now:`;
      } else if (isSkill) {
        prompt = `Generate a relevant skill for a resume targeting ${context || "professional roles"}. Provide ONLY the skill name (1-3 words), no explanations or additional text.`;
      } else if (isTitle) {
        prompt = `Generate a clear and relevant title for a resume section about "${text || context || "professional achievements"}". The title should be 1-5 words, professional, and accurately represent the section content. Provide ONLY the title, no explanations or additional text.`;
      } else {
        prompt = `${fieldPrompt}\n\n`;
        if (context) {
          prompt += `Based on this information: ${context}\n\n`;
        }
        prompt += "Please generate appropriate content.";
      }
      break;
      
    default:
      if (isSkill) {
        prompt = `Provide a single, highly relevant skill for a resume targeting ${context || "professional roles"}. The skill should be 1-3 words only, no explanation.`;
      } else if (isTitle) {
        prompt = `Provide a concise, professional title for a resume section about "${text || context || "professional achievements"}". The title should be 1-5 words only.`;
      } else {
        prompt = `${fieldPrompt}\n\nHere is the current content:\n\n${text}`;
      }
  }
  
  return prompt;
};

// Get the appropriate system prompt for a feature
export const getSystemPromptForFeature = (feature: AIFeatureType): string => {
  switch (feature) {
    case AIFeatureType.TEXT_IMPROVEMENT:
      return DEFAULT_SYSTEM_PROMPTS.TEXT_IMPROVEMENT;
    case AIFeatureType.GRAMMAR_CHECK:
      return DEFAULT_SYSTEM_PROMPTS.GRAMMAR_CHECK;
    case AIFeatureType.CONTENT_SUGGESTIONS:
      return DEFAULT_SYSTEM_PROMPTS.CONTENT_SUGGESTIONS;
    case AIFeatureType.TEMPLATE_GENERATION:
      return DEFAULT_SYSTEM_PROMPTS.TEMPLATE_GENERATION;
    default:
      return "You are a helpful assistant.";
  }
};

const PromptUtils = {
  createTextImprovementPrompt,
  createGrammarCheckPrompt,
  createContentSuggestionsPrompt,
  generatePromptByField,
  getSystemPromptForFeature
};

export default PromptUtils; 
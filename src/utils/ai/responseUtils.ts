import { GrammarCheckResult, AIResponse, ContentSuggestion } from "../aiTypes";

// Parse grammar check results from AI response
export const parseGrammarCheckResponse = (response: AIResponse): GrammarCheckResult => {
  const content = response.content;
  
  // Check if no issues were found
  if (content.includes("No issues found")) {
    return {
      correctedText: content.replace("No issues found.", "").trim(),
      issues: [],
    };
  }
  
  // Parse the issues from the response
  const issues = [];
  const sections = content.split(/\d+\.\s/).filter(Boolean);
  
  for (const section of sections) {
    const parts = section.split(/Original:|Corrected:|Explanation:/i).filter(Boolean);
    
    if (parts.length >= 3) {
      issues.push({
        original: parts[0].trim(),
        correction: parts[1].trim(),
        explanation: parts[2].trim(),
      });
    }
  }
  
  // Extract the fully corrected text if available
  let correctedText = "";
  const correctedTextMatch = content.match(/Corrected full text:\s*([\s\S]+?)(?:\n\n|$)/i);
  
  if (correctedTextMatch && correctedTextMatch[1]) {
    correctedText = correctedTextMatch[1].trim();
  } else {
    // If no explicit corrected text section, return the full content
    // This is to match the original implementation behavior
    correctedText = content;
  }
  
  return {
    correctedText,
    issues,
  };
};

// Parse content suggestions from AI response
export const parseContentSuggestionsResponse = (response: AIResponse): ContentSuggestion[] => {
  const content = response.content;
  const suggestions: ContentSuggestion[] = [];
  
  // Extract numbered suggestions
  const suggestionMatches = Array.from(content.matchAll(/\d+\.\s*([\s\S]+?)(?=\n\d+\.|$)/g));
  
  for (const match of suggestionMatches) {
    if (match[1]) {
      suggestions.push({
        text: match[1].trim(),
      });
    }
  }
  
  // If no numbered suggestions found, split by paragraphs
  if (suggestions.length === 0) {
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    for (const paragraph of paragraphs) {
      suggestions.push({
        text: paragraph.trim()
      });
    }
  }
  
  return suggestions;
};

// Clean AI response for direct use, with special handling for specific fields
export const cleanAIResponse = (response: AIResponse, field?: string): string => {
  let content = response.content.trim();
  
  // Remove markdown code blocks
  content = content.replace(/```(.|\n)*?```/g, "");
  
  // Remove quotation marks around the response if they wrap the entire text
  if (content.startsWith('"') && content.endsWith('"')) {
    content = content.slice(1, -1);
  }
  
  // Handle specific fields
  if (field) {
    const fieldLower = field.toLowerCase();
    
    // For skills, ensure we get just the skill name (1-3 words only)
    if (fieldLower === 'skill') {
      // Extract just the first few words and remove any descriptions/explanations
      const words = content.split(/\s+/);
      if (words.length > 3) {
        content = words.slice(0, 3).join(' ');
      }
      // Remove any punctuation
      content = content.replace(/[.,;:!?].*$/, '');
    }
    
    // For section titles, ensure we get a concise title
    if (fieldLower.includes('title') || fieldLower.includes('name')) {
      // Limit to first line and first sentence
      content = content.split('\n')[0].split('.')[0].trim();
      
      // Remove any explanations or descriptions
      if (content.includes(':')) {
        content = content.split(':')[0].trim();
      }
      if (content.includes('-')) {
        content = content.split('-')[0].trim();
      }
      
      // Cap at reasonable title length (10 words max)
      const words = content.split(/\s+/);
      if (words.length > 10) {
        content = words.slice(0, 10).join(' ');
      }
    }
  }
  
  // Remove any "Here's an improved version:" or similar prefixes
  content = content.replace(/^(?:Here(?:'s| is)(?: an?| the| your)?|I've created a) (improved|optimized|enhanced|suggested|corrected|grammar-checked|better) (?:version|text|content|suggestion|draft|copy|example)(?: for you)?[:\.]?\s*/i, "");
  
  return content.trim();
};

// Process multiple results from AI response
export const processMultipleResults = (response: AIResponse, field?: string): string[] => {
  // First try to split by the explicit separator
  if (response.content.includes('|||')) {
    return response.content
      .split('|||')
      .map(item => cleanAIResponse({ ...response, content: item }, field));
  }
  
  const content = response.content;
  let results: string[] = [];
  
  // Try to find numbered items (1. Item, 2. Item, etc.)
  const numberedMatch = content.match(/\d+\.\s+([\s\S]+?)(?=\n\d+\.|$)/g);
  if (numberedMatch && numberedMatch.length > 0) {
    results = numberedMatch.map(item => 
      cleanAIResponse({ ...response, content: item.replace(/^\d+\.\s+/, '') }, field)
    );
    return results;
  }
  
  // Try to find bullet points
  const bulletMatch = content.match(/[•\-\*]\s+([\s\S]+?)(?=\n[•\-\*]|$)/g);
  if (bulletMatch && bulletMatch.length > 0) {
    results = bulletMatch.map(item => 
      cleanAIResponse({ ...response, content: item.replace(/^[•\-\*]\s+/, '') }, field)
    );
    return results;
  }
  
  // If no structured format is found, split by paragraphs
  results = content
    .split('\n\n')
    .filter(para => para.trim().length > 0)
    .map(para => cleanAIResponse({ ...response, content: para }, field));
  
  return results;
};

const ResponseUtils = {
  parseGrammarCheckResponse,
  parseContentSuggestionsResponse,
  cleanAIResponse,
  processMultipleResults
};

export default ResponseUtils; 
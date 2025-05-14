// Configuration constants for AI services
import { AIServiceConfig } from "../utils/aiTypes";

export const AI_MODELS: Record<string, AIServiceConfig> = {
  ANTHROPIC: {
    preferred: "claude-2.0",
    fallbacks: ["claude-instant-1.2"],
    isAvailable: async () => {
      try {
        // Simple check - we're not actually implementing the check for this example
        return true;
      } catch {
        return false;
      }
    }
  },
  OPENAI: {
    preferred: "gpt-4",
    fallbacks: ["gpt-3.5-turbo"],
    isAvailable: async () => {
      try {
        // Simple check - we're not actually implementing the check for this example
        return true;
      } catch {
        return false;
      }
    }
  },
  GROQ: {
    preferred: "llama2-70b-4096",
    fallbacks: ["mixtral-8x7b-32768"],
  },
  GOOGLE: {
    preferred: "gemini-pro",
    fallbacks: [],
  },
};

export const API_ENDPOINTS = {
  ANTHROPIC: "/api/anthropic",
  OPENAI: "/api/openai",
  GROQ: "https://api.groq.com/openai/v1/chat/completions",
  GOOGLE: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
};

export const DEFAULT_PARAMS = {
  ANTHROPIC: {
    temperature: 0.7,
    maxTokens: 1000,
    // Other default parameters
  },
  OPENAI: {
    temperature: 0.7,
    max_tokens: 1000,
    // Other default parameters
  },
};

export const DEFAULT_SYSTEM_PROMPTS = {
  TEXT_IMPROVEMENT: "You are an expert resume writer who helps job seekers improve their resume text.",
  GRAMMAR_CHECK: "You are a professional editor who helps improve grammar and writing.",
  CONTENT_SUGGESTIONS: "You are a career coach who provides helpful resume content suggestions.",
  TEMPLATE_GENERATION: "You are a professional UI/UX designer and React developer specializing in creating beautiful, modern resume templates.",
};

export const FIELD_PROMPTS = {
  "personal info":
    "Enhance the personal information for a resume. Create a concise and impactful summary that highlights key qualifications, career objectives, and unique value propositions. Focus on professional tone and relevance to the target job or industry.",
  "work experience":
    "Improve the work experience description for a resume. Use strong action verbs, quantify achievements where possible, and emphasize relevant accomplishments that demonstrate skills and impact. Tailor the content to showcase experience most relevant to the target position.",
  education:
    "Refine the education details for a resume. Highlight relevant coursework, academic achievements, or projects that relate to the target job or industry. Present the information in a clear, concise manner that emphasizes the value of the educational background.",
  skill:
    "Suggest a single, highly relevant skill for a resume. Choose a skill that is most applicable to the target job or industry, using industry-standard terminology. Consider technical, soft, or transferable skills that align with common job requirements. Provide only one skill without any additional explanation. 1-3 words only",
  "project name":
    "Create a concise yet descriptive project name for a resume that clearly indicates the project's purpose, main technology used, or key outcome. Ensure the name is memorable and relevant to the target industry.",
  "project description":
    "Enhance the project description for a resume. Highlight the technologies used, your specific role, and the project's impact or results. Use action verbs, quantify achievements where possible, and focus on aspects most relevant to the target job.",
  "additional section title":
    "Craft a clear and relevant title for an additional resume section that adds value to your application. Ensure the title is concise, professional, and accurately represents the content of the section.",
  "additional section content":
    "Improve the content of this additional resume section. Focus on information that complements your other qualifications and is directly relevant to your target job or industry. Present the information in a clear, concise, and impactful manner.",
}; 
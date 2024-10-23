const API_ENDPOINTS = {
  openai: "https://api.openai.com/v1/chat/completions",
  anthropic: "https://api.anthropic.com/v1/complete",
  groq: "https://api.groq.com/openai/v1/chat/completions",
  google: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
};

const AI_MODELS = {
  openai: "gpt-4o",
  anthropic: "claude-3-5-sonnet-20241022",
  groq: "llama-3.1-70b-versatile",
  google: "gemini-1.5-flash-002",
};

const FIELD_PROMPTS = {
  "personal info": "Enhance the personal information for a resume. Create a concise and impactful summary that highlights key qualifications, career objectives, and unique value propositions. Focus on professional tone and relevance to the target job or industry.",
  "work experience": "Improve the work experience description for a resume. Use strong action verbs, quantify achievements where possible, and emphasize relevant accomplishments that demonstrate skills and impact. Tailor the content to showcase experience most relevant to the target position.",
  "education": "Refine the education details for a resume. Highlight relevant coursework, academic achievements, or projects that relate to the target job or industry. Present the information in a clear, concise manner that emphasizes the value of the educational background.",
  "skill": "Suggest a single, highly relevant skill for a resume. Choose a skill that is most applicable to the target job or industry, using industry-standard terminology. Consider technical, soft, or transferable skills that align with common job requirements. Provide only one skill without any additional explanation. 1-3 words only",
  "project name": "Create a concise yet descriptive project name for a resume that clearly indicates the project's purpose, main technology used, or key outcome. Ensure the name is memorable and relevant to the target industry.",
  "project description": "Enhance the project description for a resume. Highlight the technologies used, your specific role, and the project's impact or results. Use action verbs, quantify achievements where possible, and focus on aspects most relevant to the target job.",
  "additional section title": "Craft a clear and relevant title for an additional resume section that adds value to your application. Ensure the title is concise, professional, and accurately represents the content of the section.",
  "additional section content": "Improve the content of this additional resume section. Focus on information that complements your other qualifications and is directly relevant to your target job or industry. Present the information in a clear, concise, and impactful manner.",
};

const createHeaders = (apiKey: string, service: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (service !== "google") {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  return headers;
};

const createRequestBody = (service: string, systemPrompt: string, userPrompt: string) => {
  switch (service) {
    case "openai":
    case "groq":
      return JSON.stringify({
        model: AI_MODELS[service as keyof typeof AI_MODELS],
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      });
    case "anthropic":
      return JSON.stringify({
        prompt: `Human: ${systemPrompt}\n\n${userPrompt}\n\nAssistant:`,
        model: AI_MODELS.anthropic,
        max_tokens_to_sample: 500,
      });
    case "google":
      return JSON.stringify({
        contents: [
          { parts: [{ text: systemPrompt }] },
          { parts: [{ text: userPrompt }] },
        ],
      });
    default:
      throw new Error("Unsupported AI service");
  }
};

const makeApiRequest = async (apiKey: string, service: string, systemPrompt: string, userPrompt: string) => {
  const headers = createHeaders(apiKey, service);
  const body = createRequestBody(service, systemPrompt, userPrompt);
  const url = service === "google" ? `${API_ENDPOINTS[service]}?key=${apiKey}` : API_ENDPOINTS[service as keyof typeof API_ENDPOINTS];

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: body,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  switch (service) {
    case "openai":
    case "groq":
      return data.choices[0].message.content.trim();
    case "anthropic":
      return data.completion.trim();
    case "google":
      return data.candidates[0].content.parts[0].text.trim();
    default:
      throw new Error("Unsupported AI service");
  }
};

export const generateAIContent = async (
  apiKey: string,
  service: string,
  text: string,
  field: string,
  context: string,
  operation: "suggest" | "optimize" | "grammar"
): Promise<string[]> => {
  let systemPrompt = "You are an AI assistant specializing in resume optimization.";
  let userPrompt = "";
  const fieldPrompt = FIELD_PROMPTS[field as keyof typeof FIELD_PROMPTS] || "Improve the following text for a resume, focusing on clarity, impact, and relevance to the field.";

  switch (operation) {
    case "suggest":
      systemPrompt += " Your task is to provide three unique suggestions to improve the given resume text, separated by '|||'. so suggestion1 ||| suggestion2 ||| suggestion3. Each suggestion should enhance the content's impact, relevance, and professionalism while maintaining the original intent. Tailor your suggestions to the specific resume field and context provided. Your answer - without introductions, additions or special markings, just the required answer. ";
      userPrompt = `Provide three unique suggestions to improve the following ${field} text for a resume. Consider the resume context and job target when making your suggestions.\n\nResume Context: ${context}\n\nField-specific guidance: ${fieldPrompt}\n\nText to improve: ${text}\n\nProvide three distinct suggestions, separated by '|||'. so suggestion1 ||| suggestion2 ||| suggestion3:`;
      break;
    case "optimize":
      systemPrompt += " Your task is to provide three improved versions of the given resume text, separated by '|||'. so optimize1 ||| optimize2 ||| optimize3. Each version should enhance clarity, impact, and relevance to the field while maintaining the core message. Tailor your optimizations to the specific resume field and context provided. Your answer - without introductions, additions or special markings, just the required answer.";
      userPrompt = `Provide three optimized versions of the following ${field} text for a resume. Consider the resume context and job target when optimizing.\n\nResume Context: ${context}\n\nField-specific guidance: ${fieldPrompt}\n\nText to optimize: ${text}\n\nProvide three distinct optimized versions, separated by '|||'. so optimize1 ||| optimize2 ||| optimize3:`;
      break;
    case "grammar":
      systemPrompt += " Your task is to provide a single corrected version of the given resume text, focusing on grammar, spelling, and punctuation. Maintain the original meaning and tone while ensuring the text is polished and professional. Your answer - without introductions, additions or special markings, just the required answer.";
      userPrompt = `Improve the grammar, spelling, and punctuation of the following ${field} text for a resume. Maintain the original meaning and tone.\n\nResume Context: ${context}\n\nField-specific guidance: ${fieldPrompt}\n\nText to improve: ${text}\n\nProvide the corrected version:`;
      break;
  }

  try {
    const response = await makeApiRequest(apiKey, service, systemPrompt, userPrompt);
    return operation === "grammar" ? [response] : response.split("|||").map((suggestion: string) => suggestion.trim());
  } catch (error) {
    console.error(`Error in ${operation} operation:`, error);
    throw error;
  }
};

export const validateApiKey = async (apiKey: string, service: string): Promise<boolean> => {
  try {
    const response = await makeApiRequest(apiKey, service, "Test", "Test");
    return !!response;
  } catch (error) {
    console.error("Error validating API key:", error);
    return false;
  }
};
import Anthropic from "@anthropic-ai/sdk";
import { AI_MODELS } from "./aiModelConfig";

const API_ENDPOINTS = {
  openai: "https://api.openai.com/v1/chat/completions",
  groq: "https://api.groq.com/openai/v1/chat/completions",
  google:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
};

// Cache for model availability results
const modelAvailabilityCache: Record<string, Record<string, string>> = {};

// Get available model for a service with an option to specify a model directly
const getAvailableModel = async (
  service: string, 
  apiKey: string, 
  specificModel?: string
): Promise<string> => {
  // If a specific model is requested, use it directly
  if (specificModel) {
    cacheModelAvailability(service, apiKey, specificModel);
    return specificModel;
  }
  
  // Return from cache if available
  if (modelAvailabilityCache[service]?.[apiKey]) {
    return modelAvailabilityCache[service][apiKey];
  }

  const config = AI_MODELS[service];
  if (!config) {
    throw new Error(`Service ${service} is not supported`);
  }

  // Check if preferred model is available
  if (config.isAvailable) {
    try {
      const isPreferredAvailable = await config.isAvailable(apiKey);
      if (isPreferredAvailable) {
        cacheModelAvailability(service, apiKey, config.preferred);
        return config.preferred;
      }
    } catch (error) {
      console.error("Error checking model availability:", error);
      // Fall through to fallbacks
    }
  }

  // For now, just return the preferred model as default
  // (fallback logic will be implemented in the API request functions)
  cacheModelAvailability(service, apiKey, config.preferred);
  return config.preferred;
};

// Cache model availability results
export const cacheModelAvailability = (service: string, apiKey: string, model: string) => {
  if (!modelAvailabilityCache[service]) {
    modelAvailabilityCache[service] = {};
  }
  modelAvailabilityCache[service][apiKey] = model;
  
  // Update localStorage to inform other components
  localStorage.setItem("aiCurrentModel", model);
  
  // Dispatch an event so other components can update
  const event = new CustomEvent("aiModelChanged", { 
    detail: { service, model } 
  });
  window.dispatchEvent(event);
};

const FIELD_PROMPTS = {
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

const createHeaders = (apiKey: string, service: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (service !== "google") {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  return headers;
};

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

const makeApiRequest = async (
  apiKey: string,
  service: string,
  systemPrompt: string,
  userPrompt: string,
  specificModel?: string
) => {
  if (service === "anthropic") {
    const anthropic = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });

    // Get the best available model for Anthropic
    const modelToUse = await getAvailableModel(service, apiKey, specificModel);
    
    try {
      const response = await anthropic.messages.create({
        model: modelToUse,
        max_tokens: 4096,
        messages: [
          { role: "user", content: systemPrompt },
          {
            role: "assistant",
            content:
              "I understand. I'll help create a template that matches these requirements.",
          },
          { role: "user", content: userPrompt },
        ],
      });

      return response.content[0].type === "text"
        ? response.content[0].text
        : "";
    } catch (error: unknown) {
      // If the model is not available, try the fallback models
      const typedError = error as { status?: number; message?: string };
      if (typedError.status === 404 || typedError.message?.includes("model")) {
        const config = AI_MODELS[service];
        // Try fallback models
        for (const fallbackModel of config.fallbacks) {
          try {
            const response = await anthropic.messages.create({
              model: fallbackModel,
              max_tokens: 4096,
              messages: [
                { role: "user", content: systemPrompt },
                {
                  role: "assistant",
                  content: "I understand. I'll help with that.",
                },
                { role: "user", content: userPrompt },
              ],
            });
            
            // If successful, cache this model for future use
            cacheModelAvailability(service, apiKey, fallbackModel);
            
            return response.content[0].type === "text"
              ? response.content[0].text
              : "";
          } catch (fallbackError) {
            // Continue to the next fallback model
            console.error(`Fallback model ${fallbackModel} failed:`, fallbackError);
          }
        }
      }
      
      console.error("Anthropic API error:", error);
      throw error;
    }
  }

  const headers = createHeaders(apiKey, service);
  const body = await createRequestBody(service, systemPrompt, userPrompt, apiKey, specificModel);
  const url =
    service === "google"
      ? `${API_ENDPOINTS[service]}?key=${apiKey}`
      : API_ENDPOINTS[service as keyof typeof API_ENDPOINTS];

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
        const config = AI_MODELS[service];
        
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
            // Continue to the next fallback
            console.error(`Fallback model ${fallbackModel} failed:`, fallbackError);
          }
        }
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `HTTP error! status: ${response.status}${
          errorData ? `, message: ${JSON.stringify(errorData)}` : ""
        }`
      );
    }

    const data = await response.json();

    switch (service) {
      case "openai":
      case "groq":
        return data.choices[0].message.content.trim();
      case "google":
        return data.candidates[0].content.parts[0].text.trim();
      default:
        throw new Error("Unsupported AI service");
    }
  } catch (error) {
    console.error(`API request failed for service ${service}:`, error);
    throw error;
  }
};

export const generateAIContent = async (
  apiKey: string,
  service: string,
  text: string,
  field: string,
  context: string,
  operation: "suggest" | "optimize" | "grammar" | "generate",
  specificModel?: string
): Promise<string[]> => {
  let systemPrompt =
    "You are an AI assistant specializing in resume optimization.";
  let userPrompt = "";
  const fieldPrompt =
    FIELD_PROMPTS[field as keyof typeof FIELD_PROMPTS] ||
    "Improve the following text for a resume, focusing on clarity, impact, and relevance to the field.";

  switch (operation) {
    case "suggest":
      systemPrompt +=
        " Your task is to provide three unique suggestions to improve the given resume text, separated by '|||'. so suggestion1 ||| suggestion2 ||| suggestion3. Each suggestion should enhance the content's impact, relevance, and professionalism while maintaining the original intent. Tailor your suggestions to the specific resume field and context provided. Your answer - without introductions, additions or special markings, just the required answer. ";
      userPrompt = `Provide three unique suggestions to improve the following ${field} text for a resume. Consider the resume context and job target when making your suggestions.\n\nResume Context: ${context}\n\nField-specific guidance: ${fieldPrompt}\n\nText to improve: ${text}\n\nProvide three distinct suggestions, separated by '|||'. so suggestion1 ||| suggestion2 ||| suggestion3:`;
      break;
    case "optimize":
      systemPrompt +=
        " Your task is to provide three improved versions of the given resume text, separated by '|||'. so optimize1 ||| optimize2 ||| optimize3. Each version should enhance clarity, impact, and relevance to the field while maintaining the core message. Tailor your optimizations to the specific resume field and context provided. Your answer - without introductions, additions or special markings, just the required answer.";
      userPrompt = `Provide three optimized versions of the following ${field} text for a resume. Consider the resume context and job target when optimizing.\n\nResume Context: ${context}\n\nField-specific guidance: ${fieldPrompt}\n\nText to optimize: ${text}\n\nProvide three distinct optimized versions, separated by '|||'. so optimize1 ||| optimize2 ||| optimize3:`;
      break;
    case "grammar":
      systemPrompt +=
        " Your task is to provide a single corrected version of the given resume text, focusing on grammar, spelling, and punctuation. Maintain the original meaning and tone while ensuring the text is polished and professional. Your answer - without introductions, additions or special markings, just the required answer.";
      userPrompt = `Improve the grammar, spelling, and punctuation of the following ${field} text for a resume. Maintain the original meaning and tone.\n\nResume Context: ${context}\n\nField-specific guidance: ${fieldPrompt}\n\nText to improve: ${text}\n\nProvide the corrected version:`;
      break;
    case "generate":
      systemPrompt = `You are a senior UI/UX designer and React developer specializing in creating exceptional, customized resume templates.

CRITICAL RESPONSE FORMAT:
- Return ONLY the React.createElement code
- NO imports, NO exports, NO comments
- NO markdown code blocks
- NO explanations or additional text
- Start directly with React.createElement
- End with the closing parenthesis
- NO trailing characters or newlines

CRITICAL DATA HANDLING:
1. Empty Section Handling:
   ❌ WRONG:
   - Rendering empty section containers
   - Showing headers for empty sections
   - Using placeholder text
   - Rendering empty lists or dividers

   ✅ CORRECT:
   - Check array length before rendering ANY section
   - Only render sections with actual data
   - Skip entire section blocks when empty
   - Remove all related spacing/dividers for empty sections

2. Required Checks:
   workExperience.length > 0 && workExperience.map(...)
   education.length > 0 && education.map(...)
   skills.length > 0 && skills.map(...)
   projects.length > 0 && projects.map(...)

3. Section Visibility:
   - Personal Info: Only show fields that exist (check each field)
   - Work Experience: Only if workExperience.length > 0
   - Education: Only if education.length > 0
   - Skills: Only if skills.length > 0
   - Projects: Only if projects.length > 0

4. Empty State Examples:
   ✅ CORRECT:
   if (workExperience.length > 0) {
     React.createElement('div', null, [
       React.createElement('h2', null, 'Experience'),
       // ... section content
     ])
   }

   ❌ WRONG:
   React.createElement('div', null, [
     React.createElement('h2', null, 'Experience'),
     workExperience.map(...) // No length check
   ])

EXACT DATA STRUCTURE AND ACCESS:
The code receives these props directly (NOT as props.X):
1. personalInfo: {
   name: string        // Access as: personalInfo.name
   title: string       // Access as: personalInfo.title
   email: string       // Access as: personalInfo.email
   phone: string       // Access as: personalInfo.phone
   location: string    // Access as: personalInfo.location
   summary: string     // Access as: personalInfo.summary
}

2. workExperience: Array<{
   id: string
   company: string
   position: string
   startDate: string
   endDate: string
   description: string
}>
// Access as: workExperience.map(job => job.company)

3. education: Array<{
   id: string
   institution: string    // Note: NOT school
   degree: string
   fieldOfStudy: string
   startDate: string
   endDate: string
   description: string
}>
// Access as: education.map(edu => edu.institution)

4. skills: string[]
// Access as: skills.map(skill => skill)

5. projects: Array<{
   id: string
   name: string
   description: string
   technologies: string   // Note: This is a string, not array
   link: string
   github: string
}>
// Access as: projects.map(proj => proj.name)

6. templateColors: {
   primary: string
   secondary: string
   accent: string
}
// Access as: templateColors.primary

CRITICAL ACCESS PATTERNS:
❌ WRONG:
- props.personalInfo.name
- resumeData.skills
- props.colors.primary
- project.technologies[]

✅ CORRECT:
- personalInfo.name
- skills.map(skill => skill)
- templateColors.primary
- project.technologies

TECHNICAL REQUIREMENTS:
1. Use React.createElement ONLY
2. Include key={item.id} for all mapped elements
3. Handle empty arrays with proper checks (array.length > 0)
4. Use templateColors for all color values
5. Use exact property names as shown above
6. Direct access to all variables (no props. prefix)
7. Proper array mapping with correct property access
8. NEVER render empty sections or containers
9. Check existence of ALL data before rendering`;

      userPrompt = `CREATE A CUSTOM RESUME TEMPLATE

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
3. Include proper array mapping with keys
4. Handle empty data cases
5. Maintain professional layout and spacing
6. Follow A4 page dimensions
7. Use only inline styles
8. Start with React.createElement and end with )

Generate the template code now:`;
      break;
  }

  try {
    const suggestions = await makeApiRequest(
      apiKey,
      service,
      systemPrompt,
      userPrompt,
      specificModel
    );
    console.log(suggestions);

    return operation === "grammar" || operation === "generate"
      ? [suggestions]
      : suggestions.split("|||").map((suggestion: string) => suggestion.trim());
  } catch (error) {
    console.error(`Error in ${operation} operation:`, error);
    throw error;
  }
};

export const validateApiKey = async (
  apiKey: string,
  service: string,
  specificModel?: string
): Promise<boolean> => {
  try {
    if (service === "anthropic") {
      const anthropic = new Anthropic({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      // Try to get an available model
      try {
        const modelToUse = specificModel || await getAvailableModel(service, apiKey);
        
        // Try a simple test message
        const testResult = await anthropic.messages.create({
          model: modelToUse,
          max_tokens: 1024,
          messages: [{ role: "user", content: "Test" }],
        });
        
        return !!testResult;
      } catch (error: unknown) {
        // If the specific model fails, don't try fallbacks if a model was explicitly specified
        if (specificModel) {
          console.error(`Specified model ${specificModel} failed:`, error);
          return false;
        }
        
        // If the preferred model fails, try fallbacks
        const typedError = error as { status?: number; message?: string };
        if (typedError.status === 404 || typedError.message?.includes("model")) {
          for (const fallbackModel of AI_MODELS.anthropic.fallbacks) {
            try {
              await anthropic.messages.create({
                model: fallbackModel,
                max_tokens: 1024,
                messages: [{ role: "user", content: "Test" }],
              });
              
              // If successful, cache this model for future use
              cacheModelAvailability(service, apiKey, fallbackModel);
              return true;
            } catch (fallbackError) {
              // Continue to the next fallback
              console.error(`Fallback model ${fallbackModel} validation failed:`, fallbackError);
            }
          }
        }
        // If all fallbacks fail, return false
        return false;
      }
    }

    // For other services, use the makeApiRequest with integrated fallbacks
    const result = await makeApiRequest(apiKey, service, "Test", "Test", specificModel);
    return !!result;
  } catch (error) {
    console.error("Error validating API key:", error);
    return false;
  }
};

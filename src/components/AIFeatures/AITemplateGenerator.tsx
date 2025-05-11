import { generateAIContent } from "../../utils/aiApi";
import { TemplatePreferences } from "../../types/templates";

const createTemplatePrompt = (preferences: TemplatePreferences): string => {
  const prompt = `CRITICAL RESPONSE FORMAT:
1. Return ONLY pure React.createElement code
2. NO imports, NO exports, NO comments
3. NO markdown code blocks or backticks
4. Start directly with React.createElement
5. End with closing parenthesis
6. NO trailing characters or newlines
7. NO explanations or additional text

Create a professional, modern resume template that perfectly matches this user's vision:

PRIMARY USER REQUEST:
"${preferences.freeformDescription || "Create a clean, professional resume design"}"
This is the most important requirement - the template must closely follow this vision while maintaining professional standards.

INTERPRETATION OF USER'S VISION:
Let's implement this vision using:
- Layout: ${preferences.layout} - organized to emphasize the user's preferred content flow
- Visual Style: ${preferences.visualElements.useIcons ? "Modern with professional icons" : "Clean and minimal"} design approach
- Emphasis: Highlighting key information through ${preferences.headerStyle.size} headers and ${preferences.spacing} spacing
${preferences.visualElements.useDividers ? "- Visual Structure: Using subtle dividers to organize content as requested" : ""}

DETAILED STYLE IMPLEMENTATION:
1. Header Design (Following user preference):
   - Position: ${preferences.headerStyle.position}
   - Alignment: ${preferences.headerStyle.alignment}
   - Size: ${preferences.headerStyle.size}
   ${preferences.headerStyle.customStyles ? `- Custom Styling: ${JSON.stringify(preferences.headerStyle.customStyles, null, 2)}` : ""}

2. Color Palette (As specified):
   - Primary (${preferences.colorScheme.primary}): For main headers and emphasis
   - Secondary (${preferences.colorScheme.secondary}): For subheaders and job titles
   - Accent (${preferences.colorScheme.accent}): For interactive elements and highlights
   - Background (${preferences.colorScheme.background}): Base color

3. Content Organization:
   - Following user's preferred order: ${preferences.sectionOrder.join(" → ")}
   - Using ${preferences.spacing} spacing for optimal readability
   - Maintaining clear visual hierarchy

4. Custom Elements (Per user request):
   ${preferences.visualElements.customElements ? `
   - Dividers: ${preferences.visualElements.customElements.dividerStyle}
   - Icons: ${preferences.visualElements.customElements.iconSet}
   - Borders: ${preferences.visualElements.customElements.customBorders}
   ` : ""}

${preferences.customCSS ? `\nUSER'S CUSTOM STYLING:\n${preferences.customCSS}\nThis custom CSS must be incorporated while maintaining template consistency.` : ""}

ENHANCED DESIGN FEATURES (aligned with user's vision):
1. Layout Implementation:
   - NON Responsive design using Flexbox/Grid (only A4 page needed)
   - Content hierarchy matching user's preferences
   - Smooth transitions between sections

2. Professional Details:
   - Interactive elements with subtle hover effects
   - Typography scaling for readability
   - Strategic use of whitespace
   - Refined visual elements

3. Visual Enhancements:
   - Subtle patterns/gradients where appropriate
   - Professional iconography
   - Elegant section transitions
   - Emphasis on key content areas

CRITICAL TECHNICAL REQUIREMENTS:
1. React.createElement syntax only
2. Strict type safety for all data
3. Proper color system usage via templateColors
4. Array handling with length checks
5. Key props for mapped elements
6. Direct variable access (no resumeData prefix)
7. Proper styling for all interactive elements

The final template must prioritize the user's specific requests while maintaining professional standards and technical requirements. Focus on creating a unique design that matches the user's vision exactly.

FINAL RESPONSE CHECKLIST:
- Starts with React.createElement
- Contains only React.createElement code
- No imports or exports
- No comments or explanations
- No markdown formatting
- Ends with closing parenthesis
- No trailing characters`;

  return prompt;
};

type AITemplateResponse =
  | { success: true; templateCode: string }
  | { success: false; error: string; templateCode: string };

export const AITemplateGenerator = async (
  preferences: TemplatePreferences,
  apiKey: string,
  service: string,
  specificModel?: string
): Promise<AITemplateResponse> => {
  try {
    if (!apiKey || !service) {
      throw new Error("API key and service is required");
    }

    const prompt = createTemplatePrompt(preferences);
    const response = await generateAIContent(
      apiKey,
      service,
      "template",
      JSON.stringify(preferences),
      prompt,
      "generate",
      specificModel
    );
    
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

    // Try to validate syntax
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
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      templateCode: "" // Return empty string if no code was generated
    };
  }
};

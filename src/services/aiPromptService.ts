import { TemplatePreferences } from "@/types/templates";
import { formatPrompt, validatePrompt } from "@/promptTemplates/aiPromptUtils";
import { templatePromptTemplate } from "@/promptTemplates/templateGenerator";

/**
 * Service for creating AI prompts
 */
export class AiPromptService {
  /**
   * Create a prompt for template generation
   * @param preferences Template preferences
   * @returns Formatted prompt for AI template generation
   */
  static createTemplatePrompt(preferences: TemplatePreferences): string {
    const freeformDescription = 
      preferences.freeformDescription || "Create a clean, professional resume design";
    
    // Create replacements object with all the preferences
    const replacements: Record<string, string> = {
      freeformDescription,
      layout: preferences.layout,
      headerPosition: preferences.headerStyle.position,
      headerAlignment: preferences.headerStyle.alignment,
      headerSize: preferences.headerStyle.size,
      sectionOrder: preferences.sectionOrder.join(" → "),
      primaryColor: preferences.colorScheme.primary,
      secondaryColor: preferences.colorScheme.secondary,
      accentColor: preferences.colorScheme.accent,
      backgroundColor: preferences.colorScheme.background,
      useIcons: preferences.visualElements.useIcons ? "yes" : "no",
      useDividers: preferences.visualElements.useDividers ? "yes" : "no",
      borderStyle: preferences.visualElements.borderStyle,
      spacing: preferences.spacing,
      customCSS: preferences.customCSS || "",
    };

    // Add custom elements if they exist
    if (preferences.visualElements.customElements) {
      replacements.dividerStyle = preferences.visualElements.customElements.dividerStyle || "";
      replacements.iconSet = preferences.visualElements.customElements.iconSet || "";
      replacements.customBorders = preferences.visualElements.customElements.customBorders || "";
    }

    // Format the prompt with replacements
    return formatPrompt(templatePromptTemplate, replacements);
  }

  /**
   * Validate a template generation prompt
   * @param prompt The prompt to validate
   * @returns Validation result
   */
  static validateTemplatePrompt(prompt: string): { isValid: boolean; error?: string } {
    const requiredPhrases = [
      "React.createElement",
      "CRITICAL RESPONSE FORMAT",
      "Create a professional, modern resume template"
    ];
    
    return validatePrompt(prompt, 100, requiredPhrases);
  }
}

export default AiPromptService; 
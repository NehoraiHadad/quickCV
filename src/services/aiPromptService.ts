// GridConfiguration import commented out as it should be referenced via TemplatePreferences
import { TemplatePreferences, /* GridConfiguration */ } from "@/types/templates"; 
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
    
    const columns = preferences.gridConfiguration?.columns || 1;
    let gridInstructions = "The layout should be single-column, with sections flowing vertically.";
    if (columns > 1) {
      gridInstructions = `The main content area should use a ${columns}-column grid layout for wider screens. Use the ResponsiveGrid component available in scope: React.createElement(ResponsiveGrid, { cols: { default: 1, sm: ${columns} } }, [/* sections as children here */]). Ensure resume sections like Work Experience, Education, Projects, Skills are appropriately placed within this grid. For smaller screens, it should revert to a single column.`;
    }

    const replacements: Record<string, string> = {
      freeformDescription,
      layout: preferences.layout || (columns > 1 ? `${columns}-column grid` : "single-column"),
      gridInstructions, 
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

    if (preferences.visualElements.customElements) {
      replacements.dividerStyle = preferences.visualElements.customElements.dividerStyle || "";
      replacements.iconSet = preferences.visualElements.customElements.iconSet || "";
      replacements.customBorders = preferences.visualElements.customElements.customBorders || "";
    }

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

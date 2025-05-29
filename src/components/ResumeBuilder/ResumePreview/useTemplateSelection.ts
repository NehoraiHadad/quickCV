import { useMemo, useEffect } from "react";
import templates from "@/data/templates"; // Should be ResumeTemplate[]
import useCustomTemplates from "@/hooks/useCustomTemplates"; // Should return customTemplates as ResumeTemplate[]
import { ResumeTemplate } from "./types"; // Import ResumeTemplate for explicit typing

interface UseTemplateSelectionReturn {
  currentTemplate: ResumeTemplate; // Explicitly type the returned currentTemplate
}

/**
 * Hook to handle template selection logic
 */
export const useTemplateSelection = (selectedTemplate: string): UseTemplateSelectionReturn => {
  const { customTemplates, loadTemplatesFromStorage } = useCustomTemplates();

  // Load custom templates when needed
  useEffect(() => {
    if (selectedTemplate.startsWith("custom-")) {
      loadTemplatesFromStorage();
    }
  }, [selectedTemplate, loadTemplatesFromStorage]);

  // Select the current template from all available templates
  const currentTemplate: ResumeTemplate = useMemo(() => {
    // Both `templates` and `customTemplates` should be ResumeTemplate[] now.
    const allTemplates: ResumeTemplate[] = [...templates, ...customTemplates];

    console.log("Template Selection Process:", {
      selectedTemplateId: selectedTemplate,
      customTemplatesCount: customTemplates.length,
      customTemplateIds: customTemplates.map((t) => t.id),
      allTemplatesCount: allTemplates.length,
      allTemplateIds: allTemplates.map((t) => t.id),
    });

    const template: ResumeTemplate | undefined = allTemplates.find((t) => t.id === selectedTemplate);

    if (!template) {
      // Fallback to the first static template if the selected one isn't found.
      // This assumes `templates` array is never empty and contains valid ResumeTemplate objects.
      return templates[0]; 
    }

    return template;
  }, [selectedTemplate, customTemplates]);

  return { currentTemplate };
}
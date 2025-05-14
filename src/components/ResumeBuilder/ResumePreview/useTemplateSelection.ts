import { useMemo, useEffect } from "react";
import templates from "@/data/templates";
import useCustomTemplates from "@/hooks/useCustomTemplates";

/**
 * Hook to handle template selection logic
 */
export const useTemplateSelection = (selectedTemplate: string) => {
  const { customTemplates, loadTemplatesFromStorage } = useCustomTemplates();

  // Load custom templates when needed
  useEffect(() => {
    if (selectedTemplate.startsWith("custom-")) {
      loadTemplatesFromStorage();
    }
  }, [selectedTemplate, loadTemplatesFromStorage]);

  // Select the current template from all available templates
  const currentTemplate = useMemo(() => {
    const allTemplates = [...templates, ...customTemplates];

    console.log("Template Selection Process:", {
      selectedTemplateId: selectedTemplate,
      customTemplatesCount: customTemplates.length,
      customTemplateIds: customTemplates.map((t) => t.id),
      allTemplatesCount: allTemplates.length,
      allTemplateIds: allTemplates.map((t) => t.id),
    });

    const template = allTemplates.find((t) => t.id === selectedTemplate);

    if (!template) {
      return templates[0];
    }

    return template;
  }, [selectedTemplate, customTemplates]);

  return { currentTemplate };
} 
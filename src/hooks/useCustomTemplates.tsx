import { useState, useEffect, useCallback, useRef } from "react";
import { Template } from "../components/TemplateSelection/TemplateGallery";
import { CustomTemplate, GridConfiguration } from "../types/templates";
import { ResumeData } from "../types/resume";
import { sampleResumeData } from "../data/templates";
import ResponsiveGrid from "@/components/ui/ResponsiveGrid";
import React from "react";

interface UseCustomTemplatesReturn {
  customTemplates: Template[];
  saveTemplate: (template: CustomTemplate) => Promise<void>;
  deleteTemplate: (templateId: string) => Promise<void>;
  getTemplateForEditing: (templateId: string) => CustomTemplate | null;
  resetTemplateCode: () => CustomTemplate;
  addTemplate: (template: CustomTemplate) => Promise<Template>;
  getCustomTemplates: () => Template[];
  loadTemplatesFromStorage: () => Promise<void>;
}

const useCustomTemplates = (): UseCustomTemplatesReturn => {
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
  const templatesRef = useRef<Template[]>([]);

  // Create template function factory
  const createTemplateFunction = useCallback((code: string, gridConfiguration?: GridConfiguration) => {
    const templateFunction = new Function(
      "React",
      "resumeData",
      "templateColors",
      "ResponsiveGrid",
      // "gridConfig", // Pass grid configuration if needed directly
      `
      const { personalInfo, workExperience, education, skills, projects, additionalSections } = resumeData;
      // const currentGridConfig = gridConfig || ${JSON.stringify(gridConfiguration)}; 
      // The above line is an example if you need to pass runtime gridConfig, 
      // but for now ResponsiveGrid will be available and can be used with any config from template code.
      try {
        with (React) {
          ${code.trim().startsWith('return') ? code : `return (${code})`}
        }
      } catch (error) {
        console.error("Template execution error:", error);
        throw error;
      }
      `
    );

    return (resumeData: ResumeData, currentColors?: Record<string, string>) => {
      try {
        // When calling templateFunction, provide ResponsiveGrid.
        // The template code can then use ResponsiveGrid directly.
        return templateFunction(React, resumeData, currentColors || resumeData.colors || {}, ResponsiveGrid);
      } catch (err: unknown) {
        console.error("Error rendering template:", err);
        return React.createElement('div', {
          className: 'p-4 text-red-500 border border-red-300 rounded'
        }, 'Render Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    };
  }, []);

  // Create template object
  const createTemplate = useCallback((customTemplate: CustomTemplate): Template => {
    // Pass gridConfiguration from preferences to createTemplateFunction
    const renderFunction = createTemplateFunction(customTemplate.code, customTemplate.preferences.gridConfiguration);
    
    const template: Template = {
      id: customTemplate.id,
      name: customTemplate.name,
      render: (resumeData: ResumeData, colors?: Record<string, string>) => renderFunction(resumeData, colors),
      preview: renderFunction(sampleResumeData, sampleResumeData.colors), // Pass colors for preview
      isCustom: true
    };

    return template;
  }, [createTemplateFunction]);

  // Load templates from storage
  const loadTemplatesFromStorage = useCallback(async () => {
    try {
      const savedTemplates = localStorage.getItem('customTemplates');
      if (savedTemplates) {
        const parsedTemplates = JSON.parse(savedTemplates);
        
        const templates = parsedTemplates.map((template: CustomTemplate) => {
          const createdTemplate = createTemplate(template);
          return createdTemplate;
        });
        
        setCustomTemplates(templates);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  }, [createTemplate]);

  // Save template
  const saveTemplate = useCallback(async (template: CustomTemplate): Promise<void> => {
    try {
      const newTemplate = createTemplate(template);

      // Save to storage
      const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
      const templateIndex = savedTemplates.findIndex((t: CustomTemplate) => t.id === template.id);
      
      if (templateIndex !== -1) {
        savedTemplates[templateIndex] = template;
      } else {
        savedTemplates.push(template);
      }
      
      localStorage.setItem('customTemplates', JSON.stringify(savedTemplates));

      // Update state immediately
      setCustomTemplates(prev => {
        const newTemplates = templateIndex !== -1
          ? prev.map(t => t.id === template.id ? newTemplate : t)
          : [...prev, newTemplate];
        
        return newTemplates;
      });

      // Reload templates to ensure consistency
      await loadTemplatesFromStorage();

    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  }, [createTemplate, loadTemplatesFromStorage]);

  // Initialize templates on mount
  useEffect(() => {
    loadTemplatesFromStorage();
  }, [loadTemplatesFromStorage]);

  // Get custom templates
  const getCustomTemplates = useCallback((): Template[] => {
    return customTemplates;
  }, [customTemplates]);

  // Add template
  const addTemplate = useCallback(async (template: CustomTemplate): Promise<Template> => {
    try {
      const newTemplate = createTemplate(template);
      
      // Save to storage
      const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
      savedTemplates.push(template);
      localStorage.setItem('customTemplates', JSON.stringify(savedTemplates));
      
      // Update state and ref atomically
      setCustomTemplates(prev => {
        const updated = [...prev, newTemplate];
        templatesRef.current = updated;
        return updated;
      });
      
      return newTemplate;
    } catch (error) {
      console.error('Error in addTemplate:', error);
      throw error;
    }
  }, [createTemplate]);

  // Delete template
  const deleteTemplate = useCallback(async (templateId: string): Promise<void> => {
    try {
      // Update storage
      const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
      const filteredTemplates = savedTemplates.filter((t: CustomTemplate) => t.id !== templateId);
      localStorage.setItem('customTemplates', JSON.stringify(filteredTemplates));
      
      // Update state
      setCustomTemplates(prev => prev.filter(template => template.id !== templateId));
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }, []);

  const getTemplateForEditing = useCallback((templateId: string): CustomTemplate | null => {
    try {
      const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
      return savedTemplates.find((t: CustomTemplate) => t.id === templateId) || null;
    } catch (error) {
      console.error('Error getting template:', error);
      return null;
    }
  }, []);

  const resetTemplateCode = useCallback((): CustomTemplate => {
    return {
      id: '',
      name: '',
      code: '',
      preferences: {
        layout: "single-column",
        name: "",
        headerStyle: {
          position: "top",
          alignment: "left",
          size: "medium"
        },
        sectionOrder: [],
        colorScheme: {
          primary: "#000000",
          secondary: "#666666",
          accent: "#0066cc",
          background: "#ffffff"
        },
        visualElements: {
          useDividers: true,
          useIcons: false,
          borderStyle: "solid",
          useShapes: false
        },
        spacing: "balanced",
        gridConfiguration: { columns: 1 } // Default grid configuration
      },
      createdAt: new Date(),
    };
  }, []);

  return {
    customTemplates,
    saveTemplate,
    deleteTemplate,
    getTemplateForEditing,
    resetTemplateCode,
    addTemplate,
    getCustomTemplates,
    loadTemplatesFromStorage,
  };
};

export default useCustomTemplates;

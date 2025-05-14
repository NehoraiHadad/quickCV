"use client";
import React, { createContext, useState, useContext } from "react";

interface TemplateContextType {
  selectedTemplate: string;
  setSelectedTemplate: (templateId: string) => void;
  colors: {
    [key: string]: string | Record<string, string>;
  };
  updateColors: (updatedColors: Partial<{
    [key: string]: string | Record<string, string>;
  }>) => void;
}

// Initial colors for the templates
const defaultColors = {
  primary: "#3B82F6",   // Blue
  secondary: "#1F2937", // Dark Gray
  accent: "#10B981",    // Green
  background: "#FFFFFF", // White
};

// Create the context
const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

/**
 * Provider component for managing template and styling state
 */
export const TemplateProvider: React.FC<{ 
  children: React.ReactNode;
  initialTemplate?: string;
  initialColors?: {
    [key: string]: string | Record<string, string>;
  };
}> = ({
  children,
  initialTemplate = "",
  initialColors
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialTemplate);
  const [colors, setColors] = useState<{
    [key: string]: string | Record<string, string>;
  }>(initialColors || defaultColors);

  const updateColors = (updatedColors: Partial<{
    [key: string]: string | Record<string, string>;
  }>) => {
    setColors((prevColors) => {
      const newColors = { ...prevColors };
      Object.entries(updatedColors).forEach(([key, value]) => {
        if (value !== undefined) {
          newColors[key] = value;
        }
      });
      return newColors;
    });
  };

  return (
    <TemplateContext.Provider
      value={{
        selectedTemplate,
        setSelectedTemplate,
        colors,
        updateColors,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

/**
 * Hook for using the template context
 */
export const useTemplate = (): TemplateContextType => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
}; 
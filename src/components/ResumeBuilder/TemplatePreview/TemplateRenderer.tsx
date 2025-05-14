import React, { useMemo } from "react";
import { validateTemplateCode } from "../../../utils/template/validator";
import { TemplateRenderResult } from "./types";
import { ResumeDataWithColors } from "../../../types/TemplatePreview";
import {
  getPreambleCode,
  prepareWorkExperience,
  prepareEducation,
  prepareSkills,
  prepareProjects,
  prepareTemplateColors
} from "./utils";

interface TemplateRendererProps {
  code: string;
  resumeData: ResumeDataWithColors;
}

/**
 * Component that handles the actual template rendering logic
 */
const TemplateRenderer: React.FC<TemplateRendererProps> = ({ code, resumeData }) => {
  // Validate and render the template code
  const { renderedTemplate, error } = useMemo(() => {
    try {
      // Don't try to render empty code
      if (!code || !code.trim()) {
        return { error: "No template code provided", renderedTemplate: null };
      }

      // Validate the code first
      const validation = validateTemplateCode(code);
      if (!validation.isValid) {
        return { error: validation.error || "Invalid template code", renderedTemplate: null };
      }

      // Check for common issues with array keys
      if (code.includes(".map(") && !code.includes("key:") && !code.includes("key=")) {
        console.warn("Warning: Template may be missing keys in array mappings");
      }

      // Make sure we have required resume data
      if (!resumeData || !resumeData.personalInfo) {
        return { error: "Resume data not available", renderedTemplate: null };
      }

      // Ensure the code has a return statement
      let processedCode = code.trim();
      if (!processedCode.startsWith("return")) {
        processedCode = `return ${processedCode}`;
      }

      console.log("Trying to render with code:", processedCode);

      // Create a function that will render the template
      try {
        // Create the render function with a preamble that defines common variables
        const renderFunction = new Function(
          "React",
          "personalInfo",
          "workExperience",
          "education",
          "skills",
          "projects",
          "templateColors",
          getPreambleCode() + processedCode
        );

        // Execute the function with the resume data
        const result = renderFunction(
          React,
          {
            name: resumeData.personalInfo?.name || "Your Name",
            title: resumeData.personalInfo?.title || "Your Title",
            email: resumeData.personalInfo?.email || "email@example.com",
            phone: resumeData.personalInfo?.phone || "123-456-7890",
            location: resumeData.personalInfo?.location || "Your Location",
            summary: resumeData.personalInfo?.summary || "Professional summary"
          },
          prepareWorkExperience(resumeData.workExperience),
          prepareEducation(resumeData.education),
          prepareSkills(resumeData.skills),
          prepareProjects(resumeData.projects),
          prepareTemplateColors(resumeData.colors)
        );

        if (!result) {
          return { error: "Template function returned null or undefined", renderedTemplate: null };
        }

        return { renderedTemplate: result, error: null };
      } catch (err) {
        console.error("Template rendering error:", err);
        return {
          error: err instanceof Error ? err.message : "Error rendering template",
          renderedTemplate: null,
        };
      }
    } catch (err) {
      console.error("Template setup error:", err);
      return {
        error: err instanceof Error ? err.message : "Error setting up template",
        renderedTemplate: null,
      };
    }
  }, [code, resumeData]) as TemplateRenderResult;

  // If there's an error, render the error message
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p className="font-semibold mb-2">Error in template code:</p>
        <pre className="text-sm overflow-auto max-h-[400px] p-2 bg-red-100 rounded">
          {error}
        </pre>
      </div>
    );
  }

  // Return the rendered template or a placeholder
  return (
    <>
      {renderedTemplate || (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Template preview will appear here</p>
        </div>
      )}
    </>
  );
};

export default TemplateRenderer; 
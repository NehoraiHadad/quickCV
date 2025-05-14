import React from "react";
import TemplateCodeEditor from "../TemplateCodeEditor";
import TemplatePreview from "../TemplatePreview";
import { EditorSectionProps } from "./types";
import { ResumeData } from "@/types/resume";
import { ResumeDataWithColors } from "@/types/TemplatePreview";

const EditorSection: React.FC<EditorSectionProps & { resumeData?: ResumeData }> = ({ 
  code, 
  setCode, 
  viewMode,
  resumeData
}) => {
  // Add default colors if resumeData is provided but doesn't have colors
  const resumeDataWithColors: ResumeDataWithColors | undefined = resumeData ? {
    ...resumeData,
    colors: {
      primary: resumeData.colors?.primary || "#3B82F6",
      secondary: resumeData.colors?.secondary || "#1F2937",
      accent: resumeData.colors?.accent || "#10B981",
      background: "#FFFFFF" // Required field for ResumeDataWithColors
    }
  } : undefined;

  if (!code) {
    return (
      <div className="text-center p-6 text-gray-500">
        Generate a template or write template code to see a preview
      </div>
    );
  }

  if (viewMode === "split") {
    return (
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="overflow-auto">
          <TemplateCodeEditor code={code} onChange={setCode} viewMode="edit" />
        </div>
        <div className="overflow-auto">
          {resumeDataWithColors && <TemplatePreview code={code} resumeData={resumeDataWithColors} />}
        </div>
      </div>
    );
  }

  if (viewMode === "edit") {
    return (
      <div className="overflow-auto">
        <TemplateCodeEditor code={code} onChange={setCode} viewMode="edit" />
      </div>
    );
  }

  // Preview mode
  return (
    <div className="overflow-auto">
      {resumeDataWithColors && <TemplatePreview code={code} resumeData={resumeDataWithColors} />}
    </div>
  );
};

export default EditorSection; 
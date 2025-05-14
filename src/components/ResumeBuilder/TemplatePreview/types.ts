import { ResumeDataWithColors } from "../../../types/TemplatePreview";
import React from "react";

export interface TemplatePreviewProps {
  code: string;
  resumeData: ResumeDataWithColors;
}

export interface TemplateErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export interface TemplateErrorBoundaryState {
  hasError: boolean;
}

export interface TemplateRenderResult {
  renderedTemplate: React.ReactNode | null;
  error: string | null;
} 
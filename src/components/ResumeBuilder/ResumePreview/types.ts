import { Layout } from 'react-grid-layout';
import { ResumeData } from "@/types/resume";
import { Template } from "@/types/templates";

export interface ZoomControlsProps {
  zoomLevel: number;
  displayZoomValue: number;
  onZoomChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrint: () => void;
  showZoomControls: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

import { SectionProps as DefaultSectionProps, TemplateSections } from "@/components/Templates/DefaultTemplate/types"; // Assuming SectionProps is needed by sections

// Define a more specific type for the currentTemplate prop
export interface ResumeTemplate extends Template {
  getSections?: () => TemplateSections; // Made optional for now to avoid breaking other templates
  getTemplateColors?: (colors: Record<string, string>) => Record<string, string>; // Also optional
}

export interface TemplateDisplayProps {
  resumeContentRef: React.RefObject<HTMLDivElement>;
  scale: number;
  zoomLevel: number;
  currentTemplate: ResumeTemplate; // Use the more specific type
  resumeData: ResumeData;
  layouts?: { [key: string]: Layout[] };
  fullPage?: boolean;
}

// Re-export SectionProps if it's generic enough, or define a local one.
// For now, assuming DefaultSectionProps is what sections expect.
export type SectionProps = DefaultSectionProps;
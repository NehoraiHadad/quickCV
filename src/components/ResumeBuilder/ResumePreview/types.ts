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

import { ColorPalette, DefaultTemplateProps, SectionProps as DefaultSectionProps, TemplateSections } from "@/components/Templates/DefaultTemplate/types"; // Added ColorPalette, DefaultTemplateProps

// Define a more specific type for the currentTemplate prop
export interface ResumeTemplate extends Template {
  sections: TemplateSections; 
  templateColors: ColorPalette; // Changed from Record<string, string> to ColorPalette
  defaultLayouts?: { [key: string]: Layout[] }; 
  component?: React.FC<DefaultTemplateProps>; 
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
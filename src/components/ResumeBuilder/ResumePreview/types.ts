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

export interface TemplateDisplayProps {
  containerRef: React.RefObject<HTMLDivElement>;
  resumeContentRef: React.RefObject<HTMLDivElement>;
  scale: number;
  zoomLevel: number;
  currentTemplate: Template;
  resumeData: ResumeData;
  layouts?: { [key: string]: Layout[] };
  fullPage?: boolean;
} 
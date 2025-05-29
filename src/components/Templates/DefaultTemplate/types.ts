import { ResumeData } from "@/types/resume";

export interface DefaultTemplateProps {
  resumeData: ResumeData;
}

export interface SectionProps {
  resumeData: ResumeData;
  templateColors: ColorPalette; // Changed to use ColorPalette type
}

// Define the ColorPalette type
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
}

export type TemplateSections = {
  header: React.FC<SectionProps>;
  experience: React.FC<SectionProps>;
  projects: React.FC<SectionProps>;
  skills: React.FC<SectionProps>;
  education: React.FC<SectionProps>;
  additional: React.FC<SectionProps>;
};
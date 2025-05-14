import { ResumeData } from "@/types/resume";

export interface CleanCardTemplateProps {
  resumeData: ResumeData;
}

export interface SectionProps {
  resumeData: ResumeData;
  templateColors: {
    primary: string;
    secondary: string;
    accent: string;
    [key: string]: string;
  };
} 
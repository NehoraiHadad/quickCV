import { ResumeData } from "@/types/resume";

export interface DefaultTemplateProps {
  resumeData: ResumeData;
}

export interface SectionProps {
  resumeData: ResumeData;
  templateColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
} 
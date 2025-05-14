import { ResumeData } from "./resume";

export interface ResumeDataWithColors extends Omit<ResumeData, 'colors'> {
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    custom?: Record<string, string>;
  };
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url?: string;
  link?: string;
  github?: string;
  technologies?: string;
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  custom?: Record<string, string>;
  [key: string]: string | Record<string, string> | undefined;
} 
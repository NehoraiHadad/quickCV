import { Layout } from 'react-grid-layout';
import {
  ResumeData,
  PersonalInfo,
  WorkExperience,
  Education,
  Project,
  AdditionalSection,
  Skill
} from "@/types/resume"; // This now imports ResumeData with the corrected layouts type

export interface ResumeContextValue {
  resumeData: ResumeData; // This will use the updated ResumeData type
  updatePersonalInfo: (updatedInfo: Partial<PersonalInfo>) => void;
  addWorkExperience: (newExperience: Omit<WorkExperience, "id">) => void;
  updateWorkExperience: (
    id: string,
    updatedExperience: Partial<WorkExperience>
  ) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: (newEducation: Omit<Education, "id">) => void;
  updateEducation: (id: string, updatedEducation: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (newSkill: string) => void;
  removeSkill: (skill: string | Skill) => void;
  addProject: (newProject: Omit<Project, "id">) => void;
  updateProject: (id: string, updatedProject: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addAdditionalSection: (newSection: Omit<AdditionalSection, "id">) => void;
  updateAdditionalSection: (
    id: string,
    updatedSection: Partial<AdditionalSection>
  ) => void;
  removeAdditionalSection: (id: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (templateId: string) => void;
  saveResumeData: () => string;
  loadResumeData: (jsonData: string) => void;
  colors: { [key: string]: string };
  updateColors: (updatedColors: Partial<{ [key: string]: string }>) => void;
  // Modified the signature of updateTemplateLayout
  updateTemplateLayout: (templateId: string, allLayouts: { [breakpoint: string]: Layout[] }) => void;
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies?: string;
  link?: string;
  github?: string;
  url?: string;
}

export interface AdditionalSection {
  id: string;
  title: string;
  content: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  additionalSections: AdditionalSection[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  selectedTemplate: string;
  sectionCustomizations?: {
    [sectionKey: string]: SectionCustomization;
  };
}

export interface SectionCustomization {
  height?: string; // e.g., "100px", "10rem", "auto"
  // Future: hidden?: boolean;
}

// Create more specific Resume Data type variations for skills
export type ResumeDataWithStringSkills = Omit<ResumeData, 'skills'> & {
  skills: string[];
};

export type ResumeDataWithSkillObjects = Omit<ResumeData, 'skills'> & {
  skills: Skill[];
};

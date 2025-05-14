import { WorkExperienceItem, EducationItem, SkillItem, ProjectItem, TemplateColors } from "../../../types/TemplatePreview";

/**
 * Add unique IDs to array items if they don't have them
 */
export const addUniqueIds = <T extends { id?: string }>(array: T[]): (T & { id: string })[] => {
  return array.map((item, index) => {
    if (!item.id) {
      return { ...item, id: `temp-id-${index}` };
    }
    return item as (T & { id: string });
  });
};

/**
 * Returns preamble code for template rendering
 */
export const getPreambleCode = () => `
  // Add these helper variables to avoid "not defined" errors 
  // that might occur when we modify the code
  const idx = 0; 
  const index = 0;
  
  // Helper function to safely render values
  const safeRender = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
  };
`;

/**
 * Prepares work experience data for rendering
 */
export const prepareWorkExperience = (workExperience: Partial<WorkExperienceItem>[] = []): WorkExperienceItem[] => {
  return addUniqueIds(workExperience).map(item => ({
    ...item,
    id: String(item.id),
    company: item.company || '',
    position: item.position || '',
    startDate: item.startDate || '',
    endDate: item.endDate || '',
    description: String(item.description || '')
  }));
};

/**
 * Prepares education data for rendering
 */
export const prepareEducation = (education: Partial<EducationItem>[] = []): EducationItem[] => {
  return addUniqueIds(education).map(item => ({
    ...item,
    id: String(item.id),
    institution: item.institution || '',
    degree: item.degree || '',
    fieldOfStudy: item.fieldOfStudy || item.field || '',
    startDate: item.startDate || '',
    endDate: item.endDate || '',
    description: String(item.description || '')
  }));
};

/**
 * Prepares skills data for rendering
 */
export const prepareSkills = (skills: (string | Partial<SkillItem>)[] = []): SkillItem[] => {
  return addUniqueIds(skills.map((skill, i) => {
    if (typeof skill === 'string') return { id: `skill-${i}`, name: skill };
    return { 
      ...skill, 
      id: String(skill.id || `skill-${i}`), 
      name: String(skill.name || '')
    };
  }));
};

/**
 * Prepares project data for rendering
 */
export const prepareProjects = (projects: Partial<ProjectItem>[] = []): ProjectItem[] => {
  return addUniqueIds(projects).map(item => ({
    ...item,
    id: String(item.id),
    name: item.name || '',
    description: String(item.description || '')
  }));
};

/**
 * Prepares template colors with defaults
 */
export const prepareTemplateColors = (colors: Partial<TemplateColors> = {}): TemplateColors => {
  return { 
    primary: "#000000", 
    secondary: "#666666", 
    accent: "#0066cc", 
    background: "#ffffff",
    ...colors 
  };
}; 
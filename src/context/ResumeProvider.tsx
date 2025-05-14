"use client";
import React from "react";
import { PersonalInfoProvider, usePersonalInfo } from "@/context/PersonalInfoContext";
import { WorkExperienceProvider, useWorkExperience } from "@/context/WorkExperienceContext";
import { EducationProvider, useEducation } from "@/context/EducationContext";
import { SkillsProvider, useSkills } from "@/context/SkillsContext";
import { ProjectsProvider, useProjects } from "@/context/ProjectsContext";
import { AdditionalSectionsProvider, useAdditionalSections } from "@/context/AdditionalSectionsContext";
import { TemplateProvider, useTemplate } from "@/context/TemplateContext";
import { ResumeData, Skill } from "@/types/resume";

interface ResumeProviderProps {
  children: React.ReactNode;
  initialData?: ResumeData;
}

export const ResumeProvider: React.FC<ResumeProviderProps> = ({ 
  children, 
  initialData 
}) => {
  // Compose all providers together
  return (
    <PersonalInfoProvider initialData={initialData?.personalInfo}>
      <WorkExperienceProvider initialData={initialData?.workExperience}>
        <EducationProvider initialData={initialData?.education}>
          <SkillsProvider initialData={initialData?.skills}>
            <ProjectsProvider initialData={initialData?.projects}>
              <AdditionalSectionsProvider initialData={initialData?.additionalSections}>
                <TemplateProvider 
                  initialTemplate={initialData?.selectedTemplate}
                  initialColors={initialData?.colors}
                >
                  {children}
                </TemplateProvider>
              </AdditionalSectionsProvider>
            </ProjectsProvider>
          </SkillsProvider>
        </EducationProvider>
      </WorkExperienceProvider>
    </PersonalInfoProvider>
  );
};

export default ResumeProvider;

/**
 * Unified hook that combines all resume-related data and methods
 */
export const useResume = () => {
  const { personalInfo, updatePersonalInfo } = usePersonalInfo();
  const { workExperience, addWorkExperience, updateWorkExperience, removeWorkExperience } = useWorkExperience();
  const { education, addEducation, updateEducation, removeEducation } = useEducation();
  const { skills, addSkill, removeSkill } = useSkills();
  const { projects, addProject, updateProject, removeProject } = useProjects();
  const { additionalSections, addAdditionalSection, updateAdditionalSection, removeAdditionalSection } = useAdditionalSections();
  const { selectedTemplate, setSelectedTemplate, colors, updateColors } = useTemplate();

  // Define default colors for fallback
  const defaultColors = {
    primary: "#3B82F6",
    secondary: "#1F2937",
    accent: "#10B981"
  };

  // Convert string skills to Skill objects
  const skillObjects: Skill[] = skills.map((skillName, index) => ({
    id: `skill-${index}`,
    name: skillName,
  }));

  // Create a combined data object that has the same structure as the previous ResumeData type
  const resumeData: ResumeData = {
    personalInfo,
    workExperience,
    education,
    skills: skillObjects,
    projects,
    additionalSections,
    colors: {
      primary: typeof colors.primary === 'string' ? colors.primary : defaultColors.primary,
      secondary: typeof colors.secondary === 'string' ? colors.secondary : defaultColors.secondary,
      accent: typeof colors.accent === 'string' ? colors.accent : defaultColors.accent,
    },
    selectedTemplate
  };

  // JSON serialization methods for saving/loading
  const saveResumeData = (): string => {
    return JSON.stringify(resumeData);
  };

  const loadResumeData = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData) as ResumeData;
      
      // Update all contexts with the loaded data
      if (parsedData.personalInfo) {
        updatePersonalInfo(parsedData.personalInfo);
      }
      
      if (parsedData.workExperience) {
        // Clear existing and add all loaded items
        parsedData.workExperience.forEach(exp => addWorkExperience(exp));
      }
      
      if (parsedData.education) {
        parsedData.education.forEach(edu => addEducation(edu));
      }
      
      if (parsedData.skills) {
        parsedData.skills.forEach(skill => addSkill(skill.name));
      }
      
      if (parsedData.projects) {
        parsedData.projects.forEach(proj => addProject(proj));
      }
      
      if (parsedData.additionalSections) {
        parsedData.additionalSections.forEach(section => addAdditionalSection(section));
      }
      
      if (parsedData.colors) {
        updateColors(parsedData.colors);
      }

      if (parsedData.selectedTemplate) {
        setSelectedTemplate(parsedData.selectedTemplate);
      }
    } catch (error) {
      console.error("Error parsing JSON data:", error);
    }
  };

  return {
    // Combined data
    resumeData,
    
    // Personal info methods
    updatePersonalInfo,
    
    // Work experience methods
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    
    // Education methods
    addEducation,
    updateEducation,
    removeEducation,
    
    // Skills methods
    addSkill,
    removeSkill,
    
    // Projects methods
    addProject,
    updateProject,
    removeProject,
    
    // Additional sections methods
    addAdditionalSection,
    updateAdditionalSection,
    removeAdditionalSection,
    
    // Template and styling methods
    selectedTemplate,
    setSelectedTemplate,
    colors,
    updateColors,
    
    // Serialization methods
    saveResumeData,
    loadResumeData,
  };
}; 
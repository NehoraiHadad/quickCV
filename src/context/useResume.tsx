"use client";
import { usePersonalInfo } from "./PersonalInfoContext";
import { useWorkExperience } from "./WorkExperienceContext";
import { useEducation } from "./EducationContext";
import { useSkills } from "./SkillsContext";
import { useState, useContext, createContext } from "react";
import { ResumeData, Skill } from "@/types/resume";

interface ResumeContextProps {
  selectedTemplate: string;
  setSelectedTemplate: (templateId: string) => void;
  colors: { [key: string]: string };
  updateColors: (updatedColors: Partial<{ [key: string]: string }>) => void;
  saveResumeData: () => string;
  loadResumeData: (jsonData: string) => void;
}

const ResumeContext = createContext<ResumeContextProps | undefined>(undefined);

export const ResumeContextProvider: React.FC<{
  children: React.ReactNode;
  initialSelectedTemplate?: string;
  initialColors?: { [key: string]: string };
}> = ({ 
  children, 
  initialSelectedTemplate = "",
  initialColors = {
    primary: "#3B82F6",
    secondary: "#1F2937",
    accent: "#10B981",
  } 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(initialSelectedTemplate);
  const [colors, setColors] = useState(initialColors);

  const updateColors = (updatedColors: Partial<{ [key: string]: string }>) => {
    setColors((prevColors) => {
      const filteredUpdates: { [key: string]: string } = {};
      
      // Only include defined values
      Object.entries(updatedColors).forEach(([key, value]) => {
        if (value !== undefined) {
          filteredUpdates[key] = value;
        }
      });
      
      return {
        ...prevColors,
        ...filteredUpdates,
      };
    });
  };

  const saveResumeData = () => {
    // This will be implemented in the useResume hook
    return "{}";
  };

  const loadResumeData = () => {
    // This will be implemented in the useResume hook
  };

  return (
    <ResumeContext.Provider
      value={{
        selectedTemplate,
        setSelectedTemplate,
        colors,
        updateColors,
        saveResumeData,
        loadResumeData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResumeContext must be used within a ResumeContextProvider");
  }
  return context;
};

// This is the main hook that will be used throughout the application
export const useResume = () => {
  const { personalInfo, updatePersonalInfo } = usePersonalInfo();
  const { workExperience, addWorkExperience, updateWorkExperience, removeWorkExperience } = 
    useWorkExperience();
  const { education, addEducation, updateEducation, removeEducation } = useEducation();
  const { skills, addSkill, removeSkill } = useSkills();
  const { 
    selectedTemplate, 
    setSelectedTemplate,
    colors,
    updateColors,
  } = useResumeContext();

  // Convert string skills to Skill objects
  const skillObjects: Skill[] = skills.map((skillName, index) => ({
    id: `skill-${index}`,
    name: skillName,
  }));

  // Combined resume data
  const resumeData: ResumeData = {
    personalInfo,
    workExperience,
    education,
    skills: skillObjects,
    projects: [], // Add projects context later
    additionalSections: [], // Add additional sections context later
    colors: {
      primary: colors.primary || '#3B82F6',
      secondary: colors.secondary || '#1F2937',
      accent: colors.accent || '#10B981'
    },
    selectedTemplate,
  };

  // Save all resume data as JSON
  const saveResumeData = (): string => {
    return JSON.stringify(resumeData);
  };

  // Load resume data from JSON
  const loadResumeData = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData) as ResumeData;
      
      // Update each context with the loaded data
      if (data.personalInfo) {
        updatePersonalInfo(data.personalInfo);
      }
      
      // For array data, we need to clear existing and add new
      if (data.workExperience) {
        data.workExperience.forEach(exp => addWorkExperience(exp));
      }
      
      if (data.education) {
        data.education.forEach(edu => addEducation(edu));
      }
      
      if (data.skills) {
        data.skills.forEach(skill => addSkill(skill.name));
      }
      
      if (data.colors) {
        updateColors(data.colors);
      }
      
      if (data.selectedTemplate) {
        setSelectedTemplate(data.selectedTemplate);
      }
    } catch (error) {
      console.error("Error parsing resume data:", error);
    }
  };

  return {
    resumeData,
    updatePersonalInfo,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    removeSkill,
    selectedTemplate,
    setSelectedTemplate,
    colors,
    updateColors,
    saveResumeData,
    loadResumeData,
  };
}; 
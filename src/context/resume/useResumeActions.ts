import { useState } from "react";
import { 
  ResumeData, 
  PersonalInfo, 
  WorkExperience, 
  Education, 
  Project, 
  AdditionalSection,
  Skill,
} from "@/types/resume";
import { initialResumeData } from "./initialState";

export const useResumeActions = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // Colors
  const updateColors = (updatedColors: Partial<{ [key: string]: string }>) => {
    setResumeData((prevData) => ({
      ...prevData,
      colors: {
        ...prevData.colors,
        ...updatedColors,
      },
    }));
  };

  // Personal Info
  const updatePersonalInfo = (updatedInfo: Partial<PersonalInfo>) => {
    setResumeData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        ...updatedInfo,
      },
    }));
  };

  // Work Experience
  const addWorkExperience = (newExperience: Omit<WorkExperience, "id">) => {
    setResumeData((prevData) => ({
      ...prevData,
      workExperience: [
        ...prevData.workExperience,
        { id: Date.now().toString(), ...newExperience },
      ],
    }));
  };

  const updateWorkExperience = (
    id: string,
    updatedExperience: Partial<WorkExperience>
  ) => {
    setResumeData((prevData) => ({
      ...prevData,
      workExperience: prevData.workExperience.map((exp) =>
        exp.id === id ? { ...exp, ...updatedExperience } : exp
      ),
    }));
  };

  const removeWorkExperience = (id: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      workExperience: prevData.workExperience.filter((exp) => exp.id !== id),
    }));
  };

  // Education
  const addEducation = (newEducation: Omit<Education, "id">)_ => {
    setResumeData((prevData) => ({
      ...prevData,
      education: [
        ...prevData.education,
        { id: Date.now().toString(), ...newEducation },
      ],
    }));
  };

  const updateEducation = (
    id: string,
    updatedEducation: Partial<Education>
  ) => {
    setResumeData((prevData) => ({
      ...prevData,
      education: prevData.education.map((edu) =>
        edu.id === id ? { ...edu, ...updatedEducation } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      education: prevData.education.filter((edu) => edu.id !== id),
    }));
  };

  // Skills
  const addSkill = (newSkill: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: [
        ...prevData.skills,
        { id: Date.now().toString(), name: newSkill }
      ],
    }));
  };

  const removeSkill = (skillToRemove: string | Skill) => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((skill) => {
        if (typeof skillToRemove === 'string') {
          return skill.name !== skillToRemove;
        } else {
          return skill.id !== skillToRemove.id;
        }
      }),
    }));
  };

  // Projects
  const addProject = (newProject: Omit<Project, "id">) => {
    setResumeData((prevData) => ({
      ...prevData,
      projects: [
        ...prevData.projects,
        { id: Date.now().toString(), ...newProject },
      ],
    }));
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setResumeData((prevData) => ({
      ...prevData,
      projects: prevData.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updatedProject } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      projects: prevData.projects.filter((proj) => proj.id !== id),
    }));
  };

  // Additional Sections
  const addAdditionalSection = (newSection: Omit<AdditionalSection, "id">) => {
    setResumeData((prevData) => ({
      ...prevData,
      additionalSections: [
        ...prevData.additionalSections,
        { id: Date.now().toString(), ...newSection },
      ],
    }));
  };

  const updateAdditionalSection = (
    id: string,
    updatedSection: Partial<AdditionalSection>
  ) => {
    setResumeData((prevData) => ({
      ...prevData,
      additionalSections: prevData.additionalSections.map((section) =>
        section.id === id ? { ...section, ...updatedSection } : section
      ),
    }));
  };

  const removeAdditionalSection = (id: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      additionalSections: prevData.additionalSections.filter(
        (section) => section.id !== id
      ),
    }));
  };

  // Section Customizations (New Function)
  const updateSectionHeight = (sectionKey: string, height: string | null) => {
    setResumeData((prevData) => {
      const newCustomizations = { ...(prevData.sectionCustomizations || {}) };
      
      if (!newCustomizations[sectionKey]) {
        newCustomizations[sectionKey] = {};
      }

      if (height === null) {
        newCustomizations[sectionKey].height = undefined; 
      } else {
        newCustomizations[sectionKey].height = height;
      }
      
      return {
        ...prevData,
        sectionCustomizations: newCustomizations,
      };
    });
  };

  // Import/Export
  const saveResumeData = () => {
    const jsonData = JSON.stringify(resumeData);
    return jsonData;
  };

  const loadResumeData = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData) as ResumeData;
      setResumeData(parsedData);
    } catch (error) {
      console.error("Error parsing JSON data:", error);
    }
  };

  return {
    resumeData,
    selectedTemplate,
    setSelectedTemplate,
    colors: resumeData.colors,
    updateColors,
    updatePersonalInfo,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
    addAdditionalSection,
    updateAdditionalSection,
    removeAdditionalSection,
    updateSectionHeight, 
    saveResumeData,
    loadResumeData,
  };
};

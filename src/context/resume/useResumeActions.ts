import { useState } from "react";
import { Layout } from 'react-grid-layout'; 
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

import templates from "@/data/templates"; // Import templates array
import { ResumeTemplate } from "../ResumeBuilder/ResumePreview/types"; // To get the type with defaultLayouts

export const useResumeActions = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplate, setSelectedTemplateState] = useState<string>(initialResumeData.selectedTemplate || "default");

  // Function to handle template selection and layout initialization
  const selectTemplateAndInitializeLayouts = (templateId: string) => {
    setSelectedTemplateState(templateId);

    setResumeData(prevData => {
      const updatedResumeData = { ...prevData, selectedTemplate: templateId };

      // Check if layouts for this template already exist or if it's a custom template
      if ((prevData.layouts && prevData.layouts[templateId]) || templateId.startsWith("custom-")) {
        // If layout exists or it's custom, just return with updated selectedTemplate
        return updatedResumeData;
      }

      const chosenTemplate = templates.find(t => t.id === templateId) as ResumeTemplate | undefined;

      if (chosenTemplate && chosenTemplate.defaultLayouts) {
        return {
          ...updatedResumeData, // Contains already updated selectedTemplate
          layouts: {
            ...(prevData.layouts || {}), // Build upon existing layouts object
            [templateId]: chosenTemplate.defaultLayouts,
          },
        };
      }
      
      // If no specific default layout found for a non-custom template, 
      // still return with updated selectedTemplate
      return updatedResumeData;
    });
  };

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

  // Work Experience (Add, Update, Remove)
  const addWorkExperience = (newExperience: Omit<WorkExperience, "id">) => { 
    setResumeData((prevData) => ({ 
      ...prevData, 
      workExperience: [ 
        ...prevData.workExperience, 
        { id: Date.now().toString(), ...newExperience }, 
      ], 
    })); 
  };
  const updateWorkExperience = ( id: string, updatedExperience: Partial<WorkExperience> ) => { 
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

  // Education (Add, Update, Remove)
  const addEducation = (newEducation: Omit<Education, "id">) => { 
    setResumeData((prevData) => ({ 
      ...prevData, 
      education: [ 
        ...prevData.education, 
        { id: Date.now().toString(), ...newEducation }, 
      ], 
    })); 
  };
  const updateEducation = ( id: string, updatedEducation: Partial<Education> ) => { 
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

  // Skills (Add, Remove)
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

  // Projects (Add, Update, Remove)
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

  // Additional Sections (Add, Update, Remove)
  const addAdditionalSection = (newSection: Omit<AdditionalSection, "id">) => { 
    setResumeData((prevData) => ({ 
      ...prevData, 
      additionalSections: [ 
        ...prevData.additionalSections, 
        { id: Date.now().toString(), ...newSection }, 
      ], 
    })); 
  };
  const updateAdditionalSection = ( id: string, updatedSection: Partial<AdditionalSection> ) => { 
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

  // Layout Customizations - MODIFIED
  const updateTemplateLayout = (templateId: string, allLayouts: { [breakpoint: string]: Layout[] }) => {
    setResumeData((prevData) => ({
      ...prevData,
      layouts: {
        ...(prevData.layouts || {}), 
        [templateId]: allLayouts, // Store the entire allLayouts object
      },
    }));
  };

  // Import/Export
  const saveResumeData = () => {
    const jsonData = JSON.stringify(resumeData);
    return jsonData;
  };

  const loadResumeData = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData) as ResumeData;
      if (!parsedData.layouts) {
        parsedData.layouts = {}; 
      }
      // Further checks for nested structure consistency in layouts can be added if needed
      setResumeData(parsedData);
    } catch (error) {
      console.error("Error parsing JSON data:", error);
    }
  };

  return {
    resumeData,
    selectedTemplate,
    // setSelectedTemplate, // Expose the new function instead
    setSelectedTemplate: selectTemplateAndInitializeLayouts,
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
    updateTemplateLayout, 
    saveResumeData,
    loadResumeData,
  };
};

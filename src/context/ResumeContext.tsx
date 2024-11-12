"use client";
import React, { createContext, useState, useContext } from "react";
import {
  ResumeData,
  PersonalInfo,
  WorkExperience,
  Education,
  Project,
  AdditionalSection,
} from "@/types/resume";

interface ResumeContextValue {
  resumeData: ResumeData;
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
  removeSkill: (skill: string) => void;
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
}

export const ResumeContext = createContext<ResumeContextValue | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    additionalSections: [],
    colors: {
      primary: "#3B82F6",
      secondary: "#1F2937",
      accent: "#10B981",
    },
  });

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const updateColors = (updatedColors: Partial<{ [key: string]: string }>) => {
    setResumeData((prevData) => ({
      ...prevData,
      colors: {
        ...prevData.colors,
        ...updatedColors,
      },
    }));
  };

  const updatePersonalInfo = (updatedInfo: Partial<PersonalInfo>) => {
    setResumeData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        ...updatedInfo,
      },
    }));
  };

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

  const addEducation = (newEducation: Omit<Education, "id">) => {
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

  const addSkill = (newSkill: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: [...prevData.skills, newSkill],
    }));
  };

  const removeSkill = (skill: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((s) => s !== skill),
    }));
  };

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

  const value = {
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
    addProject,
    updateProject,
    removeProject,
    addAdditionalSection,
    updateAdditionalSection,
    removeAdditionalSection,
    selectedTemplate,
    setSelectedTemplate,
    saveResumeData,
    loadResumeData,
    updateColors,
    colors: resumeData.colors,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};

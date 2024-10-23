import { useState } from "react";
import {
  ResumeData,
  WorkExperience,
  Education,
  Project,
  AdditionalSection,
} from "@/types/resume";

export const useResumeData = () => {
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
      primary: "",
      secondary: "",
      accent: "",
    },
  });

  const [selectedTemplate, setSelectedTemplate] = useState("default");

  const updatePersonalInfo = (info: Partial<ResumeData["personalInfo"]>) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  const addWorkExperience = (experience: Omit<WorkExperience, "id">) => {
    const newExperience = { id: Date.now().toString(), ...experience };
    setResumeData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newExperience],
    }));
  };

  const updateWorkExperience = (
    id: string,
    updates: Partial<WorkExperience>
  ) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp
      ),
    }));
  };

  const removeWorkExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = (education: Omit<Education, "id">) => {
    const newEducation = { id: Date.now().toString(), ...education };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addSkill = (skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
  };

  const removeSkill = (skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addProject = (project: Omit<Project, "id">) => {
    const newProject = { id: Date.now().toString(), ...project };
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updates } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const addAdditionalSection = (section: Omit<AdditionalSection, "id">) => {
    const newSection = { id: Date.now().toString(), ...section };
    setResumeData((prev) => ({
      ...prev,
      additionalSections: [...prev.additionalSections, newSection],
    }));
  };

  const updateAdditionalSection = (
    id: string,
    updates: Partial<AdditionalSection>
  ) => {
    setResumeData((prev) => ({
      ...prev,
      additionalSections: prev.additionalSections.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      ),
    }));
  };

  const removeAdditionalSection = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      additionalSections: prev.additionalSections.filter(
        (section) => section.id !== id
      ),
    }));
  };

  return {
    resumeData,
    selectedTemplate,
    setSelectedTemplate,
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
  };
};

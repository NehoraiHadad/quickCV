"use client";
import React, { createContext, useState, useContext } from "react";
import { Skill } from "@/types/resume";

// Convert skills to a consistent format (string[] only)
const formatSkills = (skills: Array<string | Skill> = []): string[] => {
  return skills.map(skill => 
    typeof skill === 'string' ? skill : skill.name
  );
};

interface SkillsContextValue {
  skills: string[];
  addSkill: (newSkill: string) => void;
  removeSkill: (skill: string) => void;
}

const SkillsContext = createContext<SkillsContextValue | undefined>(undefined);

export const SkillsProvider: React.FC<{ 
  children: React.ReactNode;
  initialData?: string[] | Skill[];
}> = ({ children, initialData = [] }) => {
  // Convert initial data to string array
  const initialStringSkills = formatSkills(initialData as Array<string | Skill>);
  const [skills, setSkills] = useState<string[]>(initialStringSkills);

  const addSkill = (newSkill: string) => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prevSkills) => [...prevSkills, newSkill.trim()]);
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prevSkills) => prevSkills.filter((s) => s !== skill));
  };

  return (
    <SkillsContext.Provider
      value={{
        skills,
        addSkill,
        removeSkill,
      }}
    >
      {children}
    </SkillsContext.Provider>
  );
};

export const useSkills = () => {
  const context = useContext(SkillsContext);
  if (context === undefined) {
    throw new Error("useSkills must be used within a SkillsProvider");
  }
  return context;
}; 
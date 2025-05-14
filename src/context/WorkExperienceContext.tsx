"use client";
import React, { createContext, useState, useContext } from "react";
import { WorkExperience } from "@/types/resume";

interface WorkExperienceContextValue {
  workExperience: WorkExperience[];
  addWorkExperience: (newExperience: Omit<WorkExperience, "id">) => void;
  updateWorkExperience: (id: string, updatedExperience: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
}

const WorkExperienceContext = createContext<WorkExperienceContextValue | undefined>(undefined);

export const WorkExperienceProvider: React.FC<{ 
  children: React.ReactNode;
  initialData?: WorkExperience[];
}> = ({ children, initialData }) => {
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(initialData || []);

  const addWorkExperience = (newExperience: Omit<WorkExperience, "id">) => {
    setWorkExperience((prevExperience) => [
      ...prevExperience,
      { id: Date.now().toString(), ...newExperience },
    ]);
  };

  const updateWorkExperience = (
    id: string,
    updatedExperience: Partial<WorkExperience>
  ) => {
    setWorkExperience((prevExperience) =>
      prevExperience.map((exp) =>
        exp.id === id ? { ...exp, ...updatedExperience } : exp
      )
    );
  };

  const removeWorkExperience = (id: string) => {
    setWorkExperience((prevExperience) =>
      prevExperience.filter((exp) => exp.id !== id)
    );
  };

  return (
    <WorkExperienceContext.Provider
      value={{
        workExperience,
        addWorkExperience,
        updateWorkExperience,
        removeWorkExperience,
      }}
    >
      {children}
    </WorkExperienceContext.Provider>
  );
};

export const useWorkExperience = () => {
  const context = useContext(WorkExperienceContext);
  if (context === undefined) {
    throw new Error("useWorkExperience must be used within a WorkExperienceProvider");
  }
  return context;
}; 
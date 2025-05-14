"use client";
import React, { createContext, useState, useContext } from "react";
import { Education } from "@/types/resume";

interface EducationContextValue {
  education: Education[];
  addEducation: (newEducation: Omit<Education, "id">) => void;
  updateEducation: (id: string, updatedEducation: Partial<Education>) => void;
  removeEducation: (id: string) => void;
}

const EducationContext = createContext<EducationContextValue | undefined>(undefined);

export const EducationProvider: React.FC<{ 
  children: React.ReactNode;
  initialData?: Education[];
}> = ({ children, initialData }) => {
  const [education, setEducation] = useState<Education[]>(initialData || []);

  const addEducation = (newEducation: Omit<Education, "id">) => {
    setEducation((prevEducation) => [
      ...prevEducation,
      { id: Date.now().toString(), ...newEducation },
    ]);
  };

  const updateEducation = (
    id: string,
    updatedEducation: Partial<Education>
  ) => {
    setEducation((prevEducation) =>
      prevEducation.map((edu) =>
        edu.id === id ? { ...edu, ...updatedEducation } : edu
      )
    );
  };

  const removeEducation = (id: string) => {
    setEducation((prevEducation) =>
      prevEducation.filter((edu) => edu.id !== id)
    );
  };

  return (
    <EducationContext.Provider
      value={{
        education,
        addEducation,
        updateEducation,
        removeEducation,
      }}
    >
      {children}
    </EducationContext.Provider>
  );
};

export const useEducation = () => {
  const context = useContext(EducationContext);
  if (context === undefined) {
    throw new Error("useEducation must be used within an EducationProvider");
  }
  return context;
}; 
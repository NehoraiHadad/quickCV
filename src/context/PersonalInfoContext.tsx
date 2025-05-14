"use client";
import React, { createContext, useState, useContext } from "react";
import { PersonalInfo } from "@/types/resume";

interface PersonalInfoContextValue {
  personalInfo: PersonalInfo;
  updatePersonalInfo: (updatedInfo: Partial<PersonalInfo>) => void;
}

const PersonalInfoContext = createContext<PersonalInfoContextValue | undefined>(undefined);

export const PersonalInfoProvider: React.FC<{ 
  children: React.ReactNode;
  initialData?: PersonalInfo;
}> = ({ children, initialData }) => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(
    initialData || {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    }
  );

  const updatePersonalInfo = (updatedInfo: Partial<PersonalInfo>) => {
    setPersonalInfo((prevInfo) => ({
      ...prevInfo,
      ...updatedInfo,
    }));
  };

  return (
    <PersonalInfoContext.Provider
      value={{
        personalInfo,
        updatePersonalInfo,
      }}
    >
      {children}
    </PersonalInfoContext.Provider>
  );
};

export const usePersonalInfo = () => {
  const context = useContext(PersonalInfoContext);
  if (context === undefined) {
    throw new Error("usePersonalInfo must be used within a PersonalInfoProvider");
  }
  return context;
}; 
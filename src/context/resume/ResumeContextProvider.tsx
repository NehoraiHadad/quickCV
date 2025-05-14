"use client";
import React, { createContext, useContext } from "react";
import { ResumeContextValue } from "./types";
import { useResumeActions } from "./useResumeActions";

// Create context with undefined initial value
export const ResumeContext = createContext<ResumeContextValue | undefined>(
  undefined
);

// Provider component
export const ResumeContextProvider: React.FC<{ 
  children: React.ReactNode 
}> = ({ children }) => {
  // Use the extracted actions hook
  const resumeActions = useResumeActions();

  return (
    <ResumeContext.Provider value={resumeActions}>
      {children}
    </ResumeContext.Provider>
  );
};

// Custom hook for consuming the context
export const useResume = (): ResumeContextValue => {
  const context = useContext(ResumeContext);
  
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  
  return context;
}; 
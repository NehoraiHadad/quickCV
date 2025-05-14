"use client";
import React, { createContext, useState, useContext } from "react";
import { AdditionalSection } from "@/types/resume";

interface AdditionalSectionsContextType {
  additionalSections: AdditionalSection[];
  addAdditionalSection: (newSection: Omit<AdditionalSection, "id">) => void;
  updateAdditionalSection: (id: string, updatedSection: Partial<AdditionalSection>) => void;
  removeAdditionalSection: (id: string) => void;
}

// Create the context
const AdditionalSectionsContext = createContext<AdditionalSectionsContextType | undefined>(
  undefined
);

/**
 * Provider component for managing additional sections state
 */
export const AdditionalSectionsProvider: React.FC<{ 
  children: React.ReactNode;
  initialData?: AdditionalSection[];
}> = ({
  children,
  initialData
}) => {
  const [additionalSections, setAdditionalSections] = useState<AdditionalSection[]>(initialData || []);

  const addAdditionalSection = (newSection: Omit<AdditionalSection, "id">) => {
    setAdditionalSections((prevSections) => [
      ...prevSections,
      { id: Date.now().toString(), ...newSection },
    ]);
  };

  const updateAdditionalSection = (
    id: string,
    updatedSection: Partial<AdditionalSection>
  ) => {
    setAdditionalSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, ...updatedSection } : section
      )
    );
  };

  const removeAdditionalSection = (id: string) => {
    setAdditionalSections((prevSections) =>
      prevSections.filter((section) => section.id !== id)
    );
  };

  return (
    <AdditionalSectionsContext.Provider
      value={{
        additionalSections,
        addAdditionalSection,
        updateAdditionalSection,
        removeAdditionalSection,
      }}
    >
      {children}
    </AdditionalSectionsContext.Provider>
  );
};

/**
 * Hook for using the additional sections context
 */
export const useAdditionalSections = (): AdditionalSectionsContextType => {
  const context = useContext(AdditionalSectionsContext);
  if (context === undefined) {
    throw new Error(
      "useAdditionalSections must be used within an AdditionalSectionsProvider"
    );
  }
  return context;
}; 
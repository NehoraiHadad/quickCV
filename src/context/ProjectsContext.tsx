"use client";
import React, { createContext, useState, useContext } from "react";
import { Project } from "@/types/resume";

interface ProjectsContextType {
  projects: Project[];
  addProject: (newProject: Omit<Project, "id">) => void;
  updateProject: (id: string, updatedProject: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

// Create the context
const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

/**
 * Provider component for managing projects state
 */
export const ProjectsProvider: React.FC<{ 
  children: React.ReactNode;
  initialData?: Project[];
}> = ({
  children,
  initialData
}) => {
  const [projects, setProjects] = useState<Project[]>(initialData || []);

  const addProject = (newProject: Omit<Project, "id">) => {
    setProjects((prevProjects) => [
      ...prevProjects,
      { id: Date.now().toString(), ...newProject },
    ]);
  };

  const updateProject = (
    id: string,
    updatedProject: Partial<Project>
  ) => {
    setProjects((prevProjects) =>
      prevProjects.map((proj) =>
        proj.id === id ? { ...proj, ...updatedProject } : proj
      )
    );
  };

  const removeProject = (id: string) => {
    setProjects((prevProjects) =>
      prevProjects.filter((proj) => proj.id !== id)
    );
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        removeProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

/**
 * Hook for using the projects context
 */
export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}; 
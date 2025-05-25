import React from "react";
import { SectionProps } from "./types";
import { Project as ProjectType } from "@/types/resume"; // Assuming Project type is available

const isEffectivelyEmpty = (str: string | null | undefined): boolean => !str || str.trim() === '';

const isProjectItemEffectivelyEmpty = (proj: ProjectType): boolean => {
  // Ensure all relevant fields are checked. Adjust if ProjectType has different fields.
  return (
    isEffectivelyEmpty(proj.name) &&
    isEffectivelyEmpty(proj.description) &&
    isEffectivelyEmpty(proj.technologies) && // Assuming technologies is a string of comma-separated values
    isEffectivelyEmpty(proj.link) &&
    isEffectivelyEmpty(proj.github)
  );
};

const Projects: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { projects } = resumeData;

  const sectionIsEffectivelyEmpty =
    !projects ||
    projects.length === 0 ||
    projects.every(isProjectItemEffectivelyEmpty);

  if (sectionIsEffectivelyEmpty) {
    return (
      <section className="mb-6">
        <h2
          className="text-2xl font-semibold text-gray-800 mb-3"
          style={{ color: templateColors.primary }}
        >
          Projects
        </h2>
        <div className="p-4 bg-gray-50 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
          <p className="text-sm text-gray-500 italic">
            Showcase your projects here. For example: Personal Portfolio Website - A responsive website built with React and Tailwind CSS.
          </p>
        </div>
      </section>
    );
  }

  const visibleProjects = projects.filter(proj => !isProjectItemEffectivelyEmpty(proj));

  // Fallback if all items were empty (should be caught by `every` but good for safety)
  if (visibleProjects.length === 0) {
      return (
        <section className="mb-6">
          <h2
            className="text-2xl font-semibold text-gray-800 mb-3"
            style={{ color: templateColors.primary }}
          >
            Projects
          </h2>
          <div className="p-4 bg-gray-50 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
            <p className="text-sm text-gray-500 italic">
              Showcase your projects here. For example: Personal Portfolio Website - A responsive website built with React and Tailwind CSS.
            </p>
          </div>
        </section>
      );
  }
  
  return (
    <section className="mb-6">
      <h2
        className="text-2xl font-semibold text-gray-800 mb-3"
        style={{ color: templateColors.primary }}
      >
        Projects
      </h2>
      {visibleProjects.map((proj) => (
        <div 
          key={proj.id} 
          className="mb-4 bg-gray-50 p-4 rounded-lg" 
          style={{ backgroundColor: `${templateColors.accent}10` }}
        >
          {/* Render project name only if it exists, otherwise, this card shouldn't have been rendered due to filter */}
          {!isEffectivelyEmpty(proj.name) && (
            <h3
              className="text-lg font-semibold text-gray-800"
              style={{ color: templateColors.secondary }}
            >
              {proj.name}
            </h3>
          )}
          {!isEffectivelyEmpty(proj.description) && (
            <p className="text-sm text-gray-700 mb-2">
              {proj.description}
            </p>
          )}
          {!isEffectivelyEmpty(proj.technologies) && (
            <p className="text-xs text-gray-600 mb-2">
              <span className="font-semibold">Technologies:</span>{" "}
              {proj.technologies}
            </p>
          )}
          {!isEffectivelyEmpty(proj.link) && (
            <a
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline mr-3"
              style={{ color: templateColors.accent }}
            >
              View Project
            </a>
          )}
          {!isEffectivelyEmpty(proj.github) && (
            <a
              href={proj.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
              style={{ color: templateColors.accent }}
            >
              GitHub
            </a>
          )}
        </div>
      ))}
    </section>
  );
};

export default Projects;

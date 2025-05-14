import React from "react";
import { SectionProps } from "./types";

const Projects: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { projects } = resumeData;

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <h2
        className="text-2xl font-semibold text-gray-800 mb-3"
        style={{ color: templateColors.primary }}
      >
        Projects
      </h2>
      {projects.map((proj) => (
        <div 
          key={proj.id} 
          className="mb-4 bg-gray-50 p-4 rounded-lg" 
          style={{ backgroundColor: `${templateColors.accent}10` }}
        >
          <h3
            className="text-lg font-semibold text-gray-800"
            style={{ color: templateColors.secondary }}
          >
            {proj.name}
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            {proj.description}
          </p>
          {proj.technologies && (
            <p className="text-xs text-gray-600 mb-2">
              <span className="font-semibold">Technologies:</span>{" "}
              {proj.technologies}
            </p>
          )}
          {proj.link && (
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
          {proj.github && (
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
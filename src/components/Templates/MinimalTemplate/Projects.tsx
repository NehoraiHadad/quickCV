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
        className="text-xl font-semibold mb-3"
        style={{ color: templateColors.primary }}
      >
        Projects
      </h2>
      {projects.map((proj) => (
        <div key={proj.id} className="mb-4">
          <h3 className="text-base font-semibold mb-1" style={{ color: templateColors.secondary }}>
            {proj.name}
          </h3>
          <p className="text-sm text-gray-700 mb-1">
            {proj.description}
          </p>
          {proj.technologies && (
            <p className="text-xs text-gray-600 mb-1">
              <span className="font-semibold">Technologies:</span> {proj.technologies}
            </p>
          )}
          <div className="flex gap-3">
            {proj.link && (
              <a
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:underline"
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
                className="text-xs hover:underline"
                style={{ color: templateColors.accent }}
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Projects; 
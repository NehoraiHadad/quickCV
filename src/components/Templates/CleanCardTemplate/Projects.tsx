import React from "react";
import { SectionProps } from "./types";

const Projects: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { projects } = resumeData;

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2
        className="text-2xl font-semibold mb-4"
        style={{ color: templateColors.primary }}
      >
        Projects
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg shadow-md border hover:shadow-lg transition duration-300"
            style={{ borderColor: templateColors.accent }}
          >
            <h3
              className="font-semibold text-lg mb-2"
              style={{ color: templateColors.primary }}
            >
              {project.name}
            </h3>
            <p className="mb-3">{project.description}</p>
            {project.technologies && (
              <div className="mb-2">
                <strong style={{ color: templateColors.secondary }}>
                  Technologies:
                </strong>
                <span> {project.technologies}</span>
              </div>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: templateColors.accent }}
                className="hover:underline text-sm mr-3"
              >
                View Project
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: templateColors.accent }}
                className="hover:underline text-sm"
              >
                GitHub
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects; 
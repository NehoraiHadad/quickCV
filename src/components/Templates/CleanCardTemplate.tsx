import React from "react";
import { ResumeData } from "@/types/resume";

interface CleanCardTemplateProps {
  resumeData: ResumeData;
}

const CleanCardTemplate: React.FC<CleanCardTemplateProps> = ({
  resumeData,
}) => {
  const {
    personalInfo,
    workExperience,
    education,
    skills,
    projects,
    additionalSections,
    colors = {},
  } = resumeData;

  // Define default colors
  const defaultColors = {
    primary: "#3B82F6",
    secondary: "#1F2937",
    accent: "#10B981",
  };

  // Merge default colors with user-defined colors
  const templateColors = { ...defaultColors, ...colors };

  return (
    <div
      className="p-8 w-full h-full mx-auto bg-white font-sans shadow-lg"
      style={{ color: templateColors.secondary }}
    >
      {/* Header */}
      <header
        className="text-center mb-8 pb-6"
        style={{
          borderBottom: personalInfo.name
            ? `2px solid ${templateColors.primary}`
            : "none",
        }}
      >
        {" "}
        <h1
          className="text-4xl font-bold"
          style={{ color: templateColors.primary }}
        >
          {personalInfo.name}
        </h1>
        <p className="text-xl mt-2" style={{ color: templateColors.secondary }}>
          {personalInfo.title}
        </p>
        <div className="flex flex-wrap justify-center text-sm mt-4">
          {personalInfo.email && (
            <p className="mr-4">
              <a
                href={`mailto:${personalInfo.email}`}
                style={{ color: templateColors.accent }}
                className="hover:underline transition duration-300"
              >
                {personalInfo.email}
              </a>
            </p>
          )}
          {personalInfo.phone && (
            <p className="mr-4">
              <a
                href={`tel:${personalInfo.phone}`}
                style={{ color: templateColors.accent }}
                className="hover:underline transition duration-300"
              >
                {personalInfo.phone}
              </a>
            </p>
          )}
          {personalInfo.location && (
            <p style={{ color: templateColors.secondary }}>
              {personalInfo.location}
            </p>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h2
            className="text-2xl font-semibold mb-3"
            style={{ color: templateColors.primary }}
          >
            Professional Summary
          </h2>
          <p className="leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      <div className="flex flex-row gap-8">
        {/* Left column */}
        <div className="w-2/3">
          {/* Work Experience */}
          {workExperience.length > 0 && (
            <section className="mb-8">
              <h2
                className="text-2xl font-semibold mb-4"
                style={{ color: templateColors.primary }}
              >
                Work Experience
              </h2>
              {workExperience.map((job) => (
                <div
                  key={job.id}
                  className="mb-6 p-4 rounded-lg shadow-sm"
                  style={{ backgroundColor: `${templateColors.accent}10` }}
                >
                  <h3
                    className="font-semibold text-lg"
                    style={{ color: templateColors.primary }}
                  >
                    {job.position}
                  </h3>
                  <p
                    className="font-medium"
                    style={{ color: templateColors.secondary }}
                  >
                    {job.company}
                  </p>
                  <p
                    className="text-sm mb-2"
                    style={{ color: templateColors.secondary }}
                  >
                    {job.startDate} - {job.endDate}
                  </p>
                  <p>{job.description}</p>
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-8">
              <h2
                className="text-2xl font-semibold mb-4"
                style={{ color: templateColors.primary }}
              >
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="hover:underline text-sm"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="w-1/3">
          {/* Skills */}
          {skills.length > 0 && (
            <section
              className="mb-8 p-4 rounded-lg shadow-sm"
              style={{ backgroundColor: `${templateColors.accent}10` }}
            >
              <h2
                className="text-2xl font-semibold mb-3"
                style={{ color: templateColors.primary }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                    style={{
                      backgroundColor: `${templateColors.primary}20`,
                      color: templateColors.primary,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section
              className="mb-8 p-4 rounded-lg shadow-sm"
              style={{ backgroundColor: `${templateColors.accent}10` }}
            >
              <h2
                className="text-2xl font-semibold mb-3"
                style={{ color: templateColors.primary }}
              >
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <h3
                    className="font-semibold"
                    style={{ color: templateColors.primary }}
                  >
                    {edu.degree}
                  </h3>
                  <p>{edu.fieldOfStudy}</p>
                  <p style={{ color: templateColors.secondary }}>
                    {edu.institution}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: templateColors.secondary }}
                  >
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Additional Sections */}
          {additionalSections.map((section) => (
            <section
              key={section.id}
              className="mb-8 p-4 rounded-lg shadow-sm"
              style={{ backgroundColor: `${templateColors.accent}10` }}
            >
              <h2
                className="text-2xl font-semibold mb-3"
                style={{ color: templateColors.primary }}
              >
                {section.title}
              </h2>
              <div>
                <p>{section.content}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CleanCardTemplate);

import React from "react";
import { ResumeData } from "@/types/resume";

interface DefaultTemplateProps {
  resumeData: ResumeData;
}

const DefaultTemplate: React.FC<DefaultTemplateProps> = ({ resumeData }) => {
  const {
    personalInfo,
    workExperience,
    education,
    skills,
    projects,
    additionalSections,
    colors = {}, // Provide a default empty object
  } = resumeData;

  // Define default colors
  const defaultColors = {
    primary: '#3B82F6',
    secondary: '#1F2937',
    accent: '#10B981',
  };

  // Merge default colors with user-defined colors
  const templateColors = { ...defaultColors, ...colors };

  return (
    <div className="p-6 w-full h-full mx-auto bg-white">
      {/* Personal Information */}
      <header
      className={`${personalInfo.name ? 'border-b-2' : ''} pb-4 mb-6`}
      style={{ borderColor: templateColors.primary }}
      >
        <h1
          className="text-4xl font-bold"
          style={{ color: templateColors.primary }}
        >
          {personalInfo.name}
        </h1>

        <div className="flex flex-wrap justify-between text-sm text-gray-600 mt-2">
          {personalInfo.email && (
            <p className="mr-4">
              <span className="font-semibold">Email:</span>{" "}
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-gray-600 no-underline hover:underline"
                style={{ color: templateColors.accent }}
              >
                {personalInfo.email}
              </a>
            </p>
          )}
          {personalInfo.phone && (
            <p className="mr-4">
              <span className="font-semibold">Phone:</span>{" "}
              <a
                href={`tel:${personalInfo.phone}`}
                className="text-gray-600 no-underline hover:underline"
                style={{ color: templateColors.accent }}
              >
                {personalInfo.phone}
              </a>
            </p>
          )}
          {personalInfo.location && (
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {personalInfo.location}
            </p>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2
            className="text-2xl font-semibold text-gray-800 mb-2"
            style={{ color: templateColors.primary }}
          >
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Two-column layout */}
      <div className="flex flex-row gap-6">
        {/* Left column */}
        <div className=" w-2/3">
          {/* Work Experience */}
          {workExperience.length > 0 && (
            <section className="mb-6">
              <h2
                className="text-2xl font-semibold text-gray-800 mb-3"
                style={{ color: templateColors.primary }}
              >
                Work Experience
              </h2>
              {workExperience.map((exp) => (
                <div key={exp.id} className="mb-4 bg-gray-50 p-4 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
                  <h3
                    className="text-lg font-semibold text-gray-800"
                    style={{ color: templateColors.secondary }}
                  >
                    {exp.position} |{" "}
                    <span className="text-gray-600">{exp.company}</span>
                  </h3>
                  <p className="text-xs text-gray-600 mb-2" style={{ color: templateColors.accent }}>
                    {exp.startDate} - {exp.endDate}
                  </p>
                  <p className="text-sm text-gray-700">{exp.description}</p>
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-6">
              <h2
                className="text-2xl font-semibold text-gray-800 mb-3"
                style={{ color: templateColors.primary }}
              >
                Projects
              </h2>
              {projects.map((proj) => (
                <div key={proj.id} className="mb-4 bg-gray-50 p-4 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
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
          )}
        </div>

        {/* Right column */}
        <div className="w-1/3">
          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-6">
              <h2
                className="text-2xl font-semibold text-gray-800 mb-3"
                style={{ color: templateColors.primary }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: `${templateColors.primary}20`, color: templateColors.primary }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-6">
              <h2
                className="text-2xl font-semibold text-gray-800 mb-3"
                style={{ color: templateColors.primary }}
              >
                Education
              </h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3 bg-gray-50 p-3 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
                  <h3
                    className="text-lg font-semibold text-gray-800"
                    style={{ color: templateColors.secondary }}
                  >
                    {edu.degree}, {edu.fieldOfStudy}
                  </h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-600" style={{ color: templateColors.accent }}>
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Additional Sections */}
          {additionalSections.map((section) => (
            <section key={section.id} className="mb-6">
              <h2
                className="text-2xl font-semibold text-gray-800 mb-2"
                style={{ color: templateColors.primary }}
              >
                {section.title}
              </h2>
              <div className="bg-gray-50 p-3 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
                <p className="text-sm text-gray-700">{section.content}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DefaultTemplate);
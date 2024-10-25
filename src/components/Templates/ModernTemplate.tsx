import React from "react";
import { ResumeData } from "@/types/resume";

interface ModernTemplateProps {
  resumeData: ResumeData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ resumeData }) => {
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
    <div className="mx-auto w-full h-full bg-white p-8 flex flex-col" style={{ color: templateColors.secondary }}>
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-3xl font-bold" style={{ color: templateColors.primary }}>{personalInfo.name}</h1>
        <div className="flex flex-wrap text-sm mt-1">
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} className="mr-4 hover:underline" style={{ color: templateColors.accent }}>
              {personalInfo.email}
            </a>
          )}
          {personalInfo.phone && (
            <a href={`tel:${personalInfo.phone}`} className="mr-4 hover:underline" style={{ color: templateColors.accent }}>
              {personalInfo.phone}
            </a>
          )}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 gap-6">
        {/* Left column */}
        <div className="w-2/3 pr-4">
          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-4">
              <h2 className="text-lg font-semibold mb-2" style={{ borderBottom: `1px solid ${templateColors.primary}`, color: templateColors.primary }}>Professional Summary</h2>
              <p className="text-sm">{personalInfo.summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <section className="mb-4">
              <h2 className="text-lg font-semibold mb-2" style={{ borderBottom: `1px solid ${templateColors.primary}`, color: templateColors.primary }}>Work Experience</h2>
              {workExperience.map((exp) => (
                <div key={exp.id} className="mb-3">
                  <h3 className="text-base font-semibold" style={{ color: templateColors.primary }}>{exp.position}</h3>
                  <p className="text-sm font-medium">{exp.company}</p>
                  <p className="text-xs" style={{ color: templateColors.accent }}>
                    {exp.startDate} - {exp.endDate}
                  </p>
                  <p className="text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-4">
              <h2 className="text-lg font-semibold mb-2" style={{ borderBottom: `1px solid ${templateColors.primary}`, color: templateColors.primary }}>Projects</h2>
              {projects.map((proj) => (
                <div key={proj.id} className="mb-3">
                  <h3 className="text-base font-semibold" style={{ color: templateColors.primary }}>{proj.name}</h3>
                  <p className="text-sm">{proj.description}</p>
                  {proj.technologies && (
                    <p className="text-xs mt-1" style={{ color: templateColors.accent }}>
                      <span className="font-medium">Technologies:</span> {proj.technologies}
                    </p>
                  )}
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
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="w-1/3">
          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-4">
              <h2 className="text-lg font-semibold mb-2" style={{ borderBottom: `1px solid ${templateColors.primary}`, color: templateColors.primary }}>Skills</h2>
              <ul className="list-disc list-inside">
                {skills.map((skill, index) => (
                  <li key={index} className="text-sm" style={{ color: templateColors.secondary }}>{skill}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-4">
              <h2 className="text-lg font-semibold mb-2" style={{ borderBottom: `1px solid ${templateColors.primary}`, color: templateColors.primary }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <h3 className="text-base font-semibold" style={{ color: templateColors.primary }}>
                    {edu.degree}, {edu.fieldOfStudy}
                  </h3>
                  <p className="text-sm">{edu.institution}</p>
                  <p className="text-xs" style={{ color: templateColors.accent }}>
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Additional Sections */}
          {additionalSections.map((section) => (
            <section key={section.id} className="mb-4">
              <h2 className="text-lg font-semibold mb-2" style={{ borderBottom: `1px solid ${templateColors.primary}`, color: templateColors.primary }}>{section.title}</h2>
              <p className="text-sm">{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ModernTemplate);
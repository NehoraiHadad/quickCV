import React from "react";
import { ResumeData } from "@/types/resume";

interface MinimalTemplateProps {
  resumeData: ResumeData;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ resumeData }) => {
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
    primary: '#2563EB',
    secondary: '#1F2937',
    accent: '#6366F1',
  };

  // Merge default colors with user-defined colors
  const templateColors = { ...defaultColors, ...colors };

  return (
    <div className="p-8 w-full h-full mx-auto bg-white font-sans">
      {/* Header with Personal Information */}
      <header className="text-center mb-8">
        <h1 
          className="text-3xl font-bold mb-1" 
          style={{ color: templateColors.primary }}
        >
          {personalInfo.name}
        </h1>
        {personalInfo.title && (
          <p className="text-lg mb-3 text-gray-600">{personalInfo.title}</p>
        )}
        
        {/* Contact Information */}
        <div className="flex justify-center flex-wrap gap-x-4 text-sm text-gray-600">
          {personalInfo.email && (
            <a 
              href={`mailto:${personalInfo.email}`}
              className="hover:underline"
              style={{ color: templateColors.accent }}
            >
              {personalInfo.email}
            </a>
          )}
          {personalInfo.phone && (
            <a 
              href={`tel:${personalInfo.phone}`}
              className="hover:underline"
              style={{ color: templateColors.accent }}
            >
              {personalInfo.phone}
            </a>
          )}
          {personalInfo.location && (
            <span>{personalInfo.location}</span>
          )}
        </div>
      </header>

      {/* Horizontal divider */}
      <div 
        className="h-0.5 w-full mb-6" 
        style={{ backgroundColor: templateColors.primary }}
      ></div>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 
            className="text-xl font-semibold mb-2"
            style={{ color: templateColors.primary }}
          >
            Profile
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section className="mb-6">
          <h2 
            className="text-xl font-semibold mb-3"
            style={{ color: templateColors.primary }}
          >
            Experience
          </h2>
          {workExperience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-base font-semibold" style={{ color: templateColors.secondary }}>
                  {exp.position}
                </h3>
                <span className="text-xs" style={{ color: templateColors.accent }}>
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <p className="text-sm font-medium mb-1 text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-700">{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 
            className="text-xl font-semibold mb-3"
            style={{ color: templateColors.primary }}
          >
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-base font-semibold" style={{ color: templateColors.secondary }}>
                  {edu.institution}
                </h3>
                <span className="text-xs" style={{ color: templateColors.accent }}>
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <p className="text-sm font-medium mb-1 text-gray-600">
                {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
              </p>
              {edu.description && (
                <p className="text-sm text-gray-700">{edu.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Two-column layout for Skills and Projects */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Skills */}
        <div className="w-full md:w-1/3">
          {skills.length > 0 && (
            <section className="mb-6">
              <h2 
                className="text-xl font-semibold mb-3"
                style={{ color: templateColors.primary }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-y-1.5">
                {skills.map((skill, index) => (
                  <div key={index} className="w-full">
                    <p className="text-sm text-gray-700">• {skill}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Additional Sections */}
          {additionalSections.length > 0 && (
            <>
              {additionalSections.map((section) => (
                <section key={section.id} className="mb-6">
                  <h2 
                    className="text-xl font-semibold mb-2"
                    style={{ color: templateColors.primary }}
                  >
                    {section.title}
                  </h2>
                  <div className="text-sm text-gray-700">
                    {section.content}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>

        {/* Projects */}
        <div className="w-full md:w-2/3">
          {projects.length > 0 && (
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
          )}
        </div>
      </div>

      {/* Footer with subtle divider */}
      <div 
        className="h-0.5 w-full mt-4" 
        style={{ backgroundColor: `${templateColors.primary}40` }}
      ></div>
    </div>
  );
};

export default MinimalTemplate; 
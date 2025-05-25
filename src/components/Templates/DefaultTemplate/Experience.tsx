import React from "react";
import { SectionProps } from "./types";
import { WorkExperience as WorkExperienceType } from "@/types/resume";

const isEffectivelyEmpty = (str: string | null | undefined): boolean => !str || str.trim() === '';

const isExperienceItemEffectivelyEmpty = (exp: WorkExperienceType): boolean => {
  return (
    isEffectivelyEmpty(exp.position) &&
    isEffectivelyEmpty(exp.company) &&
    isEffectivelyEmpty(exp.startDate) &&
    isEffectivelyEmpty(exp.endDate) &&
    isEffectivelyEmpty(exp.description)
  );
};

const Experience: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { workExperience } = resumeData;

  const sectionIsEffectivelyEmpty =
    !workExperience ||
    workExperience.length === 0 ||
    workExperience.every(isExperienceItemEffectivelyEmpty);

  if (sectionIsEffectivelyEmpty) {
    return (
      <section className="mb-6">
        <h2
          className="text-2xl font-semibold text-gray-800 mb-3"
          style={{ color: templateColors.primary }}
        >
          Work Experience
        </h2>
        <div className="p-4 bg-gray-50 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
          <p className="text-sm text-gray-500 italic">
            Add your work experience to see it here. For example: Software Engineer at Google (2020-Present).
          </p>
        </div>
      </section>
    );
  }

  const visibleExperiences = workExperience.filter(exp => !isExperienceItemEffectivelyEmpty(exp));

  // This check ensures that if workExperience had items, but ALL were empty
  // (which should ideally be caught by the .every() check in sectionIsEffectivelyEmpty),
  // we still render the placeholder.
  if (visibleExperiences.length === 0) {
      return (
        <section className="mb-6">
          <h2
            className="text-2xl font-semibold text-gray-800 mb-3"
            style={{ color: templateColors.primary }}
          >
            Work Experience
          </h2>
          <div className="p-4 bg-gray-50 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
            <p className="text-sm text-gray-500 italic">
              Add your work experience to see it here. For example: Software Engineer at Google (2020-Present).
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
        Work Experience
      </h2>
      {visibleExperiences.map((exp) => (
        <div 
          key={exp.id} 
          className="mb-4 bg-gray-50 p-4 rounded-lg" 
          style={{ backgroundColor: `${templateColors.accent}10` }}
        >
          <h3
            className="text-lg font-semibold text-gray-800"
            style={{ color: templateColors.secondary }}
          >
            {exp.position} |{" "}
            <span className="text-gray-600">{exp.company}</span>
          </h3>
          <p 
            className="text-xs text-gray-600 mb-2" 
            style={{ color: templateColors.accent }}
          >
            {exp.startDate} - {exp.endDate}
          </p>
          <p className="text-sm text-gray-700">{exp.description}</p>
        </div>
      ))}
    </section>
  );
};

export default Experience;

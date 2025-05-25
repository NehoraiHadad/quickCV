import React from "react";
import { SectionProps } from "./types";
import { Education as EducationType } from "@/types/resume";

const isEffectivelyEmpty = (str: string | null | undefined): boolean => !str || str.trim() === '';

const isEducationItemEffectivelyEmpty = (edu: EducationType): boolean => {
  return (
    isEffectivelyEmpty(edu.institution) &&
    isEffectivelyEmpty(edu.degree) &&
    isEffectivelyEmpty(edu.fieldOfStudy) &&
    isEffectivelyEmpty(edu.startDate) &&
    isEffectivelyEmpty(edu.endDate) &&
    isEffectivelyEmpty(edu.description) // Added: description is a valid field
  );
};

const Education: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { education } = resumeData;

  const sectionIsEffectivelyEmpty =
    !education ||
    education.length === 0 ||
    education.every(isEducationItemEffectivelyEmpty);

  if (sectionIsEffectivelyEmpty) {
    return (
      <section className="mb-6">
        <h2
          className="text-2xl font-semibold text-gray-800 mb-3"
          style={{ color: templateColors.primary }}
        >
          Education
        </h2>
        <div className="p-4 bg-gray-50 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
          <p className="text-sm text-gray-500 italic">
            Detail your educational background here. For example: B.S. in Computer Science - University of Example (2016-2020).
          </p>
        </div>
      </section>
    );
  }

  const visibleEducation = education.filter(edu => !isEducationItemEffectivelyEmpty(edu));

  if (visibleEducation.length === 0) {
      return (
        <section className="mb-6">
          <h2
            className="text-2xl font-semibold text-gray-800 mb-3"
            style={{ color: templateColors.primary }}
          >
            Education
          </h2>
          <div className="p-4 bg-gray-50 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
            <p className="text-sm text-gray-500 italic">
              Detail your educational background here. For example: B.S. in Computer Science - University of Example (2016-2020).
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
        Education
      </h2>
      {visibleEducation.map((edu) => (
        <div 
          key={edu.id} 
          className="mb-3 bg-gray-50 p-3 rounded-lg" 
          style={{ backgroundColor: `${templateColors.accent}10` }}
        >
          {(!isEffectivelyEmpty(edu.degree) || !isEffectivelyEmpty(edu.fieldOfStudy)) && (
             <h3
             className="text-lg font-semibold text-gray-800"
             style={{ color: templateColors.secondary }}
           >
            {!isEffectivelyEmpty(edu.degree) ? edu.degree : ''}
            {!isEffectivelyEmpty(edu.degree) && !isEffectivelyEmpty(edu.fieldOfStudy) ? ", " : ''}
            {!isEffectivelyEmpty(edu.fieldOfStudy) ? edu.fieldOfStudy : ''}
           </h3>
          )}
          {!isEffectivelyEmpty(edu.institution) && (
            <p className="text-sm text-gray-600">{edu.institution}</p>
          )}
          {(!isEffectivelyEmpty(edu.startDate) || !isEffectivelyEmpty(edu.endDate)) && (
            <p 
              className="text-xs text-gray-600" 
              style={{ color: templateColors.accent }}
            >
              {!isEffectivelyEmpty(edu.startDate) ? edu.startDate : ''}
              {!isEffectivelyEmpty(edu.startDate) && !isEffectivelyEmpty(edu.endDate) ? " - " : ''}
              {!isEffectivelyEmpty(edu.endDate) ? edu.endDate : ''}
            </p>
          )}
          {/* Removed GPA rendering block */}
          {!isEffectivelyEmpty(edu.description) && (
            <p className="text-sm text-gray-700 mt-1">{edu.description}</p>
          )}
        </div>
      ))}
    </section>
  );
};

export default Education;

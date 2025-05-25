import React from "react";
import { SectionProps } from "./types";
import { Education as EducationType } from "@/types/resume"; // Assuming Education type

const isEffectivelyEmpty = (str: string | null | undefined): boolean => !str || str.trim() === '';

const isEducationItemEffectivelyEmpty = (edu: EducationType): boolean => {
  return (
    isEffectivelyEmpty(edu.institution) &&
    isEffectivelyEmpty(edu.degree) &&
    isEffectivelyEmpty(edu.fieldOfStudy) &&
    isEffectivelyEmpty(edu.startDate) && // Assuming startDate/endDate are strings
    isEffectivelyEmpty(edu.endDate) &&
    isEffectivelyEmpty(edu.gpa) // Assuming gpa is a string or can be checked this way; adjust if number
    // Add other relevant fields from EducationType if necessary, e.g., edu.description if it exists
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
            {/* Add comma only if both degree and fieldOfStudy are present and non-empty */}
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
              {/* Add hyphen only if both dates are present and non-empty */}
              {!isEffectivelyEmpty(edu.startDate) && !isEffectivelyEmpty(edu.endDate) ? " - " : ''}
              {!isEffectivelyEmpty(edu.endDate) ? edu.endDate : ''}
            </p>
          )}
          {!isEffectivelyEmpty(edu.gpa) && ( 
             <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>
          )}
          {/* Add other fields like edu.description if available in EducationType and relevant */}
        </div>
      ))}
    </section>
  );
};

export default Education;

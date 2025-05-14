import React from "react";
import { SectionProps } from "./types";

const Education: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { education } = resumeData;

  if (education.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <h2
        className="text-2xl font-semibold text-gray-800 mb-3"
        style={{ color: templateColors.primary }}
      >
        Education
      </h2>
      {education.map((edu) => (
        <div 
          key={edu.id} 
          className="mb-3 bg-gray-50 p-3 rounded-lg" 
          style={{ backgroundColor: `${templateColors.accent}10` }}
        >
          <h3
            className="text-lg font-semibold text-gray-800"
            style={{ color: templateColors.secondary }}
          >
            {edu.degree}, {edu.fieldOfStudy}
          </h3>
          <p className="text-sm text-gray-600">{edu.institution}</p>
          <p 
            className="text-xs text-gray-600" 
            style={{ color: templateColors.accent }}
          >
            {edu.startDate} - {edu.endDate}
          </p>
        </div>
      ))}
    </section>
  );
};

export default Education; 
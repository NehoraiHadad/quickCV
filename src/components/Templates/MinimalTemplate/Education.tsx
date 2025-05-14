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
  );
};

export default Education; 
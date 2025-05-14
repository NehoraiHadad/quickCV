import React from "react";
import { SectionProps } from "./types";

const Experience: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { workExperience } = resumeData;

  if (workExperience.length === 0) {
    return null;
  }

  return (
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
  );
};

export default Experience; 
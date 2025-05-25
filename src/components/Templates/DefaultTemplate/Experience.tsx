import React from "react";
import { SectionProps } from "./types";

const Experience: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { workExperience } = resumeData;

  if (!workExperience || workExperience.length === 0) {
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
      {workExperience.map((exp) => (
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
import React from "react";
import { SectionProps } from "./types";

const Education: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { education } = resumeData;

  if (education.length === 0) {
    return null;
  }

  return (
    <section
      className="mb-8 p-4 rounded-lg shadow-sm"
      style={{ backgroundColor: `${templateColors.accent}10` }}
    >
      <h2
        className="text-2xl font-semibold mb-3"
        style={{ color: templateColors.primary }}
      >
        Education
      </h2>
      {education.map((edu) => (
        <div key={edu.id} className="mb-4">
          <h3
            className="font-semibold"
            style={{ color: templateColors.primary }}
          >
            {edu.degree}
          </h3>
          <p className="font-medium">{edu.institution}</p>
          <p className="text-sm">
            {edu.startDate} - {edu.endDate}
          </p>
          {edu.description && <p className="mt-1">{edu.description}</p>}
        </div>
      ))}
    </section>
  );
};

export default Education; 
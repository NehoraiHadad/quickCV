import React from "react";
import { SectionProps } from "./types";

const Additional: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { additionalSections } = resumeData;

  if (additionalSections.length === 0) {
    return null;
  }

  return (
    <>
      {additionalSections.map((section) => (
        <section key={section.id} className="mb-6">
          <h2
            className="text-2xl font-semibold text-gray-800 mb-2"
            style={{ color: templateColors.primary }}
          >
            {section.title}
          </h2>
          <div 
            className="bg-gray-50 p-3 rounded-lg" 
            style={{ backgroundColor: `${templateColors.accent}10` }}
          >
            <p className="text-sm text-gray-700">{section.content}</p>
          </div>
        </section>
      ))}
    </>
  );
};

export default Additional; 
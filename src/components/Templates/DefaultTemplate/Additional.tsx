import React from "react";
import { SectionProps } from "./types";

const Additional: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { additionalSections } = resumeData;

  if (!additionalSections || additionalSections.length === 0) {
    return (
      <section className="mb-6">
        <h2
          className="text-2xl font-semibold text-gray-800 mb-2"
          style={{ color: templateColors.primary }}
        >
          Additional Information
        </h2>
        <div className="p-4 bg-gray-50 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
          <p className="text-sm text-gray-500 italic">
            You can add custom sections here, like Awards, Certifications, or Languages.
          </p>
        </div>
      </section>
    );
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
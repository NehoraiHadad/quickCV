import React from "react";
import { SectionProps } from "./types";

const Additional: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { additionalSections } = resumeData;

  if (!additionalSections || additionalSections.length === 0) {
    return null;
  }

  return (
    <>
      {additionalSections.map((section) => (
        <section key={section.id} className="mb-6">
          <h2 
            className="text-xl font-semibold mb-2"
            style={{ color: templateColors.primary }}
          >
            {section.title}
          </h2>
          <div className="text-sm text-gray-700">
            {section.content}
          </div>
        </section>
      ))}
    </>
  );
};

export default Additional; 
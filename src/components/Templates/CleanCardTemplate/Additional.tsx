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
        <section key={section.id} className="mb-8">
          <h2
            className="text-2xl font-semibold mb-3"
            style={{ color: templateColors.primary }}
          >
            {section.title}
          </h2>
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
            <p>{section.content}</p>
          </div>
        </section>
      ))}
    </>
  );
};

export default Additional; 
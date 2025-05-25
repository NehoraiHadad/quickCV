import React from "react";
import { SectionProps } from "./types";
import { AdditionalSection as AdditionalSectionType } from "@/types/resume";

const isEffectivelyEmpty = (str: string | null | undefined): boolean => !str || str.trim() === '';

const isAdditionalItemEffectivelyEmpty = (section: AdditionalSectionType): boolean => {
  return (
    isEffectivelyEmpty(section.title) &&
    isEffectivelyEmpty(section.content)
  );
};

const Additional: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { additionalSections } = resumeData;

  const sectionIsEffectivelyEmpty =
    !additionalSections ||
    additionalSections.length === 0 ||
    additionalSections.every(isAdditionalItemEffectivelyEmpty);

  if (sectionIsEffectivelyEmpty) {
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

  const visibleSections = additionalSections.filter(section => !isAdditionalItemEffectivelyEmpty(section));

  if (visibleSections.length === 0) {
    // This case should ideally be covered by sectionIsEffectivelyEmpty.
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
      {visibleSections.map((section) => (
        // Each "additional section" is its own <section> element in the original logic
        // Only render the section if it has a title or content after filtering.
        <section key={section.id} className="mb-6">
          {!isEffectivelyEmpty(section.title) && (
            <h2
              className="text-2xl font-semibold text-gray-800 mb-2"
              style={{ color: templateColors.primary }}
            >
              {section.title}
            </h2>
          )}
          {/* Render content div only if content is not empty */}
          {!isEffectivelyEmpty(section.content) && (
            <div 
              className="bg-gray-50 p-3 rounded-lg" 
              style={{ backgroundColor: `${templateColors.accent}10` }}
            >
              <p className="text-sm text-gray-700">{section.content}</p>
            </div>
          )}
        </section>
      ))}
    </>
  );
};

export default Additional;

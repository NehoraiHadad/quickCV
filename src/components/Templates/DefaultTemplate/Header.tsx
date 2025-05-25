import React from "react";
import { SectionProps } from "./types";

const isEffectivelyEmpty = (str: string | null | undefined): boolean => !str || str.trim() === '';

const Header: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { personalInfo } = resumeData;

  const nameIsEmpty = isEffectivelyEmpty(personalInfo.name);
  const emailIsEmpty = isEffectivelyEmpty(personalInfo.email);
  const phoneIsEmpty = isEffectivelyEmpty(personalInfo.phone);
  const locationIsEmpty = isEffectivelyEmpty(personalInfo.location);
  const summaryIsEmpty = isEffectivelyEmpty(personalInfo.summary);

  const isHeaderEffectivelyEmpty = nameIsEmpty && emailIsEmpty && phoneIsEmpty && locationIsEmpty && summaryIsEmpty;

  if (isHeaderEffectivelyEmpty) {
    return (
      <div className="p-6 text-center text-gray-400 italic border-dashed border-2 rounded-md my-6">
        Header information will appear here. Add your name, contact details, or a professional summary.
      </div>
    );
  }

  // Removed sectionCustomizations logic
  const summaryStyle: React.CSSProperties = {}; 

  return (
    <>
      <header
        className={`${!nameIsEmpty ? 'border-b-2' : ''} pb-4 mb-6`}
        style={{ borderColor: templateColors.primary }}
      >
        {!nameIsEmpty && (
          <h1
            className="text-4xl font-bold"
            style={{ color: templateColors.primary }}
          >
            {personalInfo.name}
          </h1>
        )}

        {(!emailIsEmpty || !phoneIsEmpty || !locationIsEmpty) && (
          <div className="flex flex-wrap justify-between text-sm text-gray-600 mt-2">
            {!emailIsEmpty && (
              <p className="mr-4">
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="text-gray-600 no-underline hover:underline"
                  style={{ color: templateColors.accent }}
                >
                  {personalInfo.email}
                </a>
              </p>
            )}
            {!phoneIsEmpty && (
              <p className="mr-4">
                <span className="font-semibold">Phone:</span>{" "}
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="text-gray-600 no-underline hover:underline"
                  style={{ color: templateColors.accent }}
                >
                  {personalInfo.phone}
                </a>
              </p>
            )}
            {!locationIsEmpty && (
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {personalInfo.location}
              </p>
            )}
          </div>
        )}
      </header>

      {!summaryIsEmpty && (
        <section 
          className="mb-6" 
          style={summaryStyle} 
          data-section-key="summary" // Added this attribute
        > 
          <h2
            className="text-2xl font-semibold text-gray-800 mb-2"
            style={{ color: templateColors.primary }}
          >
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      )}
    </>
  );
};

export default Header;

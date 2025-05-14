import React from "react";
import { SectionProps } from "./types";

const Header: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { personalInfo } = resumeData;

  return (
    <>
      {/* Header */}
      <header
        className="text-center mb-8 pb-6"
        style={{
          borderBottom: personalInfo.name
            ? `2px solid ${templateColors.primary}`
            : "none",
        }}
      >
        <h1
          className="text-4xl font-bold"
          style={{ color: templateColors.primary }}
        >
          {personalInfo.name}
        </h1>
        <p className="text-xl mt-2" style={{ color: templateColors.secondary }}>
          {personalInfo.title}
        </p>
        <div className="flex flex-wrap justify-center text-sm mt-4">
          {personalInfo.email && (
            <p className="mr-4">
              <a
                href={`mailto:${personalInfo.email}`}
                style={{ color: templateColors.accent }}
                className="hover:underline transition duration-300"
              >
                {personalInfo.email}
              </a>
            </p>
          )}
          {personalInfo.phone && (
            <p className="mr-4">
              <a
                href={`tel:${personalInfo.phone}`}
                style={{ color: templateColors.accent }}
                className="hover:underline transition duration-300"
              >
                {personalInfo.phone}
              </a>
            </p>
          )}
          {personalInfo.location && (
            <p style={{ color: templateColors.secondary }}>
              {personalInfo.location}
            </p>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h2
            className="text-2xl font-semibold mb-3"
            style={{ color: templateColors.primary }}
          >
            Professional Summary
          </h2>
          <p className="leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}
    </>
  );
};

export default Header; 
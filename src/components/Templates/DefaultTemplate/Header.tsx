import React from "react";
import { SectionProps } from "./types";

const Header: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { personalInfo } = resumeData;

  return (
    <>
      <header
        className={`${personalInfo.name ? 'border-b-2' : ''} pb-4 mb-6`}
        style={{ borderColor: templateColors.primary }}
      >
        <h1
          className="text-4xl font-bold"
          style={{ color: templateColors.primary }}
        >
          {personalInfo.name}
        </h1>

        <div className="flex flex-wrap justify-between text-sm text-gray-600 mt-2">
          {personalInfo.email && (
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
          {personalInfo.phone && (
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
          {personalInfo.location && (
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {personalInfo.location}
            </p>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
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
import React from "react";
import { SectionProps } from "./types";

const Header: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { personalInfo } = resumeData;

  return (
    <>
      {/* Header with Personal Information */}
      <header className="text-center mb-8">
        <h1 
          className="text-3xl font-bold mb-1" 
          style={{ color: templateColors.primary }}
        >
          {personalInfo.name}
        </h1>
        {personalInfo.title && (
          <p className="text-lg mb-3 text-gray-600">{personalInfo.title}</p>
        )}
        
        {/* Contact Information */}
        <div className="flex justify-center flex-wrap gap-x-4 text-sm text-gray-600">
          {personalInfo.email && (
            <a 
              href={`mailto:${personalInfo.email}`}
              className="hover:underline"
              style={{ color: templateColors.accent }}
            >
              {personalInfo.email}
            </a>
          )}
          {personalInfo.phone && (
            <a 
              href={`tel:${personalInfo.phone}`}
              className="hover:underline"
              style={{ color: templateColors.accent }}
            >
              {personalInfo.phone}
            </a>
          )}
          {personalInfo.location && (
            <span>{personalInfo.location}</span>
          )}
        </div>
      </header>

      {/* Horizontal divider */}
      <div 
        className="h-0.5 w-full mb-6" 
        style={{ backgroundColor: templateColors.primary }}
      ></div>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 
            className="text-xl font-semibold mb-2"
            style={{ color: templateColors.primary }}
          >
            Profile
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
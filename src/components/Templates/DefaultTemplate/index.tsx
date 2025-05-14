import React from "react";
import { DefaultTemplateProps } from "./types";
import { getTemplateColors } from "./styles";
import Header from "./Header";
import Experience from "./Experience";
import Projects from "./Projects";
import Skills from "./Skills";
import Education from "./Education";
import Additional from "./Additional";

const DefaultTemplate: React.FC<DefaultTemplateProps> = ({ resumeData }) => {
  // Merge default colors with user-defined colors
  const templateColors = getTemplateColors(resumeData.colors);

  return (
    <div className="p-6 w-full h-full mx-auto bg-white">
      {/* Header and Summary */}
      <Header resumeData={resumeData} templateColors={templateColors} />

      {/* Two-column layout */}
      <div className="flex flex-row gap-6">
        {/* Left column */}
        <div className="w-2/3">
          {/* Work Experience */}
          <Experience resumeData={resumeData} templateColors={templateColors} />

          {/* Projects */}
          <Projects resumeData={resumeData} templateColors={templateColors} />
        </div>

        {/* Right column */}
        <div className="w-1/3">
          {/* Skills */}
          <Skills resumeData={resumeData} templateColors={templateColors} />

          {/* Education */}
          <Education resumeData={resumeData} templateColors={templateColors} />

          {/* Additional Sections */}
          <Additional resumeData={resumeData} templateColors={templateColors} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(DefaultTemplate); 
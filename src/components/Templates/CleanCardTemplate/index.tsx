import React from "react";
import { CleanCardTemplateProps } from "./types";
import Header from "./Header";
import Experience from "./Experience";
import Projects from "./Projects";
import Skills from "./Skills";
import Education from "./Education";
import Additional from "./Additional";

const CleanCardTemplate: React.FC<CleanCardTemplateProps> = ({ resumeData }) => {
  const { colors = {} } = resumeData;

  // Define default colors
  const defaultColors = {
    primary: "#3B82F6",
    secondary: "#1F2937",
    accent: "#10B981",
  };

  // Merge default colors with user-defined colors
  const templateColors = { ...defaultColors, ...colors };

  return (
    <div
      className="p-8 w-full h-full mx-auto bg-white font-sans"
      style={{ color: templateColors.secondary }}
    >
      <Header resumeData={resumeData} templateColors={templateColors} />

      <div className="flex flex-row gap-8">
        {/* Left column */}
        <div className="w-2/3">
          <Experience resumeData={resumeData} templateColors={templateColors} />
          <Projects resumeData={resumeData} templateColors={templateColors} />
        </div>

        {/* Right column */}
        <div className="w-1/3">
          <Skills resumeData={resumeData} templateColors={templateColors} />
          <Education resumeData={resumeData} templateColors={templateColors} />
        </div>
      </div>
      
      <Additional resumeData={resumeData} templateColors={templateColors} />
    </div>
  );
};

export default CleanCardTemplate; 
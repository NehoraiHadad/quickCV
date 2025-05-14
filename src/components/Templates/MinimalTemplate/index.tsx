import React from "react";
import { MinimalTemplateProps } from "./types";
import Header from "./Header";
import Experience from "./Experience";
import Education from "./Education";
import Skills from "./Skills";
import Projects from "./Projects";
import Additional from "./Additional";
import Footer from "./Footer";

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ resumeData }) => {
  const { colors = {} } = resumeData;

  // Define default colors
  const defaultColors = {
    primary: '#2563EB',
    secondary: '#1F2937',
    accent: '#6366F1',
  };

  // Merge default colors with user-defined colors
  const templateColors = { ...defaultColors, ...colors };

  return (
    <div className="p-8 w-full h-full mx-auto bg-white font-sans">
      <Header resumeData={resumeData} templateColors={templateColors} />
      <Experience resumeData={resumeData} templateColors={templateColors} />
      <Education resumeData={resumeData} templateColors={templateColors} />
      
      {/* Two-column layout for Skills and Projects */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Skills and Additional Sections */}
        <div className="w-full md:w-1/3">
          <Skills resumeData={resumeData} templateColors={templateColors} />
          <Additional resumeData={resumeData} templateColors={templateColors} />
        </div>

        {/* Projects */}
        <div className="w-full md:w-2/3">
          <Projects resumeData={resumeData} templateColors={templateColors} />
        </div>
      </div>

      <Footer resumeData={resumeData} templateColors={templateColors} />
    </div>
  );
};

export default MinimalTemplate; 
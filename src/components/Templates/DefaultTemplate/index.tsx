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
    <div className="p-6 w-[794px] h-[1123px] mx-auto bg-white shadow-lg"> {/* h-full is removed, other classes retained as per instructions */}
      <div key="header">
        <Header resumeData={resumeData} templateColors={templateColors} />
      </div>
      <div key="experience">
        <Experience resumeData={resumeData} templateColors={templateColors} />
      </div>
      <div key="projects">
        <Projects resumeData={resumeData} templateColors={templateColors} />
      </div>
      <div key="skills">
        <Skills resumeData={resumeData} templateColors={templateColors} />
      </div>
      <div key="education">
        <Education resumeData={resumeData} templateColors={templateColors} />
      </div>
      <div key="additional">
        <Additional resumeData={resumeData} templateColors={templateColors} />
      </div>
    </div>
  );
};

export default React.memo(DefaultTemplate);

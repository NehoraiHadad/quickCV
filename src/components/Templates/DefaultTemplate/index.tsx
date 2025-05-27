import React from "react";
import { DefaultTemplateProps, TemplateSections, SectionProps } from "./types"; // DefaultTemplateProps might become unused if resumeData is removed
// import { getTemplateColors } from "./styles"; // Removed as unused
import Header from "./Header";
import Experience from "./Experience";
import Projects from "./Projects";
import Skills from "./Skills";
import Education from "./Education";
import Additional from "./Additional";

// Define the section components
// Each component will receive resumeData and templateColors
const sections: TemplateSections = {
  header: (props: SectionProps) => <Header {...props} />,
  experience: (props: SectionProps) => <Experience {...props} />,
  projects: (props: SectionProps) => <Projects {...props} />,
  skills: (props: SectionProps) => <Skills {...props} />,
  education: (props: SectionProps) => <Education {...props} />,
  additional: (props: SectionProps) => <Additional {...props} />,
};

// Function to get all sections
const getSections = () => sections; // Removed direct export

// The DefaultTemplate component might be simplified or changed later.
// For now, it can remain, or be a simple wrapper if needed.
// Or, it could be removed if TemplateDisplay will use getSections() directly.
// Let's keep it simple for now:
const DefaultTemplate: React.FC<DefaultTemplateProps> = (/* { resumeData } */) => { // resumeData removed
  // const templateColors = getTemplateColors(resumeData.colors); // resumeData is no longer available here
  // This component might not render anything directly anymore,
  // or it could render a default layout if needed for other purposes.
  // For this subtask, focus on making sections available via getSections.
  // We will decide how/if to use this component in the next step when we update TemplateDisplay.
  // For now, let's have it return a placeholder or null.
  return null; 
};

export { getSections }; // Added export statement at the end
export default React.memo(DefaultTemplate);

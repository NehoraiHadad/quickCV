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

// The 'sections' object is defined above.
// We will attach it as a static property to DefaultTemplate component.

// Define an interface for the component that includes the static 'sections' property
interface DefaultTemplateComponent extends React.FC<DefaultTemplateProps> {
  sections: TemplateSections;
}

// The DefaultTemplate component might be simplified or changed later.
// For now, it can remain, or be a simple wrapper if needed.
// Or, it could be removed if TemplateDisplay will use getSections() directly.
// Let's keep it simple for now:
const DefaultTemplate: DefaultTemplateComponent = (/* { resumeData } */) => { // resumeData removed, type changed
  // const templateColors = getTemplateColors(resumeData.colors); // resumeData is no longer available here
  // This component might not render anything directly anymore,
  // or it could render a default layout if needed for other purposes.
  // For this subtask, focus on making sections available via getSections.
  // We will decide how/if to use this component in the next step when we update TemplateDisplay.
  // For now, let's have it return a placeholder or null.
  return null; 
};

// Attach sections as a static property to the DefaultTemplate component
DefaultTemplate.sections = sections; // Removed 'as any' cast

// Cast the memoized component to DefaultTemplateComponent to ensure type correctness for static properties
const MemoizedDefaultTemplate = React.memo(DefaultTemplate) as unknown as DefaultTemplateComponent;

export default MemoizedDefaultTemplate;

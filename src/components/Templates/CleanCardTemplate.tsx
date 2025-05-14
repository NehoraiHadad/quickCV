import React from "react";
import { ResumeData } from "@/types/resume";
import CleanCardTemplateComponent from "./CleanCardTemplate/index";

interface CleanCardTemplateWrapperProps {
  resumeData: ResumeData;
}

// This is a wrapper component to maintain backward compatibility
// Eventually, all imports can be updated to use the new modular component directly
const CleanCardTemplateWrapper: React.FC<CleanCardTemplateWrapperProps> = ({ resumeData }) => {
  return <CleanCardTemplateComponent resumeData={resumeData} />;
};

export default CleanCardTemplateWrapper;

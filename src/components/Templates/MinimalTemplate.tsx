import React from "react";
import { ResumeData } from "@/types/resume";
import MinimalTemplateComponent from "./MinimalTemplate/index";

interface MinimalTemplateWrapperProps {
  resumeData: ResumeData;
}

// This is a wrapper component to maintain backward compatibility
// Eventually, all imports can be updated to use the new modular component directly
const MinimalTemplateWrapper: React.FC<MinimalTemplateWrapperProps> = ({ resumeData }) => {
  return <MinimalTemplateComponent resumeData={resumeData} />;
};

export default MinimalTemplateWrapper; 
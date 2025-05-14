import React from "react";
import { PersonalInfoProvider } from "../../../context/PersonalInfoContext";
import { WorkExperienceProvider } from "../../../context/WorkExperienceContext";
import { EducationProvider } from "../../../context/EducationContext";
import { SkillsProvider } from "../../../context/SkillsContext";
import { ProjectsProvider } from "../../../context/ProjectsContext";
import { AdditionalSectionsProvider } from "../../../context/AdditionalSectionsContext";
import { TemplateProvider } from "../../../context/TemplateContext";
import { ResumeDataWithColors } from "../../../types/TemplatePreview";

interface ContextProvidersProps {
  resumeData: ResumeDataWithColors;
  children: React.ReactNode;
}

/**
 * Wraps template preview with all necessary context providers
 */
const ContextProviders: React.FC<ContextProvidersProps> = ({ resumeData, children }) => {
  return (
    <PersonalInfoProvider initialData={resumeData.personalInfo}>
      <WorkExperienceProvider initialData={resumeData.workExperience}>
        <EducationProvider initialData={resumeData.education}>
          <SkillsProvider initialData={resumeData.skills}>
            <ProjectsProvider initialData={resumeData.projects}>
              <AdditionalSectionsProvider initialData={resumeData.additionalSections}>
                <TemplateProvider 
                  initialTemplate={resumeData.selectedTemplate}
                  initialColors={resumeData.colors}
                >
                  {children}
                </TemplateProvider>
              </AdditionalSectionsProvider>
            </ProjectsProvider>
          </SkillsProvider>
        </EducationProvider>
      </WorkExperienceProvider>
    </PersonalInfoProvider>
  );
};

export default ContextProviders; 
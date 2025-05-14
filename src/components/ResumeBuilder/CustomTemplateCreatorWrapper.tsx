import React from "react";
import { PersonalInfoProvider } from "../../context/PersonalInfoContext";
import { WorkExperienceProvider } from "../../context/WorkExperienceContext";
import { EducationProvider } from "../../context/EducationContext";
import { SkillsProvider } from "../../context/SkillsContext";
import { ProjectsProvider } from "../../context/ProjectsContext";
import { AdditionalSectionsProvider } from "../../context/AdditionalSectionsContext";
import { TemplateProvider } from "../../context/TemplateContext";
import CustomTemplateCreator from "./CustomTemplateCreator";
import { CustomTemplate } from "../../types/templates";

interface CustomTemplateCreatorWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreate: (template: CustomTemplate) => Promise<void>;
  editingTemplate?: CustomTemplate | null;
}

/**
 * Wrapper component that provides all necessary context providers for CustomTemplateCreator
 */
const CustomTemplateCreatorWrapper: React.FC<CustomTemplateCreatorWrapperProps> = (props) => {
  return (
    <PersonalInfoProvider>
      <WorkExperienceProvider>
        <EducationProvider>
          <SkillsProvider>
            <ProjectsProvider>
              <AdditionalSectionsProvider>
                <TemplateProvider>
                  <CustomTemplateCreator {...props} />
                </TemplateProvider>
              </AdditionalSectionsProvider>
            </ProjectsProvider>
          </SkillsProvider>
        </EducationProvider>
      </WorkExperienceProvider>
    </PersonalInfoProvider>
  );
};

export default CustomTemplateCreatorWrapper; 
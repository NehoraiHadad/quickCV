import React from "react";
import { useResume } from "@/context/ResumeContext";
import TextImprovement from "@/components/AIFeatures/TextImprovement";
import { FormInput, FormTextarea, ResumeSection, Card } from "@/components/ui";

// Fields that don't need AI improvement
const excludedFields = ["name", "email", "phone", "location"];

export default function PersonalInfo() {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  const shouldShowAI = (key: string) => {
    return !excludedFields.includes(key);
  };

  return (
    <ResumeSection title="Personal Information">
      <Card>
        <div className="space-y-4">
          {Object.entries(personalInfo).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              {key === "summary" ? (
                <FormTextarea
                  id={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  onChange={(e) => updatePersonalInfo({ [key]: e.target.value })}
                  rows={4}
                  rightIcon={
                    shouldShowAI(key) ? (
                      <TextImprovement
                        initialText={value}
                        field={`personal info ${key}`}
                        onImprove={(improvedText) => updatePersonalInfo({ [key]: improvedText })}
                      />
                    ) : undefined
                  }
                />
              ) : (
                <FormInput
                  id={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  onChange={(e) => updatePersonalInfo({ [key]: e.target.value })}
                  rightIcon={
                    shouldShowAI(key) ? (
                      <TextImprovement
                        initialText={value}
                        field={`personal info ${key}`}
                        onImprove={(improvedText) => updatePersonalInfo({ [key]: improvedText })}
                      />
                    ) : undefined
                  }
                />
              )}
            </div>
          ))}
        </div>
      </Card>
    </ResumeSection>
  );
}

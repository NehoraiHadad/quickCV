import React from "react";
import { useResume } from "@/context/ResumeContext";
import { AdditionalSection } from "@/types/resume";
import TextImprovement from "@/components/AIFeatures/TextImprovement";
import { 
  FormInput, 
  FormTextarea, 
  ResumeSection, 
  ResumeItemCard, 
  SectionActions 
} from "@/components/ui";

export default function AdditionalSections() {
  const {
    resumeData,
    addAdditionalSection,
    updateAdditionalSection,
    removeAdditionalSection,
  } = useResume();
  const { additionalSections } = resumeData;

  const addSection = () => {
    addAdditionalSection({
      title: "",
      content: "",
    });
  };

  const updateSection = (
    id: string,
    field: keyof AdditionalSection,
    value: string
  ) => {
    updateAdditionalSection(id, { [field]: value });
  };

  return (
    <ResumeSection 
      title="Additional Sections"
      actions={
        <SectionActions
          onAdd={addSection}
          addLabel="Add Section"
          showEdit={false}
          showDelete={false}
          showMove={false}
        />
      }
    >
      {additionalSections.map((section) => (
        <ResumeItemCard
          key={section.id}
          title={section.title || "New Section"}
          actions={
            <SectionActions
              onDelete={() => removeAdditionalSection(section.id)}
              showAdd={false}
              showEdit={false}
              deleteLabel="Remove Section"
              showMove={false}
            />
          }
        >
          <div className="space-y-4">
            <FormInput
              id={`title-${section.id}`}
              label="Section Title"
              value={section.title}
              onChange={(e) => updateSection(section.id, "title", e.target.value)}
              placeholder="Section Title"
              rightIcon={
                <TextImprovement
                  initialText={section.title}
                  field="additional section title"
                  onImprove={(improvedText) => updateSection(section.id, "title", improvedText)}
                />
              }
            />
            
            <FormTextarea
              id={`content-${section.id}`}
              label="Section Content"
              value={section.content}
              onChange={(e) => updateSection(section.id, "content", e.target.value)}
              placeholder="Section Content"
              rows={4}
              rightIcon={
                <TextImprovement
                  initialText={section.content}
                  field="additional section content"
                  onImprove={(improvedText) => updateSection(section.id, "content", improvedText)}
                />
              }
            />
          </div>
        </ResumeItemCard>
      ))}
    </ResumeSection>
  );
}

import React from "react";
import { useResume } from "@/context/ResumeContext";
import TextImprovement from "@/components/AIFeatures/TextImprovement";
import { 
  FormInput, 
  FormTextarea, 
  ResumeSection, 
  ResumeItemCard,
  SectionActions 
} from "@/components/ui";

export default function WorkExperience() {
  const {
    resumeData,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
  } = useResume();
  const { workExperience } = resumeData;

  const addExperience = () => {
    addWorkExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  return (
    <ResumeSection 
      title="Work Experience" 
      actions={
        <SectionActions
          onAdd={addExperience}
          addLabel="Add Experience"
          showEdit={false}
          showDelete={false}
          showMove={false}
        />
      }
    >
      {workExperience.map((exp) => (
        <ResumeItemCard
          key={exp.id}
          title={exp.company}
          subtitle={exp.position}
          dateRange={exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : undefined}
          actions={
            <SectionActions
              onDelete={() => removeWorkExperience(exp.id)}
              showAdd={false}
              showEdit={false}
              deleteLabel="Remove Experience"
              showMove={false}
            />
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id={`company-${exp.id}`}
                label="Company Name"
                value={exp.company}
                onChange={(e) =>
                  updateWorkExperience(exp.id, { company: e.target.value })
                }
                rightIcon={
                  <TextImprovement
                    initialText={exp.company}
                    field="company name"
                    onImprove={(improvedText) => updateWorkExperience(exp.id, { company: improvedText })}
                  />
                }
              />
              <FormInput
                id={`position-${exp.id}`}
                label="Position"
                value={exp.position}
                onChange={(e) =>
                  updateWorkExperience(exp.id, { position: e.target.value })
                }
                rightIcon={
                  <TextImprovement
                    initialText={exp.position}
                    field="work experience position"
                    onImprove={(improvedText) => updateWorkExperience(exp.id, { position: improvedText })}
                  />
                }
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id={`startDate-${exp.id}`}
                label="Start Date"
                value={exp.startDate}
                onChange={(e) =>
                  updateWorkExperience(exp.id, { startDate: e.target.value })
                }
              />
              <FormInput
                id={`endDate-${exp.id}`}
                label="End Date"
                value={exp.endDate}
                onChange={(e) =>
                  updateWorkExperience(exp.id, { endDate: e.target.value })
                }
              />
            </div>
            
            <FormTextarea
              id={`description-${exp.id}`}
              label="Description"
              value={exp.description}
              onChange={(e) =>
                updateWorkExperience(exp.id, { description: e.target.value })
              }
              rows={4}
              rightIcon={
                <TextImprovement
                  initialText={exp.description}
                  field="work experience description"
                  onImprove={(improvedText) => updateWorkExperience(exp.id, { description: improvedText })}
                />
              }
            />
          </div>
        </ResumeItemCard>
      ))}
    </ResumeSection>
  );
}

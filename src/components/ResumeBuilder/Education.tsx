import { useResume } from "@/context/ResumeContext";
import TextImprovement from "@/components/AIFeatures/TextImprovement";
import type { Education } from "@/types/resume";
import { 
  FormInput, 
  FormTextarea, 
  ResumeSection, 
  ResumeItemCard, 
  SectionActions 
} from "@/components/ui";

export default function Education() {
  const { resumeData, addEducation, updateEducation, removeEducation } =
    useResume();
  const { education } = resumeData;

  const addEducationItem = () => {
    addEducation({
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  return (
    <ResumeSection 
      title="Education"
      actions={
        <SectionActions
          onAdd={addEducationItem}
          addLabel="Add Education"
          showEdit={false}
          showDelete={false}
          showMove={false}
        />
      }
    >
      {education.map((edu) => (
        <ResumeItemCard
          key={edu.id}
          title={edu.institution}
          subtitle={`${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`}
          dateRange={edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : undefined}
          actions={
            <SectionActions
              onDelete={() => removeEducation(edu.id)}
              showAdd={false}
              showEdit={false}
              deleteLabel="Remove Education"
              showMove={false}
            />
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id={`institution-${edu.id}`}
                label="Institution"
                value={edu.institution}
                onChange={(e) =>
                  updateEducation(edu.id, { institution: e.target.value })
                }
                rightIcon={
                  <TextImprovement
                    initialText={edu.institution}
                    field="education institution"
                    onImprove={(improvedText) => updateEducation(edu.id, { institution: improvedText })}
                  />
                }
              />
              <FormInput
                id={`degree-${edu.id}`}
                label="Degree"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, { degree: e.target.value })
                }
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id={`fieldOfStudy-${edu.id}`}
                label="Field of Study"
                value={edu.fieldOfStudy}
                onChange={(e) =>
                  updateEducation(edu.id, { fieldOfStudy: e.target.value })
                }
                rightIcon={
                  <TextImprovement
                    initialText={edu.fieldOfStudy}
                    field="education field of study"
                    onImprove={(improvedText) => updateEducation(edu.id, { fieldOfStudy: improvedText })}
                  />
                }
              />
              <FormInput
                id={`startDate-${edu.id}`}
                label="Start Date"
                value={edu.startDate}
                onChange={(e) =>
                  updateEducation(edu.id, { startDate: e.target.value })
                }
              />
            </div>
            
            <FormInput
              id={`endDate-${edu.id}`}
              label="End Date"
              value={edu.endDate}
              onChange={(e) =>
                updateEducation(edu.id, { endDate: e.target.value })
              }
            />
            
            <FormTextarea
              id={`description-${edu.id}`}
              label="Description"
              value={edu.description}
              onChange={(e) =>
                updateEducation(edu.id, { description: e.target.value })
              }
              rows={4}
              rightIcon={
                <TextImprovement
                  initialText={edu.description}
                  field="education description"
                  onImprove={(improvedText) => updateEducation(edu.id, { description: improvedText })}
                />
              }
            />
          </div>
        </ResumeItemCard>
      ))}
    </ResumeSection>
  );
}

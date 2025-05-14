import React from "react";
import { useResume } from "@/context/ResumeContext";
import TextImprovement from "@/components/AIFeatures/TextImprovement";
import { Project } from "@/types/resume";
import { 
  FormInput, 
  FormTextarea, 
  ResumeSection, 
  ResumeItemCard, 
  SectionActions 
} from "@/components/ui";

export default function Projects() {
  const { resumeData, addProject, updateProject, removeProject } = useResume();
  const { projects } = resumeData;

  const addNewProject = () => {
    addProject({
      name: "",
      description: "",
      technologies: "",
      link: "",
      github: "",
    });
  };

  const updateProjectItem = (
    id: string,
    field: keyof Project,
    value: string
  ) => {
    updateProject(id, { [field]: value });
  };

  return (
    <ResumeSection 
      title="Projects"
      actions={
        <SectionActions
          onAdd={addNewProject}
          addLabel="Add Project"
          showEdit={false}
          showDelete={false}
          showMove={false}
        />
      }
    >
      {projects.map((proj) => (
        <ResumeItemCard
          key={proj.id}
          title={proj.name}
          description={proj.description ? proj.description.substring(0, 50) + (proj.description.length > 50 ? '...' : '') : undefined}
          actions={
            <SectionActions
              onDelete={() => removeProject(proj.id)}
              showAdd={false}
              showEdit={false}
              deleteLabel="Remove Project"
              showMove={false}
            />
          }
        >
          <div className="space-y-4">
            <FormInput
              id={`name-${proj.id}`}
              label="Project Name"
              value={proj.name}
              onChange={(e) => updateProjectItem(proj.id, "name", e.target.value)}
              placeholder="Project Name"
              rightIcon={
                <TextImprovement
                  initialText={proj.name}
                  field="project name"
                  onImprove={(improvedText) => updateProjectItem(proj.id, "name", improvedText)}
                />
              }
            />
            
            <FormTextarea
              id={`description-${proj.id}`}
              label="Description"
              value={proj.description}
              onChange={(e) => updateProjectItem(proj.id, "description", e.target.value)}
              placeholder="Description"
              rows={3}
              rightIcon={
                <TextImprovement
                  initialText={proj.description}
                  field="project description"
                  onImprove={(improvedText) => updateProjectItem(proj.id, "description", improvedText)}
                />
              }
            />
            
            <FormInput
              id={`technologies-${proj.id}`}
              label="Technologies Used"
              value={proj.technologies || ""}
              onChange={(e) => updateProjectItem(proj.id, "technologies", e.target.value)}
              placeholder="Technologies Used"
              rightIcon={
                <TextImprovement
                  initialText={proj.technologies || ""}
                  field="project technologies"
                  onImprove={(improvedText) => updateProjectItem(proj.id, "technologies", improvedText)}
                />
              }
            />
            
            <FormInput
              id={`link-${proj.id}`}
              label="Project Link"
              value={proj.link || ""}
              onChange={(e) => updateProjectItem(proj.id, "link", e.target.value)}
              placeholder="Project Link"
              type="url"
            />
            
            <FormInput
              id={`github-${proj.id}`}
              label="GitHub Repository"
              value={proj.github || ""}
              onChange={(e) => updateProjectItem(proj.id, "github", e.target.value)}
              placeholder="GitHub Repository"
              type="url"
            />
          </div>
        </ResumeItemCard>
      ))}
    </ResumeSection>
  );
}

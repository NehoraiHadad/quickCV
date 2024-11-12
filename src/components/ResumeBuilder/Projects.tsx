import React from "react";
import { useResume } from "@/context/ResumeContext";
import TextImprovement from "@/components/AIFeatures/TextImprovement";
import { Project } from "@/types/resume";

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
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Projects</h2>
      {projects.map((proj) => (
        <div key={proj.id} className="border p-4 rounded-md shadow-md bg-white">
          <input
            type="text"
            placeholder="Project Name"
            value={proj.name}
            onChange={(e) => updateProjectItem(proj.id, "name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <TextImprovement
            initialText={proj.name}
            field="project name"
            onImprove={(improvedText) => updateProjectItem(proj.id, "name", improvedText)}
          />
          <textarea
            placeholder="Description"
            value={proj.description}
            onChange={(e) =>
              updateProjectItem(proj.id, "description", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-2"
            rows={3}
          />
          <TextImprovement
            initialText={proj.description}
            field="project description"
            onImprove={(improvedText) => updateProjectItem(proj.id, "description", improvedText)}
          />
          <input
            type="text"
            placeholder="Technologies Used"
            value={proj.technologies}
            onChange={(e) =>
              updateProjectItem(proj.id, "technologies", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-2"
          />
          <TextImprovement
            initialText={proj.technologies}
            field="project technologies"
            onImprove={(improvedText) => updateProjectItem(proj.id, "technologies", improvedText)}
          />
          <input
            type="url"
            placeholder="Project Link"
            value={proj.link}
            onChange={(e) => updateProjectItem(proj.id, "link", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-2"
          />
          <input
            type="url"
            placeholder="GitHub Repository"
            value={proj.github}
            onChange={(e) => updateProjectItem(proj.id, "github", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-2"
          />
          <button
            onClick={() => removeProject(proj.id)}
            className="mt-4 text-red-600 hover:text-red-800 transition-colors duration-300"
          >
            Remove Project
          </button>
        </div>
      ))}
      <button
        onClick={addNewProject}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300"
      >
        Add Project
      </button>
    </div>
  );
}

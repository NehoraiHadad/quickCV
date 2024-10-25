import React from "react";
import { useResume } from "@/context/ResumeContext";
import TextImprovement from "@/components/AIFeatures/TextImprovement";

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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">
        Work Experience
      </h2>
      {workExperience.map((exp) => (
        <div key={exp.id} className="border p-4 rounded-md shadow-md bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={`company-${exp.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name
              </label>
              <input
                type="text"
                id={`company-${exp.id}`}
                value={exp.company}
                onChange={(e) =>
                  updateWorkExperience(exp.id, { company: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <TextImprovement
                initialText={exp.company}
                field="company name"
                onImprove={(improvedText) => updateWorkExperience(exp.id, { company: improvedText })}
              />
            </div>
            <div>
              <label
                htmlFor={`position-${exp.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Position
              </label>
              <input
                type="text"
                id={`position-${exp.id}`}
                value={exp.position}
                onChange={(e) =>
                  updateWorkExperience(exp.id, { position: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <TextImprovement
                initialText={exp.position}
                field="work experience position"
                onImprove={(improvedText) => updateWorkExperience(exp.id, { position: improvedText })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label
                htmlFor={`startDate-${exp.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                type="text"
                id={`startDate-${exp.id}`}
                value={exp.startDate}
                onChange={(e) =>
                  updateWorkExperience(exp.id, { startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor={`endDate-${exp.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Date
              </label>
              <input
                type="text"
                id={`endDate-${exp.id}`}
                value={exp.endDate}
                onChange={(e) =>
                  updateWorkExperience(exp.id, { endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor={`description-${exp.id}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id={`description-${exp.id}`}
              value={exp.description}
              onChange={(e) =>
                updateWorkExperience(exp.id, { description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
            <TextImprovement
              initialText={exp.description}
              field="work experience description"
              onImprove={(improvedText) => updateWorkExperience(exp.id, { description: improvedText })}
            />
          </div>
          <button
            onClick={() => removeWorkExperience(exp.id)}
            className="mt-4 text-red-600 hover:text-red-800 transition-colors duration-300"
          >
            Remove Experience
          </button>
        </div>
      ))}
      <button
        onClick={addExperience}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300"
      >
        Add Experience
      </button>
    </div>
  );
}
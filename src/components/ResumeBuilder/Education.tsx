import { useResume } from "@/context/ResumeContext";
import TextImprovement from "@/components/AIFeatures/TextImprovement";
import type { Education } from "@/types/resume";

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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Education</h2>
      {education.map((edu) => (
        <div key={edu.id} className="border p-4 rounded-md shadow-md bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={`institution-${edu.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Institution
              </label>
              <input
                type="text"
                id={`institution-${edu.id}`}
                value={edu.institution}
                onChange={(e) =>
                  updateEducation(edu.id, { institution: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <TextImprovement
                initialText={edu.institution}
                field="education institution"
                onImprove={(improvedText) => updateEducation(edu.id, { institution: improvedText })}
              />
            </div>
            <div>
              <label
                htmlFor={`degree-${edu.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Degree
              </label>
              <input
                type="text"
                id={`degree-${edu.id}`}
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, { degree: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label
                htmlFor={`fieldOfStudy-${edu.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Field of Study
              </label>
              <input
                type="text"
                id={`fieldOfStudy-${edu.id}`}
                value={edu.fieldOfStudy}
                onChange={(e) =>
                  updateEducation(edu.id, { fieldOfStudy: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <TextImprovement
                initialText={edu.fieldOfStudy}
                field="education field of study"
                onImprove={(improvedText) => updateEducation(edu.id, { fieldOfStudy: improvedText })}
              />
            </div>
            <div>
              <label
                htmlFor={`startDate-${edu.id}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Date
              </label>
              <input
                type="text"
                id={`startDate-${edu.id}`}
                value={edu.startDate}
                onChange={(e) =>
                  updateEducation(edu.id, { startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor={`endDate-${edu.id}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Date
            </label>
            <input
              type="text"
              id={`endDate-${edu.id}`}
              value={edu.endDate}
              onChange={(e) =>
                updateEducation(edu.id, { endDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor={`description-${edu.id}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id={`description-${edu.id}`}
              value={edu.description}
              onChange={(e) =>
                updateEducation(edu.id, { description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
            <TextImprovement
              initialText={edu.description}
              field="education description"
              onImprove={(improvedText) => updateEducation(edu.id, { description: improvedText })}
            />
          </div>
          <button
            onClick={() => removeEducation(edu.id)}
            className="mt-4 text-red-600 hover:text-red-800 transition-colors duration-300"
          >
            Remove Education
          </button>
        </div>
      ))}
      <button
        onClick={addEducationItem}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300"
      >
        Add Education
      </button>
    </div>
  );
}

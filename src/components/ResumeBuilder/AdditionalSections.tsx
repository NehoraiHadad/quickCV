import React from "react";
import { useResume } from "@/context/ResumeContext";
import { AdditionalSection } from "@/types/resume";
import TextImprovement from "@/components/AIFeatures/TextImprovement";

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
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">
        Additional Sections
      </h2>
      {additionalSections.map((section) => (
        <div
          key={section.id}
          className="border p-4 rounded-md shadow-md bg-white"
        >
          <input
            type="text"
            placeholder="Section Title"
            value={section.title}
            onChange={(e) => updateSection(section.id, "title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <TextImprovement
            initialText={section.title}
            field="additional section title"
            onImprove={(improvedText) => updateSection(section.id, "title", improvedText)}
          />
          <textarea
            placeholder="Section Content"
            value={section.content}
            onChange={(e) =>
              updateSection(section.id, "content", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mt-2"
            rows={4}
          />
          <TextImprovement
            initialText={section.content}
            field="additional section content"
            onImprove={(improvedText) => updateSection(section.id, "content", improvedText)}
          />
          <button
            onClick={() => removeAdditionalSection(section.id)}
            className="mt-4 text-red-600 hover:text-red-800 transition-colors duration-300"
          >
            Remove Section
          </button>
        </div>
      ))}
      <button
        onClick={addSection}
        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300"
      >
        Add Section
      </button>
    </div>
  );
}

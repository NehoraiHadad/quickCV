import React from "react";
import { useResume } from "@/context/ResumeContext";
import TextImprovement from "@/components/AIFeatures/TextImprovement";

export default function PersonalInfo() {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updatePersonalInfo({ [name]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">
        Personal Information
      </h2>
      {Object.entries(personalInfo).map(([key, value]) => (
        <div key={key} className="flex flex-col">
          <label
            htmlFor={key}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          {key === "summary" ? (
            <textarea
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <input
              type="text"
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          )}
          {key !== "name" &&
          key !== "email" &&
          key !== "phone" &&
          key !== "location" && (
            <TextImprovement
              initialText={value}
              field={`personal info ${key}`}
              onImprove={(improvedText) => updatePersonalInfo({ [key]: improvedText })}
            />
          )}
        </div>
      ))}
    </div>
  );
}

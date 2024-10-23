import { useResume } from "@/context/ResumeContext";
import { useState } from "react";
import TextImprovement from "../AIFeatures/TextImprovement";

export default function Skills() {
  const { resumeData, addSkill, removeSkill } = useResume();
  const { skills } = resumeData;
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      addSkill(newSkill.trim());
      setNewSkill("");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Skills</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Enter a skill"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleAddSkill}
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          Add
        </button>
      </div>
      <div className="top-[-1rem] right-16 relative ">
        <TextImprovement
          initialText={newSkill}
          field="skill"
          onImprove={setNewSkill}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
          >
            <span>{skill}</span>
            <button
              onClick={() => removeSkill(skill)}
              className="ml-2 text-red-500 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import { SectionProps } from "./types";
import { Skill } from "@/types/resume";

const Skills: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { skills } = resumeData;

  if (skills.length === 0) {
    return null;
  }

  // Helper function to get skill name
  const getSkillName = (skill: string | Skill): string => {
    if (typeof skill === 'string') {
      return skill;
    }
    return skill.name;
  };

  return (
    <section className="mb-6">
      <h2 
        className="text-xl font-semibold mb-3"
        style={{ color: templateColors.primary }}
      >
        Skills
      </h2>
      <div className="flex flex-wrap gap-y-1.5">
        {skills.map((skill, index) => (
          <div key={typeof skill === 'string' ? `skill-${index}` : skill.id || `skill-${index}`} className="w-full">
            <p className="text-sm text-gray-700">• {getSkillName(skill)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills; 
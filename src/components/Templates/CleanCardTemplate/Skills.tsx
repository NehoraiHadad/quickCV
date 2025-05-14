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
    <section
      className="mb-8 p-4 rounded-lg shadow-sm"
      style={{ backgroundColor: `${templateColors.accent}10` }}
    >
      <h2
        className="text-2xl font-semibold mb-3"
        style={{ color: templateColors.primary }}
      >
        Skills
      </h2>
      <div className="flex flex-wrap">
        {skills.map((skill, index) => (
          <span
            key={typeof skill === 'string' ? `skill-${index}` : skill.id || `skill-${index}`}
            className="px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
            style={{
              backgroundColor: `${templateColors.primary}20`,
              color: templateColors.primary,
            }}
          >
            {getSkillName(skill)}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Skills; 
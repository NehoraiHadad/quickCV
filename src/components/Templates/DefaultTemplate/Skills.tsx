import React from "react";
import { SectionProps } from "./types";
import { Skill as SkillType } from "@/types/resume"; // Assuming Skill type is available

const isEffectivelyEmpty = (str: string | null | undefined): boolean => !str || str.trim() === '';

// Helper function to get skill name (adapting existing one)
const getSkillName = (skill: string | SkillType): string => {
  if (typeof skill === 'string') {
    return skill;
  }
  // Ensure skill.name exists, default to empty string if not, 
  // though SkillType should ideally guarantee 'name' if it's an object.
  return skill.name || ''; 
};

const isSkillItemEffectivelyEmpty = (skill: string | SkillType): boolean => {
  const skillName = getSkillName(skill);
  return isEffectivelyEmpty(skillName);
};

const Skills: React.FC<SectionProps> = ({ resumeData, templateColors }) => {
  const { skills } = resumeData;

  const sectionIsEffectivelyEmpty =
    !skills ||
    skills.length === 0 ||
    skills.every(isSkillItemEffectivelyEmpty);

  if (sectionIsEffectivelyEmpty) {
    return (
      <section className="mb-6">
        <h2
          className="text-2xl font-semibold text-gray-800 mb-3"
          style={{ color: templateColors.primary }}
        >
          Skills
        </h2>
        <div className="p-4 bg-gray-50 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
          <p className="text-sm text-gray-500 italic">
            List your skills here. For example: JavaScript, React, Node.js.
          </p>
        </div>
      </section>
    );
  }

  const visibleSkills = skills.filter(skill => !isSkillItemEffectivelyEmpty(skill));

  // Fallback if all items were empty
  if (visibleSkills.length === 0) {
      return (
        <section className="mb-6">
          <h2
            className="text-2xl font-semibold text-gray-800 mb-3"
            style={{ color: templateColors.primary }}
          >
            Skills
          </h2>
          <div className="p-4 bg-gray-50 rounded-lg" style={{ backgroundColor: `${templateColors.accent}10` }}>
            <p className="text-sm text-gray-500 italic">
              List your skills here. For example: JavaScript, React, Node.js.
            </p>
          </div>
        </section>
      );
  }
  
  return (
    <section className="mb-6">
      <h2
        className="text-2xl font-semibold text-gray-800 mb-3"
        style={{ color: templateColors.primary }}
      >
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {visibleSkills.map((skill, index) => (
          <span
            key={typeof skill === 'string' ? `skill-${index}` : (skill as SkillType).id || `skill-obj-${index}`}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ 
              backgroundColor: `${templateColors.primary}20`, 
              color: templateColors.primary 
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

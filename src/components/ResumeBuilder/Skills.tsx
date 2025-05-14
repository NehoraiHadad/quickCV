import { useResume } from "@/context/ResumeContext";
import { useState } from "react";
import TextImprovement from "../AIFeatures/TextImprovement";
import { 
  FormInput, 
  ResumeSection, 
  Button 
} from "@/components/ui";
import { Skill } from "@/types/resume";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSkill(e.target.value);
    
    // Handle Enter key press
    if (e.target.value && e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key === 'Enter') {
      handleAddSkill();
    }
  };

  // Function to get the skill name regardless of skill type
  const getSkillName = (skill: string | Skill): string => {
    if (typeof skill === 'string') {
      return skill;
    }
    return skill.name;
  };

  return (
    <ResumeSection title="Skills">
      <div className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-grow">
            <FormInput
              id="new-skill"
              label=""
              value={newSkill}
              onChange={handleInputChange}
              placeholder="Enter a skill"
              rightIcon={
                <TextImprovement
                  initialText={newSkill}
                  field="skill"
                  onImprove={setNewSkill}
                />
              }
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleAddSkill}
              variant="primary"
              size="md"
            >
              Add
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {skills.map((skill, index) => {
            const skillName = getSkillName(skill);
            return (
              <div
                key={typeof skill === 'string' ? `skill-${index}` : skill.id || `skill-${index}`}
                className="bg-gray-200 px-3 py-1 rounded-full flex items-center"
              >
                <span>{skillName}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-red-500 font-bold"
                  aria-label={`Remove ${skillName}`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ResumeSection>
  );
}

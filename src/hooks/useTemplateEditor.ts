import { useState, useEffect, useMemo } from "react";
import { TemplatePreferences, GridConfiguration, CustomTemplate as CustomTemplateType } from "../types/templates"; 
import { AITemplateGenerator } from "../components/AIFeatures/AITemplateGenerator";
import { cleanGeneratedCode } from "../utils/template/formatter";
import { ResumeDataWithColors } from "../types/TemplatePreview";

interface Skill {
  id?: string;
  name?: string;
  level?: string;
}

interface UseTemplateEditorProps {
  apiKey?: string;
  service?: string; 
  currentModel?: string;
  resumeData: ResumeDataWithColors;
  editingTemplate?: CustomTemplateType | null;
  onTemplateCreate: (template: CustomTemplateType) => Promise<void>;
}

export const getDefaultPreferences = (): TemplatePreferences => ({
  name: "", 
  layout: "single-column",
  headerStyle: {
    position: "top",
    alignment: "left",
    size: "medium",
  },
  sectionOrder: ["personal", "experience", "education", "skills", "projects"],
  colorScheme: {
    primary: "#000000",
    secondary: "#666666",
    accent: "#0066cc",
    background: "#ffffff",
  },
  visualElements: {
    useDividers: true,
    useIcons: false,
    borderStyle: "solid",
    useShapes: false,
  },
  spacing: "balanced",
  customCSS: "", 
  freeformDescription: "", 
  gridConfiguration: { 
    columns: 1,
  },
});

interface EducationData { // Local type for formatting consistency if needed
  id: string;
  institution: string;
  degree: string;
  field?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate: string;
  description: string;
}

function useTemplateEditor({
  apiKey,
  service,
  currentModel,
  resumeData,
  editingTemplate,
  onTemplateCreate
}: UseTemplateEditorProps) {
  const [activeTab, setActiveTab] = useState<"generate" | "code">("generate");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [preferences, setPreferences] = useState<TemplatePreferences>(
    editingTemplate?.preferences ? { ...getDefaultPreferences(), ...editingTemplate.preferences } : getDefaultPreferences()
  );
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeViewMode, setCodeViewMode] = useState<"split" | "preview" | "edit">("split");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const previewData = useMemo(() => {
    const defaultWorkExperience = [
      { id: "default-work-1", company: "Tech Company", position: "Senior Developer", startDate: "2020-01", endDate: "Present", description: "Led development of key features."      },
      { id: "default-work-2", company: "Another Tech Co", position: "Junior Developer", startDate: "2018-03", endDate: "2019-12", description: "Worked on frontend applications."      }
    ];
    const defaultEducationData = [ 
      { id: "default-edu-1", institution: "University", degree: "Bachelor of Science", field: "Computer Science", fieldOfStudy: "Computer Science", startDate: "2014-09", endDate: "2018-05", description: "Graduated with honors."      }
    ];
    const formatSkills = (skills: Array<string | Skill> = []) => skills.map((skill, index) => typeof skill === 'string' ? { id: `skill-${index}`, name: skill } : { id: String(skill.id || `skill-${index}`), name: String(skill.name || ''), level: typeof skill.level === 'string' ? skill.level : 'Intermediate' });
    const defaultSkills = [ { id: "default-skill-1", name: "JavaScript", level: "Expert" }, { id: "default-skill-2", name: "React", level: "Advanced" }, { id: "default-skill-3", name: "CSS", level: "Intermediate" }];
    const defaultProjects = [ { id: "default-project-1", name: "Portfolio Website", description: "Personal portfolio showcasing work and skills.", url: "https://example.com" }];
    const formatEducation = (educationDataInput: Array<any> = []) => educationDataInput.map(edu => ({ ...edu, id: edu.id || String(Date.now() + Math.random()), fieldOfStudy: edu.fieldOfStudy || edu.field || "", }));
    
    return {
      ...resumeData,
      personalInfo: resumeData.personalInfo || { name: "John Doe", title: "Software Developer", email: "john@example.com", phone: "123-456-7890", location: "New York, NY", summary: "Experienced software developer with a passion for creating user-friendly applications." },
      workExperience: resumeData.workExperience?.length ? resumeData.workExperience : defaultWorkExperience,
      education: formatEducation(resumeData.education?.length ? resumeData.education : defaultEducationData),
      skills: formatSkills(resumeData.skills?.length ? resumeData.skills : defaultSkills),
      projects: resumeData.projects?.length ? resumeData.projects : defaultProjects,
      colors: resumeData.colors || { primary: "#3B82F6", secondary: "#1F2937", accent: "#10B981", background: "#FFFFFF" }
    };
  }, [resumeData]);

  useEffect(() => {
    if (editingTemplate) {
      setName(editingTemplate.name);
      setCode(editingTemplate.code);
      setPreferences(prev => ({ ...getDefaultPreferences(), ...editingTemplate.preferences }));
      setActiveTab("code");
    } else {
      resetState();
    }
  }, [editingTemplate]);

  const handleCreateTemplate = async (currentPrefs: TemplatePreferences) => {
    try {
      setIsLoading(true);
      setError(null);
      if (!apiKey || !service) throw new Error("API key and service are required");

      const result = await AITemplateGenerator(currentPrefs, apiKey, service, currentModel ?? undefined);
      let processedCode;
      try {
        let tmpCode = result.templateCode;
        if (tmpCode.includes('.map(') && (tmpCode.match(/\.map\s*\(\s*\(.*?\)\s*=>\s*React\.createElement/g) || []).length > (tmpCode.match(/key\s*:/g) || []).length) {
          tmpCode = "// IMPORTANT: Make sure all mapped items have key props. Example:\n" + "// workExperience.map((item, index) => React.createElement('div', { key: item.id || index }, ...))\n\n" + tmpCode;
        }
        processedCode = cleanGeneratedCode(tmpCode);
      } catch (error) {
        console.error("Error processing template code:", error);
        processedCode = cleanGeneratedCode(result.templateCode);
      }
      setCode(processedCode);
      setGeneratedCode(processedCode);
      if (!result.success) setError(result.error || "Failed to generate template. You can still edit the code manually.");
      else setError(null);
      setActiveTab("code");
      setCodeViewMode("split");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      if (!name.trim()) { setError("Template name is required"); return false; }
      if (!code.trim()) { setError("Template code is required"); return false; }
      const template: CustomTemplateType = {
        id: editingTemplate?.id || Date.now().toString(),
        name: name.trim(),
        code: code.trim(),
        preferences, 
        createdAt: editingTemplate?.createdAt || new Date(),
      };
      await onTemplateCreate(template);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template");
      return false;
    }
  };

  const resetState = () => {
    setName("");
    setCode("");
    setGeneratedCode("");
    setActiveTab("generate");
    setError(null);
    setPreferences(getDefaultPreferences());
    setShowAdvancedOptions(false);
  };

  const handleGenerateClick = async () => {
    await handleCreateTemplate(preferences); 
  };

  const handleFreeformChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreferences(prev => ({ ...prev, freeformDescription: e.target.value }));
  };
  
  const handleCustomCSSChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreferences(prev => ({ ...prev, customCSS: e.target.value }));
  };

  const handleGridColumnsChange = (columns: 1 | 2 | 3) => {
    setPreferences(prevPrefs => ({
      ...prevPrefs,
      gridConfiguration: {
        ...(prevPrefs.gridConfiguration || { columns: 1 }), 
        columns: columns,
      },
    }));
  };

  return {
    activeTab, setActiveTab, name, setName, code, setCode,
    preferences, setPreferences, generatedCode, isLoading, error,
    codeViewMode, setCodeViewMode, showAdvancedOptions, setShowAdvancedOptions,
    handleSaveTemplate, resetState, handleGenerateClick,
    handleFreeformChange, handleCustomCSSChange, handleGridColumnsChange,
    previewData
  };
}

export default useTemplateEditor;

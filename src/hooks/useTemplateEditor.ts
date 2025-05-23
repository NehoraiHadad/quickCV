import { useState, useEffect, useMemo } from "react";
import { TemplatePreferences } from "../types/templates";
import { AITemplateGenerator } from "../components/AIFeatures/AITemplateGenerator";
import { cleanGeneratedCode } from "../utils/template/formatter";
import { ResumeDataWithColors } from "../types/TemplatePreview";

// Define a specific skill type for better type safety
interface Skill {
  id?: string;
  name?: string;
  level?: string;
}

export interface CustomTemplate {
  id: string;
  name: string;
  code: string;
  preferences: TemplatePreferences;
  createdAt: Date;
}

interface UseTemplateEditorProps {
  apiKey?: string;
  service?: string; 
  currentModel?: string;
  resumeData: ResumeDataWithColors;
  editingTemplate?: CustomTemplate | null;
  onTemplateCreate: (template: CustomTemplate) => Promise<void>;
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
});

// Define a proper type for education items
interface EducationData {
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
  // State
  const [activeTab, setActiveTab] = useState<"generate" | "code">("generate");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [preferences, setPreferences] = useState<TemplatePreferences>(getDefaultPreferences());
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeViewMode, setCodeViewMode] = useState<"split" | "preview" | "edit">("split");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [freeformDescription, setFreeformDescription] = useState("");

  // Ensure we have default data for the preview
  const previewData = useMemo(() => {
    // Generate default data if not available
    const defaultWorkExperience = [
      {
        id: "default-work-1",
        company: "Tech Company",
        position: "Senior Developer",
        startDate: "2020-01",
        endDate: "Present",
        description: "Led development of key features."
      },
      {
        id: "default-work-2",
        company: "Another Tech Co",
        position: "Junior Developer",
        startDate: "2018-03",
        endDate: "2019-12",
        description: "Worked on frontend applications."
      }
    ];

    const defaultEducation = [
      {
        id: "default-edu-1",
        institution: "University",
        degree: "Bachelor of Science",
        field: "Computer Science",
        fieldOfStudy: "Computer Science",
        startDate: "2014-09",
        endDate: "2018-05",
        description: "Graduated with honors."
      }
    ];

    // Ensure skills always have a consistent structure with id and name properties
    const formatSkills = (skills: Array<string | Skill> = []) => {
      return skills.map((skill, index) => {
        // If skill is just a string, convert it to an object with id and name
        if (typeof skill === 'string') {
          return { id: `skill-${index}`, name: skill };
        }
        // If skill is an object, make sure it has id and name as strings
        return {
          id: String(skill.id || `skill-${index}`),
          name: typeof skill.name === 'string' ? skill.name : String(skill.name || ''),
          level: typeof skill.level === 'string' ? skill.level : 'Intermediate'
        };
      });
    };

    const defaultSkills = [
      { id: "default-skill-1", name: "JavaScript", level: "Expert" },
      { id: "default-skill-2", name: "React", level: "Advanced" },
      { id: "default-skill-3", name: "CSS", level: "Intermediate" }
    ];

    const defaultProjects = [
      {
        id: "default-project-1",
        name: "Portfolio Website",
        description: "Personal portfolio showcasing work and skills.",
        url: "https://example.com"
      }
    ];

    // Ensure education data is properly formatted to include fieldOfStudy
    const formatEducation = (educationData: Array<EducationData> = []) => {
      return educationData.map(edu => ({
        ...edu,
        // Ensure fieldOfStudy is present (if field exists, use that value)
        fieldOfStudy: edu.fieldOfStudy || edu.field || "",
      }));
    };

    const dataWithConsistentTypes = {
      ...resumeData,
      personalInfo: resumeData.personalInfo || {
        name: "John Doe",
        title: "Software Developer",
        email: "john@example.com",
        phone: "123-456-7890",
        location: "New York, NY",
        summary: "Experienced software developer with a passion for creating user-friendly applications."
      },
      workExperience: resumeData.workExperience?.length ? resumeData.workExperience : defaultWorkExperience,
      education: formatEducation(resumeData.education?.length ? resumeData.education : defaultEducation),
      skills: formatSkills(resumeData.skills?.length ? resumeData.skills : defaultSkills),
      projects: resumeData.projects?.length ? resumeData.projects : defaultProjects,
      colors: resumeData.colors || {
        primary: "#3B82F6",
        secondary: "#1F2937",
        accent: "#10B981",
        background: "#FFFFFF"
      }
    };

    return dataWithConsistentTypes;
  }, [resumeData]);

  // Load editing template data when available
  useEffect(() => {
    if (editingTemplate) {
      setName(editingTemplate.name);
      setCode(editingTemplate.code);
      setPreferences(editingTemplate.preferences);
      setActiveTab("code");
    } else {
      resetState();
    }
  }, [editingTemplate]);

  const handleCreateTemplate = async (prefs: TemplatePreferences) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!apiKey || !service) {
        throw new Error("API key and service are required");
      }

      // Update preferences with freeform description
      const updatedPrefs = {
        ...prefs,
        freeformDescription,
      };

      // Update state for next render
      setPreferences(updatedPrefs);

      // Generate template code
      const result = await AITemplateGenerator(
        updatedPrefs,
        apiKey,
        service,
        currentModel ?? undefined
      );

      // Whether successful or not, display the code so the user can fix it if needed
      let processedCode;
      try {
        // Replace unsafe index references with a safer approach
        // Look for React.createElement with no key prop in map contexts
        let tmpCode = result.templateCode;
        // Simple pattern to catch basic instances of map elements without keys
        if (tmpCode.includes('.map(') && 
            (tmpCode.match(/\.map\s*\(\s*\(.*?\)\s*=>\s*React\.createElement/g) || []).length > 
            (tmpCode.match(/key\s*:/g) || []).length) {
          console.log("Detected mapping without keys. Adding a template comment to guide user.");
          // Add a comment at the top to guide the user
          tmpCode = "// IMPORTANT: Make sure all mapped items have key props. Example:\n" +
                   "// workExperience.map((item, index) => React.createElement('div', { key: item.id || index }, ...))\n\n" + 
                   tmpCode;
        }
        processedCode = cleanGeneratedCode(tmpCode);
      } catch (error) {
        console.error("Error processing template code:", error);
        processedCode = cleanGeneratedCode(result.templateCode);
      }
      
      setCode(processedCode);
      setGeneratedCode(processedCode);
      
      if (!result.success) {
        setError(result.error || "Failed to generate template. You can still edit the code manually.");
      } else {
        setError(null);
      }
      
      // Always switch to code tab to show the result
      setActiveTab("code");
      // Set to split view by default to show both code and preview
      setCodeViewMode("split");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      if (!name.trim()) {
        setError("Template name is required");
        return;
      }

      if (!code.trim()) {
        setError("Template code is required");
        return;
      }

      const template: CustomTemplate = {
        id: editingTemplate?.id || Date.now().toString(),
        name: name.trim(),
        code: code.trim(),
        preferences,
        createdAt: editingTemplate?.createdAt || new Date(),
      };

      await onTemplateCreate(template);
      resetState();
      return true; // Indicate success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template");
      return false; // Indicate failure
    }
  };

  const resetState = () => {
    setName("");
    setCode("");
    setGeneratedCode("");
    setActiveTab("generate");
    setError(null);
    setPreferences(getDefaultPreferences());
    setFreeformDescription("");
    setShowAdvancedOptions(false);
  };

  const handleGenerateClick = async () => {
    await handleCreateTemplate(preferences);
  };

  const handleFreeformChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFreeformDescription(e.target.value);
    setPreferences({
      ...preferences,
      freeformDescription: e.target.value,
    });
  };
  
  const handleCustomCSSChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreferences({
      ...preferences,
      customCSS: e.target.value,
    });
  };

  return {
    activeTab,
    setActiveTab,
    name,
    setName,
    code,
    setCode,
    preferences,
    setPreferences,
    generatedCode,
    isLoading,
    error,
    codeViewMode,
    setCodeViewMode,
    showAdvancedOptions,
    setShowAdvancedOptions,
    freeformDescription,
    handleCreateTemplate,
    handleSaveTemplate,
    resetState,
    handleGenerateClick,
    handleFreeformChange,
    handleCustomCSSChange,
    previewData
  };
}

export default useTemplateEditor; 
import { CustomTemplate } from "../../../hooks/useTemplateEditor";
import { TemplatePreferences } from "../../../types/templates";
import { ResumeData } from "@/types/resume";

export interface CustomTemplateCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreate: (template: CustomTemplate) => Promise<void>;
  editingTemplate?: CustomTemplate | null;
}

export interface ToolbarControlsProps {
  handleSaveTemplate: () => Promise<boolean>;
  handleCancel: () => void;
  isEditing: boolean;
  isLoading: boolean;
}

export interface HeaderSectionProps {
  title: string;
  name: string;
  setName: (name: string) => void;
  handleSaveTemplate: () => Promise<boolean>;
  handleCancel: () => void;
  isEditing: boolean;
}

export interface ViewControlsProps {
  activeTab: "generate" | "code";
  setActiveTab: (tab: "generate" | "code") => void;
  codeViewMode: "split" | "preview" | "edit";
  setCodeViewMode: (mode: "split" | "preview" | "edit") => void;
  error: string | null;
}

export interface EditorSectionProps {
  code: string;
  setCode: (code: string) => void;
  viewMode: "edit" | "preview" | "split";
}

export interface PreviewSectionProps {
  code: string;
  resumeData: ResumeData;
}

export interface TemplateGenerationFormProps {
  preferences: TemplatePreferences;
  setPreferences: (preferences: TemplatePreferences) => void;
  freeformDescription: string;
  handleFreeformChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCustomCSSChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  showAdvancedOptions: boolean;
  setShowAdvancedOptions: (show: boolean) => void;
  isLoading: boolean;
  handleGenerateClick: () => Promise<void>;
} 
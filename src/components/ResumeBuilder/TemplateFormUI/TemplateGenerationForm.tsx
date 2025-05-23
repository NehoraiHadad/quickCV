import React from "react";
import { TemplatePreferences } from "../../../types/templates";
import FormSection from "./FormSection";

interface TemplateGenerationFormProps {
  preferences: TemplatePreferences;
  freeformDescription: string;
  handleFreeformChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCustomCSSChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleGridColumnsChange: (columns: 1 | 2 | 3) => void; // New prop
  showAdvancedOptions: boolean;
  setShowAdvancedOptions: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  handleGenerateClick: () => Promise<void>;
}

const TemplateGenerationForm: React.FC<TemplateGenerationFormProps> = ({
  preferences,
  freeformDescription,
  handleFreeformChange,
  handleCustomCSSChange,
  handleGridColumnsChange, // Destructure new prop
  showAdvancedOptions,
  setShowAdvancedOptions,
  isLoading,
  handleGenerateClick,
}) => {
  return (
    <div className="space-y-6">
      <FormSection title="Your Vision">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="freeformDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Describe your ideal template
            </label>
            <textarea
              id="freeformDescription"
              value={freeformDescription}
              onChange={handleFreeformChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-1 focus:ring-blue-500 
                       h-32 resize-none text-sm"
              placeholder="Describe the template you want in detail. For example: 'A clean, minimal resume with a sidebar for skills and a main section for experience. Use elegant typography and subtle dividers.'"
            ></textarea>
          </div>
        </div>
      </FormSection>

      {showAdvancedOptions && (
        <FormSection title="Advanced Style Options">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="customCSS"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Custom CSS
              </label>
              <textarea
                id="customCSS"
                value={preferences.customCSS}
                onChange={handleCustomCSSChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 
                         h-32 resize-none font-mono text-xs"
                placeholder=".resume-header { font-weight: bold; }"
              ></textarea>
            </div>
          </div>
        </FormSection>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {showAdvancedOptions ? "Hide" : "Show"} advanced options
          <span className="ml-1">
            {showAdvancedOptions ? "↑" : "↓"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Generate Template"}
        </button>
      </div>
    </div>
  );
};

export default TemplateGenerationForm; 
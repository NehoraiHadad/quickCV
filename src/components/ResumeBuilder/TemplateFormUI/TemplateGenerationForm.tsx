import React from "react";
import { TemplatePreferences } from "../../../types/templates";
import FormSection from "./FormSection";

interface TemplateGenerationFormProps {
  preferences: TemplatePreferences;
  freeformDescription: string; // This prop might be redundant if freeformDescription is solely from preferences
  handleFreeformChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleCustomCSSChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleGridColumnsChange: (columns: 1 | 2 | 3) => void; 
  showAdvancedOptions: boolean;
  setShowAdvancedOptions: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  handleGenerateClick: () => Promise<void>;
}

const TemplateGenerationForm: React.FC<TemplateGenerationFormProps> = ({
  preferences,
  // freeformDescription, // Intentionally commented out if using from preferences
  handleFreeformChange,
  handleCustomCSSChange,
  handleGridColumnsChange, 
  showAdvancedOptions,
  setShowAdvancedOptions,
  isLoading,
  handleGenerateClick,
}) => {
  // Use freeformDescription from preferences, as updated in useTemplateEditor
  const currentFreeformDesc = preferences.freeformDescription || "";

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
              value={currentFreeformDesc} 
              onChange={handleFreeformChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-1 focus:ring-blue-500 
                       h-32 resize-none text-sm"
              placeholder="Describe the template you want in detail. For example: 'A clean, minimal resume with a sidebar for skills and a main section for experience. Use elegant typography and subtle dividers.'"
            ></textarea>
          </div>
        </div>
      </FormSection>

      <FormSection title="Layout Options">
        <div>
          <label
            htmlFor="gridColumns"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Number of Columns (for main content area)
          </label>
          <select
            id="gridColumns"
            name="gridColumns"
            value={preferences.gridConfiguration?.columns || 1}
            onChange={(e) => handleGridColumnsChange(parseInt(e.target.value, 10) as 1 | 2 | 3)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value={1}>1 Column</option>
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
          </select>
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
                value={preferences.customCSS || ""} // Ensure value is controlled
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

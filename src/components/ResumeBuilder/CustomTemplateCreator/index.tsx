import React from 'react';
import { Dialog, DialogPanel } from "@headlessui/react";
import useAIApi from "../../../hooks/useAIApi";
import { useResume } from "../../../context";
import useTemplateEditor from "../../../hooks/useTemplateEditor";
import { ResumeDataWithColors } from "../../../types/TemplatePreview";

import HeaderSection from "./HeaderSection";
import ViewControls from "./ViewControls";
import EditorSection from "./EditorSection";
import { CustomTemplateCreatorProps } from "./types";

// Import TemplateGenerationForm here to avoid circular dependency
import TemplateGenerationForm from "../TemplateFormUI/TemplateGenerationForm";

const CustomTemplateCreator: React.FC<CustomTemplateCreatorProps> = ({
  isOpen,
  onClose,
  onTemplateCreate,
  editingTemplate,
}) => {
  const { apiKey, service, currentModel } = useAIApi();
  const { resumeData } = useResume();
  
  // Convert resumeData to ResumeDataWithColors by adding background property
  const resumeDataWithColors: ResumeDataWithColors = {
    ...resumeData,
    colors: {
      primary: resumeData.colors?.primary || "#3B82F6",
      secondary: resumeData.colors?.secondary || "#1F2937",
      accent: resumeData.colors?.accent || "#10B981",
      background: "#FFFFFF" // Required field for ResumeDataWithColors
    }
  };

  const {
    // State
    activeTab,
    setActiveTab,
    name,
    setName,
    code,
    setCode,
    preferences,
    generatedCode,
    isLoading,
    error,
    codeViewMode,
    setCodeViewMode,
    showAdvancedOptions,
    setShowAdvancedOptions,
    freeformDescription,
    
    // Data
    previewData,
    
    // Functions
    handleSaveTemplate,
    resetState,
    handleGenerateClick,
    handleFreeformChange,
    handleCustomCSSChange
  } = useTemplateEditor({
    apiKey,
    service: service ?? undefined,
    currentModel: currentModel ?? undefined,
    resumeData: resumeDataWithColors,
    editingTemplate,
    onTemplateCreate
  });

  const handleCancel = () => {
    onClose();
    resetState();
  };

  // Ensure handleSaveTemplate always returns a boolean
  const handleSaveTemplateWrapper = async (): Promise<boolean> => {
    return await handleSaveTemplate() || false;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative z-10 bg-white rounded-xl shadow-xl mx-auto max-w-7xl w-full h-[90vh] overflow-hidden">
            <HeaderSection
              title={editingTemplate ? "Edit Template" : "Create Custom Template"}
              name={name}
              setName={setName}
              handleSaveTemplate={handleSaveTemplateWrapper}
              handleCancel={handleCancel}
              isEditing={!!editingTemplate}
            />

            <ViewControls
              codeViewMode={codeViewMode}
              setCodeViewMode={setCodeViewMode}
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                // When switching to code tab, ensure latest code is displayed
                if (tab === "code" && generatedCode && !code) {
                  setCode(generatedCode);
                }
              }}
              error={error}
            />

            <div className="p-6">
              {activeTab === "generate" ? (
                <TemplateGenerationForm
                  preferences={preferences}
                  freeformDescription={freeformDescription}
                  handleFreeformChange={handleFreeformChange}
                  handleCustomCSSChange={handleCustomCSSChange}
                  showAdvancedOptions={showAdvancedOptions}
                  setShowAdvancedOptions={setShowAdvancedOptions}
                  isLoading={isLoading}
                  handleGenerateClick={handleGenerateClick}
                />
              ) : (
                <div className="h-[70vh] overflow-auto">
                  <EditorSection 
                    code={code} 
                    setCode={setCode} 
                    viewMode={codeViewMode}
                    resumeData={previewData}
                  />
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default CustomTemplateCreator; 
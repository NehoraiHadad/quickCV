import React from "react";
import TabButton from "./TabButton";

interface TemplateViewControlsProps {
  codeViewMode: "split" | "preview" | "edit";
  setCodeViewMode: React.Dispatch<React.SetStateAction<"split" | "preview" | "edit">>;
  activeTab: "generate" | "code";
  setActiveTab: React.Dispatch<React.SetStateAction<"generate" | "code">>;
  error: string | null;
}

const TemplateViewControls: React.FC<TemplateViewControlsProps> = ({
  codeViewMode,
  setCodeViewMode,
  activeTab,
  setActiveTab,
  error,
}) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex">
          <TabButton
            active={activeTab === "generate"}
            onClick={() => setActiveTab("generate")}
          >
            Generate
          </TabButton>
          <TabButton
            active={activeTab === "code"}
            onClick={() => setActiveTab("code")}
          >
            Code & Preview
          </TabButton>
        </div>

        {activeTab === "code" && (
          <div className="flex items-center px-4 py-2 space-x-3">
            <button
              type="button"
              onClick={() => setCodeViewMode("split")}
              className={`text-sm px-2 py-1 rounded ${
                codeViewMode === "split"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setCodeViewMode("edit")}
              className={`text-sm px-2 py-1 rounded ${
                codeViewMode === "edit"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Edit Only
            </button>
            <button
              type="button"
              onClick={() => setCodeViewMode("preview")}
              className={`text-sm px-2 py-1 rounded ${
                codeViewMode === "preview"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Preview Only
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 text-sm border-t border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default TemplateViewControls; 
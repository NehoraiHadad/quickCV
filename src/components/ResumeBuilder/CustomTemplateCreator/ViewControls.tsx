import React from "react";
import { ViewControlsProps } from "./types";

const ViewControls: React.FC<ViewControlsProps> = ({
  activeTab,
  setActiveTab,
  codeViewMode,
  setCodeViewMode,
  error
}) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-2">
        <div>
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab("generate")}
              className={`${
                activeTab === "generate"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              Generate Template
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`${
                activeTab === "code"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
            >
              Edit Template Code
            </button>
          </nav>
        </div>

        {activeTab === "code" && (
          <div className="flex space-x-4">
            <button
              onClick={() => setCodeViewMode("split")}
              className={`${
                codeViewMode === "split"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700"
              } px-3 py-1 rounded-md text-sm font-medium`}
            >
              Split View
            </button>
            <button
              onClick={() => setCodeViewMode("edit")}
              className={`${
                codeViewMode === "edit"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700"
              } px-3 py-1 rounded-md text-sm font-medium`}
            >
              Edit Only
            </button>
            <button
              onClick={() => setCodeViewMode("preview")}
              className={`${
                codeViewMode === "preview"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700"
              } px-3 py-1 rounded-md text-sm font-medium`}
            >
              Preview Only
            </button>
          </div>
        )}
      </div>
      {error && (
        <div className="bg-red-50 p-3 border-l-4 border-red-500">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewControls; 
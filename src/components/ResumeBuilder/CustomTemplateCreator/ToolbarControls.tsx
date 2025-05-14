import React from "react";
import { ToolbarControlsProps } from "./types";

const ToolbarControls: React.FC<ToolbarControlsProps> = ({
  handleSaveTemplate,
  handleCancel,
  isEditing,
  isLoading
}) => {
  return (
    <div className="flex space-x-2 mt-4">
      <button
        type="button"
        onClick={handleCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSaveTemplate}
        disabled={isLoading}
        className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Saving..." : isEditing ? "Update Template" : "Save Template"}
      </button>
    </div>
  );
};

export default ToolbarControls; 
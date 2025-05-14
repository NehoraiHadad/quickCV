import React from "react";
import { HeaderSectionProps } from "./types";
import ToolbarControls from "./ToolbarControls";

const HeaderSection: React.FC<HeaderSectionProps> = ({
  title,
  name,
  setName,
  handleSaveTemplate,
  handleCancel,
  isEditing
}) => {
  return (
    <div className="bg-white px-6 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <label htmlFor="templateName" className="block text-sm font-medium text-gray-700">
              Template Name
            </label>
            <input
              type="text"
              name="templateName"
              id="templateName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="My Custom Template"
            />
          </div>
          <ToolbarControls
            handleSaveTemplate={handleSaveTemplate}
            handleCancel={handleCancel}
            isEditing={isEditing}
            isLoading={false}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderSection; 
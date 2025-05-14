import React from "react";
import { DialogTitle } from "@headlessui/react";

interface TemplateHeaderSectionProps {
  name: string;
  setName: (name: string) => void;
  handleCancel: () => void;
  handleSaveTemplate: () => Promise<void>;
  isEditing: boolean;
}

const TemplateHeaderSection: React.FC<TemplateHeaderSectionProps> = ({
  name,
  setName,
  handleCancel,
  handleSaveTemplate,
  isEditing,
}) => {
  return (
    <DialogTitle as="div" className="bg-gray-50 p-6 border-b">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? "Edit Template" : "Create Custom Template"}
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1.5 border border-gray-300 text-gray-700 
                     rounded-md hover:bg-gray-50 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveTemplate}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Template
          </button>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="template-name" className="block text-sm font-medium text-gray-700">
          Template Name
        </label>
        <input
          type="text"
          id="template-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                    shadow-sm focus:outline-none focus:ring-blue-500 
                    focus:border-blue-500 sm:text-sm"
          placeholder="Enter template name"
        />
      </div>
    </DialogTitle>
  );
};

export default TemplateHeaderSection; 
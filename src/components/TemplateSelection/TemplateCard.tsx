import React from "react";
import { Template } from "./TemplateGallery";

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  scale: number;
  onSelect: (templateId: string) => void;
  onEdit?: (templateId: string) => void;
  onDelete?: (templateId: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  scale,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const handleSelect = () => {
    onSelect(template.id);
  };

  const isCustomTemplate = template.id.startsWith("custom-");

  return (
    <div
      onClick={handleSelect}
      data-testid={`template-${template.id}`}
      className={`relative border rounded-lg cursor-pointer transition-all duration-200 group ${
        isSelected
          ? "border-blue-500 shadow-lg"
          : "border-gray-200 hover:border-blue-300"
      } aspect-[3/4.2] overflow-hidden`}
    >
      {isCustomTemplate && (
        <div className="absolute -right-4 top-2 rotate-45 bg-blue-500/90 text-white text-[5px] px-4 py-[1px] shadow-sm tracking-wider uppercase font-medium z-20">
          Custom
        </div>
      )}
      <div
        className="relative group-hover:z-10 group-hover:shadow-xl transition-transform duration-200 ease-out"
        style={{
          width: "210mm",
          height: "297mm",
          transform: `scale(${scale})`, // Base scale
          transformOrigin: "top left",
        }}
      >
        {/* This div will handle the hover scale effect */}
        <div
          className="w-full h-full transition-transform duration-200 ease-out group-hover:scale-[1.15]" // Relative scale on hover
          style={{
            transformOrigin: "top left",
          }}
        >
          {template.preview}
        </div>
      </div>
      {/* New container for always-visible name and hover-visible controls */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 py-2 bg-white border-t z-20">
        {/* Always visible template name */}
        <h3 className="font-medium text-sm">{template.name}</h3> 
        
        {/* Container for hover-visible buttons */}
        {isCustomTemplate && onEdit && onDelete && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(template.id);
              }}
              aria-label="Edit template"
              className="text-blue-500 hover:text-blue-700 px-2 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(template.id);
              }}
              aria-label="Delete template"
              className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

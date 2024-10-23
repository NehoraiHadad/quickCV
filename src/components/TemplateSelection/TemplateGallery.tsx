import React, { useRef, useEffect, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import templates from "@/data/templates";
import { ResumeData } from "@/types/resume";

export interface Template {
  id: string;
  name: string;
  render: (resumeData: ResumeData) => React.ReactElement;
  preview: React.ReactElement;
}

const TemplateGallery: React.FC = () => {
  const { selectedTemplate, setSelectedTemplate } = useResume();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const defaultTemplate = templates[0];
  const currentTemplate =
    templates.find((t) => t.id === selectedTemplate) || defaultTemplate;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = 0.1 * (containerWidth / 210); // 210mm is A4 width
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template.id)}
            className={`p-4 border rounded-md shadow-md ${
              (selectedTemplate || defaultTemplate.id) === template.id
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            {template.name}
          </button>
        ))}
      </div>

      <div className="mt-8 h-96">
        <h3 className="text-xl font-semibold mb-2">Preview</h3>
        <div
          ref={containerRef}
          className="shadow-lg overflow-hidden"
          style={{
            width: "210mm",
            height: "297mm",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {currentTemplate.preview}
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;

import React from "react";
import { Responsive as ResponsiveReactGridLayout, Layout } from "react-grid-layout";
import { TemplateDisplayProps } from "./types";
import { useResume } from "@/context/ResumeContext"; // Added

// Example layout - adjust as needed
const initialLayouts: { [key: string]: Layout[] } = {
  lg: [
    { i: 'header', x: 0, y: 0, w: 12, h: 2, static: true }, // Made header static for now
    { i: 'experience', x: 0, y: 2, w: 8, h: 4 },
    { i: 'education', x: 8, y: 2, w: 4, h: 4 },
    { i: 'skills', x: 0, y: 6, w: 12, h: 2 },
  ],
  md: [ // Add a layout for medium screens
    { i: 'header', x: 0, y: 0, w: 10, h: 2, static: true },
    { i: 'experience', x: 0, y: 2, w: 6, h: 4 },
    { i: 'education', x: 6, y: 2, w: 4, h: 4 },
    { i: 'skills', x: 0, y: 6, w: 10, h: 2 },
  ]
};

const TemplateDisplay: React.FC<TemplateDisplayProps> = ({
  resumeContentRef,
  scale,
  zoomLevel,
  currentTemplate,
  resumeData,
  layouts, // Add this
  fullPage = false,
}) => {
  const { updateTemplateLayout, selectedTemplate } = useResume(); // Added

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => { // Added
    if (selectedTemplate) {
      updateTemplateLayout(selectedTemplate, allLayouts);
    }
  };

  return (
    <div
      className={`overflow-hidden shadow-lg bg-white ${fullPage ? 'mx-auto' : ''}`}
      style={{
        width: "794px", // A4 width in pixels
        height: "1123px", // A4 height in pixels
        transform: `scale(${scale * zoomLevel})`,
        transformOrigin: "top left",
        maxWidth: fullPage ? "100%" : undefined, // This might need adjustment if fullPage means fill screen
      }}
    >
      <div className="h-full w-full" ref={resumeContentRef}> {/* Ensure inner div also uses w-full */}
    <ResponsiveReactGridLayout
      className="layout"
      layouts={layouts || initialLayouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={30}
      width={793} // Approximate 210mm in pixels (210 * 96 / 25.4)
      // isDraggable={false} // Consider making items non-draggable for preview
      // isResizable={false} // Consider making items non-resizable for preview
      onLayoutChange={handleLayoutChange} // Added
    >
      {/* Temporary: Wrap current template output in divs matching initialLayouts keys */}
      {/* This will need to be replaced by rendering actual resume sections */}
      <div key="header">
        {/* Placeholder for header content. For now, the whole template is here. */}
        {currentTemplate.render(resumeData)}
      </div>
      <div key="experience" style={{ backgroundColor: '#f0f0f0' }}>
        {/* Placeholder for experience section */}
        Experience Section (placeholder)
      </div>
      <div key="education" style={{ backgroundColor: '#e0e0e0' }}>
        {/* Placeholder for education section */}
        Education Section (placeholder)
      </div>
      <div key="skills" style={{ backgroundColor: '#d0d0d0' }}>
        {/* Placeholder for skills section */}
        Skills Section (placeholder)
      </div>
    </ResponsiveReactGridLayout>
      </div>
    </div>
  );
};

export default TemplateDisplay; 
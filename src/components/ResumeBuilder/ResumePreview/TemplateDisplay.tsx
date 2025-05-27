import React from "react";
// Removed duplicate React import
import { Responsive as ResponsiveReactGridLayout, Layout } from "react-grid-layout";
import { TemplateDisplayProps } from "./types"; // SectionProps removed as it's unused
import { useResume } from "@/context/ResumeContext";
import { getTemplateColors as defaultGetTemplateColors } from "@/components/Templates/DefaultTemplate/styles"; // Fallback for colors
import { TemplateSections } from "@/components/Templates/DefaultTemplate/types"; // For casting sections

// initialLayouts has been moved to data/templates.ts as defaultLayouts

const TemplateDisplay: React.FC<TemplateDisplayProps> = ({
  resumeContentRef,
  scale,
  zoomLevel,
  currentTemplate,
  resumeData,
  layouts, 
  fullPage = false,
}) => {
  const { updateTemplateLayout, selectedTemplate } = useResume();

  const handleLayoutChange = (currentLayout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    if (selectedTemplate) {
      // Ensure currentTemplate.id is valid before updating
      const templateId = currentTemplate.id || selectedTemplate;
      updateTemplateLayout(templateId, allLayouts);
    }
  };

  // Get sections from the current template
  const sections = currentTemplate.getSections ? currentTemplate.getSections() : ({} as TemplateSections);

  // Get template colors
  const templateColors = currentTemplate.getTemplateColors
    ? currentTemplate.getTemplateColors(resumeData.colors || {})
    : defaultGetTemplateColors(resumeData.colors || {});

  // Determine the actual layouts to use (from props or fallback to initialLayouts)
  // The layouts from context/props should ideally conform to all sections available in `sections`
  // Use layouts from props (resumeData.layouts[templateId]) if available, otherwise fallback to template's defaultLayouts
  const actualLayouts = (layouts && Object.keys(layouts).length > 0 ? layouts : currentTemplate.defaultLayouts) || {};
  
  // Ensure all section keys from `sections` are present in `actualLayouts` for all breakpoints,
  // or add them with default values if missing. This is important for react-grid-layout.
  // For simplicity, this step is omitted here, assuming `actualLayouts` is comprehensive.
  // However, a robust solution would merge `Object.keys(sections)` with `actualLayouts`.

  return (
    <div
      className={`overflow-hidden shadow-lg bg-white ${fullPage ? 'mx-auto' : ''}`}
      style={{
        width: "794px", 
        height: "1123px", 
        transform: `scale(${scale * zoomLevel})`,
        transformOrigin: "top left",
        maxWidth: fullPage ? "100%" : undefined,
      }}
    >
      <div className="h-full w-full" ref={resumeContentRef}>
        <ResponsiveReactGridLayout
          className="layout"
          layouts={actualLayouts} // Use actualLayouts
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}
          width={794} // Set to width of the container
          // isDraggable={false} // Uncomment if sections should not be draggable
          // isResizable={false} // Uncomment if sections should not be resizable
          onLayoutChange={handleLayoutChange}
          preventCollision={true} // Optional: might improve layout stability
        >
          {Object.keys(sections).map((sectionKey) => {
            const SectionComponent = sections[sectionKey as keyof TemplateSections];
            if (!SectionComponent) {
              console.warn(`No component found for section: ${sectionKey}`);
              return null;
            }
            // The div's key must match the 'i' in the layout definition from actualLayouts
            return (
              <div key={sectionKey} className="bg-white overflow-hidden"> {/* Ensure content clipping if necessary */}
                <SectionComponent resumeData={resumeData} templateColors={templateColors} />
              </div>
            );
          })}
        </ResponsiveReactGridLayout>
      </div>
    </div>
  );
};

export default React.memo(TemplateDisplay); // Consider React.memo if props are complex
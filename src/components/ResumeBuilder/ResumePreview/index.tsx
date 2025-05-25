import React from "react";
import { useResume } from "@/context/ResumeContext";
import { useTemplateSelection } from "./useTemplateSelection";
import { useScaleAndZoom } from "./useScaleAndZoom";
import ZoomControls from "./ZoomControls";
import TemplateDisplay from "./TemplateDisplay";

export interface ResumePreviewProps {
  fullPage?: boolean;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ fullPage = false }) => {
  const { resumeData, selectedTemplate } = useResume();
  const { currentTemplate } = useTemplateSelection(selectedTemplate);

  // Attempt to get layouts for the current template
  // This will likely be undefined since resumeData.layouts is not populated yet
  const templateLayouts = resumeData.layouts?.[selectedTemplate];

  const {
    zoomLevel,
    containerRef,
    resumeContentRef,
    scale,
    showZoomControls,
    setShowZoomControls,
    handlePrint,
    handleZoomChange,
    displayZoomValue,
  } = useScaleAndZoom();

  return (
    <div ref={containerRef} className={`relative ${fullPage ? 'h-full w-full' : 'h-full'} overflow-auto`}>
      <ZoomControls
        zoomLevel={zoomLevel}
        displayZoomValue={displayZoomValue}
        onZoomChange={handleZoomChange}
        onPrint={handlePrint}
        showZoomControls={showZoomControls}
        onMouseEnter={() => setShowZoomControls(true)}
        onMouseLeave={() => setShowZoomControls(false)}
      />
      <TemplateDisplay
        resumeContentRef={resumeContentRef}
        scale={scale}
        zoomLevel={zoomLevel}
        currentTemplate={currentTemplate}
        resumeData={resumeData}
        layouts={templateLayouts} // Pass the layouts
        fullPage={fullPage}
      />
    </div>
  );
};

export default React.memo(ResumePreview); 
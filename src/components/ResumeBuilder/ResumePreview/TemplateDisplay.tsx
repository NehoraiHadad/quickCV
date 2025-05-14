import React from "react";
import { TemplateDisplayProps } from "./types";

const TemplateDisplay: React.FC<TemplateDisplayProps> = ({
  containerRef,
  resumeContentRef,
  scale,
  zoomLevel,
  currentTemplate,
  resumeData,
  fullPage = false,
}) => {
  return (
    <div
      ref={containerRef}
      className={`overflow-hidden shadow-lg bg-white ${fullPage ? 'mx-auto' : ''}`}
      style={{
        width: "210mm",
        height: "297mm",
        transform: `scale(${scale * zoomLevel})`,
        transformOrigin: "top left",
        maxWidth: fullPage ? "100%" : undefined,
      }}
    >
      <div className="h-full" ref={resumeContentRef}>
        {currentTemplate.render(resumeData)}
      </div>
    </div>
  );
};

export default TemplateDisplay; 
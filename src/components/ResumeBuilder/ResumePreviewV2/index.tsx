import React, { useState, useEffect, useRef, useCallback } from "react";
import { useResume } from "@/context/ResumeContext";
import { useTemplateSelection } from "../ResumePreview/useTemplateSelection";
import { useScaleAndZoom } from "../ResumePreview/useScaleAndZoom";
import ZoomControls from "../ResumePreview/ZoomControls";
import TemplateDisplay from "../ResumePreview/TemplateDisplay";

export interface ResumePreviewProps { 
  fullPage?: boolean;
}

const ResumePreviewV2: React.FC<ResumePreviewProps> = ({ fullPage = false }) => {
  // Corrected destructuring from useResume
  const { resumeData, selectedTemplate, updateSectionHeight } = useResume(); 

  const { currentTemplate } = useTemplateSelection(selectedTemplate);
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

  const [isDragging, setIsDragging] = useState(false);
  const [initialClientY, setInitialClientY] = useState(0);
  const [initialSectionHeight, setInitialSectionHeight] = useState(0); 
  const resizableSectionRef = useRef<HTMLElement | null>(null);
  const summarySectionQuery = '[data-section-key="summary"]';

  const [isContentOverflowing, setIsContentOverflowing] = useState(false);

  useEffect(() => {
    if (resumeContentRef.current && currentTemplate?.id) {
      const sectionEl = resumeContentRef.current.querySelector(summarySectionQuery) as HTMLElement;
      resizableSectionRef.current = sectionEl; 
    } else {
      resizableSectionRef.current = null;
    }
  }, [resumeData, currentTemplate?.id, resumeContentRef, scale, zoomLevel]);

  useEffect(() => {
    if (resumeContentRef.current && currentTemplate?.id) { 
      const el = resumeContentRef.current;
      const tolerance = 5; 
      if (el.scrollHeight > el.clientHeight + tolerance) {
        setIsContentOverflowing(true);
      } else {
        setIsContentOverflowing(false);
      }
    }
  }, [resumeData, currentTemplate?.id, scale, zoomLevel, resumeContentRef]);

  const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!resizableSectionRef.current) return;
    event.preventDefault();
    setIsDragging(true);
    setInitialClientY(event.clientY);
    const currentScaleFactor = (scale * zoomLevel) || 1;
    setInitialSectionHeight(resizableSectionRef.current.offsetHeight / currentScaleFactor); 
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [scale, zoomLevel, handleMouseMove, handleMouseUp]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !resizableSectionRef.current) return;
    event.preventDefault();
    const currentScaleFactor = (scale * zoomLevel) || 1;
    const deltaY = event.clientY - initialClientY;
    let newHeight = initialSectionHeight + (deltaY / currentScaleFactor); 
    if (newHeight < 50) newHeight = 50; 
    resizableSectionRef.current.style.height = `${newHeight}px`;
  }, [isDragging, initialClientY, initialSectionHeight, scale, zoomLevel]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !resizableSectionRef.current) return;
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    const finalHeight = resizableSectionRef.current.style.height; 
    if (typeof updateSectionHeight === 'function' && finalHeight) { 
      updateSectionHeight("summary", finalHeight); 
    }
  }, [isDragging, updateSectionHeight, handleMouseMove]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className={`relative ${fullPage ? 'h-full w-full' : 'h-full'}`}>
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
        containerRef={containerRef}
        resumeContentRef={resumeContentRef} 
        scale={scale}
        zoomLevel={zoomLevel}
        currentTemplate={currentTemplate}
        resumeData={resumeData}
        fullPage={fullPage}
      />
      {resizableSectionRef.current && ( 
        <div 
          style={{ 
            position: 'absolute', 
            height: '10px', 
            width: resizableSectionRef.current.offsetWidth * ((scale*zoomLevel) || 1) + 'px', 
            left: resizableSectionRef.current.offsetLeft * ((scale*zoomLevel) || 1) + 'px',
            top: (resizableSectionRef.current.offsetTop + resizableSectionRef.current.offsetHeight) * ((scale*zoomLevel) || 1) - 5 + 'px',
            cursor: 'ns-resize',
            backgroundColor: 'rgba(0,0,255,0.3)', 
            zIndex: 100 
          }}
          onMouseDown={handleMouseDown}
        />
      )}
      {isContentOverflowing && (
        <div 
          style={{
            position: 'absolute',
            bottom: '40px', 
            left: '50%',
            transform: 'translateX(-50%)', 
            backgroundColor: 'rgba(255, 107, 107, 0.9)', 
            color: 'white',
            padding: '8px 15px',
            borderRadius: '6px',
            zIndex: 200, 
            fontSize: '0.875rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}
        >
          Warning: Content may be overflowing the page.
        </div>
      )}
    </div>
  );
};

export default React.memo(ResumePreviewV2);

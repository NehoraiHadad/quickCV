import { useState, useEffect, useRef, useCallback } from "react";
import { createPrintDocument, displayValueToZoomLevel, zoomLevelToDisplayValue } from "./utils";

/**
 * Hook to handle scaling and zooming of resume preview
 */
export const useScaleAndZoom = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeContentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [showZoomControls, setShowZoomControls] = useState(false);

  // Update scale based on container width
  useEffect(() => {
    const A4_WIDTH_PX = 794;
    const A4_HEIGHT_PX = 1123;

    const updateScale = () => {
      if (containerRef.current) { // containerRef is the viewport
        const viewportWidth = containerRef.current.offsetWidth;
        const viewportHeight = containerRef.current.offsetHeight;

        if (viewportWidth > 0 && viewportHeight > 0) {
          const scaleX = viewportWidth / A4_WIDTH_PX;
          // const scaleY = viewportHeight / A4_HEIGHT_PX; // scaleY is no longer used
          const newScale = scaleX; // Scale to fit container width
          setScale(Math.max(newScale, 0.1)); // Ensure scale is not too small or zero
        } else {
          setScale(0.1); // Default to a small scale if viewport dimensions are zero
        }
      }
    };
    const currentContainer = containerRef.current;
    const resizeObserver = new ResizeObserver(updateScale);

    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer);
      }
    };
  }, []);

  // Handle printing the resume
  const handlePrint = useCallback(() => {
    const printContent = resumeContentRef.current?.innerHTML;
    const printWindow = createPrintDocument(printContent);
    
    if (printWindow) {
      // Fallback for browsers that don't support onafterprint
      const checkWindowClosed = setInterval(() => {
        if (printWindow.closed) {
          clearInterval(checkWindowClosed);
        } else {
          printWindow.close();
        }
      }, 1000);

      // Clear the interval after 10 seconds to prevent it from running indefinitely
      setTimeout(() => clearInterval(checkWindowClosed), 10000);
    }
  }, []);

  // Handle zoom slider changes
  const handleZoomChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const displayValue = parseInt(e.target.value);
    const actualZoom = displayValueToZoomLevel(displayValue);
    setZoomLevel(actualZoom);
  }, []);

  // Calculate display zoom value for UI
  const displayZoomValue = zoomLevelToDisplayValue(zoomLevel);

  return {
    zoomLevel,
    containerRef,
    resumeContentRef,
    scale,
    showZoomControls,
    setShowZoomControls,
    handlePrint,
    handleZoomChange,
    displayZoomValue,
  };
}; 
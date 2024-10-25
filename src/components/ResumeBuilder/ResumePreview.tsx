import React, { useRef, useEffect, useState } from "react";
import { useResume } from "@/context/ResumeContext";
import templates from "@/data/templates";

const ResumePreview: React.FC = () => {
  const { resumeData, selectedTemplate } = useResume();
  const [zoomLevel, setZoomLevel] = useState<number>(0.15);
  const containerRef = useRef<HTMLDivElement>(null);
  const resumeContentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [showZoomControls, setShowZoomControls] = useState(false);

  const defaultTemplate = templates[0];
  const currentTemplate =
    templates.find((t) => t.id === selectedTemplate) || defaultTemplate;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const newScale = Math.max(containerWidth / 210, 0.1); // Minimum scale of 0.1
        setScale(newScale);
      }
    };

    const resizeObserver = new ResizeObserver(updateScale);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  const handlePrint = () => {
    const printContent = resumeContentRef.current?.innerHTML;

    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch (e) {
          console.log(
            "Access to stylesheet blocked by CORS policy or something :",
            styleSheet.href, e
          );
          return "";
        }
      })
      .join("\n");

    const printWindow = window.open("", "_blank");

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Resume</title>
            <style>
              ${styles}
              body {
                font-family: Arial, sans-serif;
                width: 210mm;
                height: 297mm;
              }
              @page {
                size: A4;
                margin: 0;
              }
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
              }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onafterprint = function() {
                window.close();
              };
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  if (!window.closed) {
                    window.close();
                  }
                }, 1000);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

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
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const displayValue = parseInt(e.target.value);
    const actualZoom = (displayValue / 100) * 0.3;
    setZoomLevel(actualZoom);
  };

  const displayZoomValue = Math.round((zoomLevel / 0.3) * 100);

  return (
    <div className="relative h-full">
      <div
        className="absolute top-[-10px] left-[-10px] z-10 flex items-center bg-white rounded-full p-1 shadow-md"
        onMouseEnter={() => setShowZoomControls(true)}
        onMouseLeave={() => setShowZoomControls(false)}
      >
        <button className="bg-white rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </button>
        {showZoomControls && (
          <>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={displayZoomValue}
              onChange={handleZoomChange}
              className="w-20 mx-2"
            />
            <span className="text-xs mr-2">{displayZoomValue}%</span>
          </>
        )}
        <button
          onClick={handlePrint}
          className="bg-white rounded-full p-1 ml-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>
      <div
        ref={containerRef}
        className="overflow-hidden p-6"
        style={{
          width: "210mm",
          height: "297mm",
          transform: `scale(${scale * zoomLevel})`,
          transformOrigin: "top left",
        }}
      >
        <div className="h-full shadow-lg" ref={resumeContentRef}>
          {currentTemplate.render(resumeData)}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;

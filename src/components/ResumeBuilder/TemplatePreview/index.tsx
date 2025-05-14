import React from "react";
import { TemplatePreviewProps } from "./types";
import TemplateErrorBoundary from "./ErrorBoundary";
import TemplateRenderer from "./TemplateRenderer";
import ContextProviders from "./ContextProviders";

/**
 * Renders a live preview of a resume template using the provided code
 */
const TemplatePreview: React.FC<TemplatePreviewProps> = ({ code, resumeData }) => {
  return (
    <div className="border rounded-md overflow-auto bg-white p-4 h-full">
      <div className="w-full" style={{ minHeight: "650px" }}>
        <ContextProviders resumeData={resumeData}>
          <TemplateErrorBoundary
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-red-500 font-semibold">Error rendering template</p>
                  <p className="text-gray-500 text-sm mt-2">
                    The template contains errors. Check the console for details.
                  </p>
                </div>
              </div>
            }
          >
            <TemplateRenderer code={code} resumeData={resumeData} />
          </TemplateErrorBoundary>
        </ContextProviders>
      </div>
    </div>
  );
};

export default TemplatePreview; 
"use client";
import React, { useState, useEffect } from "react";
import PersonalInfo from "@/components/ResumeBuilder/PersonalInfo";
import WorkExperience from "@/components/ResumeBuilder/WorkExperience";
import Education from "@/components/ResumeBuilder/Education";
import Skills from "@/components/ResumeBuilder/Skills";
import Projects from "@/components/ResumeBuilder/Projects";
import AdditionalSections from "@/components/ResumeBuilder/AdditionalSections";
import TemplateSelection from "@/components/ResumeBuilder/TemplateSelection";
// Changed import to V2 using alias
import ResumePreviewV2 from "@/components/ResumeBuilder/ResumePreviewV2"; 
import ColorCustomization from "@/components/ResumeBuilder/ColorCustomization";
import Split from 'react-split';
import { Button } from "@/components/ui";
import { useSearchParams } from "next/navigation";

const ResumeBuilderContent: React.FC = () => {
  const [currentSection, setCurrentSection] = useState("personal-info");
  const [mobileView, setMobileView] = useState<"main" | "aside">("main");
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const sectionParam = searchParams.get("section");
    if (sectionParam) {
      setCurrentSection(sectionParam);
    }
  }, [searchParams]);

  const renderSection = () => {
    switch (currentSection) {
      case "personal-info":
        return <PersonalInfo />;
      case "work-experience":
        return <WorkExperience />;
      case "education":
        return <Education />;
      case "skills":
        return <Skills />;
      case "projects":
        return <Projects />;
      case "additional":
        return <AdditionalSections />;
      case "template":
        return <TemplateSelection />;
      case "colors":
        return <ColorCustomization />;
      case "preview":
        // Changed component
        return <div className="p-4 h-full overflow-auto"><ResumePreviewV2 fullPage /></div>; 
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="md:hidden flex-1 flex flex-col">
        <main className={`flex-1 p-4 overflow-y-auto ${mobileView === "main" ? "block" : "hidden"}`}>
          {renderSection()}
        </main>
        <aside className={`w-full p-4 overflow-y-auto bg-gray-100 ${mobileView === "aside" ? "block" : "hidden"}`}>
          {/* Changed component */}
          <ResumePreviewV2 /> 
        </aside>
      </div>
      
      <div className="hidden md:block flex-1">
        <Split
          className="flex flex-row h-full"
          sizes={[60, 40]}
          minSize={300}
          gutterSize={8}
          snapOffset={30}
        >
          <main className="flex-1 p-4 overflow-y-auto resume-preview-scroll">
            {renderSection()}
          </main>
          <aside className="w-full md:w-2/4 p-4 overflow-y-auto bg-gray-100 resume-preview-scroll">
            {/* Changed component */}
            <ResumePreviewV2 /> 
          </aside>
        </Split>
      </div>
      
      <div className="md:hidden fixed bottom-4 right-4 flex space-x-2 z-30">
        <Button
          onClick={() => setMobileView(mobileView === "main" ? "aside" : "main")}
          variant="primary"
          size="md"
          className="rounded-full shadow-lg"
        >
          {mobileView === "main" ? "Preview" : "Edit"}
        </Button>
      </div>
    </div>
  );
};

export default function ResumeBuilder() {
  return <ResumeBuilderContent />;
}

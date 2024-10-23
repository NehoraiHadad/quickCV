"use client";
import React, { useState } from "react";
import PersonalInfo from "@/components/ResumeBuilder/PersonalInfo";
import WorkExperience from "@/components/ResumeBuilder/WorkExperience";
import Education from "@/components/ResumeBuilder/Education";
import Skills from "@/components/ResumeBuilder/Skills";
import Projects from "@/components/ResumeBuilder/Projects";
import AdditionalSections from "@/components/ResumeBuilder/AdditionalSections";
import TemplateSelection from "@/components/ResumeBuilder/TemplateSelection";
import ResumePreview from "@/components/ResumeBuilder/ResumePreview";
import { ResumeProvider, useResume } from "@/context/ResumeContext";
import ColorCustomization from "@/components/ResumeBuilder/ColorCustomization";

const ResumeBuilderContent: React.FC = () => {
  const [currentSection, setCurrentSection] = useState("personal-info");
  const { saveResumeData, loadResumeData } = useResume();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'main' | 'aside'>('main');

  const handleSaveData = () => {
    const jsonData = saveResumeData();
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        loadResumeData(content);
      };
      reader.readAsText(file);
    }
  };

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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white py-4 px-6 shadow flex justify-between items-center z-30 relative">
        <h1 className="text-2xl font-bold">Build Your Resume</h1>
        <button
          className="md:hidden"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          {isNavOpen ? 'Close' : 'Menu'}
        </button>
      </header>
      <div className="flex-1 flex flex-col md:flex-row relative">
        <nav className={`w-full md:w-48 bg-gray-100 p-4 overflow-y-auto fixed md:static inset-0 z-20 ${isNavOpen ? 'block' : 'hidden'} md:block pt-20 md:pt-4`}>
          <ul className="space-y-2">
            {[
              "personal-info",
              "work-experience",
              "education",
              "skills",
              "projects",
              "additional",
              "template",
              "colors",
            ].map((section) => (
              <li key={section}>
                <button
                  onClick={() => {
                    setCurrentSection(section);
                    setIsNavOpen(false);
                    setMobileView('main');
                  }}
                  className={`w-full text-left py-2 px-4 rounded transition-colors duration-300 ${
                    currentSection === section
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {section
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleSaveData}
              className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition-colors duration-300 "
            >
              Save Data
            </button>
            <label className="bg-blue-500 text-center text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
              Load Data
              <input
                type="file"
                accept=".json"
                onChange={handleLoadData}
                className="hidden"
              />
            </label>
          </div>
        </nav>
        <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
          <main className={`flex-1 p-4 overflow-y-auto ${mobileView === 'main' ? 'block' : 'hidden'} md:block`}>
            {renderSection()}
          </main>
          <aside className={`w-full md:w-2/4 p-4 overflow-y-auto bg-gray-100 ${mobileView === 'aside' ? 'block' : 'hidden'} md:block`}>
            <ResumePreview />
          </aside>
        </div>
        <div className="md:hidden fixed bottom-4 right-4 flex space-x-2 z-30">
          <button
            onClick={() => setMobileView(mobileView === 'main' ? 'aside' : 'main')}
            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md"
          >
            {mobileView === 'main' ? 'Preview' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ResumeBuilder() {
  return (
    <ResumeProvider>
      <ResumeBuilderContent />
    </ResumeProvider>
  );
}
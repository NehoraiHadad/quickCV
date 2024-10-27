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
  const [mobileView, setMobileView] = useState<"main" | "aside">("main");

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
        <button className="md:hidden" onClick={() => setIsNavOpen(!isNavOpen)}>
          {isNavOpen ? "Close" : "Menu"}
        </button>
      </header>
      <div className="flex-1 flex flex-col md:flex-row relative max-h-[91.27vh]">
        <nav
          className={`w-full md:w-48 bg-gray-100 p-4 overflow-y-auto fixed md:static inset-0 z-20 ${
            isNavOpen ? "block" : "hidden"
          } md:flex pt-20 md:pt-4 flex flex-col`}
        >
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
                    setMobileView("main");
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
          <div className="mt-auto pt-4 flex justify-center">
            {" "}
            <a
              href="https://github.com/NehoraiHadad/quickCV"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </nav>
        <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
          <main
            className={`flex-1 p-4 overflow-y-auto ${
              mobileView === "main" ? "block" : "hidden"
            } md:block`}
          >
            {renderSection()}
          </main>
          <aside
            className={`w-full md:w-2/4 p-4 overflow-y-auto bg-gray-100 ${
              mobileView === "aside" ? "block" : "hidden"
            } md:block`}
          >
            <ResumePreview />
          </aside>
        </div>
        <div className="md:hidden fixed bottom-4 right-4 flex space-x-2 z-30">
          <button
            onClick={() =>
              setMobileView(mobileView === "main" ? "aside" : "main")
            }
            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md"
          >
            {mobileView === "main" ? "Preview" : "Edit"}
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

'use client';

import React from 'react';
import { useResume } from '@/context/ResumeContext';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const ResumeDataButtons: React.FC = () => {
  const { loadResumeData, saveResumeData } = useResume();

  // Handle save data
  const handleSaveData = () => {
    const filename = "resume-data.json";
    // Get the most current data using the context's saveResumeData function
    const jsonStr = saveResumeData();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle load data
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

  return (
    <>
      <button
        onClick={handleSaveData}
        className="inline-flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-300 text-sm mr-2"
        aria-label="Save Data"
      >
        <ArrowDownTrayIcon className="h-5 w-5" />
      </button>
      <label className="inline-flex items-center justify-center bg-slate-500 hover:bg-slate-400 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-300 text-sm cursor-pointer"
        aria-label="Load Data"
      >
        <ArrowUpTrayIcon className="h-5 w-5" />
        <input
          type="file"
          accept=".json"
          onChange={handleLoadData}
          className="hidden"
        />
      </label>
    </>
  );
};

export default ResumeDataButtons; 
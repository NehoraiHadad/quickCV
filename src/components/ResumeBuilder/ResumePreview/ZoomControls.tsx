import React from "react";
import { ZoomControlsProps } from "./types";

const ZoomControls: React.FC<ZoomControlsProps> = ({
  displayZoomValue,
  onZoomChange,
  onPrint,
  showZoomControls,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className="absolute top-4 left-4 z-10 flex items-center bg-white rounded-full p-1 shadow-md"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
            min="10"
            max="200"
            step="1"
            value={displayZoomValue}
            onChange={onZoomChange}
            className="w-20 mx-2"
          />
          <span className="text-xs mr-2">{displayZoomValue}%</span>
        </>
      )}
      <button
        onClick={onPrint}
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
  );
};

export default ZoomControls; 
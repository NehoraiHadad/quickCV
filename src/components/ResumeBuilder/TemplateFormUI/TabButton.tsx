import React from "react";

interface TabButtonProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

/**
 * A styled tab button component for switching between sections
 */
const TabButton: React.FC<TabButtonProps> = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 transition-colors duration-200 ${
      active
        ? "border-b-2 border-blue-500 text-blue-600"
        : "text-gray-600 hover:text-gray-800"
    }`}
  >
    {children}
  </button>
);

export default TabButton; 
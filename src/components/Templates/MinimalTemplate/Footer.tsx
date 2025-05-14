import React from "react";
import { SectionProps } from "./types";

const Footer: React.FC<SectionProps> = ({ templateColors }) => {
  return (
    <div 
      className="h-0.5 w-full mt-4" 
      style={{ backgroundColor: `${templateColors.primary}40` }}
    ></div>
  );
};

export default Footer; 
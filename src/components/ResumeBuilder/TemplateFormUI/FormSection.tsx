import React from "react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * A styled form section component with a title and container
 */
const FormSection: React.FC<FormSectionProps> = ({ title, children }) => (
  <div className="mb-6 bg-white rounded-lg shadow-sm p-6 border border-gray-100 transition-shadow hover:shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

export default FormSection; 
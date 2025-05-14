import React from 'react';
import Card from './Card';

interface FormSectionProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  required?: boolean;
}

const FormSection: React.FC<FormSectionProps> = ({
  children,
  title,
  description,
  className = '',
  actions,
  collapsible = false,
  defaultCollapsed = false,
  required = false,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  
  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <Card 
      className={`mb-6 ${className}`}
      title={
        typeof title === 'string' ? (
          <div className="flex items-center">
            <span>{title}</span>
            {required && <span className="text-red-500 ml-1">*</span>}
          </div>
        ) : title
      }
      subtitle={description}
      headerActions={
        <div className="flex items-center">
          {actions}
          {collapsible && (
            <button
              type="button"
              onClick={toggleCollapse}
              className="ml-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>
      }
    >
      <div className={`transition-all duration-300 ${isCollapsed ? 'h-0 overflow-hidden' : ''}`}>
        {children}
      </div>
    </Card>
  );
};

export default FormSection; 
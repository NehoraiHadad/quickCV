import React from 'react';
import Section from './Section';

interface ResumeSectionProps {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({
  children,
  title,
  icon,
  actions,
  className = '',
}) => {
  const titleContent = (
    <div className="flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </div>
  );

  return (
    <Section
      title={titleContent}
      className={`mb-6 ${className}`}
      headerActions={actions}
    >
      {children}
    </Section>
  );
};

export default ResumeSection; 
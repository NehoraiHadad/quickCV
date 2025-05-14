import React from 'react';
import Card from './Card';

interface ResumeItemCardProps {
  title: string;
  subtitle?: string;
  dateRange?: string;
  location?: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const ResumeItemCard: React.FC<ResumeItemCardProps> = ({
  title,
  subtitle,
  dateRange,
  location,
  description,
  children,
  actions,
  className = '',
}) => {
  return (
    <Card 
      className={`mb-4 hover:shadow-md transition-shadow ${className}`}
      headerActions={actions}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-md text-gray-600">{subtitle}</p>
            )}
          </div>
          
          <div className="text-right">
            {dateRange && (
              <p className="text-sm text-gray-500">{dateRange}</p>
            )}
            {location && (
              <p className="text-sm text-gray-500">{location}</p>
            )}
          </div>
        </div>
        
        {description && (
          <p className="text-gray-700">{description}</p>
        )}
        
        {children}
      </div>
    </Card>
  );
};

export default ResumeItemCard; 
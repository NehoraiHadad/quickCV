import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
  id?: string;
  headerActions?: React.ReactNode;
  divider?: boolean;
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  description,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  contentClassName = '',
  id,
  headerActions,
  divider = true,
}) => {
  const hasHeader = title || description || headerActions;
  
  return (
    <section id={id} className={`mb-8 ${className}`}>
      {hasHeader && (
        <div className="mb-4">
          <div className="flex justify-between items-center">
            {title && (
              typeof title === 'string' ? (
                <h2 className={`text-xl font-semibold text-gray-900 ${titleClassName}`}>
                  {title}
                </h2>
              ) : (
                title
              )
            )}
            
            {headerActions && (
              <div className="flex space-x-2 items-center">
                {headerActions}
              </div>
            )}
          </div>
          
          {description && (
            <p className={`mt-1 text-sm text-gray-500 ${descriptionClassName}`}>
              {description}
            </p>
          )}
          
          {divider && hasHeader && (
            <div className="mt-4 border-b border-gray-200"></div>
          )}
        </div>
      )}
      
      <div className={contentClassName}>
        {children}
      </div>
    </section>
  );
};

export default Section; 
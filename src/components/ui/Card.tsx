import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  footer?: React.ReactNode;
  headerActions?: React.ReactNode;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  noPadding?: boolean;
  borderColor?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  footer,
  headerActions,
  elevation = 'sm',
  noPadding = false,
  borderColor,
  onClick,
}) => {
  // Shadow classes based on elevation
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };

  // Border color
  const borderClasses = borderColor ? `border-${borderColor}` : 'border-gray-200';
  
  // Determine if card has a header (title or headerActions)
  const hasHeader = title || headerActions;
  
  // Determine if card is clickable
  const isClickable = !!onClick;
  const clickableClasses = isClickable ? 'cursor-pointer transform transition-transform hover:-translate-y-1' : '';
  
  return (
    <div 
      className={`
        bg-white rounded-lg border ${borderClasses} overflow-hidden
        ${shadowClasses[elevation]}
        ${clickableClasses}
        ${className}
      `}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
    >
      {hasHeader && (
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div>
            {title && (
              typeof title === 'string' ? 
                <h3 className="text-lg font-medium text-gray-900">{title}</h3> : 
                title
            )}
            {subtitle && (
              typeof subtitle === 'string' ? 
                <p className="text-sm text-gray-500">{subtitle}</p> : 
                subtitle
            )}
          </div>
          
          {headerActions && (
            <div className="flex space-x-2 items-center">
              {headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className={noPadding ? '' : 'p-4'}>
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 
import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
  maxWidth = 'lg',
}) => {
  // Max width utility classes
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
    none: '',
  };

  return (
    <Component
      className={`
        w-full 
        px-4 sm:px-6 md:px-8 
        mx-auto 
        ${maxWidthClasses[maxWidth]}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default ResponsiveContainer; 
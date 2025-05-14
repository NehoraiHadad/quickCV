import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number | {
    x?: number;
    y?: number;
  };
  autoRows?: string;
  autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
  as: Component = 'div',
  cols = { default: 1 },
  gap = 4,
  autoRows,
  autoFlow,
}) => {
  // Convert cols to grid-template-columns classes
  const getColsClass = () => {
    const classes = [];
    
    if (cols.default) {
      classes.push(`grid-cols-${cols.default}`);
    }
    
    if (cols.sm) {
      classes.push(`sm:grid-cols-${cols.sm}`);
    }
    
    if (cols.md) {
      classes.push(`md:grid-cols-${cols.md}`);
    }
    
    if (cols.lg) {
      classes.push(`lg:grid-cols-${cols.lg}`);
    }
    
    if (cols.xl) {
      classes.push(`xl:grid-cols-${cols.xl}`);
    }
    
    if (cols['2xl']) {
      classes.push(`2xl:grid-cols-${cols['2xl']}`);
    }
    
    return classes.join(' ');
  };
  
  // Convert gap to gap classes
  const getGapClass = () => {
    if (typeof gap === 'number') {
      return `gap-${gap}`;
    }
    
    const classes = [];
    
    if (gap.x !== undefined) {
      classes.push(`gap-x-${gap.x}`);
    }
    
    if (gap.y !== undefined) {
      classes.push(`gap-y-${gap.y}`);
    }
    
    return classes.join(' ');
  };
  
  // Additional grid properties
  const autoRowsClass = autoRows ? `auto-rows-${autoRows}` : '';
  const autoFlowClass = autoFlow ? `grid-flow-${autoFlow.replace(' ', '-')}` : '';
  
  return (
    <Component
      className={`
        grid
        ${getColsClass()}
        ${getGapClass()}
        ${autoRowsClass}
        ${autoFlowClass}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default ResponsiveGrid; 
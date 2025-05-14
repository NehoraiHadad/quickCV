import React from 'react';

interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  direction?: 'row' | 'column';
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  spacing?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  alignment?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  distribution?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  reverse?: boolean;
}

const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  className = '',
  as: Component = 'div',
  direction = 'row',
  breakpoint = 'md',
  spacing = 4,
  alignment = 'start',
  distribution = 'start',
  wrap = false,
  reverse = false,
}) => {
  // Spacing utility classes
  const getSpacingClass = (direction: string, size: number) => {
    if (direction === 'row') {
      return `space-x-${size}`;
    }
    return `space-y-${size}`;
  };

  // Alignment utility classes
  const alignmentClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  // Distribution utility classes
  const distributionClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  // Determine responsive direction classes
  const getDirectionClasses = () => {
    if (direction === 'row') {
      return {
        mobile: 'flex-col',
        desktop: `${breakpoint}:flex-row`,
      };
    }
    return {
      mobile: 'flex-row',
      desktop: `${breakpoint}:flex-col`,
    };
  };

  const directionClasses = getDirectionClasses();
  const mobileSpacingClass = getSpacingClass(direction === 'row' ? 'column' : 'row', spacing);
  const desktopSpacingClass = `${breakpoint}:${getSpacingClass(direction, spacing)}`;
  const wrapClass = wrap ? 'flex-wrap' : '';
  const reverseClass = reverse ? (direction === 'row' ? 'flex-row-reverse' : 'flex-col-reverse') : '';

  return (
    <Component
      className={`
        flex
        ${directionClasses.mobile}
        ${directionClasses.desktop}
        ${alignmentClasses[alignment]}
        ${distributionClasses[distribution]}
        ${mobileSpacingClass}
        ${desktopSpacingClass}
        ${wrapClass}
        ${reverseClass}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default ResponsiveStack; 
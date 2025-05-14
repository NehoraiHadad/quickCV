# Dynamic Layout Adjustment Approach

## Core Principles
- **Responsive Sections**: Sections expand or contract based on content volume
- **Priority-Based Display**: High-priority content maintains visibility while less important content compresses
- **Adaptive Spacing**: Margins and padding adjust automatically to maximize content display
- **Contextual Compression**: Different content types are compressed using context-appropriate techniques
- **Automatic Rebalancing**: Column widths and section sizes adjust dynamically to optimize space utilization

## Implementation Strategy

### 1. Layout Density Management

First, let's define the necessary types and enums. Ideally, these would live in a file like `src/types/layout.ts` or similar, according to your project architecture.

```tsx
// Suggested location: src/types/layout.ts
export enum DensityLevel {
  EXPANDED = 0,
  NORMAL = 1,
  COMPACT = 2,
  COMPRESSED = 3,
  ULTRA_COMPRESSED = 4,
}

export interface LayoutOptions {
  spacingMultiplier: number;
  columnRatio: [number, number]; // e.g., [2, 1] for 2/3 and 1/3
  enableTruncation: boolean;
  lineHeightMultiplier: number;
}

export interface ResumeLayoutContextProps {
  densityLevel: DensityLevel;
  setDensityLevel: (level: DensityLevel) => void;
  isOverflowing: boolean;
  measureOverflow: (containerRef: React.RefObject<HTMLDivElement>) => void;
  layoutOptions: LayoutOptions;
  setLayoutOptions: (options: Partial<LayoutOptions>) => void;
}

// Helper function (needs implementation)
// const calculateSpacingForDensity = (level: DensityLevel): number => { /* ... */ return 1; };
// const calculateLineHeightForDensity = (level: DensityLevel): number => { /* ... */ return 1; };
```

Now, create a system to manage overall layout density:

```tsx
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
// Assuming DensityLevel and LayoutOptions are imported from src/types/layout.ts
// import { DensityLevel, LayoutOptions, ResumeLayoutContextProps } from '@/types/layout';

// Default values for the context
const defaultLayoutContextValues: ResumeLayoutContextProps = {
  densityLevel: DensityLevel.NORMAL,
  setDensityLevel: () => {},
  isOverflowing: false,
  measureOverflow: () => {},
  layoutOptions: {
    spacingMultiplier: 1,
    columnRatio: [2, 1], // 2/3 main column, 1/3 side column
    enableTruncation: false,
    lineHeightMultiplier: 1,
  },
  setLayoutOptions: () => {},
};

// Layout density context provider
const ResumeLayoutContext = createContext<ResumeLayoutContextProps>(defaultLayoutContextValues);

// Hook to consume layout context
// Suggested location: src/hooks/useResumeLayout.ts
export const useResumeLayout = () => useContext(ResumeLayoutContext);

interface ResumeLayoutProviderProps {
  children: ReactNode;
}

// Provider implementation
// Suggested location: src/context/ResumeLayoutProvider.tsx (or similar)
export const ResumeLayoutProvider = ({ children }: ResumeLayoutProviderProps) => {
  const [densityLevel, setDensityLevel] = useState<DensityLevel>(DensityLevel.NORMAL);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [layoutOptions, setLayoutOptions] = useState<LayoutOptions>({
    spacingMultiplier: 1,
    columnRatio: [2, 1],
    enableTruncation: false,
    lineHeightMultiplier: 1,
  });

  // Helper functions (need implementation) - these would likely be defined elsewhere
  const calculateSpacingForDensity = (level: DensityLevel): number => {
    // Example logic:
    switch(level) {
      case DensityLevel.EXPANDED: return 1.5;
      case DensityLevel.NORMAL: return 1;
      case DensityLevel.COMPACT: return 0.8;
      case DensityLevel.COMPRESSED: return 0.6;
      case DensityLevel.ULTRA_COMPRESSED: return 0.4;
      default: return 1;
    }
  };
  const calculateLineHeightForDensity = (level: DensityLevel): number => {
    // Example logic:
    switch(level) {
      case DensityLevel.EXPANDED: return 1.6;
      case DensityLevel.NORMAL: return 1.5;
      case DensityLevel.COMPACT: return 1.3;
      case DensityLevel.COMPRESSED: return 1.2;
      case DensityLevel.ULTRA_COMPRESSED: return 1.1;
      default: return 1.5;
    }
  };
  
  // Measure document overflow
  const measureOverflow = useCallback((containerRef: React.RefObject<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const { scrollHeight, clientHeight } = containerRef.current;
    const hasOverflow = scrollHeight > clientHeight;
    
    if (hasOverflow && densityLevel < DensityLevel.ULTRA_COMPRESSED) {
      const newDensityLevel = Math.min(densityLevel + 1, DensityLevel.ULTRA_COMPRESSED) as DensityLevel;
      setDensityLevel(newDensityLevel);
      
      setLayoutOptions(prev => ({
        ...prev,
        spacingMultiplier: calculateSpacingForDensity(newDensityLevel),
        lineHeightMultiplier: calculateLineHeightForDensity(newDensityLevel),
        enableTruncation: newDensityLevel >= DensityLevel.COMPRESSED,
      }));
    }
    
    setIsOverflowing(hasOverflow);
  }, [densityLevel]); // Removed calculateSpacingForDensity and calculateLineHeightForDensity if they are stable
  
  const value: ResumeLayoutContextProps = {
    densityLevel,
    setDensityLevel,
    isOverflowing,
    measureOverflow,
    layoutOptions,
    setLayoutOptions: (options: Partial<LayoutOptions>) => 
      setLayoutOptions(prev => ({ ...prev, ...options })),
  };
  
  return (
    <ResumeLayoutContext.Provider value={value}>
      {children}
    </ResumeLayoutContext.Provider>
  );
};
```

### 2. Responsive Sections

Create components that adjust their display based on density levels:

```tsx
// Suggested location: src/components/ResumeBuilder/ResponsiveSection.tsx
// Assuming DensityLevel is imported from src/types/layout.ts
// Assuming useResumeLayout is imported from src/hooks/useResumeLayout.ts

type Priority = 'high' | 'medium' | 'low';

interface ResponsiveSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  children: React.ReactNode;
  priority?: Priority;
}

const ResponsiveSection = ({ 
  title, 
  children, 
  priority = 'medium',
  className,
  ...props
}: ResponsiveSectionProps) => {
  const { densityLevel, layoutOptions } = useResumeLayout();
  const { spacingMultiplier } = layoutOptions;

  // Helper function (needs implementation or refinement)
  const getHeaderSize = (): string => {
    // Example: could also depend on densityLevel or be a fixed size like 'xl' or '2xl'
    switch(priority) {
        case 'high': return '2xl';
        case 'medium': return 'xl';
        case 'low': return 'lg';
        default: return 'xl';
    }
  };
  
  // Calculate margins based on priority and density
  const getMarginBottom = () => {
    const baseMargin = priority === 'high' ? 6 : priority === 'medium' ? 4 : 2;
    // Ensure Tailwind JIT can pick this up, or use style prop if necessary for dynamic values.
    // For fixed steps, this is fine.
    return Math.max(Math.floor(baseMargin * spacingMultiplier), 1); 
  };
  
  // Get section-specific styles based on density level
  const getSectionStyles = () => {
    switch(densityLevel) {
      case DensityLevel.EXPANDED:
        return 'leading-relaxed'; // Tailwind class for line-height
      case DensityLevel.NORMAL:
        return 'leading-normal';
      case DensityLevel.COMPACT:
        return 'leading-snug';
      case DensityLevel.COMPRESSED:
      case DensityLevel.ULTRA_COMPRESSED:
        return 'leading-tight';
      default:
        return 'leading-normal';
    }
  };
  
  return (
    <section 
      className={`mb-${getMarginBottom()} ${getSectionStyles()} ${className || ''}`}
      {...props}
    >
      {title && (
        <h2 className={`font-bold text-${getHeaderSize()} mb-${Math.max(Math.floor(2 * spacingMultiplier), 1)}`}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
};
```

### 3. Adaptive Column Layout

Create a responsive column system:

```tsx
// Suggested location: src/components/ResumeBuilder/AdaptiveColumns.tsx
// Assuming DensityLevel is imported from src/types/layout.ts
// Assuming useResumeLayout is imported from src/hooks/useResumeLayout.ts
import React, { Children, cloneElement, isValidElement, ReactNode } from 'react';


interface AdaptiveColumnsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode; // Expect multiple children for columns
  initialRatio?: [number, number];
  minWidthPx?: number; // Minimum column width in pixels
}

const AdaptiveColumns = ({ 
  children, 
  initialRatio = [2, 1], // Default 2/3 : 1/3
  minWidthPx = 120, // Minimum column width
  className,
  ...props
}: AdaptiveColumnsProps) => {
  const { densityLevel, layoutOptions } = useResumeLayout();
  const { columnRatio } = layoutOptions;
  
  const currentRatio = columnRatio || initialRatio;
  const totalParts = currentRatio.reduce((sum, part) => sum + part, 0);
  
  // Calculate column width percentages
  const columnWidths = currentRatio.map(part => `${(part / totalParts) * 100}%`);
  
  // Determine gap size based on density
  const getGapSize = () => {
    switch(densityLevel) {
      case DensityLevel.EXPANDED: return 'gap-8';
      case DensityLevel.NORMAL: return 'gap-6';
      case DensityLevel.COMPACT: return 'gap-4';
      case DensityLevel.COMPRESSED: return 'gap-2';
      case DensityLevel.ULTRA_COMPRESSED: return 'gap-1';
      default: return 'gap-6';
    }
  };
  
  return (
    <div 
      className={`flex flex-row ${getGapSize()} ${className || ''}`}
      {...props}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return null;
        
        // Typing for child.props.style if necessary, though spreading is often fine.
        const childStyle = (child.props as any).style || {};

        return cloneElement(child as React.ReactElement, {
          style: { 
            ...childStyle,
            width: columnWidths[index] || 'auto',
            minWidth: `${minWidthPx}px`
          }
        });
      })}
    </div>
  );
};
```

### 4. Content Truncation

Create components that intelligently truncate content:

```tsx
// Suggested location: src/components/ResumeBuilder/TruncatableText.tsx
// Assuming DensityLevel and LayoutOptions are imported from src/types/layout.ts
// Assuming useResumeLayout is imported from src/hooks/useResumeLayout.ts
import React, { useEffect, useRef, useState, HTMLAttributes } from 'react';

interface TruncatableTextProps extends HTMLAttributes<HTMLDivElement> {
  text: string; 
  maxLines?: number;
  ellipsis?: string;
  alwaysShowFull?: boolean; // Renamed from alwaysShow for clarity
}

const TruncatableText = ({ 
  text, 
  maxLines = 3,
  ellipsis = '...',
  alwaysShowFull = false,
  className,
  ...props
}: TruncatableTextProps) => {
  const { densityLevel, layoutOptions } = useResumeLayout();
  const { enableTruncation } = layoutOptions;
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isTruncated, setIsTruncated] = useState(false); // Renamed for clarity
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    if (alwaysShowFull || !enableTruncation) {
      setDisplayText(text);
      setIsTruncated(false);
      return;
    }
    
    if (textRef.current) {
      // Ensure styles are applied and element is in DOM for accurate measurement
      // This might require a small delay or layout effect in some cases.
      const computedStyle = window.getComputedStyle(textRef.current);
      const lineHeightString = computedStyle.lineHeight;
      
      // Handle cases where lineHeight is 'normal' or unitless
      let lineHeight: number;
      if (lineHeightString === 'normal') {
        // Approximate line height, or use a more robust method if available
        const fontSizeString = computedStyle.fontSize;
        lineHeight = parseFloat(fontSizeString) * 1.2; // Common approximation
      } else {
        lineHeight = parseFloat(lineHeightString);
      }

      if (isNaN(lineHeight) || lineHeight <= 0) {
        // Fallback if lineHeight can't be determined
        setDisplayText(text);
        setIsTruncated(false);
        return;
      }
      
      const maxHeight = lineHeight * maxLines;
      
      if (textRef.current.scrollHeight > maxHeight) {
        // Truncation logic might need refinement for better accuracy
        // Consider words instead of characters, or a library for complex truncation.
        let currentText = text;
        // Iteratively remove words until it fits (can be slow for very long text)
        // A simpler character-based approximation is used in the original:
        const avgCharsPerLine = Math.max(1, Math.ceil(text.length / (textRef.current.scrollHeight / lineHeight)));
        let targetLength = Math.max(0, avgCharsPerLine * maxLines - ellipsis.length);
        
        // Ensure we don't cut in the middle of a word if possible (simplified)
        let truncatedText = text.substring(0, targetLength);
        const lastSpace = truncatedText.lastIndexOf(' ');
        if (text.length > targetLength && lastSpace > 0 && targetLength - lastSpace < 10) { // Heuristic
            truncatedText = truncatedText.substring(0, lastSpace);
        }

        setDisplayText(truncatedText + ellipsis);
        setIsTruncated(true);
      } else {
        setDisplayText(text);
        setIsTruncated(false);
      }
    }
  }, [text, maxLines, ellipsis, densityLevel, enableTruncation, alwaysShowFull, layoutOptions.lineHeightMultiplier]); // Added layoutOptions.lineHeightMultiplier as it might affect line height
  
  return (
    <div className={className} {...props}>
      <p ref={textRef} className="whitespace-pre-line">
        {displayText}
      </p>
      {/* Optionally, show a "read more" button if isTruncated is true */}
    </div>
  );
};
```

### 5. Dynamic List Compression

Create list components that adapt to space constraints:

```tsx
// Suggested location: src/components/ResumeBuilder/CompressibleList.tsx
// Assuming DensityLevel is imported from src/types/layout.ts
// Assuming useResumeLayout is imported from src/hooks/useResumeLayout.ts
import React, { ReactNode, HTMLAttributes } from 'react';

interface CompressibleListProps<TItem> extends HTMLAttributes<HTMLDivElement> {
  items: TItem[]; 
  renderItem: (item: TItem, index: number) => ReactNode; 
  minItems?: number;
  maxItems?: number; // Represents the maximum items in EXPANDED state
}

const CompressibleList = <TItem,>({ 
  items, 
  renderItem, 
  minItems = 3,
  maxItems: initialMaxItems = 10, // Renamed for clarity
  className,
  ...props 
}: CompressibleListProps<TItem>) => {
  const { densityLevel } = useResumeLayout();
  
  const getVisibleItemsCount = () => {
    switch(densityLevel) {
      case DensityLevel.EXPANDED: 
        return initialMaxItems;
      case DensityLevel.NORMAL: 
        return Math.max(minItems, Math.floor(initialMaxItems * 0.8));
      case DensityLevel.COMPACT: 
        return Math.max(minItems, Math.floor(initialMaxItems * 0.6));
      case DensityLevel.COMPRESSED: 
        return Math.max(minItems, Math.floor(initialMaxItems * 0.4));
      case DensityLevel.ULTRA_COMPRESSED: 
        return minItems;
      default: 
        return initialMaxItems;
    }
  };
  
  const visibleItemCount = getVisibleItemsCount();
  const visibleItems = items.slice(0, visibleItemCount);
  const hiddenCount = items.length - visibleItems.length;
  
  return (
    <div className={className} {...props}>
      <ul className="list-disc pl-5"> {/* Consider custom list styling if needed */}
        {visibleItems.map((item, index) => (
          <li key={index} className="mb-1"> {/* Ensure key is stable and unique if item has an ID */}
            {renderItem(item, index)}
          </li>
        ))}
        
        {hiddenCount > 0 && (
          <li className="text-gray-500 italic mt-1"> {/* Added mt-1 for spacing */}
            +{hiddenCount} more item{hiddenCount !== 1 ? 's' : ''}
          </li>
        )}
      </ul>
    </div>
  );
};
```

### 6. Template Integration

Example of integrating dynamic layout components into a template:
(Types for `resumeData`, `ExperienceItem` would be defined in `src/types/resume.ts` or similar)

```tsx
// Suggested location: src/components/Templates/DynamicTemplate/DynamicTemplate.tsx
import React, { useRef, useEffect, ReactNode } from 'react';
// Assuming imports for:
// - ResumeLayoutProvider, useResumeLayout
// - ResponsiveSection, AdaptiveColumns, TruncatableText, CompressibleList
// - DensityLevel from '@/types/layout'
// - ResumeData, ExperienceItem (etc.) from '@/types/resume' (define these based on your actual data)

// Example Data Structure (should be defined in src/types/resume.ts)
interface ExperienceItem {
  id: string; // Add id for stable keys
  title: string;
  date: string;
  company: string;
  description: string;
}

interface ProjectItem { // Example
  id: string;
  name: string;
  description: string;
}

interface ResumeData {
  fullName?: string;
  jobTitle?: string;
  contact?: { email?: string; phone?: string; linkedIn?: string };
  summary?: string;
  experience?: ExperienceItem[];
  projects?: ProjectItem[];
  skills?: { id: string; name: string; level?: string }[];
  education?: { id: string; degree?: string; school?: string; date?: string }[];
  languages?: { id: string; name: string; proficiency?: string }[];
}

// Header Component (Example - needs to be created)
// interface HeaderProps { resumeData: ResumeData; }
// const Header = ({ resumeData }: HeaderProps) => (
//   <div>
//     <h1 className="text-3xl font-bold">{resumeData.fullName}</h1>
//     <p className="text-xl">{resumeData.jobTitle}</p>
//     {/* ... more header details */}
//   </div>
// );


interface DynamicTemplateProps {
  resumeData: ResumeData;
}

const DynamicTemplate = ({ resumeData }: DynamicTemplateProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Assuming measureOverflow and densityLevel are obtained from useResumeLayout()
  // This component should be wrapped in ResumeLayoutProvider at a higher level.
  const { measureOverflow, densityLevel } = useResumeLayout(); 
  
  useEffect(() => {
    if (containerRef.current) {
      measureOverflow(containerRef);
    }
  }, [resumeData, measureOverflow, densityLevel]); // Re-measure if density changes externally too
  
  return (
    <div 
      ref={containerRef}
      className="p-4 sm:p-6 md:p-8 w-full h-full mx-auto bg-white font-sans overflow-y-auto" // Added overflow-y-auto for scrollbar if content still overflows
      style={{ fontFamily: '"Inter", sans-serif' }} // Example: using a common sans-serif font
    >
      <ResponsiveSection priority="high">
        {/* <Header resumeData={resumeData} /> */}
        {/* Placeholder for actual Header component */}
        <div>
          <h1 className="text-3xl font-bold">{resumeData.fullName || 'Your Name'}</h1>
          <p className="text-xl text-gray-700">{resumeData.jobTitle || 'Your Job Title'}</p>
          {/* Add more contact info etc. here */}
        </div>
      </ResponsiveSection>
      
      <AdaptiveColumns initialRatio={[3, 2]} minWidthPx={200}>
        {/* Main Column */}
        <div className="main-column space-y-4"> {/* Added space-y for consistent spacing */}
          {resumeData.summary && (
            <ResponsiveSection title="Summary" priority="high">
              <TruncatableText text={resumeData.summary} maxLines={densityLevel < DensityLevel.COMPACT ? 5 : 3} />
            </ResponsiveSection>
          )}

          {resumeData.experience && resumeData.experience.length > 0 && (
            <ResponsiveSection title="Experience" priority="high">
              <CompressibleList
                items={resumeData.experience}
                minItems={1} // Show at least one experience item
                initialMaxItems={3} // Max items in expanded view
                renderItem={(exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-center">
                      <strong className="text-md font-semibold">{exp.title}</strong>
                      <span className="text-xs text-gray-600">{exp.date}</span>
                    </div>
                    <div className="text-sm italic text-gray-700">{exp.company}</div>
                    <TruncatableText 
                      text={exp.description}
                      maxLines={densityLevel < DensityLevel.COMPRESSED ? 3 : 2}
                      className="mt-1 text-sm text-gray-600"
                    />
                  </div>
                )}
              />
            </ResponsiveSection>
          )}
          
          {resumeData.projects && resumeData.projects.length > 0 && (
            <ResponsiveSection title="Projects" priority="medium">
              <CompressibleList
                items={resumeData.projects}
                minItems={1}
                initialMaxItems={3}
                renderItem={(proj) => (
                  <div key={proj.id}>
                    <strong className="text-md font-semibold">{proj.name}</strong>
                    <TruncatableText 
                      text={proj.description}
                      maxLines={densityLevel < DensityLevel.COMPRESSED ? 2 : 1}
                      className="mt-1 text-sm text-gray-600"
                    />
                  </div>
                )}
              />
            </ResponsiveSection>
          )}
        </div>
        
        {/* Side Column */}
        <div className="side-column space-y-4">
          {resumeData.skills && resumeData.skills.length > 0 && (
            <ResponsiveSection title="Skills" priority="high">
              {/* Skills might need a different kind of compressible display, e.g., tag cloud or simple list */}
              <ul className="list-disc pl-5 text-sm">
                {resumeData.skills.slice(0, densityLevel < DensityLevel.COMPACT ? 10 : 5).map(skill => (
                  <li key={skill.id}>{skill.name} {skill.level && `(${skill.level})`}</li>
                ))}
                {resumeData.skills.length > (densityLevel < DensityLevel.COMPACT ? 10 : 5) && (
                  <li className="text-gray-500 italic text-xs">
                    +{resumeData.skills.length - (densityLevel < DensityLevel.COMPACT ? 10 : 5)} more...
                  </li>
                )}
              </ul>
            </ResponsiveSection>
          )}
          
          {resumeData.education && resumeData.education.length > 0 && (
            <ResponsiveSection title="Education" priority="medium">
               <CompressibleList
                items={resumeData.education}
                minItems={1}
                initialMaxItems={2}
                renderItem={(edu) => (
                  <div key={edu.id}>
                    <strong className="text-md font-semibold">{edu.degree}</strong>
                    <div className="text-sm italic text-gray-700">{edu.school}</div>
                    <div className="text-xs text-gray-600">{edu.date}</div>
                  </div>
                )}
              />
            </ResponsiveSection>
          )}
          
          {resumeData.languages && resumeData.languages.length > 0 && (
            <ResponsiveSection title="Languages" priority="low">
              <ul className="text-sm">
                {resumeData.languages.slice(0, densityLevel < DensityLevel.COMPACT ? 5 : 3).map(lang => (
                  <li key={lang.id}>{lang.name} {lang.proficiency && `(${lang.proficiency})`}</li>
                ))}
              </ul>
            </ResponsiveSection>
          )}
        </div>
      </AdaptiveColumns>
    </div>
  );
};

// Note: The DynamicTemplate component itself should be wrapped with ResumeLayoutProvider
// somewhere higher up in your application tree, for example:
//
// <ResumeLayoutProvider>
//   <DynamicTemplate resumeData={someData} />
// </ResumeLayoutProvider>
//
// Also, remember to create and test these components thoroughly.
// Unit tests should be placed in the corresponding `tests/unit` directory structure.
```

## Advantages and Considerations

### Advantages
- Maintains visual balance and professional appearance
- Preserves most important content while intelligently compressing less critical items
- Can be combined with the auto-scaling approach for more flexibility
- User can control density level manually if desired
- Works well with variable amounts of content

### Considerations
- Complex to implement correctly across all template types
- Requires careful testing to ensure appropriate compression behavior
- May need visual indicators to show when content is being compressed
- Should offer users a way to override automatic compression

## Implementation Roadmap

1.  Create the layout density context (`ResumeLayoutContext`) and provider (`ResumeLayoutProvider`).
    *   Define `DensityLevel` enum and `LayoutOptions` interface in `src/types/layout.ts`.
    *   Place `ResumeLayoutProvider` in `src/context/resume/` or similar.
    *   Place `useResumeLayout` hook in `src/hooks/`.
2.  Implement responsive section components (`ResponsiveSection`).
    *   Place in `src/components/ResumeBuilder/DynamicLayout/ResponsiveSection.tsx` (or similar).
    *   Define `ResponsiveSectionProps`.
    *   Implement helper functions like `getHeaderSize` or make them configurable.
3.  Build adaptive column system (`AdaptiveColumns`).
    *   Place in `src/components/ResumeBuilder/DynamicLayout/AdaptiveColumns.tsx`.
    *   Define `AdaptiveColumnsProps`.
4.  Add content truncation components (`TruncatableText`).
    *   Place in `src/components/ResumeBuilder/DynamicLayout/TruncatableText.tsx`.
    *   Define `TruncatableTextProps`.
    *   Refine truncation logic for accuracy and performance if needed. Consider edge cases with line heights.
5.  Create compressible list components (`CompressibleList`).
    *   Place in `src/components/ResumeBuilder/DynamicLayout/CompressibleList.tsx`.
    *   Define `CompressibleListProps`.
6.  Modify templates to use dynamic layout system (e.g., `DynamicTemplate`).
    *   Ensure actual resume data types (`ResumeData`, `ExperienceItem`, etc.) are well-defined in `src/types/resume.ts`.
    *   Integrate the dynamic components.
7.  Add manual density controls for user adjustment (consider UI elements for this).
8.  Implement visual indicators for compressed content (e.g., "show more" buttons, visual cues).
9.  Test with various content volumes and optimize behavior.
    *   Write unit tests for each component and hook in the `tests/unit/` directory, mirroring the `src/` structure.
    *   Test for accessibility (keyboard navigation, screen reader compatibility).
10. Ensure helper functions like `calculateSpacingForDensity` and `calculateLineHeightForDensity` are robustly implemented and potentially configurable. 
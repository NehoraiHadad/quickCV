# Auto-Scaling Content Approach

## Core Principles
- **Progressive Text Scaling**: Automatically adjust font size based on content volume
- **Maintain Proportions**: Scale text while preserving proportional relationships between elements
- **Preserve Readability**: Enforce minimum font size thresholds to ensure content remains readable
- **Section Priority**: Apply different scaling factors to different resume sections
- **Smart Truncation**: Combine scaling with intelligent truncation for optimal results

## Implementation Strategy

### 1. Content Overflow Detection
- Create reusable content wrappers that monitor element dimensions
- Implement ResizeObserver to detect when content exceeds boundaries
- Measure both horizontal and vertical overflow to handle different constraints

```tsx
// src/hooks/useContentOverflow.ts
import { useState, useEffect, RefObject } from 'react';

interface ContentOverflowResult {
  isOverflowing: boolean;
  overflowAmount: number;
}

export const useContentOverflow = (ref: RefObject<HTMLElement>): ContentOverflowResult => {
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [overflowAmount, setOverflowAmount] = useState<number>(0);

  useEffect(() => {
    const checkOverflow = (): void => {
      if (!ref.current) return;
      
      const { scrollHeight, clientHeight } = ref.current;
      const calculatedOverflow = Math.max(0, scrollHeight - clientHeight);
      
      setIsOverflowing(calculatedOverflow > 0);
      setOverflowAmount(calculatedOverflow);
    };

    // Initial check
    checkOverflow();

    // Setup observer
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref]);

  return { isOverflowing, overflowAmount };
};
```

### 2. Text Scaling Components

Create wrapper components that automatically adjust text size:

```tsx
// src/components/ui/ScalableText.tsx
import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { useContentOverflow } from '@/hooks/useContentOverflow';

interface ScalableTextProps {
  content: ReactNode;
  initialFontSize?: number;
  minFontSize?: number;
  scaleStep?: number;
  className?: string;
  [key: string]: any;
}

export const ScalableText: React.FC<ScalableTextProps> = ({
  content,
  initialFontSize = 16,
  minFontSize = 10,
  scaleStep = 0.5,
  className = '',
  ...props
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number>(initialFontSize);
  const { isOverflowing } = useContentOverflow(contentRef);

  useEffect(() => {
    if (isOverflowing && fontSize > minFontSize) {
      setFontSize(prev => Math.max(prev - scaleStep, minFontSize));
    }
  }, [isOverflowing, fontSize, minFontSize, scaleStep]);

  return (
    <div 
      ref={contentRef}
      className={className}
      style={{ fontSize: `${fontSize}px` }}
      {...props}
    >
      {content}
    </div>
  );
};
```

### 3. Section-Specific Scaling

Different resume sections should scale differently:

- **Headers**: Scale less aggressively, maintain prominence
- **Body Text**: Can scale more to fit content
- **Lists**: Can use combination of scaling and item compression

### 4. Template Integration

Integrate scaling components into existing templates:

```tsx
// src/components/Templates/ExperienceSection.tsx
import React from 'react';
import { ScalableText } from '@/components/ui/ScalableText';
import { Experience } from '@/types/resume';

interface ExperienceSectionProps {
  experiences: Experience[];
  templateColors: {
    primary: string;
    secondary?: string;
  };
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ 
  experiences, 
  templateColors 
}) => {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-4" style={{ color: templateColors.primary }}>
        Experience
      </h2>
      
      {experiences.map((exp, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-center">
            <ScalableText 
              content={<strong>{exp.title}</strong>} 
              initialFontSize={16}
              minFontSize={14}
              className="font-bold"
            />
            <ScalableText 
              content={exp.date} 
              initialFontSize={14}
              minFontSize={12}
              className="text-gray-600"
            />
          </div>
          
          <ScalableText 
            content={exp.company} 
            initialFontSize={14}
            minFontSize={12}
            className="italic text-gray-700"
          />
          
          <ScalableText 
            content={exp.description} 
            initialFontSize={14}
            minFontSize={10}
            className="mt-1 text-gray-800"
          />
        </div>
      ))}
    </section>
  );
};
```

## Advantages and Considerations

### Advantages
- No page breaks or pagination required
- Preserves the overall visual structure of the resume
- Allows finer control over which elements scale and by how much
- Works well with print layouts as content stays within boundaries

### Considerations
- Too much scaling can make text difficult to read
- May not work well for resumes with excessive content
- Requires careful testing across different content volumes
- Should provide visual feedback when scaling occurs

## Implementation Roadmap

1. Create base scaling hooks in `src/hooks/useContentOverflow.ts`
2. Implement UI components in `src/components/ui/ScalableText.tsx`
3. Add type definitions in `src/types/resume.ts` for scaling configuration
4. Modify template sections to use scaling components
5. Add configuration options in the resume context for scaling preferences
6. Implement visual indicators when extreme scaling occurs
7. Add feedback to users about which sections are causing overflow 
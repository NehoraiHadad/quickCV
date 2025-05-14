# Shared Content Management Strategy

## Overview
This document outlines a unified approach to content management in the resume builder, integrating three strategies:
1. **Auto-Scaling Content**: Dynamically adjusts font sizes to fit content
2. **Dynamic Layout Adjustment**: Adapts spacing and component visibility based on content volume
3. **Multi-Page Support**: Enables content to flow across multiple pages

## Common Components & Utilities

### Content Overflow Detection
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

## Unified Context Provider

All approaches need a shared content management context:

```tsx
// src/context/resume/contentLayoutContext.tsx
import React, { createContext, useState, useContext, useCallback, ReactNode, RefObject } from 'react';

export enum ContentStrategy {
  AUTO_SCALING = 'auto-scaling',
  DYNAMIC_LAYOUT = 'dynamic-layout',
  MULTI_PAGE = 'multi-page',
}

export enum DensityLevel {
  EXPANDED = 0,
  NORMAL = 1,
  COMPACT = 2,
  COMPRESSED = 3,
  ULTRA_COMPRESSED = 4,
}

export interface LayoutOptions {
  contentStrategy: ContentStrategy;
  densityLevel: DensityLevel;
  enableTruncation: boolean;
  spacingMultiplier: number;
  lineHeightMultiplier: number;
  paginationEnabled: boolean;
  pageSize: 'A4' | 'Letter';
  initialFontSize: number;
  minFontSize: number;
}

export interface ContentLayoutContextProps {
  layoutOptions: LayoutOptions;
  setLayoutOptions: (options: Partial<LayoutOptions>) => void;
  isOverflowing: boolean;
  overflowAmount: number;
  measureOverflow: (containerRef: RefObject<HTMLDivElement>) => void;
}

const defaultLayoutOptions: LayoutOptions = {
  contentStrategy: ContentStrategy.AUTO_SCALING,
  densityLevel: DensityLevel.NORMAL,
  enableTruncation: false,
  spacingMultiplier: 1,
  lineHeightMultiplier: 1,
  paginationEnabled: false,
  pageSize: 'A4',
  initialFontSize: 16,
  minFontSize: 10,
};

const ContentLayoutContext = createContext<ContentLayoutContextProps>({
  layoutOptions: defaultLayoutOptions,
  setLayoutOptions: () => {},
  isOverflowing: false,
  overflowAmount: 0,
  measureOverflow: () => {},
});

export const useContentLayout = () => useContext(ContentLayoutContext);

export const ContentLayoutProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [layoutOptions, setLayoutOptions] = useState<LayoutOptions>(defaultLayoutOptions);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [overflowAmount, setOverflowAmount] = useState(0);

  const measureOverflow = useCallback((containerRef: RefObject<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const { scrollHeight, clientHeight } = containerRef.current;
    const calculatedOverflow = Math.max(0, scrollHeight - clientHeight);
    
    setIsOverflowing(calculatedOverflow > 0);
    setOverflowAmount(calculatedOverflow);
  }, []);

  return (
    <ContentLayoutContext.Provider
      value={{
        layoutOptions,
        setLayoutOptions: (options) => setLayoutOptions(prev => ({ ...prev, ...options })),
        isOverflowing,
        overflowAmount,
        measureOverflow,
      }}
    >
      {children}
    </ContentLayoutContext.Provider>
  );
};
```

## Core Shared Components

### Adaptive Content Wrapper

This component integrates all three strategies:

```tsx
// src/components/ResumeBuilder/ContentManagement/AdaptiveContentWrapper.tsx
import React, { useRef, useEffect } from 'react';
import { useContentLayout, ContentStrategy } from '@/context/resume/contentLayoutContext';
import { ScalableText } from './ScalableText';
import { TruncatableText } from './TruncatableText';
import MultiPageContainer from './MultiPageContainer';

interface AdaptiveContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const AdaptiveContentWrapper: React.FC<AdaptiveContentWrapperProps> = ({
  children,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    layoutOptions, 
    measureOverflow,
  } = useContentLayout();
  
  const { 
    contentStrategy, 
    paginationEnabled, 
    pageSize 
  } = layoutOptions;

  useEffect(() => {
    if (containerRef.current) {
      measureOverflow(containerRef);
    }
  }, [children, measureOverflow]);

  // Choose rendering strategy based on configuration
  if (paginationEnabled) {
    return (
      <MultiPageContainer pageSize={pageSize}>
        {children}
      </MultiPageContainer>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`adaptive-content-wrapper ${className}`}
    >
      {children}
    </div>
  );
};
```

### Smart Content Component

A component that adapts based on selected strategy:

```tsx
// src/components/ResumeBuilder/ContentManagement/SmartContent.tsx
import React from 'react';
import { useContentLayout, ContentStrategy } from '@/context/resume/contentLayoutContext';
import { ScalableText } from './ScalableText';
import { TruncatableText } from './TruncatableText';

interface SmartContentProps {
  content: React.ReactNode;
  className?: string;
  priority?: 'high' | 'medium' | 'low';
  maxLines?: number;
}

export const SmartContent: React.FC<SmartContentProps> = ({
  content,
  className = '',
  priority = 'medium',
  maxLines = 3,
}) => {
  const { layoutOptions } = useContentLayout();
  const { 
    contentStrategy, 
    initialFontSize, 
    minFontSize,
    densityLevel,
    enableTruncation
  } = layoutOptions;

  // Determine line height based on density level
  const getLineHeight = () => {
    switch(densityLevel) {
      case 0: return 1.6; // EXPANDED
      case 1: return 1.5; // NORMAL
      case 2: return 1.3; // COMPACT
      case 3: return 1.2; // COMPRESSED
      case 4: return 1.1; // ULTRA_COMPRESSED
      default: return 1.5;
    }
  };

  // Set font size based on content priority
  const getFontSize = () => {
    const baseFontSize = 
      priority === 'high' ? initialFontSize : 
      priority === 'medium' ? initialFontSize - 2 : 
      initialFontSize - 4;
    
    return baseFontSize;
  };

  // Calculate max lines based on priority and density
  const getMaxLines = () => {
    if (densityLevel >= 3) { // COMPRESSED or higher
      return Math.max(1, maxLines - 2);
    } else if (densityLevel >= 2) { // COMPACT
      return Math.max(1, maxLines - 1);
    }
    return maxLines;
  };

  switch (contentStrategy) {
    case ContentStrategy.AUTO_SCALING:
      return (
        <ScalableText 
          content={content}
          initialFontSize={getFontSize()}
          minFontSize={minFontSize}
          className={className}
          lineHeight={getLineHeight()}
        />
      );
      
    case ContentStrategy.DYNAMIC_LAYOUT:
      return (
        <TruncatableText
          text={typeof content === 'string' ? content : ''}
          maxLines={getMaxLines()}
          alwaysShowFull={!enableTruncation}
          className={className}
        />
      );
      
    case ContentStrategy.MULTI_PAGE:
    default:
      return (
        <div className={className}>
          {content}
        </div>
      );
  }
};
```

### Strategy Selection UI

```tsx
// src/components/ResumeBuilder/ContentManagement/ContentStrategySelector.tsx
import React from 'react';
import { useContentLayout, ContentStrategy } from '@/context/resume/contentLayoutContext';

export const ContentStrategySelector: React.FC = () => {
  const { layoutOptions, setLayoutOptions } = useContentLayout();

  return (
    <div className="content-strategy-selector p-4 bg-white rounded shadow">
      <h3 className="text-lg font-medium mb-4">Content Management Strategy</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Strategy</label>
          <select 
            className="w-full p-2 border rounded"
            value={layoutOptions.contentStrategy}
            onChange={(e) => setLayoutOptions({ 
              contentStrategy: e.target.value as ContentStrategy 
            })}
          >
            <option value={ContentStrategy.AUTO_SCALING}>Auto-Scaling</option>
            <option value={ContentStrategy.DYNAMIC_LAYOUT}>Dynamic Layout</option>
            <option value={ContentStrategy.MULTI_PAGE}>Multi-Page</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="pagination-toggle"
            checked={layoutOptions.paginationEnabled}
            onChange={(e) => setLayoutOptions({ 
              paginationEnabled: e.target.checked 
            })}
            className="mr-2"
          />
          <label htmlFor="pagination-toggle" className="text-sm">
            Enable pagination
          </label>
        </div>

        {layoutOptions.contentStrategy === ContentStrategy.AUTO_SCALING && (
          <div>
            <label className="block text-sm font-medium mb-1">Minimum Font Size</label>
            <input 
              type="range"
              min="8"
              max="14"
              value={layoutOptions.minFontSize}
              onChange={(e) => setLayoutOptions({ 
                minFontSize: parseInt(e.target.value) 
              })}
              className="w-full"
            />
            <div className="text-sm text-gray-500">{layoutOptions.minFontSize}px</div>
          </div>
        )}

        {layoutOptions.contentStrategy === ContentStrategy.DYNAMIC_LAYOUT && (
          <div>
            <label className="block text-sm font-medium mb-1">Density Level</label>
            <input 
              type="range"
              min="0"
              max="4"
              value={layoutOptions.densityLevel}
              onChange={(e) => setLayoutOptions({ 
                densityLevel: parseInt(e.target.value) 
              })}
              className="w-full"
            />
            <div className="text-sm text-gray-500">
              {layoutOptions.densityLevel === 0 && "Expanded"}
              {layoutOptions.densityLevel === 1 && "Normal"}
              {layoutOptions.densityLevel === 2 && "Compact"}
              {layoutOptions.densityLevel === 3 && "Compressed"}
              {layoutOptions.densityLevel === 4 && "Ultra Compressed"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

## Implementation Roadmap

1. Create shared types and context
   - Implement `useContentOverflow` hook
   - Create `ContentLayoutContext` and provider

2. Build base components
   - `ScalableText` from auto-scaling approach
   - `TruncatableText` from dynamic layout approach
   - `MultiPageContainer` from multi-page approach

3. Implement wrapper components
   - `AdaptiveContentWrapper` 
   - `SmartContent`
   - `ContentStrategySelector`

4. Update template components to use the new system
   - Modify section components to use `SmartContent`
   - Wrap entire templates with `AdaptiveContentWrapper`

5. Add configuration UI
   - Include strategy selector in resume builder settings

## Benefits of the Unified Approach

- **User Flexibility**: Users can choose their preferred content management strategy
- **Code Reusability**: Core components and logic are shared across strategies
- **Progressive Enhancement**: Start with the simplest strategy and add more as needed
- **Maintainability**: Unified context and types make the codebase easier to maintain
- **Feature Consistency**: All strategies support the same set of base features

This unified approach allows templates to handle content overflow gracefully while maintaining visual quality and professional appearance, regardless of which specific strategy is active. 
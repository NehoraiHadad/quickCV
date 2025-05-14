# Multi-Page Support Approach

## Core Principles
- **Content Continuity**: Allow resume content to flow naturally across multiple pages
- **Smart Pagination**: Intelligently break content at logical section boundaries
- **Consistent Styling**: Maintain consistent look and feel across all pages
- **Print Optimization**: Ensure pagination works correctly for both screen viewing and printing
- **Simple Navigation**: Provide intuitive controls for navigating between pages

## Implementation Strategy

### 1. Page Container System

Create a flexible container system to manage multiple A4 pages:

```tsx
// MultiPageContainer component
import React, { useState, useRef, useEffect } from 'react';
import { paginateContent } from '@/utils/template/pagination';
import { PageSize } from '@/types/template';

interface MultiPageContainerProps {
  children: React.ReactNode;
  pageSize?: PageSize;
}

const MultiPageContainer: React.FC<MultiPageContainerProps> = ({ 
  children, 
  pageSize = "A4" 
}) => {
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Calculate sizes based on page format
  const pageDimensions = {
    A4: { width: "210mm", height: "297mm" },
    Letter: { width: "215.9mm", height: "279.4mm" },
    // Other sizes as needed
  }[pageSize] || { width: "210mm", height: "297mm" };
  
  useEffect(() => {
    // Process content into pages
    if (contentRef.current) {
      const paginatedContent = paginateContent(contentRef.current, pageDimensions);
      setPages(paginatedContent);
    }
  }, [children, pageSize]);
  
  return (
    <div className="multi-page-container print:block">
      <div className="hidden" ref={contentRef}>{children}</div>
      
      {pages.map((pageContent, index) => (
        <div 
          key={`page-${index}`} 
          className="page bg-white shadow-md mx-auto my-8 print:my-0 print:shadow-none"
          style={{
            width: pageDimensions.width,
            height: pageDimensions.height,
            overflow: "hidden",
            pageBreakAfter: "always"
          }}
        >
          {pageContent}
        </div>
      ))}
    </div>
  );
};

export default MultiPageContainer;
```

### 2. Content Pagination Logic

Implement intelligent logic to split content across pages:

```tsx
// src/utils/template/pagination.ts
import { PageDimensions } from '@/types/template';
import { convertMmToPx, getElementHeight } from '@/utils/template/measurements';

/**
 * Paginates content across multiple pages
 */
export function paginateContent(
  contentElement: HTMLElement, 
  dimensions: PageDimensions
): React.ReactNode[] {
  const pages: string[] = [];
  const pageHeight = dimensions.height;
  
  // Clone the content to manipulate
  const contentClone = contentElement.cloneNode(true) as HTMLElement;
  
  // Get all direct child elements
  const childElements = Array.from(contentClone.children);
  let currentPage = document.createElement('div');
  let currentPageHeight = 0;
  
  // Process each section
  childElements.forEach(section => {
    const sectionHeight = getElementHeight(section as HTMLElement);
    
    // If section fits in current page
    if (currentPageHeight + sectionHeight <= convertMmToPx(pageHeight)) {
      currentPage.appendChild(section.cloneNode(true));
      currentPageHeight += sectionHeight;
    }
    // If section doesn't fit but can be split (like long lists)
    else if (canSplitSection(section as HTMLElement)) {
      const { firstPart, secondPart } = splitSection(
        section as HTMLElement, 
        convertMmToPx(pageHeight) - currentPageHeight
      );
      
      if (firstPart) {
        currentPage.appendChild(firstPart);
        pages.push(currentPage.innerHTML);
        
        // Start new page with continuation
        currentPage = document.createElement('div');
        currentPage.appendChild(createContinuationHeader(section as HTMLElement));
        currentPage.appendChild(secondPart);
        currentPageHeight = getElementHeight(createContinuationHeader(section as HTMLElement)) + 
                          getElementHeight(secondPart);
      }
    }
    // If section doesn't fit and can't be split, move to next page
    else {
      pages.push(currentPage.innerHTML);
      currentPage = document.createElement('div');
      currentPage.appendChild(section.cloneNode(true));
      currentPageHeight = sectionHeight;
    }
  });
  
  // Add the last page if not empty
  if (currentPage.children.length > 0) {
    pages.push(currentPage.innerHTML);
  }
  
  return pages.map(htmlContent => (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  ));
}
```

### 3. Section Splitting Logic

Create rules for how different section types should be split:

```tsx
// src/utils/template/pagination.ts (continued)

/**
 * Determines if a section can be split across pages
 */
export function canSplitSection(section: HTMLElement): boolean {
  // Sections like experience or education with multiple items can be split
  if (section.classList.contains('experience') || 
      section.classList.contains('education') ||
      section.classList.contains('projects')) {
    return section.children.length > 1;
  }
  
  // Headers and short sections shouldn't be split
  return false;
}

/**
 * Splits a section into two parts that can go on different pages
 */
export function splitSection(section: HTMLElement, availableHeight: number): { 
  firstPart: HTMLElement; 
  secondPart: HTMLElement; 
} {
  const sectionClone = section.cloneNode(true) as HTMLElement;
  const items = Array.from(sectionClone.children);
  
  const firstPart = document.createElement('div');
  firstPart.className = section.className;
  
  const secondPart = document.createElement('div');
  secondPart.className = section.className;
  
  // Always include section header in first part
  if (items[0]?.tagName === 'H2' || items[0]?.tagName === 'H3') {
    firstPart.appendChild(items[0].cloneNode(true));
    items.shift();
  }
  
  let currentHeight = getElementHeight(firstPart);
  
  // Add items to first part until we run out of space
  for (const item of items) {
    const itemHeight = getElementHeight(item as HTMLElement);
    
    if (currentHeight + itemHeight <= availableHeight) {
      firstPart.appendChild(item.cloneNode(true));
      currentHeight += itemHeight;
    } else {
      // Remaining items go to second part
      for (let i = items.indexOf(item); i < items.length; i++) {
        secondPart.appendChild(items[i].cloneNode(true));
      }
      break;
    }
  }
  
  return { firstPart, secondPart };
}

/**
 * Creates a header indicating content continuation
 */
export function createContinuationHeader(section: HTMLElement): HTMLElement {
  const header = document.createElement('div');
  header.className = 'continuation-header text-sm text-gray-500 italic mb-2';
  
  // Get the section title if it exists
  const sectionTitle = section.querySelector('h2, h3')?.textContent || 'Section';
  header.textContent = `${sectionTitle} (continued)`;
  
  return header;
}
```

### 4. Page Navigation UI

Implement controls for navigating between pages:

```tsx
// src/components/ResumeBuilder/ResumePreview/PageNavigation.tsx
import React from 'react';

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  return (
    <div className="page-navigation flex items-center justify-center mt-4 print:hidden">
      <button
        className="px-3 py-1 bg-gray-200 rounded-l-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        Previous
      </button>
      
      <div className="px-4 text-sm">
        Page {currentPage} of {totalPages}
      </div>
      
      <button
        className="px-3 py-1 bg-gray-200 rounded-r-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

export default PageNavigation;
```

### 5. Print Optimization

Ensure the multi-page view works correctly when printing:

```tsx
// src/components/ResumeBuilder/ResumePreview/PrintableMultiPageResume.tsx
import React, { useRef, useEffect } from 'react';
import MultiPageContainer from './MultiPageContainer';
import { ResumeData } from '@/types/resume';
import { TemplateComponent } from '@/types/template';

interface PrintableMultiPageResumeProps {
  resumeData: ResumeData;
  Template: TemplateComponent;
  pageSize?: 'A4' | 'Letter';
}

const PrintableMultiPageResume: React.FC<PrintableMultiPageResumeProps> = ({ 
  resumeData, 
  Template,
  pageSize = 'A4'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Setup proper CSS for printing
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
        .page {
          page-break-after: always;
          margin: 0;
          padding: 0;
          box-shadow: none;
        }
        .page-navigation, .controls {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="print-container">
      <MultiPageContainer pageSize={pageSize}>
        <Template resumeData={resumeData} />
      </MultiPageContainer>
    </div>
  );
};

export default PrintableMultiPageResume;
```

## Refinements for React Integration & Project Guidelines

### 1. Custom Hook for Pagination

Extract pagination logic into a custom hook for better reusability and separation of concerns:

```tsx
// src/hooks/usePagination.ts
import { useState, useEffect, useRef, RefObject } from 'react';
import { paginateContent } from '@/utils/template/pagination';
import { PageDimensions, PageSize } from '@/types/template';

interface UsePaginationOptions {
  pageSize?: PageSize;
  content?: React.ReactNode;
  enabled?: boolean;
}

interface UsePaginationResult {
  pages: React.ReactNode[];
  contentRef: RefObject<HTMLDivElement>;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export function usePagination({ 
  pageSize = 'A4',
  content,
  enabled = true 
}: UsePaginationOptions = {}): UsePaginationResult {
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const pageDimensions: PageDimensions = {
    A4: { width: "210mm", height: "297mm" },
    Letter: { width: "215.9mm", height: "279.4mm" },
  }[pageSize] || { width: "210mm", height: "297mm" };
  
  useEffect(() => {
    if (!enabled || !contentRef.current) return;
    
    const paginatedContent = paginateContent(contentRef.current, pageDimensions);
    setPages(paginatedContent);
    setCurrentPage(1); // Reset to first page when content changes
  }, [content, pageSize, enabled]);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pages.length) {
      setCurrentPage(page);
    }
  };
  
  const nextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  return {
    pages,
    contentRef,
    currentPage,
    totalPages: pages.length,
    goToPage,
    nextPage,
    prevPage
  };
}
```

### 2. Template Types for Better Type Safety

Define proper TypeScript interfaces for templates and pagination:

```tsx
// src/types/template.ts
import { ResumeData } from './resume';

export type PageSize = 'A4' | 'Letter' | 'Legal';

export interface PageDimensions {
  width: string;
  height: string;
}

export interface TemplateProps {
  resumeData: ResumeData;
  showBorder?: boolean;
}

export type TemplateComponent = React.FC<TemplateProps>;

export interface PaginationOptions {
  enabled: boolean;
  pageSize: PageSize;
}
```

### 3. Integration with ResumePreview Component

Update the ResumePreview component to handle pagination:

```tsx
// src/components/ResumeBuilder/ResumePreview/ResumePreview.tsx
import React, { useState } from 'react';
import { useResumeContext } from '@/context/resume/resumeContext';
import { usePagination } from '@/hooks/usePagination';
import PageNavigation from './PageNavigation';
import { TemplateComponent } from '@/types/template';

interface ResumePreviewProps {
  Template: TemplateComponent;
  enablePagination?: boolean;
  pageSize?: 'A4' | 'Letter';
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  Template,
  enablePagination = true,
  pageSize = 'A4'
}) => {
  const { resumeData } = useResumeContext();
  
  const {
    pages,
    contentRef,
    currentPage,
    totalPages,
    goToPage
  } = usePagination({
    pageSize,
    enabled: enablePagination
  });
  
  // If pagination is disabled, show regular template
  if (!enablePagination) {
    return (
      <div className="resume-preview-container">
        <div className="resume-page">
          <Template resumeData={resumeData} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="resume-preview-container">
      {/* Hidden container for measuring content */}
      <div className="hidden" ref={contentRef}>
        <Template resumeData={resumeData} />
      </div>
      
      {/* Display current page */}
      {pages.length > 0 ? (
        <>
          <div 
            className="resume-page bg-white shadow-md mx-auto print:shadow-none"
            style={{
              width: pageSize === 'A4' ? '210mm' : '215.9mm',
              minHeight: pageSize === 'A4' ? '297mm' : '279.4mm',
            }}
          >
            {pages[currentPage - 1]}
          </div>
          
          {/* Show navigation only if we have multiple pages */}
          {totalPages > 1 && (
            <PageNavigation
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </>
      ) : (
        <div className="loading-placeholder">Preparing document...</div>
      )}
    </div>
  );
};

export default ResumePreview;
```

### 4. Utility Functions for DOM Measurements

Create reusable utility functions for calculating element dimensions:

```tsx
// src/utils/template/measurements.ts

/**
 * Converts millimeters to pixels
 */
export function convertMmToPx(mm: string | number): number {
  const mmValue = typeof mm === 'string' ? parseFloat(mm) : mm;
  // Standard 96 DPI conversion (96px = 25.4mm)
  return mmValue * (96 / 25.4);
}

/**
 * Gets the rendered height of an element in pixels
 */
export function getElementHeight(element: HTMLElement): number {
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Setup for accurate measurement
  clone.style.position = 'absolute';
  clone.style.visibility = 'hidden';
  clone.style.width = element.offsetWidth + 'px';
  
  // Add to DOM for measurement
  document.body.appendChild(clone);
  const height = clone.offsetHeight;
  document.body.removeChild(clone);
  
  return height;
}
```

### 5. Caching and Performance

Optimize pagination through caching of calculations:

```tsx
// Additional caching for pagination in usePagination.ts
import { useCallback, useMemo } from 'react';

// Inside usePagination hook:
const pageDimensions = useMemo(() => {
  return {
    A4: { width: "210mm", height: "297mm" },
    Letter: { width: "215.9mm", height: "279.4mm" },
  }[pageSize] || { width: "210mm", height: "297mm" };
}, [pageSize]);

// Memoize pagination results
const paginateContent = useCallback((contentElement: HTMLElement) => {
  // Pagination logic here
}, [pageDimensions]);
```

## Advantages and Considerations

### Advantages
- Handles any amount of content without compromising formatting
- Maintains readability since font sizes aren't reduced
- Provides familiar document-like experience for users
- Works well with printing and PDF export

### Considerations
- More complex to implement than other approaches
- Requires careful handling of section breaks
- May need additional visual cues for continued sections
- Navigate controls could confuse users expecting single-page resumes

## Implementation Roadmap

1. Create the basic multi-page container system
2. Implement content analysis and pagination logic
3. Add section-specific splitting rules
4. Create continuation indicators for split sections
5. Build page navigation controls
6. Optimize print and PDF export capabilities
7. Add configuration options for page size and margins 
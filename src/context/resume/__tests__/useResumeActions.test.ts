import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useResumeActions } from '../useResumeActions';
import { initialResumeData } from '../initialState';
import { Layout } from 'react-grid-layout';
import { ResumeTemplate } from '@/components/ResumeBuilder/ResumePreview/types';

// Define MockHeaderSectionForMock at the top level, as it's used by the jest.mock factory.
const MockHeaderSectionForMock = () => React.createElement('div', { 'data-testid': 'header-section' }, 'Header');

jest.mock('@/data/templates', () => {
  const mockDefaultLayoutsForMockFactory = {
    lg: [{ i: 'header', x: 0, y: 0, w: 12, h: 2, static: true }],
    md: [{ i: 'header', x: 0, y: 0, w: 10, h: 2, static: true }],
  };

  return {
    __esModule: true,
    default: [
      {
        id: 'template-with-defaults',
        name: 'Template With Defaults',
        defaultLayouts: mockDefaultLayoutsForMockFactory,
        getSections: () => ({ header: MockHeaderSectionForMock }),
        getTemplateColors: () => ({ primary: '#fff', secondary: '#000', accent: '#111' }),
        render: () => null,
        preview: null,
      } as ResumeTemplate,
      {
        id: 'template-no-defaults',
        name: 'Template No Defaults',
        getSections: () => ({}),
        getTemplateColors: () => ({ primary: '#fff', secondary: '#000', accent: '#111' }),
        render: () => null,
        preview: null,
      } as ResumeTemplate,
      {
        id: 'default', // from initialResumeData
        name: 'Default Initial',
        defaultLayouts: { lg: [{ i: 'default-header', x: 0, y: 0, w: 1, h: 1 }] },
        getSections: () => ({}),
        getTemplateColors: () => ({}),
        render: () => null,
        preview: null,
      } as ResumeTemplate,
    ],
  };
});

describe('useResumeActions', () => {
  // This is the mockDefaultLayouts used for assertions in the tests.
  // It should match what's defined as mockDefaultLayoutsForMockFactory for 'template-with-defaults'
  const mockAssertableDefaultLayouts = {
    lg: [{ i: 'header', x: 0, y: 0, w: 12, h: 2, static: true }],
    md: [{ i: 'header', x: 0, y: 0, w: 10, h: 2, static: true }],
  };

  describe('updateTemplateLayout', () => {
    test('correctly updates resumeData.layouts for a given templateId', () => {
      const { result } = renderHook(() => useResumeActions());
      const templateId = 'test-template';
      const newLayouts: { [key: string]: Layout[] } = {
        lg: [{ i: 'a', x: 0, y: 0, w: 1, h: 1 }],
        md: [{ i: 'b', x: 0, y: 0, w: 1, h: 1 }],
      };

      act(() => {
        result.current.updateTemplateLayout(templateId, newLayouts);
      });

      expect(result.current.resumeData.layouts[templateId]).toEqual(newLayouts);
    });
  });

  describe('setSelectedTemplate (selectTemplateAndInitializeLayouts)', () => {
    test('initializes layout for a new template with defaultLayouts', () => {
      const { result } = renderHook(() => useResumeActions());
      const templateIdWithDefaults = 'template-with-defaults';

      act(() => {
        result.current.setSelectedTemplate(templateIdWithDefaults);
      });

      expect(result.current.selectedTemplate).toBe(templateIdWithDefaults);
      expect(result.current.resumeData.selectedTemplate).toBe(templateIdWithDefaults);
      expect(result.current.resumeData.layouts[templateIdWithDefaults]).toEqual(mockAssertableDefaultLayouts);
    });

    test('does not overwrite existing layout when selecting a template', () => {
      const { result } = renderHook(() => useResumeActions());
      const templateIdWithDefaults = 'template-with-defaults';
      const customLayout: { [key: string]: Layout[] } = {
        lg: [{ i: 'custom-item', x: 1, y: 1, w: 2, h: 2 }],
      };

      act(() => {
        result.current.updateTemplateLayout(templateIdWithDefaults, customLayout);
      });
      expect(result.current.resumeData.layouts[templateIdWithDefaults]).toEqual(customLayout);

      act(() => {
        result.current.setSelectedTemplate(templateIdWithDefaults);
      });

      expect(result.current.selectedTemplate).toBe(templateIdWithDefaults);
      expect(result.current.resumeData.selectedTemplate).toBe(templateIdWithDefaults);
      expect(result.current.resumeData.layouts[templateIdWithDefaults]).toEqual(customLayout);
    });

    test('handles template selection for a template with no defaultLayouts', () => {
      const { result } = renderHook(() => useResumeActions());
      const templateIdNoDefaults = 'template-no-defaults';
      
      expect(result.current.resumeData.layouts[templateIdNoDefaults]).toBeUndefined();

      act(() => {
        result.current.setSelectedTemplate(templateIdNoDefaults);
      });

      expect(result.current.selectedTemplate).toBe(templateIdNoDefaults);
      expect(result.current.resumeData.selectedTemplate).toBe(templateIdNoDefaults);
      expect(result.current.resumeData.layouts[templateIdNoDefaults]).toBeUndefined();
    });
    
    test('updates resumeData.selectedTemplate field correctly', () => {
      const { result } = renderHook(() => useResumeActions());
      const newTemplateId = 'template-no-defaults';

      act(() => {
        result.current.setSelectedTemplate(newTemplateId);
      });

      expect(result.current.resumeData.selectedTemplate).toBe(newTemplateId);
    });

    test('initializes with default selected template and its layouts if available', () => {
      const { result } = renderHook(() => useResumeActions());
      const initialSelected = initialResumeData.selectedTemplate; // Should be 'default'
      
      act(() => {
        result.current.setSelectedTemplate(initialSelected);
      });
      
      const mockedTemplates = jest.requireMock('@/data/templates').default;
      const defaultTemplateMock = mockedTemplates.find((t: ResumeTemplate) => t.id === initialSelected);

      expect(result.current.selectedTemplate).toBe(initialSelected);
      expect(result.current.resumeData.selectedTemplate).toBe(initialSelected);
      if (defaultTemplateMock && defaultTemplateMock.defaultLayouts) {
         expect(result.current.resumeData.layouts[initialSelected]).toEqual(defaultTemplateMock.defaultLayouts);
      } else {
        expect(result.current.resumeData.layouts[initialSelected]).toBeUndefined();
      }
    });
  });
});

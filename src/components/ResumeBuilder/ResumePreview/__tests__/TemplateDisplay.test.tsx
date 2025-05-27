import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TemplateDisplay from '../TemplateDisplay';
import { ResumeTemplate, SectionProps } from '../types'; 
import { ResumeData } from '@/types/resume';
import { Layout } from 'react-grid-layout';
import { ResumeContextProvider } from '@/context/resume/ResumeContextProvider'; // Import the provider

// Mock Section Components
const MockHeader: React.FC<SectionProps> = ({ resumeData }) => ( // templateColors removed
  <div>Header Content: {resumeData.personalInfo.name}</div>
);
const MockExperience: React.FC<SectionProps> = () => ( // resumeData, templateColors removed
  <div>Experience Content</div>
);
// MockEducation removed as it's unused
const MockSkills: React.FC<SectionProps> = () => ( // resumeData, templateColors removed
  <div>Skills Content</div>
);

const mockGetTemplateColors = () => ({
  primary: '#000',
  secondary: '#111',
  accent: '#222',
});

const mockResumeData: ResumeData = {
  personalInfo: { name: 'Test User', title: 'Tester', email: '', phone: '', location: '', summary: '' },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  additionalSections: [],
  colors: {},
  selectedTemplate: 'test-template',
  layouts: {},
};

describe('TemplateDisplay', () => {
  const mockCurrentTemplateWithLayoutsProp: ResumeTemplate = {
    id: 'test-template-1',
    name: 'Test Template 1',
    getSections: () => ({
      header: MockHeader,
      experience: MockExperience,
    }),
    getTemplateColors: mockGetTemplateColors,
    render: () => <></>, // Placeholder for Template type compatibility
    preview: <></>,   // Placeholder for Template type compatibility
  };

  const mockCurrentTemplateWithDefaultLayouts: ResumeTemplate = {
    id: 'test-template-2',
    name: 'Test Template 2',
    getSections: () => ({
      header: MockHeader,
      skills: MockSkills,
    }),
    getTemplateColors: mockGetTemplateColors,
    defaultLayouts: {
      lg: [
        { i: 'header', x: 0, y: 0, w: 12, h: 1 },
        { i: 'skills', x: 0, y: 1, w: 12, h: 1 },
      ],
    },
    render: () => <></>,
    preview: <></>,
  };
  
  // Mock ResizeObserver
  beforeEach(() => {
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  test('renders sections based on layouts prop', () => {
    const testLayouts: { [key: string]: Layout[] } = {
      lg: [
        { i: 'header', x: 0, y: 0, w: 12, h: 1 },
        { i: 'experience', x: 0, y: 1, w: 12, h: 1 },
      ],
    };

    render(
      <ResumeContextProvider>
        <TemplateDisplay
          currentTemplate={mockCurrentTemplateWithLayoutsProp}
          resumeData={mockResumeData}
          layouts={testLayouts}
          resumeContentRef={React.createRef()}
          scale={1}
          zoomLevel={1}
        />
      </ResumeContextProvider>
    );

    expect(screen.getByText('Header Content: Test User')).toBeInTheDocument();
    expect(screen.getByText('Experience Content')).toBeInTheDocument();
  });

  test('uses currentTemplate.defaultLayouts if layouts prop is empty/undefined', () => {
    render(
      <ResumeContextProvider>
        <TemplateDisplay
          currentTemplate={mockCurrentTemplateWithDefaultLayouts}
          resumeData={mockResumeData}
          // layouts prop is not provided
          resumeContentRef={React.createRef()}
          scale={1}
          zoomLevel={1}
        />
      </ResumeContextProvider>
    );

    expect(screen.getByText('Header Content: Test User')).toBeInTheDocument();
    expect(screen.getByText('Skills Content')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomTemplateCreator from '../../../../src/components/ResumeBuilder/CustomTemplateCreator';
import { AITemplateGenerator } from '../../../../src/components/AIFeatures/AITemplateGenerator';
import { useAIApi } from '../../../../src/hooks/useAIApi';
import { useCustomTemplates } from '../../../../src/hooks/useCustomTemplates';
import { TemplatePreferences } from '../../../../src/types/templates';

// Mock the hooks and components
jest.mock('../../../../src/hooks/useAIApi');
jest.mock('../../../../src/hooks/useCustomTemplates');
jest.mock('../../../../src/components/AIFeatures/AITemplateGenerator');
jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: string }) => <pre data-testid="syntax-highlighter">{children}</pre>
}));
jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {}
}));
jest.mock('@headlessui/react', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogPanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

const mockOnClose = jest.fn();
const mockOnTemplateCreate = jest.fn();
const mockResetTemplateCode = jest.fn();

const defaultPreferences: TemplatePreferences = {
  name: '',
  layout: 'single-column' as const,
  headerStyle: {
    position: 'top',
    alignment: 'left',
    size: 'medium',
  },
  sectionOrder: ['personal', 'experience', 'education', 'skills', 'projects'],
  colorScheme: {
    primary: '#000000',
    secondary: '#666666',
    accent: '#0066cc',
    background: '#ffffff',
  },
  visualElements: {
    useDividers: true,
    useIcons: false,
    borderStyle: 'solid',
    useShapes: false,
  },
  spacing: 'balanced',
};

describe('CustomTemplateCreator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAIApi as jest.Mock).mockReturnValue({
      apiKey: 'test-api-key',
      service: 'openai'
    });
    
    (useCustomTemplates as jest.Mock).mockReturnValue({
      resetTemplateCode: mockResetTemplateCode
    });

    (AITemplateGenerator as jest.Mock).mockResolvedValue({
      success: true,
      templateCode: 'return <div>Generated Template</div>'
    });

    mockResetTemplateCode.mockReturnValue({
      name: '',
      code: '',
      preferences: defaultPreferences
    });
  });

  it('creates a new template successfully', async () => {
    render(
      <CustomTemplateCreator
        isOpen={true}
        onClose={mockOnClose}
        onTemplateCreate={mockOnTemplateCreate}
      />
    );

    const nameInput = screen.getByPlaceholderText('Enter template name');
    fireEvent.change(nameInput, { target: { value: 'New Template' } });

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Save Template')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save Template');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnTemplateCreate).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Template',
        code: expect.any(String),
        preferences: expect.any(Object)
      }));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('edits an existing template', async () => {
    const mockTemplate = {
      id: 'test-id',
      name: 'Test Template',
      code: 'return <div>Test</div>',
      preferences: {
        ...defaultPreferences,
        name: 'Test Template',
        layout: 'single-column' as const
      },
      createdAt: new Date(),
    };

    render(
      <CustomTemplateCreator
        isOpen={true}
        onClose={mockOnClose}
        onTemplateCreate={mockOnTemplateCreate}
        editingTemplate={mockTemplate}
      />
    );

    expect(screen.getByText('Edit Template')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Template')).toBeInTheDocument();

    const nameInput = screen.getByDisplayValue('Test Template');
    fireEvent.change(nameInput, { target: { value: 'Updated Template' } });

    const saveButton = screen.getByText('Save Template');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnTemplateCreate).toHaveBeenCalledWith(expect.objectContaining({
        id: 'test-id',
        name: 'Updated Template'
      }));
    });
  });

  it('handles missing API key', async () => {
    (useAIApi as jest.Mock).mockReturnValue({
      apiKey: '',
      service: 'openai'
    });

    render(
      <CustomTemplateCreator
        isOpen={true}
        onClose={mockOnClose}
        onTemplateCreate={mockOnTemplateCreate}
      />
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);

    await waitFor(() => {
      const errorDiv = screen.getByRole('alert');
      expect(errorDiv).toHaveTextContent(/failed to create template/i);
    });
  });

  it('handles template preferences changes', async () => {
    render(
      <CustomTemplateCreator
        isOpen={true}
        onClose={mockOnClose}
        onTemplateCreate={mockOnTemplateCreate}
      />
    );

    const nameInput = screen.getByPlaceholderText('Enter template name');
    fireEvent.change(nameInput, { target: { value: 'New Template' } });

    // Find and update layout select
    const layoutLabel = screen.getByText(/layout/i);
    const layoutSelect = layoutLabel.nextElementSibling as HTMLSelectElement;
    expect(layoutSelect).toBeTruthy();
    fireEvent.change(layoutSelect, { target: { value: 'two-column' } });

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(AITemplateGenerator).toHaveBeenCalledWith(
        expect.objectContaining({
          layout: 'two-column',
          name: 'New Template'
        }),
        expect.any(String),
        expect.any(String)
      );
    });
  });

  it('handles cancel operation correctly', () => {
    render(
      <CustomTemplateCreator
        isOpen={true}
        onClose={mockOnClose}
        onTemplateCreate={mockOnTemplateCreate}
      />
    );

    const nameInput = screen.getByPlaceholderText('Enter template name');
    fireEvent.change(nameInput, { target: { value: 'New Template' } });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockResetTemplateCode).toHaveBeenCalled();
  });

  it('handles API errors gracefully', async () => {
    (AITemplateGenerator as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(
      <CustomTemplateCreator
        isOpen={true}
        onClose={mockOnClose}
        onTemplateCreate={mockOnTemplateCreate}
      />
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);

    await waitFor(() => {
      const errorDiv = screen.getByRole('alert');
      expect(errorDiv).toHaveTextContent(/failed to create template/i);
    });
  });

  it('validates required fields', async () => {
    render(
      <CustomTemplateCreator
        isOpen={true}
        onClose={mockOnClose}
        onTemplateCreate={mockOnTemplateCreate}
      />
    );

    const createButton = screen.getByText('Create Template');
    fireEvent.click(createButton);

    await waitFor(() => {
      const errorDiv = screen.getByRole('alert');
      expect(errorDiv).toHaveTextContent(/failed to create template/i);
    });
  });

  it('handles code editing', async () => {
    render(
      <CustomTemplateCreator
        isOpen={true}
        onClose={mockOnClose}
        onTemplateCreate={mockOnTemplateCreate}
      />
    );

    const codeTab = screen.getByText('Edit Code');
    fireEvent.click(codeTab);

    // Find textarea by its unique class
    const textareas = screen.getAllByRole('textbox');
    const codeArea = textareas.find(t => t.tagName.toLowerCase() === 'textarea');
    expect(codeArea).toBeTruthy();
    
    fireEvent.change(codeArea!, { target: { value: 'return <div>Edited Code</div>' } });

    const saveButton = screen.getByText('Save Template');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnTemplateCreate).toHaveBeenCalledWith(expect.objectContaining({
        code: 'return <div>Edited Code</div>'
      }));
    });
  });
});

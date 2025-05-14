import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import TemplateGallery from '@/components/TemplateSelection/TemplateGallery'
import { useResume } from '@/context/ResumeContext'
import { useCustomTemplates } from '@/hooks/useCustomTemplates'
import templates from '@/data/templates'

// Mock the components and hooks
jest.mock('@/context/ResumeContext')
jest.mock('@/hooks/useCustomTemplates')
jest.mock('@/hooks/useResumeData')
jest.mock('@/components/ResumeBuilder/CustomTemplateCreatorWrapper', () => {
  return function MockCustomTemplateCreatorWrapper({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return isOpen ? (
      <div role="dialog" data-testid="mock-creator">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="z-10 bg-white rounded-xl" onClick={onClose}>Mock Creator</div>
          </div>
        </div>
      </div>
    ) : null
  }
})

describe('TemplateGallery', () => {
  // Mock implementation of hooks
  const mockSetSelectedTemplate = jest.fn()
  const mockSaveTemplate = jest.fn()
  const mockDeleteTemplate = jest.fn()
  const mockGetTemplateForEditing = jest.fn()
  const mockLoadTemplatesFromStorage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useResume hook
    ;(useResume as jest.Mock).mockReturnValue({
      selectedTemplate: 'default',
      setSelectedTemplate: mockSetSelectedTemplate
    })

    // Mock useCustomTemplates hook
    ;(useCustomTemplates as jest.Mock).mockReturnValue({
      customTemplates: [],
      saveTemplate: mockSaveTemplate,
      deleteTemplate: mockDeleteTemplate,
      getTemplateForEditing: mockGetTemplateForEditing,
      loadTemplatesFromStorage: mockLoadTemplatesFromStorage
    })

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    // Mock ResizeObserver
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }))
  })

  it('renders all default templates', () => {
    render(<TemplateGallery />)

    templates.forEach(template => {
      expect(screen.getByText(template.name)).toBeInTheDocument()
    })
  })

  it('shows selected template as active', () => {
    render(<TemplateGallery />)

    const defaultTemplate = screen.getByTestId('template-default')
    expect(defaultTemplate).toHaveClass('border-blue-500')
  })

  it('calls setSelectedTemplate when clicking a template', () => {
    render(<TemplateGallery />)

    const modernTemplate = screen.getByTestId('template-modern')
    fireEvent.click(modernTemplate)

    expect(mockSetSelectedTemplate).toHaveBeenCalledWith('modern')
  })

  it('opens template creator when clicking create button', () => {
    render(<TemplateGallery />)

    const createButton = screen.getByText('Create Template')
    fireEvent.click(createButton)

    expect(screen.getByTestId('mock-creator')).toBeInTheDocument()
  })

  it('renders custom templates when available', () => {
    const customTemplates = [
      {
        id: 'custom-1',
        name: 'Custom Template 1',
        isCustom: true,
        preview: <div>Preview</div>,
        render: () => <div>Custom Template 1</div>
      }
    ]

    ;(useCustomTemplates as jest.Mock).mockReturnValue({
      customTemplates,
      saveTemplate: mockSaveTemplate,
      deleteTemplate: mockDeleteTemplate,
      getTemplateForEditing: mockGetTemplateForEditing,
      loadTemplatesFromStorage: mockLoadTemplatesFromStorage
    })

    render(<TemplateGallery />)

    expect(screen.getByText('Custom Template 1')).toBeInTheDocument()
  })

  it('loads custom templates on mount', () => {
    render(<TemplateGallery />)

    expect(mockLoadTemplatesFromStorage).toHaveBeenCalled()
  })

  it('handles template editing', () => {
    const customTemplate = {
      id: 'custom-1',
      name: 'Custom Template 1',
      isCustom: true,
      preview: <div>Preview</div>,
      render: () => <div>Custom Template 1</div>
    }

    mockGetTemplateForEditing.mockReturnValue(customTemplate)

    ;(useCustomTemplates as jest.Mock).mockReturnValue({
      customTemplates: [customTemplate],
      saveTemplate: mockSaveTemplate,
      deleteTemplate: mockDeleteTemplate,
      getTemplateForEditing: mockGetTemplateForEditing,
      loadTemplatesFromStorage: mockLoadTemplatesFromStorage
    })

    render(<TemplateGallery />)

    const editButton = screen.getByRole('button', { name: 'Edit template' })
    fireEvent.click(editButton)

    expect(mockGetTemplateForEditing).toHaveBeenCalledWith('custom-1')
    expect(screen.getByTestId('mock-creator')).toBeInTheDocument()
  })

  it('handles template deletion', () => {
    const customTemplate = {
      id: 'custom-1',
      name: 'Custom Template 1',
      isCustom: true,
      preview: <div>Preview</div>,
      render: () => <div>Custom Template 1</div>
    }

    ;(useCustomTemplates as jest.Mock).mockReturnValue({
      customTemplates: [customTemplate],
      saveTemplate: mockSaveTemplate,
      deleteTemplate: mockDeleteTemplate,
      getTemplateForEditing: mockGetTemplateForEditing,
      loadTemplatesFromStorage: mockLoadTemplatesFromStorage
    })

    render(<TemplateGallery />)

    const deleteButton = screen.getByRole('button', { name: 'Delete template' })
    fireEvent.click(deleteButton)

    expect(mockDeleteTemplate).toHaveBeenCalledWith('custom-1')
  })
})

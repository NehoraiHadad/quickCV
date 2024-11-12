import { render, screen, fireEvent } from '@testing-library/react'
import ResumePreview from '@/components/ResumeBuilder/ResumePreview'
import { useResume } from '@/context/ResumeContext'
import { useCustomTemplates } from '@/hooks/useCustomTemplates'

// Mock the hooks
jest.mock('@/context/ResumeContext')
jest.mock('@/hooks/useCustomTemplates')
jest.mock('react-split', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-split">{children}</div>
  )
}))

describe('ResumePreview', () => {
  const mockResumeData = {
    personalInfo: {
      name: 'John Doe',
      title: 'Software Engineer',
      email: 'john@example.com',
      phone: '123-456-7890',
      location: 'Tel Aviv',
      summary: 'Experienced developer'
    },
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    additionalSections: [],
    colors: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#0066cc'
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useResume as jest.Mock).mockReturnValue({
      resumeData: mockResumeData,
      selectedTemplate: 'default'
    })
    ;(useCustomTemplates as jest.Mock).mockReturnValue({
      customTemplates: [],
      addCustomTemplate: jest.fn(),
      removeCustomTemplate: jest.fn()
    })
  })

  it('renders resume preview with selected template', () => {
    render(<ResumePreview />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
  })

  it('renders split view controls', () => {
    render(<ResumePreview />)
    expect(screen.getByTestId('mock-split')).toBeInTheDocument()
  })

  it('provides download functionality', () => {
    const mockCreateElement = document.createElement.bind(document)
    const mockClick = jest.fn()
    document.createElement = jest.fn().mockImplementation((tagName) => {
      const element = mockCreateElement(tagName)
      element.click = mockClick
      return element
    })

    render(<ResumePreview />)
    const downloadButton = screen.getByText(/Download/i)
    fireEvent.click(downloadButton)

    expect(mockClick).toHaveBeenCalled()
    document.createElement = mockCreateElement
  })

  it('handles template switching', () => {
    const { rerender } = render(<ResumePreview />)

    // Change selected template
    ;(useResume as jest.Mock).mockReturnValue({
      resumeData: mockResumeData,
      selectedTemplate: 'modern'
    })

    rerender(<ResumePreview />)
    expect(screen.getByTestId('resume-preview')).toHaveAttribute('data-template', 'modern')
  })

  it('applies custom styles based on colors', () => {
    render(<ResumePreview />)
    
    const previewContainer = screen.getByTestId('resume-preview')
    expect(previewContainer).toHaveStyle({
      '--primary-color': mockResumeData.colors.primary,
      '--secondary-color': mockResumeData.colors.secondary,
      '--accent-color': mockResumeData.colors.accent
    })
  })

  it('handles print functionality', () => {
    const mockPrint = window.print
    window.print = jest.fn()

    render(<ResumePreview />)
    const printButton = screen.getByText(/Print/i)
    fireEvent.click(printButton)

    expect(window.print).toHaveBeenCalled()
    window.print = mockPrint
  })

  it('handles zoom controls', () => {
    render(<ResumePreview />)
    
    const zoomInButton = screen.getByLabelText(/Zoom in/i)
    const zoomOutButton = screen.getByLabelText(/Zoom out/i)

    fireEvent.click(zoomInButton)
    expect(screen.getByTestId('resume-preview')).toHaveStyle({ transform: 'scale(1.1)' })

    fireEvent.click(zoomOutButton)
    expect(screen.getByTestId('resume-preview')).toHaveStyle({ transform: 'scale(1)' })
  })

  it('handles error states gracefully', () => {
    // Mock an error state
    console.error = jest.fn()
    ;(useResume as jest.Mock).mockReturnValue({
      resumeData: null,
      selectedTemplate: 'invalid-template'
    })

    render(<ResumePreview />)
    expect(screen.getByText(/Error loading preview/i)).toBeInTheDocument()
  })
}) 
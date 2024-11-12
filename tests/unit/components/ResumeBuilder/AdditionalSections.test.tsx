import { render, screen, fireEvent } from '@testing-library/react'
import AdditionalSections from '@/components/ResumeBuilder/AdditionalSections'
import { useResume } from '@/context/ResumeContext'
import { useAIApi } from '@/hooks/useAIApi'
import TextImprovement from '@/components/AIFeatures/TextImprovement'

jest.mock('@/hooks/useAIApi', () => ({
  useAIApi: jest.fn(() => ({ apiKey: 'test-key' }))
}))

const mockAddSection = jest.fn()
const mockUpdateSection = jest.fn()
const mockRemoveSection = jest.fn()

jest.mock('@/context/ResumeContext', () => ({
  useResume: jest.fn()
}))

// Mock TextImprovement component
jest.mock('@/components/AIFeatures/TextImprovement', () => {
  return jest.fn(({ initialText, onImprove }) => (
    <div data-testid="text-improvement">
      <span>{initialText}</span>
      <button onClick={() => onImprove('improved text')}>Improve</button>
    </div>
  ))
})

describe('AdditionalSections', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useResume as jest.Mock).mockReturnValue({
      resumeData: {
        additionalSections: [{
          id: '1',
          title: 'Languages',
          content: 'English (Native), Hebrew (Fluent)'
        }]
      },
      addAdditionalSection: mockAddSection,
      updateAdditionalSection: mockUpdateSection,
      removeAdditionalSection: mockRemoveSection
    })
  })

  it('renders additional sections', () => {
    render(<AdditionalSections />)
    
    // Check for title input
    expect(screen.getByDisplayValue('Languages')).toBeInTheDocument()
    
    // Check for content textarea specifically
    const contentTextarea = screen.getByPlaceholderText('Section Content') as HTMLTextAreaElement
    expect(contentTextarea.value).toBe('English (Native), Hebrew (Fluent)')
  })

  it('adds new section', () => {
    render(<AdditionalSections />)
    fireEvent.click(screen.getByText(/Add Section/i))
    expect(mockAddSection).toHaveBeenCalled()
  })

  it('updates section title', () => {
    render(<AdditionalSections />)
    const titleInput = screen.getByDisplayValue('Languages')
    fireEvent.change(titleInput, { target: { value: 'Certifications' } })
    expect(mockUpdateSection).toHaveBeenCalledWith('1', { title: 'Certifications' })
  })

  it('updates section content', () => {
    render(<AdditionalSections />)
    const contentInput = screen.getByDisplayValue(/English \(Native\), Hebrew \(Fluent\)/)
    fireEvent.change(contentInput, { target: { value: 'AWS Certified' } })
    expect(mockUpdateSection).toHaveBeenCalledWith('1', { content: 'AWS Certified' })
  })

  it('removes section', () => {
    render(<AdditionalSections />)
    fireEvent.click(screen.getByText(/Remove/i))
    expect(mockRemoveSection).toHaveBeenCalledWith('1')
  })

  it('renders TextImprovement components for both title and content', () => {
    render(<AdditionalSections />)
    const textImprovements = screen.getAllByTestId('text-improvement')
    expect(textImprovements).toHaveLength(2) // One for title, one for content
  })

  it('updates section when TextImprovement triggers improvement', () => {
    render(<AdditionalSections />)
    const textImprovements = screen.getAllByTestId('text-improvement')
    
    // Improve title
    fireEvent.click(screen.getAllByText('Improve')[0])
    expect(mockUpdateSection).toHaveBeenCalledWith('1', { title: 'improved text' })
    
    // Improve content
    fireEvent.click(screen.getAllByText('Improve')[1])
    expect(mockUpdateSection).toHaveBeenCalledWith('1', { content: 'improved text' })
  })
}) 
import { render, screen, fireEvent } from '@testing-library/react'
import Education from '@/components/ResumeBuilder/Education'
import { useResume } from '@/context/ResumeContext'
import { useAIApi } from '@/hooks/useAIApi'

jest.mock('@/hooks/useAIApi', () => ({
  useAIApi: jest.fn(() => ({ apiKey: 'test-key' }))
}))

const mockAddEducation = jest.fn()
const mockUpdateEducation = jest.fn()
const mockRemoveEducation = jest.fn()

jest.mock('@/context/ResumeContext', () => ({
  useResume: jest.fn()
}))

describe('Education', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useResume as jest.Mock).mockReturnValue({
      resumeData: {
        education: [{
          id: '1',
          institution: 'Test University',
          degree: 'BSc',
          fieldOfStudy: 'Computer Science',
          startDate: '2020-01',
          endDate: '2023-01',
          description: 'Major in Software Engineering'
        }]
      },
      addEducation: mockAddEducation,
      updateEducation: mockUpdateEducation,
      removeEducation: mockRemoveEducation
    })
  })

  it('renders education entries', () => {
    render(<Education />)
    
    expect(screen.getByText('Test University')).toBeInTheDocument()
    expect(screen.getByText('BSc')).toBeInTheDocument()
    expect(screen.getByText('Computer Science')).toBeInTheDocument()
  })

  it('adds new education entry', () => {
    render(<Education />)
    
    fireEvent.click(screen.getByText(/Add Education/i))
    
    expect(mockAddEducation).toHaveBeenCalled()
  })

  it('updates education entry', () => {
    render(<Education />)
    
    const institutionInput = screen.getByDisplayValue('Test University')
    fireEvent.change(institutionInput, { target: { value: 'New University' } })
    
    expect(mockUpdateEducation).toHaveBeenCalledWith('1', {
      institution: 'New University'
    })
  })

  it('removes education entry', () => {
    render(<Education />)
    
    fireEvent.click(screen.getByText(/Remove/i))
    
    expect(mockRemoveEducation).toHaveBeenCalledWith('1')
  })

  it('shows AI improvement buttons for description', () => {
    render(<Education />)
    
    const descriptionField = screen.getByText(/Major in Software Engineering/)
    fireEvent.focus(descriptionField)
    
    expect(screen.getByText(/Suggest/i)).toBeInTheDocument()
    expect(screen.getByText(/Optimize/i)).toBeInTheDocument()
    expect(screen.getByText(/Grammar/i)).toBeInTheDocument()
  })
}) 
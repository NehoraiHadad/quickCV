import { render, screen, fireEvent } from '@testing-library/react'
import WorkExperience from '@/components/ResumeBuilder/WorkExperience'
import { ResumeContext } from '@/context/ResumeContext'
import { useAIApi } from '@/hooks/useAIApi'

jest.mock('@/hooks/useAIApi', () => ({
  useAIApi: jest.fn(() => ({ apiKey: 'test-key' }))
}))

const mockAddWorkExperience = jest.fn()
const mockUpdateWorkExperience = jest.fn()
const mockRemoveWorkExperience = jest.fn()

jest.mock('@/context/ResumeContext', () => ({
  useResume: () => ({
    resumeData: {
      workExperience: [
        {
          id: '1',
          company: 'Tech Corp',
          position: 'Senior Developer',
          startDate: '2020-01',
          endDate: '2023-01',
          description: 'Led development team'
        }
      ]
    },
    addWorkExperience: mockAddWorkExperience,
    updateWorkExperience: mockUpdateWorkExperience,
    removeWorkExperience: mockRemoveWorkExperience
  })
}))

describe('WorkExperience', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders existing work experience', () => {
    render(<WorkExperience />)

    expect(screen.getByText('Tech Corp')).toBeInTheDocument()
    expect(screen.getByText('Senior Developer')).toBeInTheDocument()
    expect(screen.getByText(/Led development team/)).toBeInTheDocument()
  })

  it('adds new work experience', () => {
    render(<WorkExperience />)
    
    fireEvent.click(screen.getByText(/Add Experience/i))

    expect(mockAddWorkExperience).toHaveBeenCalled()
  })

  it('updates work experience', () => {
    render(<WorkExperience />)
    
    const companyInput = screen.getByDisplayValue('Tech Corp')
    fireEvent.change(companyInput, { target: { value: 'New Corp' } })

    expect(mockUpdateWorkExperience).toHaveBeenCalledWith('1', {
      company: 'New Corp'
    })
  })

  it('removes work experience', () => {
    render(<WorkExperience />)
    
    fireEvent.click(screen.getByText(/Remove/i))

    expect(mockRemoveWorkExperience).toHaveBeenCalledWith('1')
  })

  it('shows AI improvement buttons for description', () => {
    render(<WorkExperience />)
    
    const descriptionField = screen.getByText(/Led development team/)
    fireEvent.focus(descriptionField)

    expect(screen.getByText(/Suggest/i)).toBeInTheDocument()
    expect(screen.getByText(/Optimize/i)).toBeInTheDocument()
    expect(screen.getByText(/Grammar/i)).toBeInTheDocument()
  })
}) 
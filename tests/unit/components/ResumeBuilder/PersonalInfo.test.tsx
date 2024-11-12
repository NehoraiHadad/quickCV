import { render, screen, fireEvent } from '@testing-library/react'
import PersonalInfo from '@/components/ResumeBuilder/PersonalInfo'
import { ResumeContext } from '@/context/ResumeContext'
import { useAIApi } from '@/hooks/useAIApi'

jest.mock('@/hooks/useAIApi', () => ({
  useAIApi: jest.fn(() => ({ apiKey: 'test-key' }))
}))

const mockUpdatePersonalInfo = jest.fn()

jest.mock('@/context/ResumeContext', () => ({
  useResume: () => ({
    resumeData: {
      personalInfo: {
        name: 'John Doe',
        title: 'Software Engineer',
        email: 'john@example.com',
        phone: '123-456-7890',
        location: 'Tel Aviv',
        summary: 'Experienced developer'
      }
    },
    updatePersonalInfo: mockUpdatePersonalInfo
  })
}))

describe('PersonalInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all personal info fields', () => {
    render(<PersonalInfo />)

    expect(screen.getByLabelText(/Name/i)).toHaveValue('John Doe')
    expect(screen.getByLabelText(/Title/i)).toHaveValue('Software Engineer')
    expect(screen.getByLabelText(/Email/i)).toHaveValue('john@example.com')
    expect(screen.getByLabelText(/Phone/i)).toHaveValue('123-456-7890')
    expect(screen.getByLabelText(/Location/i)).toHaveValue('Tel Aviv')
    expect(screen.getByLabelText(/Summary/i)).toHaveValue('Experienced developer')
  })

  it('updates personal info on input change', () => {
    render(<PersonalInfo />)
    
    const nameInput = screen.getByLabelText(/Name/i)
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } })

    expect(mockUpdatePersonalInfo).toHaveBeenCalledWith({
      name: 'Jane Doe'
    })
  })

  it('shows AI improvement buttons for summary field', () => {
    render(<PersonalInfo />)
    
    const summaryField = screen.getByLabelText(/Summary/i)
    fireEvent.focus(summaryField)

    expect(screen.getByText(/Suggest/i)).toBeInTheDocument()
    expect(screen.getByText(/Optimize/i)).toBeInTheDocument()
    expect(screen.getByText(/Grammar/i)).toBeInTheDocument()
  })
}) 
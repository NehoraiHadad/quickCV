import { render, screen, fireEvent } from '@testing-library/react'
import Skills from '@/components/ResumeBuilder/Skills'
import { ResumeContext } from '@/context/ResumeContext'
import { useAIApi } from '@/hooks/useAIApi'

// Mock the useAIApi hook
jest.mock('@/hooks/useAIApi', () => ({
  useAIApi: jest.fn(() => ({ apiKey: 'test-key' }))
}))

// Create mock functions
const mockAddSkill = jest.fn()
const mockRemoveSkill = jest.fn()

// Mock the ResumeContext
jest.mock('@/context/ResumeContext', () => ({
  ResumeContext: {
    Provider: ({ children, value }: { children: React.ReactNode; value: any }) => (
      <div data-testid="mock-resume-context">{children}</div>
    ),
  },
  useResume: () => ({
    resumeData: {
      skills: ['JavaScript', 'React']
    },
    addSkill: mockAddSkill,
    removeSkill: mockRemoveSkill
  })
}))

describe('Skills', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders skills list', () => {
    render(<Skills />)
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('adds a new skill', () => {
    render(<Skills />)

    const input = screen.getByPlaceholderText('Enter a skill')
    const addButton = screen.getByText('Add')

    fireEvent.change(input, { target: { value: 'TypeScript' } })
    fireEvent.click(addButton)

    expect(mockAddSkill).toHaveBeenCalledWith('TypeScript')
  })

  it('removes a skill', () => {
    render(<Skills />)

    const removeButtons = screen.getAllByText('×')
    fireEvent.click(removeButtons[0])

    expect(mockRemoveSkill).toHaveBeenCalledWith('JavaScript')
  })
}) 
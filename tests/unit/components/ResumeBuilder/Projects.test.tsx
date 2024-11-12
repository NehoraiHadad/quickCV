import { render, screen, fireEvent } from '@testing-library/react'
import Projects from '@/components/ResumeBuilder/Projects'
import { ResumeContext } from '@/context/ResumeContext'
import { useAIApi } from '@/hooks/useAIApi'

jest.mock('@/hooks/useAIApi', () => ({
  useAIApi: jest.fn(() => ({ apiKey: 'test-key' }))
}))

const mockAddProject = jest.fn()
const mockUpdateProject = jest.fn()
const mockRemoveProject = jest.fn()

jest.mock('@/context/ResumeContext', () => ({
  useResume: () => ({
    resumeData: {
      projects: [
        {
          id: '1',
          name: 'AI Project',
          description: 'Built an AI system',
          technologies: 'Python, TensorFlow',
          link: 'https://example.com',
          github: 'https://github.com/example'
        }
      ]
    },
    addProject: mockAddProject,
    updateProject: mockUpdateProject,
    removeProject: mockRemoveProject
  })
}))

describe('Projects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders existing projects', () => {
    render(<Projects />)

    expect(screen.getByText('AI Project')).toBeInTheDocument()
    expect(screen.getByText(/Built an AI system/)).toBeInTheDocument()
    expect(screen.getByText(/Python, TensorFlow/)).toBeInTheDocument()
  })

  it('adds new project', () => {
    render(<Projects />)
    
    fireEvent.click(screen.getByText(/Add Project/i))

    expect(mockAddProject).toHaveBeenCalled()
  })

  it('updates project', () => {
    render(<Projects />)
    
    const nameInput = screen.getByDisplayValue('AI Project')
    fireEvent.change(nameInput, { target: { value: 'ML Project' } })

    expect(mockUpdateProject).toHaveBeenCalledWith('1', {
      name: 'ML Project'
    })
  })

  it('removes project', () => {
    render(<Projects />)
    
    fireEvent.click(screen.getByText(/Remove/i))

    expect(mockRemoveProject).toHaveBeenCalledWith('1')
  })

  it('shows AI improvement buttons for description', () => {
    render(<Projects />)
    
    const descriptionField = screen.getByText(/Built an AI system/)
    fireEvent.focus(descriptionField)

    expect(screen.getByText(/Suggest/i)).toBeInTheDocument()
    expect(screen.getByText(/Optimize/i)).toBeInTheDocument()
    expect(screen.getByText(/Grammar/i)).toBeInTheDocument()
  })
}) 
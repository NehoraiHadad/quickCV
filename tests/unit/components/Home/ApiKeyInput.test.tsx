import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ApiKeyInput from '@/components/Home/ApiKeyInput'
import { validateApiKey } from '@/utils/aiApi'

// Mock the aiApi utilities
jest.mock('@/utils/aiApi', () => ({
  validateApiKey: jest.fn()
}))

describe('ApiKeyInput', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('renders API key input fields', () => {
    render(<ApiKeyInput />)
    
    expect(screen.getByLabelText(/OpenAI API Key/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Anthropic API Key/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Google API Key/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Groq API Key/i)).toBeInTheDocument()
  })

  it('validates API key on input', async () => {
    (validateApiKey as jest.Mock).mockResolvedValueOnce(true)
    
    render(<ApiKeyInput />)
    const openaiInput = screen.getByLabelText(/OpenAI API Key/i)
    
    fireEvent.change(openaiInput, { target: { value: 'test-key' } })
    
    await waitFor(() => {
      expect(validateApiKey).toHaveBeenCalledWith('test-key', 'openai')
    })
  })

  it('shows success state for valid API key', async () => {
    (validateApiKey as jest.Mock).mockResolvedValueOnce(true)
    
    render(<ApiKeyInput />)
    const openaiInput = screen.getByLabelText(/OpenAI API Key/i)
    
    fireEvent.change(openaiInput, { target: { value: 'valid-key' } })
    
    await waitFor(() => {
      expect(screen.getByTestId('openai-status')).toHaveClass('text-green-500')
    })
  })

  it('shows error state for invalid API key', async () => {
    (validateApiKey as jest.Mock).mockResolvedValueOnce(false)
    
    render(<ApiKeyInput />)
    const openaiInput = screen.getByLabelText(/OpenAI API Key/i)
    
    fireEvent.change(openaiInput, { target: { value: 'invalid-key' } })
    
    await waitFor(() => {
      expect(screen.getByTestId('openai-status')).toHaveClass('text-red-500')
    })
  })
}) 
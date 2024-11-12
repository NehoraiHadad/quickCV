import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TextImprovement from '@/components/AIFeatures/TextImprovement'
import { useAIApi } from '@/hooks/useAIApi'
import { generateAIContent } from '@/utils/aiApi'

// Mock the hooks and utilities
jest.mock('@/hooks/useAIApi')
jest.mock('@/utils/aiApi')

describe('TextImprovement', () => {
  const mockText = 'Original text'
  const mockField = 'skill'
  const mockContext = 'Test context'
  const mockOnSelect = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAIApi as jest.Mock).mockReturnValue({ apiKey: 'test-key', service: 'openai' })
    ;(generateAIContent as jest.Mock).mockResolvedValue([
      'Suggestion 1',
      'Suggestion 2',
      'Suggestion 3'
    ])
  })

  it('renders improvement buttons', () => {
    render(
      <TextImprovement
        text={mockText}
        field={mockField}
        context={mockContext}
        onSelect={mockOnSelect}
      />
    )

    expect(screen.getByText(/Suggest/i)).toBeInTheDocument()
    expect(screen.getByText(/Optimize/i)).toBeInTheDocument()
    expect(screen.getByText(/Grammar/i)).toBeInTheDocument()
  })

  it('shows suggestions when clicking suggest button', async () => {
    render(
      <TextImprovement
        text={mockText}
        field={mockField}
        context={mockContext}
        onSelect={mockOnSelect}
      />
    )

    fireEvent.click(screen.getByText(/Suggest/i))

    await waitFor(() => {
      expect(screen.getByText('Suggestion 1')).toBeInTheDocument()
      expect(screen.getByText('Suggestion 2')).toBeInTheDocument()
      expect(screen.getByText('Suggestion 3')).toBeInTheDocument()
    })
  })

  it('calls onSelect when selecting a suggestion', async () => {
    render(
      <TextImprovement
        text={mockText}
        field={mockField}
        context={mockContext}
        onSelect={mockOnSelect}
      />
    )

    fireEvent.click(screen.getByText(/Suggest/i))

    await waitFor(() => {
      fireEvent.click(screen.getByText('Suggestion 1'))
      expect(mockOnSelect).toHaveBeenCalledWith('Suggestion 1')
    })
  })

  it('handles API errors gracefully', async () => {
    (generateAIContent as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    render(
      <TextImprovement
        text={mockText}
        field={mockField}
        context={mockContext}
        onSelect={mockOnSelect}
      />
    )

    fireEvent.click(screen.getByText(/Suggest/i))

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument()
    })
  })
}) 
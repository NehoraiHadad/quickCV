import { render, screen, fireEvent } from '@testing-library/react'
import TemplatePreferencesForm from '@/components/ResumeBuilder/TemplatePreferencesForm'

describe('TemplatePreferencesForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form fields', () => {
    render(
      <TemplatePreferencesForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByLabelText(/Layout/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Color Scheme/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Style/i)).toBeInTheDocument()
  })

  it('submits form with preferences', () => {
    render(
      <TemplatePreferencesForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    fireEvent.change(screen.getByLabelText(/Layout/i), {
      target: { value: 'modern' }
    })
    fireEvent.change(screen.getByLabelText(/Color Scheme/i), {
      target: { value: 'professional' }
    })
    fireEvent.click(screen.getByText(/Generate/i))

    expect(mockOnSubmit).toHaveBeenCalledWith({
      layout: 'modern',
      colorScheme: 'professional',
      style: 'minimal'
    })
  })

  it('calls onCancel when cancel button clicked', () => {
    render(
      <TemplatePreferencesForm 
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    fireEvent.click(screen.getByText(/Cancel/i))
    expect(mockOnCancel).toHaveBeenCalled()
  })
}) 
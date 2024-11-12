import { render, screen, fireEvent } from '@testing-library/react'
import TemplateSelection from '@/components/ResumeBuilder/TemplateSelection'
import { useResume } from '@/context/ResumeContext'
import templates from '@/data/templates'

jest.mock('@/context/ResumeContext', () => ({
  useResume: jest.fn()
}))

describe('TemplateSelection', () => {
  const mockSetSelectedTemplate = jest.fn()

  beforeEach(() => {
    (useResume as jest.Mock).mockReturnValue({
      selectedTemplate: 'default',
      setSelectedTemplate: mockSetSelectedTemplate
    })
  })

  it('renders template options', () => {
    render(<TemplateSelection />)
    
    templates.forEach(template => {
      expect(screen.getByText(template.name)).toBeInTheDocument()
    })
  })

  it('shows selected template', () => {
    render(<TemplateSelection />)
    
    const defaultTemplate = screen.getByRole('radio', { name: /Default/i })
    expect(defaultTemplate).toBeChecked()
  })

  it('changes selected template on click', () => {
    render(<TemplateSelection />)
    
    const modernTemplate = screen.getByRole('radio', { name: /Modern/i })
    fireEvent.click(modernTemplate)

    expect(mockSetSelectedTemplate).toHaveBeenCalledWith('modern')
  })
}) 
import { render, screen, fireEvent } from '@testing-library/react'
import LanguageSelector from '@/components/Home/LanguageSelector'

describe('LanguageSelector', () => {
  const mockOnLanguageChange = jest.fn()

  beforeEach(() => {
    mockOnLanguageChange.mockClear()
  })

  it('renders with initial language', () => {
    render(
      <LanguageSelector 
        onLanguageChange={mockOnLanguageChange} 
        initialLanguage="en" 
      />
    )
    
    expect(screen.getByLabelText('Select Language')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toHaveValue('en')
  })

  it('is disabled as specified in the component', () => {
    render(
      <LanguageSelector 
        onLanguageChange={mockOnLanguageChange} 
        initialLanguage="en" 
      />
    )
    
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('contains English and Hebrew options', () => {
    render(
      <LanguageSelector 
        onLanguageChange={mockOnLanguageChange} 
        initialLanguage="en" 
      />
    )
    
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2)
    expect(options[0]).toHaveValue('en')
    expect(options[1]).toHaveValue('he')
  })
}) 
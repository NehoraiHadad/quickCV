import { render, screen, fireEvent } from '@testing-library/react'
import ColorCustomization from '@/components/ResumeBuilder/ColorCustomization'
import { useResume } from '@/context/ResumeContext'

jest.mock('@/context/ResumeContext', () => ({
  useResume: jest.fn()
}))

describe('ColorCustomization', () => {
  const mockUpdateColors = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useResume as jest.Mock).mockReturnValue({
      resumeData: {
        colors: {
          primary: '#000000',
          secondary: '#666666',
          accent: '#0066cc'
        }
      },
      updateColors: mockUpdateColors
    })
  })

  it('renders color inputs with correct initial values', () => {
    render(<ColorCustomization />)
    
    expect(screen.getByLabelText(/Primary/i)).toHaveValue('#000000')
    expect(screen.getByLabelText(/Secondary/i)).toHaveValue('#666666')
    expect(screen.getByLabelText(/Accent/i)).toHaveValue('#0066cc')
  })

  it('updates colors when input changes', () => {
    render(<ColorCustomization />)
    
    const primaryInput = screen.getByLabelText(/Primary/i)
    fireEvent.change(primaryInput, { target: { value: '#ff0000' } })
    
    expect(mockUpdateColors).toHaveBeenCalledWith({
      primary: '#ff0000'
    })
  })

  it('shows color picker for each color option', () => {
    render(<ColorCustomization />)
    
    const colorPickers = screen.getAllByTestId(/-color-picker$/)
    expect(colorPickers).toHaveLength(3)
  })

  it('updates text input when color picker changes', () => {
    const { rerender } = render(<ColorCustomization />)
    
    const primaryPicker = screen.getByTestId('primary-color-picker')
    
    fireEvent.change(primaryPicker, { target: { value: '#ff0000' } })
    
    expect(mockUpdateColors).toHaveBeenCalledWith({
      primary: '#ff0000'
    })
    
    // עדכון המוק עם הערך החדש
    ;(useResume as jest.Mock).mockReturnValue({
      resumeData: {
        colors: {
          primary: '#ff0000',
          secondary: '#666666',
          accent: '#0066cc'
        }
      },
      updateColors: mockUpdateColors
    })
    
    // שימוש ב-rerender במקום render חדש
    rerender(<ColorCustomization />)
    
    expect(screen.getByTestId('primary-color-text')).toHaveValue('#ff0000')
  })
}) 
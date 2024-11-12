import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

describe('HomePage', () => {
  it('renders welcome message and logo', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument()
    expect(screen.getByAltText('QuickCV Logo')).toBeInTheDocument()
  })

  it('renders language selector', () => {
    render(<HomePage />)
    
    expect(screen.getByLabelText(/Select Language/i)).toBeInTheDocument()
  })

  it('renders API key input', () => {
    render(<HomePage />)
    
    expect(screen.getByText(/API Key/i)).toBeInTheDocument()
  })

  it('renders continue button with correct link', () => {
    render(<HomePage />)
    
    const continueButton = screen.getByText(/Continue to Resume Builder/i)
    expect(continueButton).toBeInTheDocument()
    expect(continueButton.closest('a')).toHaveAttribute('href', '/en/resume-builder')
  })
}) 
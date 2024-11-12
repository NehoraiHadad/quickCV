import { render, screen } from '@testing-library/react'
import ResumeBuilderPage from '@/app/[language]/resume-builder/page'
import { ResumeProvider } from '@/context/ResumeContext'

// Mock the Split component
jest.mock('react-split', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-split">{children}</div>
  )
}))

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

describe('ResumeBuilderPage', () => {
  it('renders all resume sections', () => {
    render(
      <ResumeProvider>
        <ResumeBuilderPage />
      </ResumeProvider>
    )

    expect(screen.getByTestId('personal-info-section')).toBeInTheDocument()
    expect(screen.getByTestId('work-experience-section')).toBeInTheDocument()
    expect(screen.getByTestId('education-section')).toBeInTheDocument()
    expect(screen.getByTestId('skills-section')).toBeInTheDocument()
    expect(screen.getByTestId('projects-section')).toBeInTheDocument()
  })

  it('renders template selection', () => {
    render(
      <ResumeProvider>
        <ResumeBuilderPage />
      </ResumeProvider>
    )

    expect(screen.getByTestId('template-selection')).toBeInTheDocument()
  })

  it('renders resume preview', () => {
    render(
      <ResumeProvider>
        <ResumeBuilderPage />
      </ResumeProvider>
    )

    expect(screen.getByTestId('resume-preview')).toBeInTheDocument()
  })

  it('renders color customization', () => {
    render(
      <ResumeProvider>
        <ResumeBuilderPage />
      </ResumeProvider>
    )

    expect(screen.getByTestId('color-customization')).toBeInTheDocument()
  })
}) 
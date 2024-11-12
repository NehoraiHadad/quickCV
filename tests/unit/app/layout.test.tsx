import { render, screen } from '@testing-library/react'
import RootLayout from '@/app/layout'

describe('RootLayout', () => {
  it('renders children within layout', () => {
    render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    )

    expect(screen.getByTestId('test-child')).toBeInTheDocument()
  })

  it('includes necessary meta tags', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    const html = document.documentElement
    expect(html.getAttribute('lang')).toBe('en')
    
    const meta = document.querySelector('meta[name="description"]')
    expect(meta).toBeInTheDocument()
  })

  it('applies global styles', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    const body = document.body
    expect(body).toHaveClass('bg-gray-50')
  })
}) 
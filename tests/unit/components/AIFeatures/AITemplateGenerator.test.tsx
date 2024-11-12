import { AITemplateGenerator } from '@/components/AIFeatures/AITemplateGenerator'
import { generateAIContent } from '@/utils/aiApi'

jest.mock('@/utils/aiApi', () => ({
  generateAIContent: jest.fn()
}))

describe('AITemplateGenerator', () => {
  const mockPreferences = {
    layout: 'modern',
    colorScheme: 'professional',
    style: 'minimal'
  }

  const mockApiKey = 'test-key'
  const mockService = 'openai'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('generates valid template code', async () => {
    const mockTemplateCode = `
      React.createElement('div', {
        className: 'resume-container'
      }, [
        React.createElement('h1', null, personalInfo.name)
      ])
    `

    ;(generateAIContent as jest.Mock).mockResolvedValueOnce([mockTemplateCode])

    const result = await AITemplateGenerator(mockPreferences, mockApiKey, mockService)

    expect(result.success).toBe(true)
    expect(result.templateCode).toContain('React.createElement')
  })

  it('handles missing API credentials', async () => {
    const result = await AITemplateGenerator(mockPreferences, '', '')

    expect(result.success).toBe(false)
    expect(result.error).toBe('API key and service is required')
  })

  it('handles invalid template code', async () => {
    const invalidCode = 'invalid javascript code {'
    ;(generateAIContent as jest.Mock).mockResolvedValueOnce([invalidCode])

    const result = await AITemplateGenerator(mockPreferences, mockApiKey, mockService)

    expect(result.success).toBe(false)
    expect(result.error).toContain('Invalid template code')
  })

  it('handles API errors', async () => {
    ;(generateAIContent as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

    const result = await AITemplateGenerator(mockPreferences, mockApiKey, mockService)

    expect(result.success).toBe(false)
    expect(result.error).toBe('API Error')
  })

  it('validates template structure', async () => {
    const codeWithoutReact = 'document.createElement("div")'
    ;(generateAIContent as jest.Mock).mockResolvedValueOnce([codeWithoutReact])

    const result = await AITemplateGenerator(mockPreferences, mockApiKey, mockService)

    expect(result.success).toBe(false)
    expect(result.error).toContain('Invalid template structure')
  })
}) 
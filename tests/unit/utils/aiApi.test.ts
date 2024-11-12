import { generateAIContent, validateApiKey } from '@/utils/aiApi'

describe('AI API Utils', () => {
  const mockApiKey = 'test-api-key'
  const mockService = 'openai'

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('validateApiKey', () => {
    it('returns true for valid API key', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ choices: [{ message: { content: 'Test response' } }] })
      })

      const result = await validateApiKey(mockApiKey, mockService)
      expect(result).toBe(true)
    })

    it('returns false for invalid API key', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Invalid API key'))

      const result = await validateApiKey(mockApiKey, mockService)
      expect(result).toBe(false)
    })
  })

  describe('generateAIContent', () => {
    const mockContext = 'Test context'
    const mockAction = 'suggest' as const

    it('successfully generates content', async () => {
      const mockResponse = { choices: [{ message: { content: 'Generated content' } }] }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await generateAIContent(
        mockApiKey,
        mockService,
        'Test prompt',
        'Test field',
        mockContext,
        mockAction
      )
      expect(result).toEqual(['Generated content'])
    })

    it('handles API errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))

      await expect(
        generateAIContent(
          mockApiKey,
          mockService,
          'Test prompt',
          'Test field',
          mockContext,
          mockAction
        )
      ).rejects.toThrow('API Error')
    })
  })
}) 
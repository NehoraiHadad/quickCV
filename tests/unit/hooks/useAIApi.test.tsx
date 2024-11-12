import { renderHook, act } from '@testing-library/react'
import { useAIApi } from '@/hooks/useAIApi'

describe('useAIApi', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with empty API key', () => {
    const { result } = renderHook(() => useAIApi())
    expect(result.current.apiKey).toBe('')
  })

  it('updates API key', () => {
    const { result } = renderHook(() => useAIApi())

    act(() => {
      result.current.setApiKey('test-key')
    })

    expect(result.current.apiKey).toBe('test-key')
  })

  it('persists API key in localStorage', () => {
    const { result } = renderHook(() => useAIApi())

    act(() => {
      result.current.setApiKey('test-key')
    })

    expect(localStorage.getItem('aiApiKey')).toBe('test-key')
  })

  it('updates service selection', () => {
    const { result } = renderHook(() => useAIApi())

    act(() => {
      result.current.setService('anthropic')
    })

    expect(result.current.service).toBe('anthropic')
    expect(localStorage.getItem('aiService')).toBe('anthropic')
  })
}) 
import { renderHook, act } from '@testing-library/react'
import { useCustomTemplates } from '@/hooks/useCustomTemplates'
import { CustomTemplate, TemplatePreferences } from '@/types/templates'

describe('useCustomTemplates', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const createTestTemplate = (): CustomTemplate => ({
    id: '1',
    name: 'Custom Template',
    code: 'React.createElement("div")',
    preferences: {
      layout: "single-column" as const,
      name: "",
      headerStyle: {
        position: "top",
        alignment: "left",
        size: "medium"
      },
      sectionOrder: [],
      colorScheme: {
        primary: "#000000",
        secondary: "#666666",
        accent: "#0066cc",
        background: "#ffffff"
      },
      visualElements: {
        useDividers: true,
        useIcons: false,
        borderStyle: "solid",
        useShapes: false
      },
      spacing: "balanced"
    },
    createdAt: new Date()
  })

  it('initializes with empty templates array', () => {
    const { result } = renderHook(() => useCustomTemplates())
    expect(result.current.customTemplates).toEqual([])
  })

  it('adds new template', async () => {
    const { result } = renderHook(() => useCustomTemplates())
    const newTemplate = createTestTemplate()

    await act(async () => {
      await result.current.addTemplate(newTemplate)
    })

    expect(result.current.customTemplates).toContainEqual(expect.objectContaining({
      id: '1',
      name: 'Custom Template',
      isCustom: true
    }))
  })

  it('removes template', async () => {
    const { result } = renderHook(() => useCustomTemplates())
    const template = createTestTemplate()

    await act(async () => {
      await result.current.addTemplate(template)
      await result.current.deleteTemplate('1')
    })

    expect(result.current.customTemplates).not.toContainEqual(expect.objectContaining({
      id: '1'
    }))
  })

  it('persists templates in localStorage', async () => {
    const { result } = renderHook(() => useCustomTemplates())
    const template = createTestTemplate()

    await act(async () => {
      await result.current.addTemplate(template)
    })

    const stored = JSON.parse(localStorage.getItem('customTemplates') || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('1')
  })
}) 
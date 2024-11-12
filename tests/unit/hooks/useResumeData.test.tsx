import { renderHook, act } from '@testing-library/react'
import { useResumeData } from '@/hooks/useResumeData'

describe('useResumeData', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with default resume data', () => {
    const { result } = renderHook(() => useResumeData())
    
    expect(result.current.resumeData.personalInfo).toEqual({
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    })
    expect(result.current.resumeData.workExperience).toHaveLength(0)
    expect(result.current.resumeData.education).toHaveLength(0)
    expect(result.current.resumeData.skills).toHaveLength(0)
    expect(result.current.resumeData.projects).toHaveLength(0)
    expect(result.current.resumeData.additionalSections).toHaveLength(0)
    expect(result.current.resumeData.colors).toEqual({
      primary: '',
      secondary: '',
      accent: ''
    })
  })

  it('updates personal info', () => {
    const { result } = renderHook(() => useResumeData())

    act(() => {
      result.current.updatePersonalInfo({
        name: 'John Doe',
        title: 'Developer',
        email: 'john@example.com',
        phone: '123-456-7890',
        location: 'New York',
        summary: 'Experienced developer'
      })
    })

    expect(result.current.resumeData.personalInfo).toEqual({
      name: 'John Doe',
      title: 'Developer',
      email: 'john@example.com',
      phone: '123-456-7890',
      location: 'New York',
      summary: 'Experienced developer'
    })
  })

  it('adds and removes work experience', () => {
    const { result } = renderHook(() => useResumeData())

    const newExperience = {
      company: 'Tech Corp',
      position: 'Developer',
      startDate: '2020-01',
      endDate: '2023-01',
      description: 'Development work'
    }

    act(() => {
      result.current.addWorkExperience(newExperience)
    })

    expect(result.current.resumeData.workExperience).toHaveLength(1)
    expect(result.current.resumeData.workExperience[0]).toEqual({
      ...newExperience,
      id: expect.any(String)
    })

    const experienceId = result.current.resumeData.workExperience[0].id

    act(() => {
      result.current.removeWorkExperience(experienceId)
    })

    expect(result.current.resumeData.workExperience).toHaveLength(0)
  })
}) 
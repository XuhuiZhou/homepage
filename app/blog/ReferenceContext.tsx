'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface ReferenceContextType {
  registerFigure: (id: string) => number
  getFigureNumber: (id: string) => number | undefined
  registerSection: (id: string, level: number) => string
  getSectionNumber: (id: string) => string | undefined
  figures: Map<string, number>
  sections: Map<string, string>
}

export const ReferenceContext = createContext<ReferenceContextType | undefined>(undefined)

export function ReferenceProvider({ children }: { children: ReactNode }) {
  const [figures, setFigures] = useState<Map<string, number>>(new Map())
  const [sections, setSections] = useState<Map<string, string>>(new Map())
  const [sectionCounters, setSectionCounters] = useState<{ h2: number; h3: number; h4: number }>({ h2: 0, h3: 0, h4: 0 })
  const [figureCounter, setFigureCounter] = useState(0)
  const [, setRefreshKey] = useState(0)

  const registerFigure = useCallback((id: string) => {
    if (!figures.has(id)) {
      const number = figureCounter + 1
      setFigures(prev => new Map(prev).set(id, number))
      setFigureCounter(number)
      setRefreshKey(prev => prev + 1)
      return number
    }
    return figures.get(id)!
  }, [figures, figureCounter])

  const getFigureNumber = useCallback((id: string) => {
    return figures.get(id)
  }, [figures])

  const registerSection = useCallback((id: string, level: number) => {
    if (!sections.has(id)) {
      let sectionNumber = ''

      setSectionCounters(prevCounters => {
        const newCounters = { ...prevCounters }

        if (level === 2) {
          newCounters.h2++
          newCounters.h3 = 0
          newCounters.h4 = 0
          sectionNumber = `${newCounters.h2}`
        } else if (level === 3) {
          newCounters.h3++
          newCounters.h4 = 0
          sectionNumber = `${newCounters.h2}.${newCounters.h3}`
        } else if (level === 4) {
          newCounters.h4++
          sectionNumber = `${newCounters.h2}.${newCounters.h3}.${newCounters.h4}`
        }

        return newCounters
      })

      setSections(prev => new Map(prev).set(id, sectionNumber))
      setRefreshKey(prev => prev + 1)
      return sectionNumber
    }
    return sections.get(id)!
  }, [sections])

  const getSectionNumber = useCallback((id: string) => {
    return sections.get(id)
  }, [sections])

  return (
    <ReferenceContext.Provider value={{
      registerFigure,
      getFigureNumber,
      registerSection,
      getSectionNumber,
      figures,
      sections
    }}>
      {children}
    </ReferenceContext.Provider>
  )
}

export function useReferences() {
  const context = useContext(ReferenceContext)
  if (!context) {
    throw new Error('useReferences must be used within a ReferenceProvider')
  }
  return context
}

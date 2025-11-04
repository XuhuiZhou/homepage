'use client'

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react'

interface ReferenceContextType {
  registerFigure: (id: string) => number
  getFigureNumber: (id: string) => number | undefined
  registerSection: (id: string, level: number) => string
  getSectionNumber: (id: string) => string | undefined
  figures: Map<string, number>
  sections: Map<string, string>
}

const ReferenceContext = createContext<ReferenceContextType | undefined>(undefined)

export function ReferenceProvider({ children }: { children: ReactNode }) {
  const figuresRef = useRef<Map<string, number>>(new Map())
  const sectionsRef = useRef<Map<string, string>>(new Map())
  const sectionCountersRef = useRef<{ h2: number; h3: number; h4: number }>({ h2: 0, h3: 0, h4: 0 })
  const [figureCounter, setFigureCounter] = useState(0)
  const [, setRefreshKey] = useState(0)

  const registerFigure = useCallback((id: string) => {
    if (!figuresRef.current.has(id)) {
      setFigureCounter(prev => {
        const number = prev + 1
        figuresRef.current.set(id, number)
        return number
      })
      setRefreshKey(prev => prev + 1)
      return figuresRef.current.get(id)!
    }
    return figuresRef.current.get(id)!
  }, [])

  const getFigureNumber = useCallback((id: string) => {
    return figuresRef.current.get(id)
  }, [])

  const registerSection = useCallback((id: string, level: number) => {
    if (!sectionsRef.current.has(id)) {
      const counters = sectionCountersRef.current
      let sectionNumber = ''

      if (level === 2) {
        counters.h2++
        counters.h3 = 0
        counters.h4 = 0
        sectionNumber = `${counters.h2}`
      } else if (level === 3) {
        counters.h3++
        counters.h4 = 0
        sectionNumber = `${counters.h2}.${counters.h3}`
      } else if (level === 4) {
        counters.h4++
        sectionNumber = `${counters.h2}.${counters.h3}.${counters.h4}`
      }

      sectionsRef.current.set(id, sectionNumber)
      setRefreshKey(prev => prev + 1)
      return sectionNumber
    }
    return sectionsRef.current.get(id)!
  }, [])

  const getSectionNumber = useCallback((id: string) => {
    return sectionsRef.current.get(id)
  }, [])

  return (
    <ReferenceContext.Provider value={{
      registerFigure,
      getFigureNumber,
      registerSection,
      getSectionNumber,
      figures: figuresRef.current,
      sections: sectionsRef.current
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

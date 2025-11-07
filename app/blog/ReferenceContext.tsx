'use client'

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react'

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
  const figuresRef = useRef<Map<string, number>>(new Map())
  const sectionsRef = useRef<Map<string, string>>(new Map())
  const sectionCountersRef = useRef<{ h2: number; h3: number; h4: number }>({ h2: 0, h3: 0, h4: 0 })
  const [, setFigureCounter] = useState(0)
  const [, setRefreshKey] = useState(0)
  const preRegisteredRef = useRef(false)

  // Pre-register figures by scanning the children tree before first render
  if (!preRegisteredRef.current) {
    const ids: string[] = []

    const visit = (node: ReactNode) => {
      if (node == null || typeof node === 'boolean') return
      if (Array.isArray(node)) {
        node.forEach(visit)
        return
      }
      if (React.isValidElement(node)) {
        // Identify our Figure components by function name to avoid import cycles
        const typeName =
          typeof node.type === 'function'
            ? ((node.type as React.ComponentType<unknown>).displayName ?? (node.type as React.ComponentType<unknown>).name)
            : (typeof node.type === 'object' && (node.type as { displayName?: string })?.displayName)
        const props = node.props as { id?: string; children?: React.ReactNode }
        if (typeName === 'Figure' && props?.id) {
          ids.push(props.id)
        }
        if (props?.children) {
          visit(props.children)
        }
      }
    }

    visit(children)

    let next = 1
    for (const id of ids) {
      if (!figuresRef.current.has(id)) {
        figuresRef.current.set(id, next)
        next++
      }
    }

    // Initialize counter to number of pre-registered figures
    if (figuresRef.current.size > 0) {
      // set synchronously via ref; state will be aligned in the mount effect
    }

    preRegisteredRef.current = true
  }

  // Initialize counters on mount; keep any pre-registered data intact
  useEffect(() => {
    if (figuresRef.current.size === 0) {
      figuresRef.current = new Map()
      setFigureCounter(0)
    } else {
      setFigureCounter(figuresRef.current.size)
    }

    if (sectionsRef.current.size === 0) {
      sectionsRef.current = new Map()
    }

    sectionCountersRef.current = { h2: 0, h3: 0, h4: 0 }
    setRefreshKey(prev => prev + 1)
  }, [])

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

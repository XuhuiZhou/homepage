'use client'

import { useEffect, ReactNode } from 'react'
import { useReferences } from './ReferenceContext'

interface FigureProps {
  id: string
  children: ReactNode
}

export function Figure({ id, children }: FigureProps) {
  const { registerFigure } = useReferences()

  useEffect(() => {
    registerFigure(id)
  }, [id, registerFigure])

  return (
    <div id={`fig:${id}`} className="scroll-mt-24">
      {children}
    </div>
  )
}

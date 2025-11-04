'use client'

import { useEffect, useState } from 'react'
import { useReferences } from './ReferenceContext'

interface NumberedHeadingProps {
  level: number
  id: string
  children: React.ReactNode
}

export function NumberedHeading({ level, id, children }: NumberedHeadingProps) {
  const { registerSection, getSectionNumber } = useReferences()
  const [sectionNumber, setSectionNumber] = useState<string>('')

  useEffect(() => {
    // Only number h2, h3, h4
    if (level >= 2 && level <= 4) {
      const number = registerSection(id, level)
      setSectionNumber(number)
    }
  }, [id, level, registerSection])

  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  // For h2, h3, h4 - show section number
  if (level >= 2 && level <= 4 && sectionNumber) {
    return (
      <Tag id={id}>
        <span className="text-zinc-500 font-normal">{sectionNumber}</span>{' '}
        {children}
      </Tag>
    )
  }

  // For h1, h5, h6 - no section number
  return (
    <Tag id={id}>
      {children}
    </Tag>
  )
}

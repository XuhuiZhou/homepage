'use client'

import { useEffect, useState, useContext } from 'react'
import { ReferenceContext } from './ReferenceContext'

interface NumberedHeadingProps {
  level: number
  id: string
  children: React.ReactNode
}

/**
 * NumberedHeading component that works both inside and outside ReferenceProvider.
 *
 * - Inside ReferenceProvider (blog posts): Displays section numbers (e.g., "1 Heading")
 * - Outside ReferenceProvider (other pages): Displays plain headings
 *
 * Note: Unlike Figure and Ref components which require ReferenceProvider,
 * this component uses useContext directly to gracefully handle missing context.
 */
export function NumberedHeading({ level, id, children }: NumberedHeadingProps) {
  const context = useContext(ReferenceContext)
  const [sectionNumber, setSectionNumber] = useState<string>('')

  useEffect(() => {
    // Only number h2, h3, h4 and only if we have a context
    if (context && level >= 2 && level <= 4) {
      const number = context.registerSection(id, level)
      setSectionNumber(number)
    }
  }, [id, level, context])

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

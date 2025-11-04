'use client'

import { useEffect, useState } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Extract all h2 and h3 headings from the page
    const elements = document.querySelectorAll('main h2, main h3')
    const items: TOCItem[] = Array.from(elements).map((element) => {
      const text = element.textContent || ''
      const level = parseInt(element.tagName.charAt(1))
      const id = element.id || slugify(text)

      // Ensure the element has an id for linking
      if (!element.id) {
        element.id = id
      }

      return { id, text, level }
    })

    setHeadings(items)

    // Set up intersection observer for scroll highlighting
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      }
    )

    elements.forEach((element) => observer.observe(element))

    return () => {
      elements.forEach((element) => observer.unobserve(element))
    }
  }, [])

  if (headings.length === 0) return null

  return (
    <nav className="space-y-1 text-sm">
      <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
        On this page
      </div>
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={`block py-1 transition-colors ${
            heading.level === 3 ? 'pl-4' : ''
          } ${
            activeId === heading.id
              ? 'text-zinc-900 dark:text-zinc-100 font-medium'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
          }`}
          onClick={(e) => {
            e.preventDefault()
            const element = document.getElementById(heading.id)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
              setActiveId(heading.id)
            }
          }}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  )
}

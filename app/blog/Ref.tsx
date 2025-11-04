'use client'

import { useReferences } from './ReferenceContext'

interface RefProps {
  fig?: string
  sec?: string
}

export function Ref({ fig, sec }: RefProps) {
  const { getFigureNumber, getSectionNumber } = useReferences()

  if (fig) {
    const number = getFigureNumber(fig)
    if (!number) {
      return <span className="text-red-500">[Figure {fig} not found]</span>
    }
    return (
      <a
        href={`#fig:${fig}`}
        className="text-inherit no-underline hover:underline font-medium"
      >
        Figure {number}
      </a>
    )
  }

  if (sec) {
    const number = getSectionNumber(sec)
    if (!number) {
      return <span className="text-red-500">[Section {sec} not found]</span>
    }
    return (
      <a
        href={`#${sec}`}
        className="text-inherit no-underline hover:underline font-medium"
      >
        Section {number}
      </a>
    )
  }

  return <span className="text-red-500">[Invalid ref]</span>
}

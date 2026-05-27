'use client'

import { useState, useEffect } from 'react'

export function CVToggle() {
  const [selectedOnly, setSelectedOnly] = useState(false)
  const [counts, setCounts] = useState<{ total: number; selected: number }>({ total: 0, selected: 0 })

  useEffect(() => {
    const pubs = document.querySelector('.cv-pubs')
    if (!pubs) return
    const total = pubs.querySelectorAll(':scope > p').length
    const selected = pubs.querySelectorAll(':scope > p .pub-sel').length
    setCounts({ total, selected })
  }, [])

  useEffect(() => {
    const root = document.querySelector('.cv-root')
    if (!root) return
    root.classList.toggle('selected-only', selectedOnly)
  }, [selectedOnly])

  const label = selectedOnly
    ? `Show all (${counts.total})`
    : `Show selected only (${counts.selected})`

  return (
    <button
      type="button"
      onClick={() => setSelectedOnly((v) => !v)}
      className="rounded border border-zinc-300 px-2 py-0.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 print:hidden"
    >
      {label}
    </button>
  )
}

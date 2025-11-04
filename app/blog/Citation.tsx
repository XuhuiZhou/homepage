'use client'

import { useState } from 'react'

interface CitationProps {
  author: string
  title: string
  year: string
  url: string
  doi?: string
  bibtexKey: string
}

export default function Citation({
  author,
  title,
  year,
  url,
  doi,
  bibtexKey,
}: CitationProps) {
  const [copied, setCopied] = useState(false)

  const bibtexContent = `@misc{${bibtexKey},
  author = {${author}},
  title = {${title}},
  year = {${year}},
  howpublished = {\\url{${url}}},${doi ? `\n  doi = {${doi}},` : ''}
}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bibtexContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="not-prose my-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Citation
      </h2>

      <div className="space-y-6">
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Please cite this work as:
          </p>
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
            <p className="font-charter text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              {author}, &ldquo;{title}&rdquo;, {year}.
            </p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Or use the BibTeX citation:
            </p>
            <button
              onClick={handleCopy}
              className="rounded px-3 py-1 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
            <pre className="overflow-x-auto text-sm text-zinc-800 dark:text-zinc-200">
              <code>{bibtexContent}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

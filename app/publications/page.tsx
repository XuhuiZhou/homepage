'use client'
import { motion } from 'motion/react'
import { PUBLICATIONS, Publication } from '../data/publications'
import { useState } from 'react'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const VARIANTS_ITEM = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

function PublicationCard({ pub }: { pub: Publication }) {
  const [showAbstract, setShowAbstract] = useState(false)

  return (
    <motion.div
      variants={VARIANTS_ITEM}
      className="mb-6 rounded-xl bg-zinc-50/40 p-4 ring-1 ring-zinc-200/50 dark:bg-zinc-950/40 dark:ring-zinc-800/50"
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
              {pub.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {pub.authors.map((author, i) => {
                const isXuhui = author === 'Xuhui Zhou'
                return (
                  <span key={i}>
                    {isXuhui ? (
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {author}
                      </span>
                    ) : (
                      author
                    )}
                    {i < pub.authors.length - 1 && ', '}
                  </span>
                )
              })}
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {pub.venue}
              {pub.award && (
                <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                  🏆 {pub.award}
                </span>
              )}
            </p>
          </div>
          {pub.abbr && (
            <span className="shrink-0 rounded-md bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {pub.abbr}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          {pub.url && (
            <a
              href={pub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50"
            >
              Paper
            </a>
          )}
          {pub.arxiv && pub.arxiv !== pub.url && (
            <a
              href={pub.arxiv}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50"
            >
              arXiv
            </a>
          )}
          {pub.pdf && (
            <a
              href={pub.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50"
            >
              PDF
            </a>
          )}
          {pub.code && (
            <a
              href={pub.code}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50"
            >
              Code
            </a>
          )}
          {pub.website && (
            <a
              href={pub.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50"
            >
              Website
            </a>
          )}
          {pub.demo && (
            <a
              href={pub.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50"
            >
              Demo
            </a>
          )}
          {pub.abstract && (
            <button
              onClick={() => setShowAbstract(!showAbstract)}
              className="text-sm text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50"
            >
              {showAbstract ? 'Hide' : 'Abstract'}
            </button>
          )}
        </div>

        {/* Abstract */}
        {showAbstract && pub.abstract && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {pub.abstract}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function Publications() {
  // Group publications by year
  const publicationsByYear = PUBLICATIONS.reduce(
    (acc, pub) => {
      if (!acc[pub.year]) {
        acc[pub.year] = []
      }
      acc[pub.year].push(pub)
      return acc
    },
    {} as Record<number, Publication[]>
  )

  const years = Object.keys(publicationsByYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <motion.div
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={VARIANTS_ITEM}>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">
          Publications
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Research on social AI, safety, and language understanding.
        </p>
      </motion.div>

      {years.map((year) => (
        <motion.section key={year} variants={VARIANTS_ITEM}>
          <h2 className="mb-4 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            {year}
          </h2>
          <div className="space-y-4">
            {publicationsByYear[year].map((pub, index) => (
              <PublicationCard key={`${year}-${index}`} pub={pub} />
            ))}
          </div>
        </motion.section>
      ))}
    </motion.div>
  )
}

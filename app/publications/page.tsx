'use client'
import { motion } from 'motion/react'
import { PUBLICATIONS, Publication } from '../data/publications'
import { useState, useMemo } from 'react'
import { AnimatedBackground } from '@/components/ui/animated-background'

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
            {pub.themes && pub.themes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {pub.themes.map((theme) => (
                  <span
                    key={theme}
                    className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-300/20"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            )}
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
          {pub.tweet && (
            <a
              href={pub.tweet}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-zinc-50"
            >
              X Post
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

type FilterOption = {
  label: string
  value: string
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900'
          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
      }`}
    >
      {children}
    </button>
  )
}

function CollapsibleSection({
  title,
  isExpanded,
  onToggle,
  children,
}: {
  title: string
  isExpanded: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="mb-3 flex w-full items-center justify-between text-sm font-medium text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
      >
        <span>{title}</span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path
            d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  )
}

export default function Publications() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [selectedVenue, setSelectedVenue] = useState<string>('all')
  const [selectedTheme, setSelectedTheme] = useState<string>('all')
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true)

  // Extract unique venues for filtering (exclude workshops - venues with spaces, and specific workshops)
  const excludedVenues = ['BlackboxNLP']
  const venues = useMemo(() => {
    const venueSet = new Set<string>()
    PUBLICATIONS.forEach((pub) => {
      if (pub.abbr && !pub.abbr.includes(' ') && !excludedVenues.includes(pub.abbr)) {
        venueSet.add(pub.abbr)
      }
    })
    return Array.from(venueSet).sort()
  }, [])

  // Extract unique themes for filtering - only specific themes
  const allowedThemes = ['AI Safety', 'Agents', 'Social AI', 'Grounding', 'Multi-Agent Systems']
  const themes = useMemo(() => {
    const themeSet = new Set<string>()
    PUBLICATIONS.forEach((pub) => {
      if (pub.themes) {
        pub.themes.forEach((theme) => {
          if (allowedThemes.includes(theme)) {
            themeSet.add(theme)
          }
        })
      }
    })
    // Sort in specific order
    return allowedThemes.filter(theme => themeSet.has(theme))
  }, [])

  // Filter publications based on selected filters
  const filteredPublications = useMemo(() => {
    return PUBLICATIONS.filter((pub) => {
      // First author filter
      if (selectedFilter === 'first-author' && pub.authors[0] !== 'Xuhui Zhou') {
        return false
      }

      // Award-winning filter
      if (selectedFilter === 'awards' && !pub.award) {
        return false
      }

      // Representative filter
      if (selectedFilter === 'representative' && !pub.representative) {
        return false
      }

      // Venue filter
      if (selectedVenue !== 'all' && pub.abbr !== selectedVenue) {
        return false
      }

      // Theme filter
      if (selectedTheme !== 'all') {
        if (!pub.themes || !pub.themes.includes(selectedTheme)) {
          return false
        }
      }

      return true
    })
  }, [selectedFilter, selectedVenue, selectedTheme])

  // Group publications by year
  const publicationsByYear = filteredPublications.reduce(
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

      {/* Filters */}
      <motion.div variants={VARIANTS_ITEM}>
        <CollapsibleSection
          title="Filters"
          isExpanded={isFiltersExpanded}
          onToggle={() => setIsFiltersExpanded(!isFiltersExpanded)}
        >
          <div className="space-y-6 pb-2">
            <div>
              <h3 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Filter by
              </h3>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={selectedFilter === 'all'}
                  onClick={() => setSelectedFilter('all')}
                >
                  All ({PUBLICATIONS.length})
                </FilterButton>
                <FilterButton
                  active={selectedFilter === 'representative'}
                  onClick={() => setSelectedFilter('representative')}
                >
                  Representative ({PUBLICATIONS.filter(p => p.representative).length})
                </FilterButton>
                <FilterButton
                  active={selectedFilter === 'first-author'}
                  onClick={() => setSelectedFilter('first-author')}
                >
                  First Author ({PUBLICATIONS.filter(p => p.authors[0] === 'Xuhui Zhou').length})
                </FilterButton>
                <FilterButton
                  active={selectedFilter === 'awards'}
                  onClick={() => setSelectedFilter('awards')}
                >
                  Awards ({PUBLICATIONS.filter(p => p.award).length})
                </FilterButton>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Venue
              </h3>
              <div className="flex flex-wrap gap-2">
                <FilterButton
                  active={selectedVenue === 'all'}
                  onClick={() => setSelectedVenue('all')}
                >
                  All Venues
                </FilterButton>
                {venues.map((venue) => (
                  <FilterButton
                    key={venue}
                    active={selectedVenue === venue}
                    onClick={() => setSelectedVenue(venue)}
                  >
                    {venue}
                  </FilterButton>
                ))}
              </div>
            </div>

            {themes.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Theme
                </h3>
                <div className="flex flex-wrap gap-2">
                  <FilterButton
                    active={selectedTheme === 'all'}
                    onClick={() => setSelectedTheme('all')}
                  >
                    All Themes
                  </FilterButton>
                  {themes.map((theme) => (
                    <FilterButton
                      key={theme}
                      active={selectedTheme === theme}
                      onClick={() => setSelectedTheme(theme)}
                    >
                      {theme}
                    </FilterButton>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>
      </motion.div>

      {/* Publications count */}
      <motion.div variants={VARIANTS_ITEM}>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Showing {filteredPublications.length} publication{filteredPublications.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Publications list */}
      {years.length > 0 ? (
        years.map((year) => (
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
        ))
      ) : (
        <motion.div variants={VARIANTS_ITEM} className="py-12 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            No publications match the selected filters.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

'use client'

import { Check, ExternalLink, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  BENCHMARK_CATEGORIES,
  BENCHMARK_FAMILIES,
  LABS,
  RELEASE_REPORTS,
  type BenchmarkCategory,
  type BenchmarkId,
  type LabKey,
  type ReleaseReport,
} from './history-data'

type LabFilter = LabKey | 'all'
type StatusFilter = 'all' | 'active' | 'absent-latest' | 'one-off'

const LAB_STYLES: Record<
  LabKey,
  {
    border: string
    bar: string
    reported: string
    badge: string
  }
> = {
  openai: {
    border: 'border-violet-600 dark:border-violet-400',
    bar: 'bg-violet-600 dark:bg-violet-400',
    reported:
      'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200',
    badge:
      'border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-500/10 dark:text-violet-200',
  },
  anthropic: {
    border: 'border-orange-600 dark:border-orange-400',
    bar: 'bg-orange-600 dark:bg-orange-400',
    reported:
      'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200',
    badge:
      'border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-500/10 dark:text-orange-200',
  },
  meta: {
    border: 'border-blue-600 dark:border-blue-400',
    bar: 'bg-blue-600 dark:bg-blue-400',
    reported:
      'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200',
    badge:
      'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-500/10 dark:text-blue-200',
  },
  xai: {
    border: 'border-zinc-950 dark:border-zinc-100',
    bar: 'bg-zinc-950 dark:bg-zinc-100',
    reported: 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100',
    badge:
      'border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100',
  },
  'thinking-machines': {
    border: 'border-emerald-600 dark:border-emerald-400',
    bar: 'bg-emerald-600 dark:bg-emerald-400',
    reported:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
    badge:
      'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200',
  },
}

const CATEGORY_ORDER = new Map(
  BENCHMARK_CATEGORIES.map((category, index) => [category, index]),
)

function reportsForLab(lab: LabKey) {
  return RELEASE_REPORTS.filter((release) => release.lab === lab).sort((a, b) =>
    a.date.localeCompare(b.date),
  )
}

function reportsBenchmark(release: ReleaseReport, benchmarkId: BenchmarkId) {
  return Object.prototype.hasOwnProperty.call(release.benchmarks, benchmarkId)
}

function transitionStats(releases: ReleaseReport[]) {
  return releases.slice(1).map((current, index) => {
    const previous = releases[index]
    const previousIds = new Set(Object.keys(previous.benchmarks))
    const currentIds = new Set(Object.keys(current.benchmarks))
    const retained = [...previousIds].filter((id) => currentIds.has(id)).length
    const added = [...currentIds].filter((id) => !previousIds.has(id)).length
    const dropped = [...previousIds].filter((id) => !currentIds.has(id)).length

    return {
      current,
      previous,
      retained,
      added,
      dropped,
      retention: previousIds.size
        ? Math.round((retained / previousIds.size) * 100)
        : 0,
    }
  })
}

function cellClass(reported: boolean, lab: LabKey) {
  if (reported) return LAB_STYLES[lab].reported
  return 'text-zinc-300 dark:text-zinc-700'
}

export function BenchmarkLifecycle() {
  const [labFilter, setLabFilter] = useState<LabFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<
    BenchmarkCategory | 'all'
  >('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')
  const [selectedBenchmarkId, setSelectedBenchmarkId] =
    useState<BenchmarkId>('hle')
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(
    null,
  )

  const scopedLabs = useMemo(
    () =>
      labFilter === 'all'
        ? LABS.map((lab) => lab.id)
        : ([labFilter] as LabKey[]),
    [labFilter],
  )

  const releaseGroups = useMemo(
    () =>
      LABS.filter((lab) => scopedLabs.includes(lab.id)).map((lab) => ({
        ...lab,
        releases: reportsForLab(lab.id),
      })),
    [scopedLabs],
  )

  const scopedReports = useMemo(
    () => releaseGroups.flatMap((group) => group.releases),
    [releaseGroups],
  )

  const filteredFamilies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return BENCHMARK_FAMILIES.filter((family) => {
      if (categoryFilter !== 'all' && family.category !== categoryFilter) {
        return false
      }
      if (
        normalizedQuery &&
        !family.name.toLowerCase().includes(normalizedQuery)
      ) {
        return false
      }

      const appearances = scopedReports.filter((release) =>
        reportsBenchmark(release, family.id),
      )
      const latestByLab = scopedLabs.map((lab) => reportsForLab(lab).at(-1))
      const active = latestByLab.some(
        (release) => release && reportsBenchmark(release, family.id),
      )
      const absentFromLatest = scopedLabs.some((lab) => {
        const labReports = reportsForLab(lab)
        return (
          labReports.some((release) => reportsBenchmark(release, family.id)) &&
          !reportsBenchmark(labReports[labReports.length - 1], family.id)
        )
      })
      if (statusFilter === 'active') return active
      if (statusFilter === 'absent-latest') return absentFromLatest
      if (statusFilter === 'one-off') return appearances.length === 1
      return appearances.length > 0
    }).sort((a, b) => {
      const categoryDifference =
        (CATEGORY_ORDER.get(a.category) ?? 0) -
        (CATEGORY_ORDER.get(b.category) ?? 0)
      return categoryDifference || a.name.localeCompare(b.name)
    })
  }, [categoryFilter, query, scopedLabs, scopedReports, statusFilter])

  const selectedFamily =
    BENCHMARK_FAMILIES.find((family) => family.id === selectedBenchmarkId) ??
    BENCHMARK_FAMILIES[0]
  const selectedAppearances = scopedReports.filter((release) =>
    reportsBenchmark(release, selectedFamily.id),
  )
  const selectedRelease = selectedReleaseId
    ? RELEASE_REPORTS.find((release) => release.id === selectedReleaseId)
    : undefined

  const totalAppearances = BENCHMARK_FAMILIES.map((family) =>
    RELEASE_REPORTS.filter((release) => reportsBenchmark(release, family.id)),
  )
  const oneOffCount = totalAppearances.filter(
    (appearances) => appearances.length === 1,
  ).length

  return (
    <section
      id="lifecycle"
      className="mt-16 scroll-mt-6 border-t border-zinc-300 pt-10 dark:border-zinc-700"
    >
      <header className="max-w-5xl">
        <p className="mb-2 text-sm font-medium text-zinc-500 uppercase dark:text-zinc-400">
          Reporting history
        </p>
        <h2 className="text-2xl font-semibold sm:text-3xl">
          Benchmark reporting history, July 2025 to July 2026
        </h2>
        <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
          An edition-level audit of {RELEASE_REPORTS.length} first-party
          flagship release bundles. Each cell answers one question: did that
          release publicly report a numeric result for this benchmark edition?
          Run details remain attached to every reported cell.
        </p>
      </header>

      <dl className="mt-7 grid max-w-3xl grid-cols-3 border-y border-zinc-200 py-4 dark:border-zinc-800">
        <div>
          <dt className="text-xs text-zinc-500 uppercase dark:text-zinc-400">
            Release bundles
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {RELEASE_REPORTS.length}
          </dd>
        </div>
        <div className="border-l border-zinc-200 pl-4 dark:border-zinc-800">
          <dt className="text-xs text-zinc-500 uppercase dark:text-zinc-400">
            Benchmark editions
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {BENCHMARK_FAMILIES.length}
          </dd>
        </div>
        <div className="border-l border-zinc-200 pl-4 dark:border-zinc-800">
          <dt className="text-xs text-zinc-500 uppercase dark:text-zinc-400">
            One-report editions
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {oneOffCount}
          </dd>
        </div>
      </dl>

      <section className="mt-10" aria-labelledby="continuity-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="w-full sm:w-auto">
            <h3 id="continuity-heading" className="text-lg font-semibold">
              Release-to-release continuity
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Retention is the share of the previous report&apos;s benchmark
              editions that appears again in the next report.
            </p>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            + new &nbsp; - dropped
          </p>
        </div>

        <div className="mt-4 overflow-x-auto border-y border-zinc-200 dark:border-zinc-800">
          <div className="min-w-[980px] divide-y divide-zinc-200 dark:divide-zinc-800">
            {LABS.map((lab) => {
              const releases = reportsForLab(lab.id)
              const transitions = transitionStats(releases)
              return (
                <div key={lab.id} className="flex min-h-24 items-stretch">
                  <div
                    className={`w-28 shrink-0 border-t-4 px-3 py-3 ${LAB_STYLES[lab.id].border}`}
                  >
                    <p className="text-sm font-medium">{lab.shortName}</p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {releases.length} reports
                    </p>
                  </div>
                  <div className="grid flex-1 auto-cols-fr grid-flow-col">
                    <div className="border-l border-zinc-200 px-3 py-3 dark:border-zinc-800">
                      <p className="text-xs font-medium">
                        {releases[0].shortModel}
                      </p>
                      <p className="mt-1 text-sm tabular-nums">
                        {Object.keys(releases[0].benchmarks).length} editions
                      </p>
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        baseline
                      </p>
                    </div>
                    {transitions.map((transition) => (
                      <div
                        key={transition.current.id}
                        className="border-l border-zinc-200 px-3 py-3 dark:border-zinc-800"
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-xs font-medium">
                            {transition.current.shortModel}
                          </p>
                          <p className="text-sm font-semibold tabular-nums">
                            {transition.retention}%
                          </p>
                        </div>
                        <div className="mt-2 h-1.5 bg-zinc-100 dark:bg-zinc-800">
                          <div
                            className={`h-full ${LAB_STYLES[lab.id].bar}`}
                            style={{ width: `${transition.retention}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
                          +{transition.added} &nbsp; -{transition.dropped}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="timeline-heading">
        <h3 id="timeline-heading" className="text-lg font-semibold">
          Benchmark reporting timeline
        </h3>

        <div className="mt-4 flex flex-wrap items-end gap-3 border-y border-zinc-200 py-4 dark:border-zinc-800">
          <div className="w-full sm:w-auto">
            <span className="mb-1.5 block text-xs text-zinc-500 uppercase dark:text-zinc-400">
              Lab
            </span>
            <div
              className="grid w-full grid-cols-3 border border-zinc-300 p-0.5 sm:inline-flex sm:w-auto dark:border-zinc-700"
              role="group"
              aria-label="Filter timeline by lab"
            >
              {(['all', ...LABS.map((lab) => lab.id)] as LabFilter[]).map(
                (lab) => (
                  <button
                    key={lab}
                    type="button"
                    aria-pressed={labFilter === lab}
                    onClick={() => setLabFilter(lab)}
                    className={`px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100 ${
                      labFilter === lab
                        ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                        : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {lab === 'all'
                      ? 'All'
                      : LABS.find((item) => item.id === lab)?.shortName}
                  </button>
                ),
              )}
            </div>
          </div>

          <label>
            <span className="mb-1.5 block text-xs text-zinc-500 uppercase dark:text-zinc-400">
              Category
            </span>
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value as BenchmarkCategory | 'all',
                )
              }
              className="h-9 border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="all">All categories</option>
              {BENCHMARK_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1.5 block text-xs text-zinc-500 uppercase dark:text-zinc-400">
              Reporting
            </span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="h-9 border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="all">All benchmarks</option>
              <option value="active">Reported in latest</option>
              <option value="absent-latest">Missing from latest</option>
              <option value="one-off">Reported once</option>
            </select>
          </label>

          <label className="min-w-52 flex-1 sm:max-w-xs">
            <span className="mb-1.5 block text-xs text-zinc-500 uppercase dark:text-zinc-400">
              Search
            </span>
            <span className="flex h-9 items-center gap-2 border border-zinc-300 px-2 dark:border-zinc-700">
              <Search aria-hidden="true" className="h-4 w-4 text-zinc-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Benchmark or edition"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
            </span>
          </label>

          <p
            className="ml-auto pb-1 text-sm text-zinc-500 tabular-nums dark:text-zinc-400"
            aria-live="polite"
          >
            {filteredFamilies.length} rows
          </p>
        </div>

        <div className="mt-5 grid gap-4 border-y border-zinc-200 py-4 lg:grid-cols-[minmax(220px,0.8fr)_2fr] dark:border-zinc-800">
          <div>
            <p className="text-xs text-zinc-500 uppercase dark:text-zinc-400">
              Selected benchmark
            </p>
            <p className="mt-1 text-lg font-semibold">{selectedFamily.name}</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {selectedFamily.category} · {selectedAppearances.length} of{' '}
              {scopedReports.length} scoped reports
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {releaseGroups.map((group) => {
              const appearances = group.releases.filter((release) =>
                reportsBenchmark(release, selectedFamily.id),
              )
              const latest = group.releases[group.releases.length - 1]
              const active = reportsBenchmark(latest, selectedFamily.id)
              return (
                <div key={group.id} className="min-w-0">
                  <p className="text-xs font-medium">{group.shortName}</p>
                  <p className="mt-1 truncate text-sm text-zinc-600 dark:text-zinc-300">
                    {appearances.length
                      ? appearances
                          .map((release) => release.shortModel)
                          .join(' / ')
                      : 'Never reported'}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      active
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {active ? 'Present in latest' : 'Absent from latest'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {selectedRelease && scopedLabs.includes(selectedRelease.lab) ? (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span
              className={`border px-2 py-1 text-xs ${LAB_STYLES[selectedRelease.lab].badge}`}
            >
              {selectedRelease.model}
            </span>
            <span className="font-medium">Reported</span>
            {reportsBenchmark(selectedRelease, selectedFamily.id) ? (
              <span className="text-zinc-600 dark:text-zinc-400">
                {selectedRelease.benchmarks[selectedFamily.id]}
              </span>
            ) : null}
            <a
              href={selectedRelease.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 underline underline-offset-4"
            >
              Source
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : null}

        <div className="mt-4 overflow-x-auto border border-zinc-200 dark:border-zinc-800">
          <table
            className="min-w-max border-collapse text-xs"
            aria-label="Benchmark reporting by model release"
          >
            <colgroup>
              <col className="w-56" />
              {scopedReports.map((release) => (
                <col key={release.id} className="w-[60px]" />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th className="sticky left-0 z-20 bg-white dark:bg-zinc-950" />
                {releaseGroups.map((group) => (
                  <th
                    key={group.id}
                    colSpan={group.releases.length}
                    className={`border-t-4 border-b border-l border-zinc-200 px-2 py-2 text-center font-medium dark:border-b-zinc-800 dark:border-l-zinc-800 ${LAB_STYLES[group.id].border}`}
                  >
                    {group.name}
                  </th>
                ))}
              </tr>
              <tr className="border-b border-zinc-200 dark:border-zinc-800">
                <th className="sticky left-0 z-20 bg-white px-3 py-2 text-left font-medium dark:bg-zinc-950">
                  Benchmark / edition
                </th>
                {scopedReports.map((release) => (
                  <th
                    key={release.id}
                    className="border-l border-zinc-200 px-1 py-2 text-center font-normal dark:border-zinc-800"
                  >
                    <a
                      href={release.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block hover:underline hover:underline-offset-2"
                      title={release.sourceLabel}
                    >
                      <span className="block font-medium">
                        {release.shortModel}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-zinc-500 dark:text-zinc-400">
                        {release.dateLabel.replace(' 20', " '")}
                      </span>
                    </a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredFamilies.map((family) => (
                <tr
                  key={family.id}
                  className={`border-b border-zinc-200 dark:border-zinc-800 ${
                    selectedFamily.id === family.id
                      ? 'bg-zinc-50 dark:bg-zinc-900/60'
                      : ''
                  }`}
                >
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 border-r border-zinc-200 px-3 py-1.5 text-left dark:border-zinc-800 ${
                      selectedFamily.id === family.id
                        ? 'bg-zinc-50 dark:bg-zinc-900'
                        : 'bg-white dark:bg-zinc-950'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBenchmarkId(family.id)
                        setSelectedReleaseId(null)
                      }}
                      className="w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100"
                    >
                      <span className="block text-[12px] font-medium">
                        {family.name}
                      </span>
                      <span className="mt-0.5 block text-[10px] font-normal text-zinc-400 dark:text-zinc-500">
                        {family.category}
                      </span>
                    </button>
                  </th>
                  {scopedReports.map((release) => {
                    const reported = reportsBenchmark(release, family.id)
                    const description = reported
                      ? release.benchmarks[family.id]
                      : undefined
                    return (
                      <td
                        key={release.id}
                        className="border-l border-zinc-200 p-1 text-center dark:border-zinc-800"
                      >
                        <button
                          type="button"
                          disabled={!reported}
                          onClick={() => {
                            setSelectedBenchmarkId(family.id)
                            setSelectedReleaseId(release.id)
                          }}
                          title={`${release.model}: ${reported ? 'Reported' : 'Not reported'}${description ? ` - ${description}` : ''}`}
                          aria-label={`${family.name}, ${release.model}: ${reported ? 'Reported' : 'Not reported'}${description ? `. ${description}` : ''}`}
                          className={`mx-auto flex h-7 w-7 items-center justify-center text-[10px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-default dark:focus-visible:outline-zinc-100 ${cellClass(reported, release.lab)}`}
                        >
                          {reported ? (
                            <Check aria-hidden="true" className="h-3.5 w-3.5" />
                          ) : (
                            <span aria-hidden="true">—</span>
                          )}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100">
              <Check aria-hidden="true" className="h-3 w-3" />
            </span>
            reported
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center text-zinc-300 dark:text-zinc-700">
              —
            </span>
            not reported
          </span>
        </div>
      </section>

      <section className="mt-12 grid gap-8 border-t border-zinc-200 pt-7 lg:grid-cols-2 dark:border-zinc-800">
        <div>
          <h3 className="text-base font-semibold">
            What the timeline captures
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Distinct named editions are separate rows, such as SWE-Bench
            Verified versus Pro, OSWorld-Verified versus OSWorld 2.0, and
            Terminal-Bench 2.0 versus 2.1. Run-setting differences such as tool
            access, reasoning effort, context length, or agent scaffolding stay
            in the cell detail. A missing cell means no public numeric result
            was found in that release bundle, not that the lab stopped
            evaluating the benchmark internally.
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold">Audit boundary</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            The corpus covers flagship general-purpose releases and their
            principal first-party capability tables or chapters. Smaller, fast,
            and domain-specialized model launches are excluded, as are refusal,
            alignment, personality, and preparedness-only evaluations. This
            keeps the retention denominator comparable while still including
            named cyber and life-science capability benchmarks reported in
            capability sections.
          </p>
        </div>
      </section>

      <details className="mt-7 border-y border-zinc-200 py-4 text-sm dark:border-zinc-800">
        <summary className="cursor-pointer font-medium">
          Source corpus ({RELEASE_REPORTS.length} release bundles)
        </summary>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {LABS.map((lab) => (
            <div key={lab.id}>
              <p className="text-xs font-medium text-zinc-500 uppercase dark:text-zinc-400">
                {lab.name}
              </p>
              <ul className="mt-2 space-y-1.5">
                {reportsForLab(lab.id).map((release) => (
                  <li key={release.id}>
                    <a
                      href={release.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 underline underline-offset-4"
                    >
                      {release.model}
                      <ExternalLink
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      />
                    </a>{' '}
                    <span className="text-zinc-400 dark:text-zinc-500">
                      {release.dateLabel}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </section>
  )
}

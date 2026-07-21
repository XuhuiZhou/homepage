'use client'

import { RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  ALL_GROUPS,
  MODEL_KEYS,
  MODEL_LABELS,
  type BenchmarkGroup,
  type BenchmarkRow,
  type ModelKey,
} from './data'

type RowFilter = 'any' | 'all'

const MODEL_STYLES: Record<
  ModelKey,
  {
    header: string
    selector: string
    winner: string
  }
> = {
  gpt: {
    header: 'border-violet-600 dark:border-violet-400',
    selector:
      'border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-500/10',
    winner:
      'bg-violet-50 font-medium shadow-[inset_3px_0_0_#7c3aed] dark:bg-violet-500/10',
  },
  claude: {
    header: 'border-orange-600 dark:border-orange-400',
    selector:
      'border-orange-500 bg-orange-50 dark:border-orange-400 dark:bg-orange-500/10',
    winner:
      'bg-orange-50 font-medium shadow-[inset_3px_0_0_#ea580c] dark:bg-orange-500/10',
  },
  muse: {
    header: 'border-blue-600 dark:border-blue-400',
    selector:
      'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10',
    winner:
      'bg-blue-50 font-medium shadow-[inset_3px_0_0_#2563eb] dark:bg-blue-500/10',
  },
  grok: {
    header: 'border-zinc-950 dark:border-zinc-100',
    selector:
      'border-zinc-800 bg-zinc-100 dark:border-zinc-200 dark:bg-zinc-800',
    winner:
      'bg-zinc-100 font-medium shadow-[inset_3px_0_0_#18181b] dark:bg-zinc-800 dark:shadow-[inset_3px_0_0_#f4f4f5]',
  },
  inkling: {
    header: 'border-emerald-600 dark:border-emerald-400',
    selector:
      'border-emerald-500 bg-emerald-50 dark:border-emerald-400 dark:bg-emerald-500/10',
    winner:
      'bg-emerald-50 font-medium shadow-[inset_3px_0_0_#059669] dark:bg-emerald-500/10',
  },
  kimi: {
    header: 'border-cyan-600 dark:border-cyan-400',
    selector:
      'border-cyan-500 bg-cyan-50 dark:border-cyan-400 dark:bg-cyan-500/10',
    winner:
      'bg-cyan-50 font-medium shadow-[inset_3px_0_0_#0891b2] dark:bg-cyan-500/10',
  },
}

const MODEL_LOGOS: Record<
  ModelKey,
  { src: string; darkSrc?: string; className?: string }
> = {
  gpt: {
    src: '/benchmarks/model-logos/openai.svg',
    className: 'dark:invert',
  },
  claude: { src: '/benchmarks/model-logos/anthropic.ico' },
  muse: { src: '/benchmarks/model-logos/meta.svg' },
  grok: { src: '/benchmarks/model-logos/xai.ico' },
  inkling: { src: '/benchmarks/model-logos/thinking-machines.png' },
  kimi: {
    src: '/benchmarks/model-logos/kimi-dark.ico',
    darkSrc: '/benchmarks/model-logos/kimi.ico',
  },
}

function ModelLogo({ model }: { model: ModelKey }) {
  const logo = MODEL_LOGOS[model]
  const label = MODEL_LABELS[model].name + ' ' + MODEL_LABELS[model].variant

  return (
    <span
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center"
      title={label}
      aria-hidden="true"
    >
      <img
        src={logo.src}
        alt=""
        className={[
          'h-4 w-4 object-contain',
          logo.darkSrc ? 'dark:hidden' : '',
          logo.className ?? '',
        ].join(' ')}
      />
      {logo.darkSrc ? (
        <img
          src={logo.darkSrc}
          alt=""
          className="hidden h-4 w-4 object-contain dark:block"
        />
      ) : null}
    </span>
  )
}

function hasReport(row: BenchmarkRow, model: ModelKey) {
  return (row[model] ?? 'NR') !== 'NR'
}

function filterGroups(
  groups: BenchmarkGroup[],
  models: ModelKey[],
  rowFilter: RowFilter,
) {
  return groups
    .map((group) => ({
      ...group,
      rows: group.rows.filter((row) => {
        const reportCount = models.filter((model) =>
          hasReport(row, model),
        ).length

        return rowFilter === 'all'
          ? reportCount === models.length
          : reportCount > 0
      }),
    }))
    .filter((group) => group.rows.length > 0)
}

function BenchmarkTable({
  groups,
  label,
  models,
}: {
  groups: BenchmarkGroup[]
  label: string
  models: ModelKey[]
}) {
  if (groups.length === 0) {
    return (
      <div className="border-y border-zinc-200 py-12 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        No benchmarks match this selection.
      </div>
    )
  }

  const benchmarkWidth = models.length <= 2 ? 46 : 34
  const modelWidth = (100 - benchmarkWidth) / models.length
  const tableMinWidth = Math.max(520, 250 + models.length * 112)

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full table-fixed border-collapse text-[12px] leading-[1.25] sm:text-[13px]"
        style={{ minWidth: tableMinWidth + 'px' }}
        aria-label={label}
      >
        <colgroup>
          <col style={{ width: benchmarkWidth + '%' }} />
          {models.map((model) => (
            <col key={model} style={{ width: modelWidth + '%' }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="border-t-4 border-zinc-300 px-2 py-2 text-left font-medium dark:border-zinc-700">
              Benchmark
            </th>
            {models.map((model) => (
              <th
                key={model}
                className={[
                  'border-t-4 px-1 py-2 text-center font-medium',
                  MODEL_STYLES[model].header,
                ].join(' ')}
              >
                <span className="block">{MODEL_LABELS[model].name}</span>
                <span className="mt-0.5 block font-normal text-zinc-500 dark:text-zinc-400">
                  {MODEL_LABELS[model].variant}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        {groups.map((group) => (
          <tbody key={group.name}>
            <tr className="bg-zinc-100 dark:bg-zinc-900">
              <th
                scope="rowgroup"
                className="border-y border-zinc-200 px-2 py-1.5 text-left font-medium text-zinc-500 uppercase dark:border-zinc-800 dark:text-zinc-400"
              >
                {group.name}
              </th>
              {models.map((model) => (
                <td
                  key={model}
                  className="border-y border-l border-zinc-200 px-1 py-1 text-center dark:border-zinc-800"
                  title={
                    MODEL_LABELS[model].name + ' ' + MODEL_LABELS[model].variant
                  }
                  aria-label={
                    MODEL_LABELS[model].name + ' ' + MODEL_LABELS[model].variant
                  }
                >
                  <ModelLogo model={model} />
                </td>
              ))}
            </tr>
            {group.rows.map((row) => (
              <tr
                key={row.benchmark}
                className="border-b border-zinc-200 dark:border-zinc-800"
              >
                <th
                  scope="row"
                  className="px-2 py-1.5 text-left font-normal break-words"
                >
                  {row.benchmark}
                </th>
                {models.map((model) => {
                  const value = row[model] ?? 'NR'
                  return (
                    <td
                      key={model}
                      className={[
                        'px-1 py-1.5 text-center break-words tabular-nums',
                        value === 'NR'
                          ? 'text-zinc-400 dark:text-zinc-600'
                          : '',
                        row.winner === model ? MODEL_STYLES[model].winner : '',
                      ].join(' ')}
                    >
                      {value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}

export function CurrentReleaseMatrix() {
  const [selectedModels, setSelectedModels] = useState<ModelKey[]>(MODEL_KEYS)
  const [rowFilter, setRowFilter] = useState<RowFilter>('any')

  const filteredGroups = useMemo(
    () => filterGroups(ALL_GROUPS, selectedModels, rowFilter),
    [selectedModels, rowFilter],
  )
  const visibleRowCount = filteredGroups.reduce(
    (count, group) => count + group.rows.length,
    0,
  )
  const selectedCoverage = useMemo(() => {
    let any = 0
    let all = 0

    for (const row of ALL_GROUPS.flatMap((group) => group.rows)) {
      const reportCount = selectedModels.filter((model) =>
        hasReport(row, model),
      ).length
      if (reportCount > 0) any += 1
      if (reportCount === selectedModels.length) all += 1
    }

    return { any, all }
  }, [selectedModels])

  function toggleModel(model: ModelKey) {
    setSelectedModels((current) => {
      if (current.includes(model)) {
        if (current.length === 1) return current
        return current.filter((candidate) => candidate !== model)
      }

      return MODEL_KEYS.filter(
        (candidate) => current.includes(candidate) || candidate === model,
      )
    })
  }

  function resetFilters() {
    setSelectedModels(MODEL_KEYS)
    setRowFilter('any')
  }

  const filtersAreDefault =
    selectedModels.length === MODEL_KEYS.length && rowFilter === 'any'

  return (
    <>
      <div className="mb-5 border-y border-zinc-200 py-4 dark:border-zinc-800">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <fieldset className="min-w-0 flex-1">
            <legend className="mb-2 text-xs font-medium text-zinc-500 uppercase dark:text-zinc-400">
              Models
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
              {MODEL_KEYS.map((model) => {
                const isSelected = selectedModels.includes(model)
                const isOnlySelection =
                  isSelected && selectedModels.length === 1

                return (
                  <label
                    key={model}
                    className={[
                      'flex min-h-12 min-w-0 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                      isSelected
                        ? MODEL_STYLES[model].selector
                        : 'border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600',
                      isOnlySelection ? 'cursor-default' : '',
                    ].join(' ')}
                    title={
                      isOnlySelection
                        ? 'At least one model must remain selected'
                        : undefined
                    }
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isOnlySelection}
                      onChange={() => toggleModel(model)}
                      className="h-4 w-4 shrink-0 accent-zinc-900 dark:accent-zinc-100"
                    />
                    <ModelLogo model={model} />
                    <span className="min-w-0">
                      <span className="block font-medium">
                        {MODEL_LABELS[model].name}
                      </span>
                      <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                        {MODEL_LABELS[model].variant}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-end gap-3">
            <fieldset>
              <legend className="mb-2 text-xs font-medium text-zinc-500 uppercase dark:text-zinc-400">
                Rows
              </legend>
              <div className="inline-grid h-10 grid-cols-2 rounded-md border border-zinc-200 bg-zinc-100 p-1 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                {[
                  ['any', 'Any selected'],
                  ['all', 'Shared by all'],
                ].map(([value, label]) => (
                  <label
                    key={value}
                    className={[
                      'flex cursor-pointer items-center justify-center rounded px-3',
                      rowFilter === value
                        ? 'bg-white font-medium shadow-sm dark:bg-zinc-800'
                        : 'text-zinc-500 dark:text-zinc-400',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="benchmark-row-filter"
                      value={value}
                      checked={rowFilter === value}
                      onChange={() => setRowFilter(value as RowFilter)}
                      className="sr-only"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={resetFilters}
              disabled={filtersAreDefault}
              className="inline-flex h-10 items-center gap-1.5 px-2 text-sm font-medium text-zinc-600 disabled:cursor-default disabled:opacity-35 dark:text-zinc-300"
              title="Reset model and row filters"
            >
              <RotateCcw aria-hidden="true" size={15} strokeWidth={1.8} />
              Reset
            </button>
          </div>
        </div>

        <p
          className="mt-3 text-xs text-zinc-500 tabular-nums dark:text-zinc-400"
          aria-live="polite"
        >
          Showing {visibleRowCount} of{' '}
          {ALL_GROUPS.flatMap((group) => group.rows).length} rows
          <span aria-hidden="true"> · </span>
          {selectedModels.length} selected
          <span aria-hidden="true"> · </span>
          {selectedCoverage.all} shared by all selected
          <span aria-hidden="true"> · </span>
          {selectedCoverage.any - selectedCoverage.all} with partial coverage
        </p>
      </div>

      <BenchmarkTable
        groups={filteredGroups}
        models={selectedModels}
        label="Filtered current-release capability benchmark matrix"
      />
    </>
  )
}

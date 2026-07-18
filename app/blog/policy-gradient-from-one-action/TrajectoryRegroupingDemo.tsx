'use client'

import { useState } from 'react'

const trajectories = [
  { id: 'τ₁', past: 'P₁', state: 'A', action: 'left', future: 'F₁', value: 8 },
  { id: 'τ₂', past: 'P₂', state: 'A', action: 'left', future: 'F₂', value: 8 },
  { id: 'τ₃', past: 'P₃', state: 'A', action: 'right', future: 'F₃', value: 2 },
  { id: 'τ₄', past: 'P₄', state: 'B', action: 'left', future: 'F₄', value: 4 },
  { id: 'τ₅', past: 'P₅', state: 'B', action: 'right', future: 'F₅', value: 6 },
  { id: 'τ₆', past: 'P₆', state: 'B', action: 'right', future: 'F₆', value: 6 },
] as const

const views = [
  {
    label: '1. Whole trajectories',
    description:
      'Sampling one trajectory selects one entire row, including its state and action at time t.',
  },
  {
    label: '2. Keep two columns',
    description:
      'Ignore the past and future columns. The sampled rows have not changed.',
  },
  {
    label: '3. Regroup the rows',
    description:
      'Put rows with the same state together, then count their actions inside each state bucket.',
  },
] as const

function TrajectoryRows({ project }: { project: boolean }) {
  return (
    <div>
      <div className="mb-2 grid grid-cols-[2.25rem_1fr] gap-2 px-2 text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">
        <span className="text-center">τ</span>
        <div className="grid grid-cols-4 text-center">
          <span>past</span>
          <span>sₜ</span>
          <span>aₜ</span>
          <span>next</span>
        </div>
      </div>

      <div className="space-y-2" aria-label="Six complete sampled trajectories">
        {trajectories.map((trajectory) => (
          <div
            key={trajectory.id}
            className="grid grid-cols-[2.25rem_1fr] items-stretch gap-2"
          >
            <div className="flex items-center justify-center font-mono text-xs text-zinc-500">
              {trajectory.id}
            </div>
            <div className="grid min-w-0 grid-cols-4 overflow-hidden border-y border-zinc-200 dark:border-zinc-800">
              <div
                className={`flex min-h-11 items-center justify-center bg-zinc-100 px-1 text-sm text-zinc-600 transition-opacity dark:bg-zinc-900 dark:text-zinc-400 ${
                  project ? 'opacity-20' : 'opacity-100'
                }`}
              >
                {trajectory.past}
              </div>
              <div
                className={`flex min-h-11 items-center justify-center px-1 text-sm font-semibold ${
                  trajectory.state === 'A'
                    ? 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100'
                    : 'bg-sky-100 text-sky-950 dark:bg-sky-950/60 dark:text-sky-100'
                }`}
              >
                {trajectory.state}
              </div>
              <div className="flex min-h-11 items-center justify-center bg-amber-100 px-1 text-sm font-medium text-amber-950 dark:bg-amber-950/60 dark:text-amber-100">
                {trajectory.action}
              </div>
              <div
                className={`flex min-h-11 items-center justify-center bg-zinc-100 px-1 text-sm text-zinc-600 transition-opacity dark:bg-zinc-900 dark:text-zinc-400 ${
                  project ? 'opacity-20' : 'opacity-100'
                }`}
              >
                {trajectory.future}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StateBucket({ state }: { state: 'A' | 'B' }) {
  const rows = trajectories.filter((trajectory) => trajectory.state === state)
  const leftRows = rows.filter((trajectory) => trajectory.action === 'left')
  const rightRows = rows.filter((trajectory) => trajectory.action === 'right')

  return (
    <section className="border-y border-zinc-200 py-4 dark:border-zinc-800">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          State {state}
        </div>
        <div className="font-mono text-xs text-zinc-500">
          3 of 6 rows → d<sub>t</sub>({state}) = 1/2
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 divide-x divide-zinc-200 dark:divide-zinc-800">
        <div className="pr-4">
          <div className="text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">
            left
          </div>
          <div className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-100">
            {leftRows.map((row) => row.id).join(', ') || 'none'}
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            {leftRows.length}/3 inside this state
          </div>
        </div>
        <div className="pl-4">
          <div className="text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">
            right
          </div>
          <div className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-100">
            {rightRows.map((row) => row.id).join(', ') || 'none'}
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            {rightRows.length}/3 inside this state
          </div>
        </div>
      </div>
    </section>
  )
}

function GroupedRows() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <StateBucket state="A" />
      <StateBucket state="B" />
    </div>
  )
}

function AverageReadout({ view }: { view: number }) {
  return (
    <div className="mt-6 border-t border-zinc-200 pt-5 dark:border-zinc-800">
      <div className="text-xs font-semibold tracking-[0.1em] text-zinc-500 uppercase">
        same six values, different parentheses
      </div>

      {view < 2 ? (
        <div className="mt-2 font-mono text-sm leading-7 text-zinc-900 dark:text-zinc-100">
          (8 + 8 + 2 + 4 + 6 + 6) / 6 = 5.67
        </div>
      ) : (
        <div className="mt-2 font-mono text-sm leading-7 text-zinc-900 dark:text-zinc-100">
          <div>state A: (3/6)[(2/3)8 + (1/3)2]</div>
          <div>state B: (3/6)[(1/3)4 + (2/3)6]</div>
          <div className="mt-1 font-semibold">total = 5.67</div>
        </div>
      )}
    </div>
  )
}

export default function TrajectoryRegroupingDemo() {
  const [view, setView] = useState(0)

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          One rollout table, three ways to read it
        </div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {views[view].description}
        </div>
      </div>

      <div className="p-5">
        <div
          className="mb-6 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Ways to read the same trajectory samples"
        >
          {views.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={view === index}
              onClick={() => setView(index)}
              className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                view === index
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                  : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {view < 2 ? <TrajectoryRows project={view === 1} /> : <GroupedRows />}
        <AverageReadout view={view} />

        <div className="mt-5 bg-zinc-900 p-4 text-sm leading-6 text-zinc-50 dark:bg-black">
          {view === 0 &&
            'A whole-row sample automatically gives a sample from every column in that row.'}
          {view === 1 &&
            'Reading only the state and action columns is marginalization, not another random draw.'}
          {view === 2 &&
            'The nested state-then-action average is the original six-row average regrouped by labels.'}
        </div>
      </div>
    </figure>
  )
}

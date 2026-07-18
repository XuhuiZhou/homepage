'use client'

import { useState } from 'react'

const worlds = [
  {
    id: 'a-left',
    history: 'A',
    historyProbability: 0.5,
    past: 2,
    action: 'left',
    actionProbability: 0.4,
    worldProbability: 0.2,
    score: 0.6,
  },
  {
    id: 'a-right',
    history: 'A',
    historyProbability: 0.5,
    past: 2,
    action: 'right',
    actionProbability: 0.6,
    worldProbability: 0.3,
    score: -0.4,
  },
  {
    id: 'b-left',
    history: 'B',
    historyProbability: 0.5,
    past: 10,
    action: 'left',
    actionProbability: 0.7,
    worldProbability: 0.35,
    score: 0.3,
  },
  {
    id: 'b-right',
    history: 'B',
    historyProbability: 0.5,
    past: 10,
    action: 'right',
    actionProbability: 0.3,
    worldProbability: 0.15,
    score: -0.7,
  },
] as const

const steps = [
  { id: 0, label: '1. Average worlds' },
  { id: 1, label: '2. Group by history' },
  { id: 2, label: '3. Cancel the past' },
] as const

const historyStyles = {
  A: {
    bar: 'bg-emerald-500 dark:bg-emerald-400',
    soft: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-900/70',
  },
  B: {
    bar: 'bg-sky-500 dark:bg-sky-400',
    soft: 'bg-sky-50 dark:bg-sky-950/30',
    border: 'border-sky-200 dark:border-sky-900/70',
  },
} as const

const percentage = (value: number) => `${Math.round(value * 100)}%`
const signed = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}`

function WorldAverage() {
  return (
    <div>
      <div className="mb-5 flex h-8 overflow-hidden rounded-sm bg-zinc-100 dark:bg-zinc-900">
        {worlds.map((world) => (
          <div
            key={world.id}
            className={`${historyStyles[world.history].bar} flex items-center justify-center border-r border-white/60 text-xs font-semibold text-white last:border-r-0 dark:border-zinc-950/60 dark:text-zinc-950`}
            style={{ width: percentage(world.worldProbability) }}
            aria-label={`${percentage(world.worldProbability)} of worlds have history ${world.history} and go ${world.action}`}
          >
            {percentage(world.worldProbability)}
          </div>
        ))}
      </div>

      <div className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {worlds.map((world) => (
          <div
            key={world.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 text-sm"
          >
            <span
              className={`h-3 w-3 rounded-sm ${historyStyles[world.history].bar}`}
              aria-hidden="true"
            />
            <span className="text-zinc-700 dark:text-zinc-300">
              History {world.history}, then go {world.action}
            </span>
            <span className="text-right font-mono text-zinc-900 dark:text-zinc-100">
              {percentage(world.worldProbability)} × {world.past} coins
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg bg-zinc-900 p-4 text-sm leading-6 text-zinc-50 dark:bg-black">
        Expected past coins = 0.20(2) + 0.30(2) + 0.35(10) + 0.15(10) ={' '}
        <strong>6</strong>.
      </div>
    </div>
  )
}

function HistoryGroups({ showScores }: { showScores: boolean }) {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(['A', 'B'] as const).map((history) => {
          const group = worlds.filter((world) => world.history === history)
          const { past, historyProbability } = group[0]

          return (
            <section
              key={history}
              className={`rounded-lg border p-4 ${historyStyles[history].border} ${historyStyles[history].soft}`}
              aria-label={`History ${history} bucket`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">
                    history {history}
                  </div>
                  <div className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
                    Past = {past} coins is fixed
                  </div>
                </div>
                <div className="font-mono text-sm text-zinc-600 dark:text-zinc-300">
                  P(H) = {historyProbability.toFixed(1)}
                </div>
              </div>

              <div className="mt-4 divide-y divide-zinc-200/80 border-y border-zinc-200/80 dark:divide-zinc-700/80 dark:border-zinc-700/80">
                {group.map((world) => (
                  <div
                    key={world.id}
                    className="grid grid-cols-[1fr_auto] gap-3 py-3 text-sm"
                  >
                    <span className="text-zinc-700 dark:text-zinc-300">
                      go {world.action}
                    </span>
                    <span className="text-right font-mono text-zinc-900 dark:text-zinc-100">
                      {showScores
                        ? `${world.actionProbability.toFixed(1)} × ${signed(world.score)}`
                        : `P = ${world.actionProbability.toFixed(1)}`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {showScores ? (
                  <>
                    Mean score = {group[0].actionProbability.toFixed(1)}(
                    {signed(group[0].score)}) +{' '}
                    {group[1].actionProbability.toFixed(1)}(
                    {signed(group[1].score)}) = <strong>0</strong>
                    <br />
                    Past × mean score = {past} × 0 = <strong>0</strong>
                  </>
                ) : (
                  <>
                    Inside this bucket, only the current action is resampled.
                    The old coin count does not change.
                  </>
                )}
              </div>
            </section>
          )
        })}
      </div>

      <div className="mt-5 rounded-lg bg-zinc-900 p-4 text-sm leading-6 text-zinc-50 dark:bg-black">
        {showScores ? (
          <>
            Outer average = 0.5(0) + 0.5(0) = <strong>0</strong>. Every history
            bucket cancels before the buckets are recombined.
          </>
        ) : (
          <>
            Average inside A, average inside B, then weight the two answers by
            0.5. This gives the same result as averaging all four worlds at
            once.
          </>
        )}
      </div>
    </div>
  )
}

export default function ExpectationWorlds() {
  const [step, setStep] = useState(0)

  const descriptions = [
    'Expectation is a probability-weighted average over every way the experiment could unfold.',
    'Conditional expectation reorganizes the same worlds into buckets that share a fixed history.',
    'Within each bucket, the policy score averages to zero, so a shared past reward contributes zero.',
  ]

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          One average, reorganized three ways
        </div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {descriptions[step]}
        </div>
      </div>

      <div className="p-5">
        <div
          className="mb-6 flex flex-wrap gap-2"
          role="group"
          aria-label="Expectation explanation steps"
        >
          {steps.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              aria-pressed={step === item.id}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                step === item.id
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                  : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {step === 0 && <WorldAverage />}
        {step === 1 && <HistoryGroups showScores={false} />}
        {step === 2 && <HistoryGroups showScores />}
      </div>
    </figure>
  )
}

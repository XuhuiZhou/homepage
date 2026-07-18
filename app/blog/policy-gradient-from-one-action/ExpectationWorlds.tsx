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
  { id: 0, label: '1. Split trajectory' },
  { id: 1, label: '2. Sum out future' },
  { id: 2, label: '3. Group by history' },
  { id: 3, label: '4. Cancel the past' },
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

function TrajectoryAnatomy() {
  return (
    <div>
      <div className="grid divide-y divide-zinc-200 border-y border-zinc-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-zinc-800 dark:border-zinc-800">
        <div className="py-4 sm:pr-4">
          <div className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
            prefix
          </div>
          <div className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">
            history H<sub>t</sub>
          </div>
          <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Everything before the current action
          </div>
          <div className="mt-2 font-mono text-sm text-zinc-900 dark:text-zinc-100">
            probability p(H<sub>t</sub>)
          </div>
        </div>

        <div className="py-4 sm:px-4">
          <div className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
            current choice
          </div>
          <div className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">
            action a<sub>t</sub>
          </div>
          <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Sampled from the policy at this history
          </div>
          <div className="mt-2 font-mono text-sm text-zinc-900 dark:text-zinc-100">
            probability π(a<sub>t</sub> | s<sub>t</sub>)
          </div>
        </div>

        <div className="py-4 sm:pl-4">
          <div className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
            suffix
          </div>
          <div className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100">
            future F<sub>t</sub>
          </div>
          <div className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Later rewards, states, and actions
          </div>
          <div className="mt-2 font-mono text-sm text-zinc-900 dark:text-zinc-100">
            probability p(F<sub>t</sub> | H<sub>t</sub>, a<sub>t</sub>)
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-zinc-900 p-4 text-sm leading-6 text-zinc-50 dark:bg-black">
        One complete trajectory τ = (H<sub>t</sub>, a<sub>t</sub>, F<sub>t</sub>
        )
        <br />
        p(τ) = p(H<sub>t</sub>) × π(a<sub>t</sub> | s<sub>t</sub>) × p(F
        <sub>t</sub> | H<sub>t</sub>, a<sub>t</sub>)
      </div>
    </div>
  )
}

function CollapsedFamilies() {
  return (
    <div>
      <div className="mb-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Each row below represents a family of complete trajectories with the
        same history and current action. Their different futures have been
        summed together.
      </div>

      <div className="mb-3 text-right font-mono text-xs text-zinc-500">
        Σ<sub>F</sub> p(F | H, a) = 1
      </div>

      <div className="mb-5 flex h-8 overflow-hidden rounded-sm bg-zinc-100 dark:bg-zinc-900">
        {worlds.map((world) => (
          <div
            key={world.id}
            className={`${historyStyles[world.history].bar} flex items-center justify-center border-r border-white/60 text-xs font-semibold text-white last:border-r-0 dark:border-zinc-950/60 dark:text-zinc-950`}
            style={{ width: percentage(world.worldProbability) }}
            aria-label={`${percentage(world.worldProbability)} of trajectories have history ${world.history} and current action ${world.action} after summing over futures`}
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
              H = {world.history}, a = {world.action}
            </span>
            <span className="text-right font-mono text-zinc-900 dark:text-zinc-100">
              {world.historyProbability.toFixed(1)} ×{' '}
              {world.actionProbability.toFixed(1)} × 1 ={' '}
              {percentage(world.worldProbability)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg bg-zinc-900 p-4 text-sm leading-6 text-zinc-50 dark:bg-black">
        These four percentages still came from p(τ). We only combined
        trajectories whose future no longer affects the quantity being averaged.
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
    'A possible world in reinforcement learning is one complete trajectory: prefix, current action, and future.',
    'For the past-reward term, all future branches can be combined because their probabilities sum to one.',
    'Conditional expectation reorganizes trajectory families into buckets that share a fixed history.',
    'Within each history bucket, the policy score averages to zero, so shared past reward contributes zero.',
  ]

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          One trajectory expectation, reorganized four ways
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

        {step === 0 && <TrajectoryAnatomy />}
        {step === 1 && <CollapsedFamilies />}
        {step === 2 && <HistoryGroups showScores={false} />}
        {step === 3 && <HistoryGroups showScores />}
      </div>
    </figure>
  )
}

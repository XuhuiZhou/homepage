'use client'

import { useState } from 'react'

const trajectories = [
  { id: 'tau-1', label: 'τ₁', history: 'A', action: 'left', future: 'F₁' },
  { id: 'tau-2', label: 'τ₂', history: 'A', action: 'left', future: 'F₂' },
  { id: 'tau-3', label: 'τ₃', history: 'A', action: 'right', future: 'F₃' },
  { id: 'tau-4', label: 'τ₄', history: 'A', action: 'right', future: 'F₄' },
  { id: 'tau-5', label: 'τ₅', history: 'A', action: 'right', future: 'F₅' },
  { id: 'tau-6', label: 'τ₆', history: 'B', action: 'left', future: 'F₆' },
  { id: 'tau-7', label: 'τ₇', history: 'B', action: 'right', future: 'F₇' },
] as const

const steps = [
  { id: 0, label: '1. Sample rollouts' },
  { id: 1, label: '2. Freeze one prefix' },
  { id: 2, label: '3. Read the next draw' },
] as const

function TrajectoryRows({
  freezeHistory = false,
}: {
  freezeHistory?: boolean
}) {
  return (
    <div>
      <div className="mb-2 grid grid-cols-[2.5rem_1.2fr_0.8fr_1fr] gap-2 px-2 text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">
        <span className="text-center">τ</span>
        <span>history</span>
        <span>action</span>
        <span>future</span>
      </div>

      <div className="space-y-2" aria-label="Example complete trajectories">
        {trajectories.map((trajectory) => {
          const selected = !freezeHistory || trajectory.history === 'A'

          return (
            <div
              key={trajectory.id}
              className={`grid grid-cols-[2.5rem_1.2fr_0.8fr_1fr] items-stretch gap-2 transition-opacity ${
                selected ? 'opacity-100' : 'opacity-20'
              }`}
            >
              <div className="flex items-center justify-center font-mono text-xs text-zinc-500">
                {trajectory.label}
              </div>
              <div className="flex min-h-10 items-center rounded-md bg-emerald-100 px-3 text-sm font-medium text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100">
                H<sub>t</sub> = {trajectory.history}
              </div>
              <div className="flex min-h-10 items-center rounded-md bg-amber-100 px-3 text-sm font-medium text-amber-950 dark:bg-amber-950/60 dark:text-amber-100">
                {trajectory.action}
              </div>
              <div className="flex min-h-10 items-center rounded-md bg-sky-100 px-3 text-sm text-sky-950 dark:bg-sky-950/60 dark:text-sky-100">
                {trajectory.future}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-zinc-200 pt-4 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
        {freezeHistory ? (
          <>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Keep only replays with H<sub>t</sub> = A.
            </span>
            <span>The green prefix is now identical in every visible row.</span>
          </>
        ) : (
          <>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              Each row is one complete sampled trajectory.
            </span>
            <span>Its prefix, current action, and future arrive together.</span>
          </>
        )}
      </div>
    </div>
  )
}

function ActionZoom() {
  return (
    <div>
      <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto_1.35fr]">
        <div className="rounded-lg bg-emerald-100 p-4 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100">
          <div className="text-xs font-semibold tracking-[0.12em] uppercase opacity-70">
            frozen prefix
          </div>
          <div className="mt-2 text-lg font-semibold">
            H<sub>t</sub> = A
          </div>
          <div className="mt-1 text-sm leading-6">
            The state s<sub>t</sub> and all earlier rewards are already fixed.
          </div>
        </div>

        <div
          className="hidden text-2xl text-zinc-400 sm:block"
          aria-hidden="true"
        >
          →
        </div>

        <div>
          <div className="mb-3 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
            one remaining draw right now
          </div>
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-2 rounded-lg bg-amber-100 p-4 text-amber-950 dark:bg-amber-950/60 dark:text-amber-100">
              <div className="font-semibold">left</div>
              <div className="mt-1 font-mono text-sm">π = 40%</div>
              <div className="mt-3 text-sm">score +0.6</div>
            </div>
            <div className="col-span-3 rounded-lg bg-amber-100 p-4 text-amber-950 dark:bg-amber-950/60 dark:text-amber-100">
              <div className="font-semibold">right</div>
              <div className="mt-1 font-mono text-sm">π = 60%</div>
              <div className="mt-3 text-sm">score −0.4</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-zinc-200 pt-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center dark:border-zinc-800">
        <div>
          <div className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
            data collection
          </div>
          <div className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-100">
            τ ∼ pθ(τ)
          </div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Still sample the complete rollout.
          </div>
        </div>

        <div className="hidden text-zinc-400 sm:block" aria-hidden="true">
          →
        </div>

        <div>
          <div className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
            inside that rollout
          </div>
          <div className="mt-1 font-mono text-sm text-zinc-900 dark:text-zinc-100">
            a<sub>t</sub> ∼ πθ(· | s<sub>t</sub>)
          </div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Its current action is already a policy sample.
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-zinc-900 p-4 text-sm leading-6 text-zinc-50 dark:bg-black">
        We did not switch samplers. We paused the same full rollouts at one
        prefix and looked at which action came next.
      </div>
    </div>
  )
}

export default function ExpectationWorlds() {
  const [step, setStep] = useState(0)

  const descriptions = [
    'A complete rollout samples the history, the current action, and everything after it.',
    'Conditioning on one history means comparing only rollouts that reached the same exact prefix.',
    'With the prefix fixed, the current action in those rollouts is distributed exactly as the policy.',
  ]

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Zooming from a full trajectory into one action
        </div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {descriptions[step]}
        </div>
      </div>

      <div className="p-5">
        <div
          className="mb-6 flex flex-wrap gap-2"
          role="group"
          aria-label="Trajectory conditioning steps"
        >
          {steps.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              aria-pressed={step === item.id}
              className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                step === item.id
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                  : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {step === 0 && <TrajectoryRows />}
        {step === 1 && <TrajectoryRows freezeHistory />}
        {step === 2 && <ActionZoom />}
      </div>
    </figure>
  )
}

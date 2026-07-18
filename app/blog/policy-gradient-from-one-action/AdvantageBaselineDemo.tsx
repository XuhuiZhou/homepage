'use client'

import { useMemo, useState } from 'react'

const actions = [
  {
    label: 'guess fast',
    shortLabel: 'guess',
    probability: 0.25,
    q: 0.2,
  },
  {
    label: 'derive step by step',
    shortLabel: 'derive',
    probability: 0.5,
    q: 1.2,
  },
  {
    label: 'ask for a hint',
    shortLabel: 'hint',
    probability: 0.25,
    q: 0.7,
  },
] as const

const scopes = [
  { id: 0, label: '1. Sample full trajectories' },
  { id: 1, label: '2. Fix one state' },
  { id: 2, label: '3. Return to trajectories' },
] as const

const rollouts = [
  { id: 'τ₁', before: 'prefix H₁', actionIndex: 0, future: 'future F₁' },
  { id: 'τ₂', before: 'prefix H₂', actionIndex: 1, future: 'future F₂' },
  { id: 'τ₃', before: 'prefix H₃', actionIndex: null, future: 'future F₃' },
  { id: 'τ₄', before: 'prefix H₄', actionIndex: 2, future: 'future F₄' },
] as const

function FullTrajectoryView() {
  return (
    <div>
      <div className="mb-2 grid grid-cols-[2.25rem_1fr_1.2fr_1fr] gap-2 px-2 text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase">
        <span className="text-center">τ</span>
        <span>before</span>
        <span>at time t</span>
        <span>after</span>
      </div>

      <div className="space-y-2" aria-label="Example complete trajectories">
        {rollouts.map((rollout) => (
          <div
            key={rollout.id}
            className="grid grid-cols-[2.25rem_1fr_1.2fr_1fr] items-stretch gap-2"
          >
            <div className="flex items-center justify-center font-mono text-xs text-zinc-500">
              {rollout.id}
            </div>
            <div className="flex min-h-12 items-center rounded-lg bg-emerald-100 px-3 text-sm text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100">
              {rollout.before}
            </div>
            <div
              className={`flex min-h-12 items-center rounded-lg px-3 text-sm font-medium ${
                rollout.actionIndex === null
                  ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400'
                  : 'bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:text-amber-100'
              }`}
            >
              {rollout.actionIndex === null ? (
                'another state u'
              ) : (
                <>s, {actions[rollout.actionIndex].shortLabel}</>
              )}
            </div>
            <div className="flex min-h-12 items-center rounded-lg bg-sky-100 px-3 text-sm text-sky-950 dark:bg-sky-950/60 dark:text-sky-100">
              {rollout.future}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg bg-zinc-900 p-4 text-sm leading-6 text-zinc-50 dark:bg-black">
        The outer expectation samples whole τ's. It determines which states are
        visited, which actions occur, and which futures follow.
      </div>
    </div>
  )
}

function FixedStateView({
  value,
  selectedIndex,
  onSelect,
}: {
  value: number
  selectedIndex: number
  onSelect: (index: number) => void
}) {
  const selected = actions[selectedIndex]
  const advantage = selected.q - value

  return (
    <div>
      <div className="mb-5 border-y border-zinc-200 py-4 dark:border-zinc-800">
        <div className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
          freeze s, then average its action branches
        </div>
        <div className="mt-2 font-mono text-sm text-zinc-900 dark:text-zinc-100">
          V(s) = 0.25(0.2) + 0.50(1.2) + 0.25(0.7) = {value.toFixed(2)}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {actions.map((action, index) => {
          const active = index === selectedIndex
          const actionAdvantage = action.q - value

          return (
            <button
              key={action.label}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={active}
              className={`rounded-lg border p-4 text-left transition ${
                active
                  ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900'
                  : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'
              }`}
            >
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {action.label}
              </div>
              <div className="mt-3 space-y-1 font-mono text-sm text-zinc-600 dark:text-zinc-400">
                <div>π(a | s) = {action.probability.toFixed(2)}</div>
                <div>Q(s,a) = {action.q.toFixed(1)}</div>
                <div className="text-zinc-900 dark:text-zinc-100">
                  A(s,a) = {actionAdvantage >= 0 ? '+' : ''}
                  {actionAdvantage.toFixed(2)}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-5 grid gap-3 border-t border-zinc-200 pt-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center dark:border-zinc-800">
        <div>
          <div className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
            selected action
          </div>
          <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {selected.label}
          </div>
        </div>
        <div className="hidden text-zinc-400 sm:block" aria-hidden="true">
          →
        </div>
        <div className="font-mono text-sm text-zinc-900 dark:text-zinc-100">
          A = {selected.q.toFixed(1)} - {value.toFixed(2)} ={' '}
          {advantage >= 0 ? '+' : ''}
          {advantage.toFixed(2)}
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-zinc-900 p-4 text-sm leading-6 text-zinc-50 dark:bg-black">
        This is the temporary inner expectation over a | s. The state is fixed;
        only its next action varies.
      </div>
    </div>
  )
}

function ReturnToTrajectories({ value }: { value: number }) {
  return (
    <div>
      <div className="mb-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        The local Q-to-A equality now applies at every state-action pair visited
        by every full trajectory.
      </div>

      <div
        className="space-y-2"
        aria-label="Advantage terms on full trajectories"
      >
        {rollouts.map((rollout) => {
          const action =
            rollout.actionIndex === null ? null : actions[rollout.actionIndex]
          const advantage = action ? action.q - value : null

          return (
            <div
              key={rollout.id}
              className="grid gap-2 border-b border-zinc-200 py-3 text-sm sm:grid-cols-[3rem_1fr_auto] sm:items-center dark:border-zinc-800"
            >
              <div className="font-mono text-zinc-500">{rollout.id}</div>
              <div className="text-zinc-700 dark:text-zinc-300">
                sum the advantage-weighted score at every visited timestep
              </div>
              <div className="font-mono text-zinc-900 sm:text-right dark:text-zinc-100">
                {action && advantage !== null ? (
                  <>
                    … + A(s,{action.shortLabel})Z<sub>t</sub> + …
                    <span className="ml-2 text-zinc-500">
                      A={advantage >= 0 ? '+' : ''}
                      {advantage.toFixed(2)}
                    </span>
                  </>
                ) : (
                  '… + A(u,a)Zₜ + …'
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="rounded-lg bg-amber-100 p-4 text-sm text-amber-950 dark:bg-amber-950/60 dark:text-amber-100">
          <div className="text-xs font-semibold tracking-[0.12em] uppercase opacity-70">
            local fact at each s
          </div>
          <div className="mt-2 font-mono">E[QZ | s] = E[AZ | s]</div>
        </div>
        <div className="hidden text-zinc-400 sm:block" aria-hidden="true">
          →
        </div>
        <div className="rounded-lg bg-emerald-100 p-4 text-sm text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100">
          <div className="text-xs font-semibold tracking-[0.12em] uppercase opacity-70">
            average states back together
          </div>
          <div className="mt-2 font-mono">Eτ[Σ QZ] = Eτ[Σ AZ]</div>
        </div>
      </div>

      <div className="mt-5 rounded-lg bg-zinc-900 p-4 text-sm leading-6 text-zinc-50 dark:bg-black">
        We return to τ because full trajectories determine how often each state
        is visited. No second action-only data collection step is performed.
      </div>
    </div>
  )
}

export default function AdvantageBaselineDemo() {
  const [scope, setScope] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(1)

  const value = useMemo(
    () =>
      actions.reduce(
        (total, action) => total + action.probability * action.q,
        0,
      ),
    [],
  )

  const descriptions = [
    'The outer expectation samples complete trajectories and all visited states.',
    'Conditioning temporarily freezes one state and averages only its possible actions.',
    'The local identity is applied at every visited state, then averaged over full trajectories.',
  ]

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Zoom into actions, then return to trajectories
        </div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {descriptions[scope]}
        </div>
      </div>

      <div className="p-5">
        <div
          className="mb-6 flex flex-wrap gap-2"
          role="group"
          aria-label="Expectation scope steps"
        >
          {scopes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setScope(item.id)}
              aria-pressed={scope === item.id}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                scope === item.id
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                  : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {scope === 0 && <FullTrajectoryView />}
        {scope === 1 && (
          <FixedStateView
            value={value}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        )}
        {scope === 2 && <ReturnToTrajectories value={value} />}
      </div>
    </figure>
  )
}

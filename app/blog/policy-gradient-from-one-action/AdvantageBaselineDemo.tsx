'use client'

import { useMemo, useState } from 'react'

const actions = [
  { label: 'guess fast', probability: 0.25, q: 0.2 },
  { label: 'derive step by step', probability: 0.5, q: 1.2 },
  { label: 'ask for a hint', probability: 0.25, q: 0.7 },
]

export default function AdvantageBaselineDemo() {
  const [selectedIndex, setSelectedIndex] = useState(1)

  const value = useMemo(
    () =>
      actions.reduce(
        (total, action) => total + action.probability * action.q,
        0,
      ),
    [],
  )

  const selected = actions[selectedIndex]
  const advantage = selected.q - value

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Why Q becomes advantage
        </div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Advantage compares an action to the policy's average action at the
          same state.
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-5">
          <div className="space-y-3">
            {actions.map((action, index) => {
              const active = index === selectedIndex
              const advantageValue = action.q - value
              const qWidth = Math.max(8, (action.q / 1.4) * 100)

              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    active
                      ? 'border-zinc-900 bg-zinc-50 shadow-sm dark:border-zinc-100 dark:bg-zinc-900'
                      : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {action.label}
                    </div>
                    <div className="font-mono text-xs text-zinc-500">
                      pi = {action.probability.toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-sky-500"
                        style={{ width: `${qWidth}%` }}
                      />
                    </div>
                    <div className="w-16 text-right font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      Q {action.q.toFixed(1)}
                    </div>
                  </div>
                  <div
                    className={`mt-2 font-mono text-sm ${
                      advantageValue >= 0
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    A = {advantageValue >= 0 ? '+' : ''}
                    {advantageValue.toFixed(2)}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 p-5 lg:border-t-0 lg:border-l dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              state value baseline
            </div>
            <div className="mt-2 font-mono text-xl text-zinc-900 dark:text-zinc-100">
              V(s) = {value.toFixed(2)}
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              This is the policy-weighted average Q over actions the model might
              take from the same state.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-100">
            <div className="text-xs font-semibold tracking-[0.14em] uppercase opacity-70">
              selected action
            </div>
            <div className="mt-2 text-lg font-semibold">{selected.label}</div>
            <div className="mt-3 font-mono text-xl">
              A = {selected.q.toFixed(1)} - {value.toFixed(2)} ={' '}
              {advantage >= 0 ? '+' : ''}
              {advantage.toFixed(2)}
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-zinc-900 p-4 font-mono text-[13px] leading-6 text-zinc-50 dark:bg-black">
            E[grad log pi(a|s) * V(s) | s] = 0
            <br />
            so Q(s,a) and A(s,a)=Q(s,a)-V(s)
            <br />
            give the same expected gradient.
          </div>
        </div>
      </div>
    </figure>
  )
}

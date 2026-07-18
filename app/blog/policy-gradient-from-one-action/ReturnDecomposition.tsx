'use client'

import { useState } from 'react'

const pastCoins = 10
const choices = [
  { id: 'left', label: 'Go left', future: 2 },
  { id: 'right', label: 'Go right', future: 5 },
] as const

type View = 'total' | 'future'

export default function ReturnDecomposition() {
  const [view, setView] = useState<View>('total')

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Pause the world just before the choice
        </div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          The frozen game prefix is H<sub>t</sub>. Both actions inherit the same
          past.
        </div>
      </div>

      <div className="p-5">
        <div className="mb-6 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              fixed inside H<sub>t</sub>
            </div>
            <div className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              10 coins already collected
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Past<sub>t</sub> = 10
            </div>
          </div>

          <div className="text-center text-xl text-zinc-400" aria-hidden="true">
            →
          </div>

          <div className="rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
            <div className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              still random
            </div>
            <div className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              sample action a<sub>t</sub>
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              left or right?
            </div>
          </div>
        </div>

        <div
          className="mb-5 flex flex-wrap gap-2"
          role="group"
          aria-label="Choose which return to compare"
        >
          <button
            type="button"
            onClick={() => setView('total')}
            aria-pressed={view === 'total'}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              view === 'total'
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-300'
            }`}
          >
            Compare full return G<sub>1</sub>
          </button>
          <button
            type="button"
            onClick={() => setView('future')}
            aria-pressed={view === 'future'}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
              view === 'future'
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-300'
            }`}
          >
            Remove the past: compare G<sub>t</sub>
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {choices.map((choice) => {
            const value =
              view === 'total' ? pastCoins + choice.future : choice.future
            const max = view === 'total' ? 15 : 5

            return (
              <div
                key={choice.id}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {choice.label}
                  </div>
                  <div className="font-mono text-lg text-zinc-900 dark:text-zinc-100">
                    {view === 'total'
                      ? `10 + ${choice.future} = ${value}`
                      : `${choice.future}`}
                  </div>
                </div>
                <div className="mt-4 flex h-4 overflow-hidden rounded-sm bg-zinc-100 dark:bg-zinc-900">
                  {view === 'total' && (
                    <div
                      className="bg-zinc-400 dark:bg-zinc-600"
                      style={{ width: `${(pastCoins / max) * 100}%` }}
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className="bg-emerald-500 dark:bg-emerald-400"
                    style={{ width: `${(choice.future / max) * 100}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-2 flex justify-between gap-3 text-xs text-zinc-500">
                  <span>
                    {view === 'total'
                      ? 'old coins + future coins'
                      : 'future coins only'}
                  </span>
                  <span>
                    {view === 'total' ? `G1 = ${value}` : `Gt = ${value}`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-5 rounded-lg bg-zinc-900 p-4 text-sm leading-6 text-zinc-50 dark:bg-black">
          Right is better by <strong>3 coins</strong> in both views. Removing
          the shared past changes the displayed totals, but not the action
          preference.
        </div>
      </div>
    </figure>
  )
}

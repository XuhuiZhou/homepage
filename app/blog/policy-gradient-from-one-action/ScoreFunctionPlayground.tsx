'use client'

import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'

const candidates = [
  {
    id: 'proof',
    label: 'clear proof',
    prob: 0.18,
    reward: 1,
    color: 'bg-emerald-500',
  },
  {
    id: 'almost',
    label: 'almost right',
    prob: 0.32,
    reward: 0.55,
    color: 'bg-sky-500',
  },
  {
    id: 'verbose',
    label: 'verbose miss',
    prob: 0.29,
    reward: 0.15,
    color: 'bg-amber-500',
  },
  {
    id: 'refusal',
    label: 'unhelpful refusal',
    prob: 0.21,
    reward: 0.05,
    color: 'bg-rose-500',
  },
]

const numberFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function ScoreFunctionPlayground() {
  const [selectedId, setSelectedId] = useState(candidates[0].id)
  const [baseline, setBaseline] = useState(0.42)

  const selected = useMemo(
    () =>
      candidates.find((candidate) => candidate.id === selectedId) ??
      candidates[0],
    [selectedId],
  )
  const advantage = selected.reward - baseline
  const updateWidth = Math.min(100, Math.max(12, Math.abs(advantage) * 100))
  const sign = advantage >= 0 ? 'increase' : 'decrease'

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="p-5">
          <div className="mb-4">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Score-function playground
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Pick the sampled answer. The policy gradient only touches that
              answer's log-probability.
            </div>
          </div>

          <div className="space-y-3">
            {candidates.map((candidate) => {
              const selectedCandidate = candidate.id === selected.id

              return (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => setSelectedId(candidate.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    selectedCandidate
                      ? 'border-zinc-900 bg-zinc-50 shadow-sm dark:border-zinc-100 dark:bg-zinc-900'
                      : 'border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {candidate.label}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      reward {numberFormat.format(candidate.reward)}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className={`h-full rounded-full ${candidate.color}`}
                        style={{ width: `${candidate.prob * 100}%` }}
                      />
                    </div>
                    <div className="w-12 text-right font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      {Math.round(candidate.prob * 100)}%
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 p-5 lg:border-t-0 lg:border-l dark:border-zinc-800 dark:bg-zinc-900/60">
          <label className="block">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Baseline
              </span>
              <span className="font-mono text-sm text-zinc-600 dark:text-zinc-300">
                b = {numberFormat.format(baseline)}
              </span>
            </div>
            <input
              aria-label="Baseline"
              className="mt-3 w-full accent-zinc-900 dark:accent-zinc-100"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={baseline}
              onChange={(event) => setBaseline(Number(event.target.value))}
            />
          </label>

          <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              sampled answer
            </div>
            <div className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {selected.label}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-zinc-50 p-3 dark:bg-zinc-900">
                <div className="text-zinc-500">reward</div>
                <div className="font-mono text-zinc-900 dark:text-zinc-100">
                  {numberFormat.format(selected.reward)}
                </div>
              </div>
              <div className="rounded-md bg-zinc-50 p-3 dark:bg-zinc-900">
                <div className="text-zinc-500">advantage</div>
                <div className="font-mono text-zinc-900 dark:text-zinc-100">
                  {advantage >= 0 ? '+' : ''}
                  {numberFormat.format(advantage)}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">
                  log-probability update
                </span>
                <span
                  className={`font-medium ${
                    advantage >= 0
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {sign}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950">
                  {advantage >= 0 ? (
                    <ArrowUp size={18} />
                  ) : (
                    <ArrowDown size={18} />
                  )}
                </div>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${
                      advantage >= 0 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${updateWidth}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-zinc-900 p-4 font-mono text-[13px] leading-6 text-zinc-50 dark:bg-black">
            Delta log pi_theta(y | x)
            <br />
            {'  '}proportional to R(x, y) - b(x)
          </div>
        </div>
      </div>
    </figure>
  )
}

'use client'

import { useMemo, useState } from 'react'

const rollouts = [
  { label: 'y1', reward: 0.9 },
  { label: 'y2', reward: 0.7 },
  { label: 'y3', reward: 0.35 },
  { label: 'y4', reward: 0.2 },
  { label: 'y5', reward: 0.05 },
]

const numberFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default function BaselineVarianceDemo() {
  const [baseline, setBaseline] = useState(0.42)

  const advantages = useMemo(
    () =>
      rollouts.map((rollout) => ({
        ...rollout,
        advantage: rollout.reward - baseline,
      })),
    [baseline],
  )

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="border-b border-zinc-200 bg-zinc-50 p-5 lg:border-r lg:border-b-0 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            The baseline turns rewards into comparisons
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            A high absolute reward is not always enough. What matters for the
            update is whether the sampled answer did better than what we
            expected for this prompt.
          </p>
          <label className="mt-5 block">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                expected reward
              </span>
              <span className="font-mono text-sm text-zinc-600 dark:text-zinc-300">
                {numberFormat.format(baseline)}
              </span>
            </div>
            <input
              aria-label="Expected reward baseline"
              className="mt-3 w-full accent-zinc-900 dark:accent-zinc-100"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={baseline}
              onChange={(event) => setBaseline(Number(event.target.value))}
            />
          </label>
          <div className="mt-5 rounded-lg bg-zinc-900 p-4 font-mono text-[13px] leading-6 text-zinc-50 dark:bg-black">
            A(x, y) = R(x, y) - b(x)
            <br />
            positive: push up
            <br />
            negative: push down
          </div>
        </div>

        <div className="p-5">
          <div className="relative h-72 rounded-lg border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-4 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
            <div
              className="absolute right-4 left-4 border-t-2 border-dashed border-zinc-500"
              style={{ bottom: `${baseline * 220 + 24}px` }}
            >
              <span className="absolute -top-7 right-0 rounded-full bg-zinc-900 px-2 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                baseline
              </span>
            </div>
            <div className="absolute right-4 bottom-6 left-4 grid h-[220px] grid-cols-5 items-end gap-3">
              {advantages.map((rollout) => {
                const positive = rollout.advantage >= 0
                const bottom = baseline * 220
                const height = Math.max(4, Math.abs(rollout.advantage) * 220)

                return (
                  <div key={rollout.label} className="relative h-full">
                    <div
                      className={`absolute left-1/2 w-8 -translate-x-1/2 rounded-t-md ${
                        positive ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{
                        bottom: positive
                          ? `${bottom}px`
                          : `${bottom - height}px`,
                        height: `${height}px`,
                        borderRadius: positive
                          ? '8px 8px 2px 2px'
                          : '2px 2px 8px 8px',
                      }}
                    />
                    <div className="absolute right-0 -bottom-6 left-0 text-center font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      {rollout.label}
                    </div>
                    <div
                      className="absolute right-0 left-0 text-center font-mono text-xs text-zinc-700 dark:text-zinc-300"
                      style={{ bottom: `${rollout.reward * 220 + 8}px` }}
                    >
                      {numberFormat.format(rollout.advantage)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}

'use client'

import { useMemo, useState } from 'react'

const futures = [
  { label: 'lucky future', return: 1.8 },
  { label: 'normal future', return: 1.1 },
  { label: 'messy future', return: 0.4 },
  { label: 'bad future', return: -0.2 },
  { label: 'good future', return: 1.4 },
]

const mean = (values: number[]) =>
  values.reduce((total, value) => total + value, 0) / values.length

export default function QExpectationDemo() {
  const [sample, setSample] = useState(1)

  const qValue = useMemo(() => mean(futures.map((future) => future.return)), [])
  const selected = futures[sample]

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Why a sampled return becomes Q
        </div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Same state and action, many possible futures. Q is their average.
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="border-b border-zinc-200 bg-zinc-50 p-5 lg:border-r lg:border-b-0 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-violet-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            <div className="text-xs font-semibold tracking-[0.14em] uppercase opacity-70">
              fixed prefix
            </div>
            <div className="mt-3 font-mono text-lg">s_t, a_t</div>
            <p className="mt-3 text-sm leading-6 opacity-80">
              Once these are fixed, the future can still vary because the
              environment and later actions can vary.
            </p>
          </div>

          <div className="mt-4 rounded-lg bg-zinc-900 p-4 font-mono text-[13px] leading-6 text-zinc-50 dark:bg-black">
            Q^pi(s_t,a_t)
            <br />
            = E_pi[G_t | s_t,a_t]
            <br />= {qValue.toFixed(2)}
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {futures.map((future, index) => (
              <button
                key={future.label}
                type="button"
                onClick={() => setSample(index)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  sample === index
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                    : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-300'
                }`}
              >
                sample {index + 1}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {futures.map((future, index) => {
              const width = Math.max(8, ((future.return + 0.4) / 2.4) * 100)
              const active = index === sample

              return (
                <div key={future.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span
                      className={
                        active
                          ? 'font-semibold text-zinc-900 dark:text-zinc-100'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }
                    >
                      {future.label}
                    </span>
                    <span className="font-mono text-zinc-600 dark:text-zinc-400">
                      G_t = {future.return.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full ${
                        active ? 'bg-amber-500' : 'bg-sky-500'
                      }`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100">
              <div className="text-xs font-semibold tracking-[0.14em] uppercase opacity-70">
                one rollout
              </div>
              <div className="mt-2 font-mono text-xl">
                G_t = {selected.return.toFixed(1)}
              </div>
            </div>
            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sky-950 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-100">
              <div className="text-xs font-semibold tracking-[0.14em] uppercase opacity-70">
                expectation
              </div>
              <div className="mt-2 font-mono text-xl">
                Q = {qValue.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  )
}

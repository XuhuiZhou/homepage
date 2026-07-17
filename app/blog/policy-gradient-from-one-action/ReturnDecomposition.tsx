'use client'

import { useMemo, useState } from 'react'

const rewards = [0.2, -0.1, 0.5, 1.4]

const sum = (values: number[]) =>
  values.reduce((total, value) => total + value, 0)

const fmt = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}`

export default function ReturnDecomposition() {
  const [step, setStep] = useState(2)

  const values = useMemo(() => {
    const past = sum(rewards.slice(0, step - 1))
    const future = sum(rewards.slice(step - 1))
    const total = sum(rewards)

    return { past, future, total }
  }, [step])

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Why total reward becomes reward-to-go
        </div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Choose which action's gradient term we are studying.
        </div>
      </div>

      <div className="p-5">
        <div className="mb-5 flex flex-wrap gap-2">
          {rewards.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setStep(index + 1)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                step === index + 1
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950'
                  : 'border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-300'
              }`}
            >
              action a{index + 1}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {rewards.map((reward, index) => {
            const isPast = index < step - 1
            const isCurrent = index === step - 1
            const isFuture = index >= step - 1

            return (
              <div
                key={index}
                className={`rounded-lg border p-4 ${
                  isPast
                    ? 'border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/70 dark:bg-emerald-950/30 dark:text-emerald-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-semibold tracking-[0.14em] uppercase">
                    r{index + 1}
                  </div>
                  {isCurrent && (
                    <div className="rounded-full bg-white/80 px-2 py-0.5 text-xs dark:bg-zinc-950">
                      chosen t
                    </div>
                  )}
                </div>
                <div className="mt-3 font-mono text-2xl">{fmt(reward)}</div>
                <div className="mt-3 text-sm leading-5">
                  {isPast && 'Already happened before this action.'}
                  {isFuture && !isPast && 'Still downstream of this action.'}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              full return
            </div>
            <div className="mt-2 font-mono text-xl text-zinc-900 dark:text-zinc-100">
              G1 = {values.total.toFixed(1)}
            </div>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
              past prefix
            </div>
            <div className="mt-2 font-mono text-xl text-zinc-900 dark:text-zinc-100">
              past = {values.past.toFixed(1)}
            </div>
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/70 dark:bg-emerald-950/30">
            <div className="text-xs font-semibold tracking-[0.14em] text-emerald-700 uppercase dark:text-emerald-300">
              reward-to-go
            </div>
            <div className="mt-2 font-mono text-xl text-emerald-950 dark:text-emerald-100">
              G{step} = {values.future.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-zinc-900 p-4 font-mono text-[13px] leading-6 text-zinc-50 dark:bg-black">
          For term t = {step}: G1 = past_before_t + G{step}
          <br />
          E[grad log pi(a{step}|s{step}) * past_before_t] = 0
          <br />
          so only G{step} needs to stay.
        </div>
      </div>
    </figure>
  )
}

'use client'

import { useMemo, useState } from 'react'

const qLeft = 12
const qRight = 8

export default function BaselineCancellationDemo() {
  const [leftProbability, setLeftProbability] = useState(0.4)

  const values = useMemo(() => {
    const rightProbability = 1 - leftProbability
    const value = leftProbability * qLeft + rightProbability * qRight
    const leftScore = 1 - leftProbability
    const rightScore = -leftProbability
    const leftBaselinePush = leftProbability * value * leftScore
    const rightBaselinePush = rightProbability * value * rightScore
    const leftAdvantage = qLeft - value
    const rightAdvantage = qRight - value
    const qGradient =
      leftProbability * qLeft * leftScore +
      rightProbability * qRight * rightScore
    const advantageGradient =
      leftProbability * leftAdvantage * leftScore +
      rightProbability * rightAdvantage * rightScore

    return {
      rightProbability,
      value,
      leftScore,
      rightScore,
      leftBaselinePush,
      rightBaselinePush,
      leftAdvantage,
      rightAdvantage,
      qGradient,
      advantageGradient,
    }
  }, [leftProbability])

  const pushWidth = Math.min(100, (Math.abs(values.leftBaselinePush) / 3) * 100)

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Watch a state baseline cancel
        </div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          One fixed state, two actions, and one logit controlling the
          probability of going left.
        </div>
      </div>

      <div className="p-5">
        <label
          htmlFor="baseline-left-probability"
          className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
        >
          Policy probability of left: p = {leftProbability.toFixed(2)}
        </label>
        <input
          id="baseline-left-probability"
          type="range"
          min="0.1"
          max="0.9"
          step="0.05"
          value={leftProbability}
          onInput={(event) =>
            setLeftProbability(Number.parseFloat(event.currentTarget.value))
          }
          className="mt-3 w-full accent-zinc-900 dark:accent-zinc-100"
        />
        <div className="mt-1 flex justify-between text-xs text-zinc-500">
          <span>left is rare</span>
          <span>left is likely</span>
        </div>

        <div className="mt-6 border-y border-zinc-200 py-4 dark:border-zinc-800">
          <div className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
            same baseline for both actions
          </div>
          <div className="mt-2 font-mono text-sm text-zinc-900 dark:text-zinc-100">
            V(s) = p(12) + (1-p)(8) = {values.value.toFixed(2)}
          </div>
        </div>

        <div className="mt-5 grid overflow-hidden border-y border-zinc-200 sm:grid-cols-2 sm:divide-x sm:divide-zinc-200 dark:border-zinc-800 dark:sm:divide-zinc-800">
          <div className="bg-emerald-50 p-4 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">
            <div className="text-xs font-semibold tracking-[0.12em] uppercase opacity-70">
              sampled left
            </div>
            <div className="mt-2 font-mono text-sm leading-7">
              probability = {leftProbability.toFixed(2)}
              <br />
              score = 1-p = +{values.leftScore.toFixed(2)}
              <br />
              weighted baseline push = +{values.leftBaselinePush.toFixed(2)}
            </div>
          </div>

          <div className="border-t border-zinc-200 bg-rose-50 p-4 text-rose-950 sm:border-t-0 dark:border-zinc-800 dark:bg-rose-950/30 dark:text-rose-100">
            <div className="text-xs font-semibold tracking-[0.12em] uppercase opacity-70">
              sampled right
            </div>
            <div className="mt-2 font-mono text-sm leading-7">
              probability = {values.rightProbability.toFixed(2)}
              <br />
              score = -p = {values.rightScore.toFixed(2)}
              <br />
              weighted baseline push = {values.rightBaselinePush.toFixed(2)}
            </div>
          </div>
        </div>

        <div
          className="mt-6"
          role="img"
          aria-label={`The positive baseline push ${values.leftBaselinePush.toFixed(2)} and negative baseline push ${values.rightBaselinePush.toFixed(2)} cancel to zero`}
        >
          <div className="mb-2 text-center text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
            probability-weighted pushes
          </div>
          <div className="grid h-8 grid-cols-[1fr_1px_1fr] items-center">
            <div className="flex justify-end">
              <div
                className="h-6 rounded-l-sm bg-emerald-500 transition-[width] dark:bg-emerald-400"
                style={{ width: `${pushWidth}%` }}
              />
            </div>
            <div className="h-8 bg-zinc-900 dark:bg-zinc-100" />
            <div>
              <div
                className="h-6 rounded-r-sm bg-rose-500 transition-[width] dark:bg-rose-400"
                style={{ width: `${pushWidth}%` }}
              />
            </div>
          </div>
          <div className="mt-2 text-center font-mono text-sm text-zinc-900 dark:text-zinc-100">
            {values.leftBaselinePush.toFixed(2)} + (
            {values.rightBaselinePush.toFixed(2)}) = 0
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-zinc-200 pt-5 sm:grid-cols-2 dark:border-zinc-800">
          <div>
            <div className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
              gradient weighted by Q
            </div>
            <div className="mt-2 font-mono text-lg text-zinc-900 dark:text-zinc-100">
              {values.qGradient.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
              gradient weighted by A = Q - V
            </div>
            <div className="mt-2 font-mono text-lg text-zinc-900 dark:text-zinc-100">
              {values.advantageGradient.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-zinc-900 p-4 text-sm leading-6 text-zinc-50 dark:bg-black">
          Subtracting V removes two equal-and-opposite baseline pushes. The
          expected policy gradient stays the same.
        </div>
      </div>
    </figure>
  )
}

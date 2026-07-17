'use client'

import { Sparkles } from 'lucide-react'

const steps = [
  {
    label: 'Prompt',
    math: 'x',
    body: 'The user asks one question.',
    tone: 'border-sky-200 bg-sky-50 text-sky-950',
  },
  {
    label: 'Policy',
    math: 'pi_theta(. | x)',
    body: 'The model rolls a weighted die over possible answers.',
    tone: 'border-violet-200 bg-violet-50 text-violet-950',
  },
  {
    label: 'Answer',
    math: 'y',
    body: 'One full response is sampled.',
    tone: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  {
    label: 'Reward',
    math: 'R(x, y)',
    body: 'Only after the answer do we learn if it was good.',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  },
]

export default function OneStepTrajectory() {
  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              The smallest LLM RL world
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              One prompt, one sampled response, one score at the end.
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
            <Sparkles size={15} />
            terminal reward
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className={`rounded-lg border p-4 ${step.tone} dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-semibold tracking-[0.14em] uppercase opacity-70">
                {step.label}
              </div>
              <div className="rounded-full bg-white/70 px-2 py-0.5 font-mono text-xs opacity-70 dark:bg-zinc-950">
                {index + 1}
              </div>
            </div>
            <div className="mt-3 rounded-md bg-white/75 px-3 py-2 font-mono text-lg shadow-sm dark:bg-zinc-950">
              {step.math}
            </div>
            <div className="mt-3 text-sm leading-5 opacity-80">{step.body}</div>
          </div>
        ))}
      </div>

      <figcaption className="border-t border-zinc-200 px-5 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        High reward gives a stronger push toward this response. After we add a
        baseline, below-expectation responses get pushed away.
      </figcaption>
    </figure>
  )
}

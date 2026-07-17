'use client'

const rows = [
  {
    name: 'one answer',
    formula: 'R(x, y)',
    intuition:
      'The whole response is one action, so the final reward is the return.',
  },
  {
    name: 'whole trajectory',
    formula: 'G_1',
    intuition: 'Every action first appears to get the total trajectory return.',
  },
  {
    name: 'reward-to-go',
    formula: 'G_t',
    intuition:
      'Past rewards are a baseline for action t, so they vanish in expectation.',
  },
  {
    name: 'action value',
    formula: 'Q^pi(s_t, a_t)',
    intuition: 'Average over all futures after the same state-action pair.',
  },
  {
    name: 'advantage',
    formula: 'A^pi(s_t, a_t)',
    intuition:
      'Subtract the state baseline: better or worse than the usual action here.',
  },
]

export default function GradientLadder() {
  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          The policy-gradient ladder
        </div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Same gradient, cleaner multipliers.
        </div>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
        {rows.map((row, index) => (
          <div
            key={row.name}
            className="grid gap-3 px-5 py-4 md:grid-cols-[110px_180px_1fr] md:items-center"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 font-mono text-xs text-white dark:bg-zinc-100 dark:text-zinc-950">
                {index + 1}
              </div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {row.name}
              </div>
            </div>
            <div className="rounded-md bg-zinc-100 px-3 py-2 font-mono text-sm text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
              {row.formula}
            </div>
            <div className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {row.intuition}
            </div>
          </div>
        ))}
      </div>
    </figure>
  )
}

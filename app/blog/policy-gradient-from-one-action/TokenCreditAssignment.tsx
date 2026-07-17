'use client'

import { useState } from 'react'

const tokens = ['The', ' answer', ' is', ' 42', '.']

export default function TokenCreditAssignment() {
  const [expanded, setExpanded] = useState(false)

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Whole answer view vs. token view
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              A response can be one action, or the product of many token
              actions.
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-white dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            {expanded ? 'show compact view' : 'show token view'}
          </button>
        </div>
      </div>

      <div className="p-5">
        {!expanded ? (
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 text-violet-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
              <div className="text-xs font-semibold tracking-[0.14em] uppercase opacity-70">
                one sampled action
              </div>
              <div className="mt-3 font-mono text-lg">
                y = "The answer is 42."
              </div>
            </div>
            <div className="text-center font-mono text-2xl text-zinc-400">
              {'->'}
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
              <div className="text-xs font-semibold tracking-[0.14em] uppercase opacity-70">
                final reward
              </div>
              <div className="mt-3 font-mono text-lg">R(x, y) = 1</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              log pi_theta(y | x) = sum_t log pi_theta(y_t | x, y_&lt;t)
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {tokens.map((token, index) => (
                <div
                  key={`${token}-${index}`}
                  className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">
                    token {index + 1}
                  </div>
                  <div className="mt-3 rounded-md bg-zinc-100 px-2 py-2 font-mono text-sm text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                    {token}
                  </div>
                  <div className="mt-4 h-10 rounded-md bg-emerald-50 px-2 py-2 text-center font-mono text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                    x R = 1
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <figcaption className="border-t border-zinc-200 px-5 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        With only one terminal reward, every sampled token receives the same
        return. That is valid, but noisy: the model learns which whole strings
        worked before it knows which individual token deserved credit.
      </figcaption>
    </figure>
  )
}

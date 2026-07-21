'use client'

import { Boxes, ChevronRight, Clock3, Grid3X3 } from 'lucide-react'
import { useState } from 'react'

type Mode = 'recurrent' | 'parallel' | 'chunkwise'

const modes: { id: Mode; label: string; icon: typeof Clock3 }[] = [
  { id: 'recurrent', label: 'Recurrent', icon: Clock3 },
  { id: 'parallel', label: 'Parallel', icon: Grid3X3 },
  { id: 'chunkwise', label: 'Chunkwise', icon: Boxes },
]

const descriptions: Record<
  Mode,
  { title: string; body: string; cost: string }
> = {
  recurrent: {
    title: 'Carry one state through time',
    body: 'Excellent for decoding, but every update waits for the previous one during training.',
    cost: 'linear work, sequential path',
  },
  parallel: {
    title: 'Materialize every token-to-token interaction',
    body: 'GPU-friendly matrix multiplication, but the causal interaction table grows quadratically.',
    cost: 'quadratic work, wide parallelism',
  },
  chunkwise: {
    title: 'Parallel inside, recurrent between',
    body: 'Each chunk uses dense matrix operations while only its boundary state crosses to the next chunk.',
    cost: 'exact rearrangement, practical balance',
  },
}

const tokens = Array.from({ length: 12 }, (_, index) => index + 1)

export default function ComputeScheduleDemo() {
  const [mode, setMode] = useState<Mode>('chunkwise')
  const current = descriptions[mode]

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4">
        <div className="text-sm font-semibold text-zinc-950">
          The same layer, scheduled three ways
        </div>
        <div className="mt-1 text-sm text-zinc-600">
          The algebra stays fixed. What changes is what the hardware sees at
          once.
        </div>
      </div>

      <div
        className="grid grid-cols-3 border-b border-zinc-200"
        role="tablist"
        aria-label="Choose a computation schedule"
      >
        {modes.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              onClick={() => setMode(item.id)}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 px-2 py-3 text-xs font-medium sm:flex-row sm:gap-2 sm:text-sm ${index > 0 ? 'border-l border-zinc-200' : ''} ${mode === item.id ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-50'}`}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      <div className="min-h-[22rem] px-5 py-6">
        {mode === 'recurrent' && (
          <div>
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
              state walks left to right
            </div>
            <div
              className="grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-6 lg:grid-cols-12"
              role="img"
              aria-label="Twelve sequential recurrent state updates"
            >
              {tokens.map((token) => (
                <div key={token} className="relative">
                  <div className="flex aspect-square items-center justify-center rounded-md border border-sky-200 bg-sky-50 font-mono text-sm font-semibold text-sky-950">
                    S{token}
                  </div>
                  {token < tokens.length && token % 4 !== 0 && (
                    <ChevronRight
                      className="absolute top-1/2 -right-3 -translate-y-1/2 text-zinc-300 sm:hidden"
                      size={16}
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-7 h-2 overflow-hidden rounded-sm bg-zinc-100">
              <div className="h-full w-full bg-sky-500" />
            </div>
            <div className="mt-2 flex justify-between text-xs text-zinc-500">
              <span>token 1</span>
              <span>one dependency chain</span>
              <span>token 12</span>
            </div>
          </div>
        )}

        {mode === 'parallel' && (
          <div>
            <div className="mb-4 flex items-center justify-between gap-4 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
              <span>query rows</span>
              <span>causal interaction table</span>
            </div>
            <div
              className="grid grid-cols-12 gap-1"
              role="img"
              aria-label="A twelve by twelve lower triangular causal attention matrix"
            >
              {tokens.flatMap((row) =>
                tokens.map((column) => (
                  <div
                    key={`${row}-${column}`}
                    className={`aspect-square rounded-sm ${column <= row ? 'bg-violet-400' : 'bg-zinc-100'}`}
                    aria-hidden="true"
                  />
                )),
              )}
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-zinc-600">
              <span
                className="h-3 w-3 rounded-sm bg-violet-400"
                aria-hidden="true"
              />
              Every colored square is one visible query-key pair.
            </div>
          </div>
        )}

        {mode === 'chunkwise' && (
          <div>
            <div className="mb-5 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
              three chunks, four tokens each
            </div>
            <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-center">
              {[0, 1, 2].map((chunk) => (
                <div key={chunk} className="contents">
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-emerald-950">
                        chunk {chunk + 1}
                      </div>
                      <div className="font-mono text-xs text-emerald-800">
                        S[{chunk}] -&gt; S[{chunk + 1}]
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {tokens.slice(chunk * 4, chunk * 4 + 4).map((token) => (
                        <div
                          key={token}
                          className="flex aspect-square items-center justify-center rounded-md bg-white font-mono text-sm font-semibold text-emerald-950 shadow-sm"
                        >
                          {token}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-emerald-900/70">
                      parallel matrix work inside
                    </div>
                  </div>
                  {chunk < 2 && (
                    <ChevronRight
                      className="mx-auto rotate-90 text-emerald-600 lg:rotate-0"
                      size={22}
                      aria-label="Pass the boundary state"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid border-t border-zinc-200 bg-zinc-50 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="px-5 py-4">
          <div className="text-sm font-semibold text-zinc-900">
            {current.title}
          </div>
          <div className="mt-1 text-sm leading-6 text-zinc-600">
            {current.body}
          </div>
        </div>
        <div className="border-t border-zinc-200 px-5 py-4 font-mono text-xs text-zinc-600 sm:border-t-0 sm:border-l">
          {current.cost}
        </div>
      </div>

      <figcaption className="border-t border-zinc-200 px-5 py-3 text-sm text-zinc-600">
        Chunkwise training is an exact scheduling trick for these recurrences,
        not a claim that every linear-attention variant has the same kernel or
        cost.
      </figcaption>
    </figure>
  )
}

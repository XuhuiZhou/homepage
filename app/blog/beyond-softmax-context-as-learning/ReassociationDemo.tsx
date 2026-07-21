'use client'

import { Equal, Layers3, ListTree } from 'lucide-react'
import { useMemo, useState } from 'react'

type Vector = [number, number]
type Route = 'pairs' | 'state'

const memories: { token: string; key: Vector; value: Vector }[] = [
  { token: 'alpha', key: [1, 0], value: [2, 1] },
  { token: 'beta', key: [0, 1], value: [-1, 2] },
  { token: 'bridge', key: [1, 1], value: [1, -1] },
]

const queries: { label: string; value: Vector }[] = [
  { label: 'topic A', value: [1, 0] },
  { label: 'topic B', value: [0, 1] },
  { label: 'both', value: [1, 1] },
]

const dot = (a: Vector, b: Vector) => a[0] * b[0] + a[1] * b[1]
const add = (a: Vector, b: Vector): Vector => [a[0] + b[0], a[1] + b[1]]
const scale = (value: Vector, amount: number): Vector => [
  value[0] * amount,
  value[1] * amount,
]
const formatVector = (value: Vector) => `[${value[0]}, ${value[1]}]`

export default function ReassociationDemo() {
  const [queryIndex, setQueryIndex] = useState(2)
  const [route, setRoute] = useState<Route>('pairs')
  const query = queries[queryIndex].value

  const result = useMemo(() => {
    return memories.reduce<Vector>(
      (sum, memory) => add(sum, scale(memory.value, dot(query, memory.key))),
      [0, 0],
    )
  }, [query])

  const state = useMemo(() => {
    return memories.reduce(
      (matrix, memory) =>
        [
          [
            matrix[0][0] + memory.key[0] * memory.value[0],
            matrix[0][1] + memory.key[0] * memory.value[1],
          ],
          [
            matrix[1][0] + memory.key[1] * memory.value[0],
            matrix[1][1] + memory.key[1] * memory.value[1],
          ],
        ] as [Vector, Vector],
      [
        [0, 0],
        [0, 0],
      ] as [Vector, Vector],
    )
  }, [])

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4">
        <div className="text-sm font-semibold text-zinc-950">
          One sum, two evaluation orders
        </div>
        <div className="mt-1 text-sm text-zinc-600">
          Change the query, then walk both routes to the identical output.
        </div>
      </div>

      <div
        className="flex flex-wrap gap-2 border-b border-zinc-200 px-5 py-4"
        aria-label="Choose a query"
      >
        {queries.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setQueryIndex(index)}
            aria-pressed={queryIndex === index}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
              queryIndex === index
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
            }`}
          >
            {item.label}{' '}
            <span className="ml-1 font-mono text-xs opacity-70">
              {formatVector(item.value)}
            </span>
          </button>
        ))}
      </div>

      <div
        className="grid grid-cols-2 border-b border-zinc-200"
        role="tablist"
        aria-label="Choose an evaluation route"
      >
        <button
          type="button"
          role="tab"
          aria-selected={route === 'pairs'}
          onClick={() => setRoute('pairs')}
          className={`flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium ${route === 'pairs' ? 'bg-sky-50 text-sky-950' : 'text-zinc-500 hover:bg-zinc-50'}`}
        >
          <ListTree size={16} aria-hidden="true" /> Pair first
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={route === 'state'}
          onClick={() => setRoute('state')}
          className={`flex items-center justify-center gap-2 border-l border-zinc-200 px-3 py-3 text-sm font-medium ${route === 'state' ? 'bg-emerald-50 text-emerald-950' : 'text-zinc-500 hover:bg-zinc-50'}`}
        >
          <Layers3 size={16} aria-hidden="true" /> State first
        </button>
      </div>

      <div className="min-h-[20rem] px-5 py-6">
        {route === 'pairs' ? (
          <div className="space-y-3">
            {memories.map((memory) => {
              const score = dot(query, memory.key)
              return (
                <div
                  key={memory.token}
                  className="grid gap-2 border-b border-zinc-100 pb-3 sm:grid-cols-[7rem_1fr_auto] sm:items-center"
                >
                  <div className="text-sm font-semibold text-zinc-900">
                    {memory.token}
                  </div>
                  <div className="font-mono text-sm text-zinc-600">
                    q.k = {score} &nbsp; x &nbsp; v {formatVector(memory.value)}
                  </div>
                  <div className="font-mono text-sm font-semibold text-sky-800">
                    {formatVector(scale(memory.value, score))}
                  </div>
                </div>
              )
            })}
            <div className="pt-2 text-sm text-zinc-600">
              Score each stored key, weight its value, then add the three
              answers.
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div>
              <div className="mb-3 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                compress once
              </div>
              <div
                className="grid max-w-56 grid-cols-2 gap-2"
                aria-label={`State matrix ${state.flat().join(', ')}`}
              >
                {state.flat().map((cell, index) => (
                  <div
                    key={index}
                    className={`flex aspect-square items-center justify-center rounded-md font-mono text-lg font-semibold ${cell > 0 ? 'bg-emerald-100 text-emerald-950' : cell < 0 ? 'bg-rose-100 text-rose-950' : 'bg-zinc-100 text-zinc-500'}`}
                  >
                    {cell}
                  </div>
                ))}
              </div>
              <div className="mt-3 font-mono text-sm text-zinc-600">
                S = sum k v^T
              </div>
            </div>
            <Equal
              className="hidden text-zinc-400 sm:block"
              size={22}
              aria-hidden="true"
            />
            <div>
              <div className="mb-3 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
                query once
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 font-mono text-sm leading-7 text-emerald-950">
                q^T S<br />
                {formatVector(query)} x [[{state[0].join(', ')}], [
                {state[1].join(', ')}]]
              </div>
              <div className="mt-3 text-sm text-zinc-600">
                The whole prefix is now represented by one matrix.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-950 px-5 py-4 text-white">
        <div className="text-sm text-zinc-300">Both routes return</div>
        <div className="font-mono text-xl font-semibold">
          o = {formatVector(result)}
        </div>
      </div>

      <figcaption className="border-t border-zinc-200 px-5 py-3 text-sm text-zinc-600">
        This toy uses plain dot-product linear attention. Practical variants add
        feature maps, normalization, gates, or richer updates.
      </figcaption>
    </figure>
  )
}

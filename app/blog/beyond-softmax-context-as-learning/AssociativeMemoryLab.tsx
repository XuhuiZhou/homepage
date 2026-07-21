'use client'

import { FastForward, RotateCcw, StepForward } from 'lucide-react'
import { useMemo, useState } from 'react'

type Vector = [number, number]
type Matrix = [Vector, Vector]
type Rule = 'additive' | 'delta'

const writes: {
  keyLabel: string
  valueLabel: string
  key: Vector
  value: Vector
}[] = [
  { keyLabel: 'capital', valueLabel: 'Paris', key: [1, 0], value: [1, 0] },
  { keyLabel: 'language', valueLabel: 'French', key: [0, 1], value: [-1, 0.5] },
  { keyLabel: 'capital', valueLabel: 'Tokyo', key: [1, 0], value: [0, 1] },
]

const zeroMatrix = (): Matrix => [
  [0, 0],
  [0, 0],
]

function read(state: Matrix, key: Vector): Vector {
  return [
    key[0] * state[0][0] + key[1] * state[1][0],
    key[0] * state[0][1] + key[1] * state[1][1],
  ]
}

function update(
  state: Matrix,
  key: Vector,
  value: Vector,
  rule: Rule,
  beta: number,
): Matrix {
  const prediction = read(state, key)
  const writeVector: Vector =
    rule === 'delta'
      ? [beta * (value[0] - prediction[0]), beta * (value[1] - prediction[1])]
      : value

  return [
    [
      state[0][0] + key[0] * writeVector[0],
      state[0][1] + key[0] * writeVector[1],
    ],
    [
      state[1][0] + key[1] * writeVector[0],
      state[1][1] + key[1] * writeVector[1],
    ],
  ]
}

function run(count: number, rule: Rule, beta: number) {
  return writes
    .slice(0, count)
    .reduce(
      (state, item) => update(state, item.key, item.value, rule, beta),
      zeroMatrix(),
    )
}

function format(value: number) {
  const rounded = Math.abs(value) < 0.005 ? 0 : value
  return rounded.toFixed(2).replace(/\.00$/, '')
}

function describeCapital(value: Vector) {
  if (value[0] > 0.65 && value[1] > 0.65) return 'Paris + Tokyo: a collision'
  if (value[1] > 0.65 && value[0] < 0.35) return 'Tokyo'
  if (value[0] > 0.65 && value[1] < 0.35) return 'Paris'
  return 'uncertain'
}

export default function AssociativeMemoryLab() {
  const [rule, setRule] = useState<Rule>('additive')
  const [step, setStep] = useState(0)
  const [beta, setBeta] = useState(1)
  const [query, setQuery] = useState<'capital' | 'language'>('capital')

  const state = useMemo(() => run(step, rule, beta), [step, rule, beta])
  const queryKey: Vector = query === 'capital' ? [1, 0] : [0, 1]
  const output = read(state, queryKey)
  const latest = step > 0 ? writes[step - 1] : undefined
  const previousState = step > 0 ? run(step - 1, rule, beta) : zeroMatrix()
  const oldPrediction = latest ? read(previousState, latest.key) : [0, 0]
  const error = latest
    ? [latest.value[0] - oldPrediction[0], latest.value[1] - oldPrediction[1]]
    : [0, 0]

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4">
        <div className="text-sm font-semibold text-zinc-950">
          Teach the state one association at a time
        </div>
        <div className="mt-1 text-sm text-zinc-600">
          The third write changes an old fact. Compare blind addition with an
          error-correcting delta update.
        </div>
      </div>

      <div
        className="grid grid-cols-2 border-b border-zinc-200"
        role="tablist"
        aria-label="Choose a memory update rule"
      >
        <button
          type="button"
          role="tab"
          aria-selected={rule === 'additive'}
          onClick={() => setRule('additive')}
          className={`px-3 py-3 text-sm font-medium ${rule === 'additive' ? 'bg-amber-50 text-amber-950' : 'text-zinc-500 hover:bg-zinc-50'}`}
        >
          Additive write
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={rule === 'delta'}
          onClick={() => setRule('delta')}
          className={`border-l border-zinc-200 px-3 py-3 text-sm font-medium ${rule === 'delta' ? 'bg-emerald-50 text-emerald-950' : 'text-zinc-500 hover:bg-zinc-50'}`}
        >
          Delta correction
        </button>
      </div>

      <div className="px-5 pt-5">
        <div className="grid gap-2 sm:grid-cols-3" aria-label="Write sequence">
          {writes.map((item, index) => (
            <div
              key={`${item.keyLabel}-${item.valueLabel}`}
              className={`rounded-md border px-3 py-3 text-sm transition-colors ${
                index < step
                  ? 'border-zinc-300 bg-zinc-100 text-zinc-900'
                  : index === step
                    ? 'border-sky-300 bg-sky-50 text-sky-950'
                    : 'border-zinc-200 bg-white text-zinc-400'
              }`}
            >
              <div className="text-xs font-semibold tracking-[0.1em] uppercase">
                write {index + 1}
              </div>
              <div className="mt-1 font-medium">
                {item.keyLabel} -&gt; {item.valueLabel}
              </div>
            </div>
          ))}
        </div>

        {rule === 'delta' && (
          <div className="mt-5">
            <label
              htmlFor="delta-beta"
              className="flex items-center justify-between text-sm font-medium text-zinc-800"
            >
              <span>Correction rate beta</span>
              <span className="font-mono text-zinc-600">{beta.toFixed(2)}</span>
            </label>
            <input
              id="delta-beta"
              type="range"
              min="0.25"
              max="1"
              step="0.25"
              value={beta}
              onChange={(event) => setBeta(Number(event.target.value))}
              className="mt-2 w-full accent-emerald-700"
            />
          </div>
        )}
      </div>

      <div className="grid gap-7 px-5 py-6 md:grid-cols-[1fr_1.15fr]">
        <div>
          <div className="mb-3 text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
            fast-weight matrix S
          </div>
          <div className="grid max-w-64 grid-cols-[4.5rem_1fr_1fr] gap-2">
            <div />
            <div className="text-center text-xs text-zinc-500">value 1</div>
            <div className="text-center text-xs text-zinc-500">value 2</div>
            {state.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="contents">
                <div className="flex items-center text-xs font-medium text-zinc-600">
                  {rowIndex === 0 ? 'capital' : 'language'}
                </div>
                {row.map((cell, columnIndex) => {
                  const strength = Math.min(1, Math.abs(cell))
                  return (
                    <div
                      key={`${rowIndex}-${columnIndex}`}
                      className="flex aspect-square items-center justify-center rounded-md border border-zinc-200 font-mono text-sm font-semibold text-zinc-950"
                      style={{
                        backgroundColor:
                          cell >= 0
                            ? `rgba(14, 165, 233, ${0.08 + strength * 0.3})`
                            : `rgba(244, 63, 94, ${0.08 + strength * 0.3})`,
                      }}
                    >
                      {format(cell)}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div
            className="flex flex-wrap gap-2"
            aria-label="Choose a memory query"
          >
            {(['capital', 'language'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setQuery(item)}
                aria-pressed={query === item}
                className={`rounded-md border px-3 py-2 text-sm font-medium ${query === item ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
              >
                query: {item}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-zinc-950 p-4 text-white">
            <div className="text-xs font-semibold tracking-[0.12em] text-zinc-400 uppercase">
              current read
            </div>
            <div className="mt-2 font-mono text-lg">
              [{format(output[0])}, {format(output[1])}]
            </div>
            <div className="mt-2 text-sm text-zinc-300">
              {query === 'capital'
                ? describeCapital(output)
                : step >= 2
                  ? 'French'
                  : 'not written yet'}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-zinc-200 pt-4 text-sm">
            <div>
              <div className="text-xs text-zinc-500">old read</div>
              <div className="mt-1 font-mono text-zinc-800">
                [{format(oldPrediction[0])}, {format(oldPrediction[1])}]
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">target</div>
              <div className="mt-1 font-mono text-zinc-800">
                {latest ? `[${latest.value.map(format).join(', ')}]` : '[0, 0]'}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">error</div>
              <div className="mt-1 font-mono text-zinc-800">
                [{format(error[0])}, {format(error[1])}]
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-50 px-5 py-4">
        <div className="text-sm text-zinc-600">
          {step} of {writes.length} writes applied
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStep(0)}
            className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
          <button
            type="button"
            onClick={() => setStep(writes.length)}
            className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            <FastForward size={15} aria-hidden="true" /> Run all
          </button>
          <button
            type="button"
            onClick={() =>
              setStep((current) => Math.min(writes.length, current + 1))
            }
            disabled={step === writes.length}
            className="flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <StepForward size={15} aria-hidden="true" /> Next write
          </button>
        </div>
      </div>

      <figcaption className="border-t border-zinc-200 px-5 py-3 text-sm text-zinc-600">
        With beta = 1 and an orthogonal key, the delta rule removes the old
        prediction before writing the new target. Addition can only pile the two
        facts together.
      </figcaption>
    </figure>
  )
}

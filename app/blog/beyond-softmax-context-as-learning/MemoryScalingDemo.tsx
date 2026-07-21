'use client'

import { BrainCircuit, Database, Rows3 } from 'lucide-react'
import { useState } from 'react'

const HEAD_DIMENSION = 128
const BYTES_PER_VALUE = 2

function formatBytes(bytes: number) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GiB`
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MiB`
  return `${Math.round(bytes / 1024)} KiB`
}

export default function MemoryScalingDemo() {
  const [exponent, setExponent] = useState(16)
  const tokens = 2 ** exponent
  const kvBytes = 2 * tokens * HEAD_DIMENSION * BYTES_PER_VALUE
  const stateBytes = HEAD_DIMENSION ** 2 * BYTES_PER_VALUE
  const ratio = kvBytes / stateBytes
  const kvWidth = 100
  const stateWidth = Math.max(4, 100 / Math.log2(ratio + 2))

  return (
    <figure className="not-prose my-10 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-950">
              What has to survive decoding?
            </div>
            <div className="mt-1 text-sm text-zinc-600">
              A simplified per-head comparison with fp16 and d = 128.
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
            <Rows3 size={16} aria-hidden="true" />
            {tokens.toLocaleString()} tokens
          </div>
        </div>
      </div>

      <div className="px-5 pt-5">
        <label
          htmlFor="context-length"
          className="flex items-center justify-between gap-4 text-sm font-medium text-zinc-800"
        >
          <span>Context length</span>
          <span className="font-mono text-zinc-600">2^{exponent}</span>
        </label>
        <input
          id="context-length"
          type="range"
          min="10"
          max="20"
          step="1"
          value={exponent}
          onChange={(event) => setExponent(Number(event.target.value))}
          className="mt-3 w-full accent-zinc-900"
        />
        <div className="mt-1 flex justify-between text-xs text-zinc-500">
          <span>1K</span>
          <span>1M</span>
        </div>
      </div>

      <div className="space-y-6 px-5 py-6">
        <div className="grid gap-3 sm:grid-cols-[11rem_1fr_auto] sm:items-center">
          <div className="flex items-center gap-3">
            <Database size={18} className="text-sky-700" aria-hidden="true" />
            <div>
              <div className="text-sm font-semibold text-zinc-900">
                KV cache
              </div>
              <div className="text-xs text-zinc-500">2 x N x d values</div>
            </div>
          </div>
          <div className="h-5 overflow-hidden rounded-sm bg-zinc-100">
            <div
              className="h-full rounded-sm bg-sky-500 transition-[width] duration-300"
              style={{ width: `${kvWidth}%` }}
            />
          </div>
          <div className="font-mono text-sm font-semibold text-zinc-800 sm:min-w-24 sm:text-right">
            {formatBytes(kvBytes)}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[11rem_1fr_auto] sm:items-center">
          <div className="flex items-center gap-3">
            <BrainCircuit
              size={18}
              className="text-emerald-700"
              aria-hidden="true"
            />
            <div>
              <div className="text-sm font-semibold text-zinc-900">
                Matrix state
              </div>
              <div className="text-xs text-zinc-500">d x d values</div>
            </div>
          </div>
          <div className="h-5 overflow-hidden rounded-sm bg-zinc-100">
            <div
              className="h-full rounded-sm bg-emerald-500 transition-[width] duration-300"
              style={{ width: `${stateWidth}%` }}
            />
          </div>
          <div className="font-mono text-sm font-semibold text-zinc-800 sm:min-w-24 sm:text-right">
            {formatBytes(stateBytes)}
          </div>
        </div>
      </div>

      <div className="grid border-t border-zinc-200 bg-zinc-50 sm:grid-cols-2">
        <div className="px-5 py-4 sm:border-r sm:border-zinc-200">
          <div className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
            at this length
          </div>
          <div className="mt-1 text-xl font-semibold text-zinc-950">
            {ratio.toLocaleString(undefined, { maximumFractionDigits: 0 })}x
          </div>
          <div className="text-sm text-zinc-600">
            more stored values in the toy KV cache
          </div>
        </div>
        <div className="border-t border-zinc-200 px-5 py-4 sm:border-t-0">
          <div className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase">
            the trade
          </div>
          <div className="mt-1 text-sm leading-6 text-zinc-700">
            The cache preserves every item. The state keeps one fixed-size
            summary and must learn what to retain.
          </div>
        </div>
      </div>

      <figcaption className="border-t border-zinc-200 px-5 py-3 text-sm text-zinc-600">
        Illustrative storage only: real architectures use many heads and layers,
        and recurrent variants may keep additional state. Bar width is
        logarithmic so both remain visible.
      </figcaption>
    </figure>
  )
}

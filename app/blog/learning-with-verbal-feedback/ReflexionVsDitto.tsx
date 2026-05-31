'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * ReflexionVsDitto
 * A split-screen contrasting inference-time verbal feedback (Reflexion: transient)
 * with internalized verbal feedback (Ditto: persistent).
 *
 * LEFT: a per-episode memory buffer fills with reflection text, then WIPES blank
 * when the episode ends — the lesson must be re-earned every time.
 * RIGHT: the same critique flows into the weights; neurons light up and STAY lit,
 * accumulating across episodes — no feedback needed at test time.
 *
 * A single episode clock (React state) synchronizes both panels.
 * Continuous motion (flowing arrows, pulses, ripples) is pure CSS keyframes,
 * so the figure is fully readable in its resting state.
 */

// ---- palette (design tokens) ----
const C = {
  mid: '#94a3b8',
  light: '#cbd5e1',
  faint: '#e2e8f0',
  emerald: '#10b981',
  emeraldSoft: '#6ee7b7',
  emeraldWash: '#ecfdf5',
  indigo: '#818cf8',
  red: '#dc2626',
  violet: '#7c3aed',
  amber: '#f59e0b',
  textStrong: '#0f172a',
  text2: '#334155',
  text3: '#475569',
  textMuted: '#64748b',
  textFaint: '#94a3b8',
  card: '#ffffff',
  panel: '#f8fafc',
  grid: '#eef0f2',
  border: '#e5e7eb',
}

// reflection "lessons" surfaced each episode (left panel text + which the right panel internalizes)
const LESSONS = [
  'Check units before computing.',
  'Cite the source line, not the page.',
  'Ask one clarifying question first.',
  'Stop when the user says enough.',
]

// neuron grid: 8 columns x 5 rows = 40 weights
const COLS = 8
const ROWS = 5
const TOTAL = COLS * ROWS

// how many neurons are lit by the END of a given episode index (0-based)
const LIT_BY_EPISODE = [7, 15, 25, 38]

// a deterministic "scatter" order so lit neurons feel organic, not row-by-row
const LIGHT_ORDER = [
  18, 3, 27, 11, 34, 6, 21, 9, 30, 14, 1, 25, 38, 16, 7, 23,
  12, 35, 4, 29, 19, 8, 32, 2, 26, 15, 39, 10, 22, 5, 31, 17,
  0, 28, 13, 36, 20, 24, 33, 37,
]

const EPISODES = LESSONS.length
const PHASE_MS = 2200 // reflect/fill phase
const WIPE_MS = 1100 // wipe / settle phase

export default function ReflexionVsDitto() {
  // episode index 0..EPISODES-1, looping
  const [episode, setEpisode] = useState(0)
  // phase: 'reflect' (filling / lighting) or 'end' (left wipes, right settles)
  const [phase, setPhase] = useState<'reflect' | 'end'>('reflect')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    // respect reduced motion: hold a complete, representative resting state
    const mq =
      typeof window !== 'undefined' && 'matchMedia' in window
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null
    if (mq && mq.matches) {
      setEpisode(EPISODES - 1)
      setPhase('reflect')
      return
    }

    const tick = () => {
      // reflect phase -> end phase
      setPhase('end')
      timer.current = setTimeout(() => {
        if (!mounted.current) return
        setEpisode((e) => (e + 1) % EPISODES)
        setPhase('reflect')
        timer.current = setTimeout(tick, PHASE_MS)
      }, WIPE_MS)
    }
    timer.current = setTimeout(tick, PHASE_MS)

    return () => {
      mounted.current = false
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  // neurons lit "through" the current episode (cumulative, persistent)
  const litCount = LIT_BY_EPISODE[episode]
  const litSet = new Set(LIGHT_ORDER.slice(0, litCount))
  // neurons that newly lit at the start of this episode (for ripple emphasis)
  const prevCount = episode === 0 ? 0 : LIT_BY_EPISODE[episode - 1]
  const freshSet = new Set(LIGHT_ORDER.slice(prevCount, litCount))

  // left-panel memory lines: in 'reflect' they are present, in 'end' they wipe
  const wiping = phase === 'end'

  return (
    <figure className="fullwidth not-prose my-8">
      <div
        role="img"
        aria-label="Split-screen comparison. Left, inference-time Reflexion: a verbal reflection accumulates into a per-episode memory buffer that wipes blank when the episode ends, so the lesson must be re-earned each time. Right, internalized Ditto: the same verbal critique flows into a grid of weight neurons that light up and stay lit, accumulating across episodes so no feedback is needed at test time."
        className="rvd-root mx-auto w-full max-w-[920px] overflow-hidden rounded-2xl border bg-white"
        style={{ borderColor: C.border, boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.05)' }}
      >
        {/* header: shared episode clock */}
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6"
          style={{ borderBottom: `1px solid ${C.grid}`, background: C.panel }}
        >
          <div className="flex items-center gap-2">
            <span
              className="rvd-clockdot inline-block h-2 w-2 rounded-full"
              style={{ background: C.emerald }}
              aria-hidden="true"
            />
            <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: C.textMuted }}>
              Same insight, opposite ontology
            </span>
          </div>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: EPISODES }).map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === episode ? 18 : 6,
                  background: i <= episode ? C.emerald : C.faint,
                }}
              />
            ))}
            <span className="ml-2 text-[12px] font-semibold tabular-nums" style={{ color: C.text2 }}>
              Episode {episode + 1}
            </span>
          </div>
        </div>

        {/* panels */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* ============ LEFT: Reflexion (transient) ============ */}
          <section
            className="relative px-4 py-5 sm:px-6"
            style={{ borderRight: `1px solid ${C.grid}` }}
          >
            <PanelHeader
              tag="Inference-time"
              title="Reflexion"
              dot={C.indigo}
              note="verbal memory, in context"
            />

            {/* attempt -> reflection flow */}
            <div className="mt-4 flex items-stretch gap-2">
              <Chip label="Attempt" color={C.mid} />
              <FlowArrow color={C.indigo} />
              <Chip label="Reflect" color={C.indigo} accent />
            </div>

            {/* MEMORY panel */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.textFaint }}>
                  Memory (context buffer)
                </span>
                <span
                  className="text-[10px] font-medium tabular-nums"
                  style={{ color: wiping ? C.red : C.textFaint }}
                >
                  {wiping ? 'episode ends — wiping' : `${episode + 1} lesson`}
                </span>
              </div>

              <div
                className="rvd-memory relative min-h-[112px] rounded-xl p-3"
                style={{
                  background: C.panel,
                  border: `1px dashed ${C.border}`,
                }}
              >
                {/* the single fresh lesson held this episode */}
                <MemoryLine
                  text={LESSONS[episode]}
                  color={C.indigo}
                  wiping={wiping}
                />

                {/* wipe overlay sweeps across at episode end */}
                <div
                  className={wiping ? 'rvd-wipe rvd-wipe-on' : 'rvd-wipe'}
                  aria-hidden="true"
                />
              </div>

              {/* episode-end divider */}
              <div className="mt-3 flex items-center gap-2" aria-hidden="true">
                <span className="h-px flex-1" style={{ background: C.grid }} />
                <span
                  className="text-[10px] font-medium uppercase tracking-wider transition-opacity duration-300"
                  style={{ color: C.red, opacity: wiping ? 1 : 0.35 }}
                >
                  episode ends → buffer cleared
                </span>
                <span className="h-px flex-1" style={{ background: C.grid }} />
              </div>
            </div>

            <p className="mt-4 text-[12px] leading-snug" style={{ color: C.text3 }}>
              The lesson lives in the prompt. It{' '}
              <span style={{ color: C.red, fontWeight: 600 }}>evaporates</span> when the
              episode ends and must be re-earned.
            </p>
          </section>

          {/* ============ RIGHT: Ditto (persistent) ============ */}
          <section className="relative px-4 py-5 sm:px-6">
            <PanelHeader
              tag="Internalized"
              title="Ditto"
              dot={C.emerald}
              note="verbal critique, in the weights"
            />

            {/* critique -> weights flow */}
            <div className="mt-4 flex items-stretch gap-2">
              <Chip label="Critique" color={C.emerald} accent />
              <FlowArrow color={C.emerald} />
              <Chip label="Update Δθ" color={C.violet} />
            </div>

            {/* neuron grid = the weights */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.textFaint }}>
                  Weights (internalized)
                </span>
                <span className="text-[10px] font-medium tabular-nums" style={{ color: C.emerald }}>
                  {litCount}/{TOTAL} retained
                </span>
              </div>

              <div
                className="rounded-xl p-3"
                style={{ background: C.emeraldWash, border: `1px solid ${C.faint}` }}
              >
                <div
                  className="mx-auto grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
                    maxWidth: 280,
                  }}
                  aria-hidden="true"
                >
                  {Array.from({ length: TOTAL }).map((_, i) => {
                    const lit = litSet.has(i)
                    const fresh = freshSet.has(i)
                    return (
                      <span
                        key={i}
                        className={
                          'rvd-neuron' +
                          (lit ? ' rvd-neuron-lit' : '') +
                          (fresh ? ' rvd-neuron-fresh' : '')
                        }
                      >
                        <span className="rvd-neuron-core" />
                        {fresh && <span className="rvd-neuron-ripple" />}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* persistence track (mirrors the left divider position) */}
              <div className="mt-3 flex items-center gap-2" aria-hidden="true">
                <span className="h-px flex-1" style={{ background: C.grid }} />
                <span
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: C.emerald }}
                >
                  episode ends → weights kept
                </span>
                <span className="h-px flex-1" style={{ background: C.grid }} />
              </div>
            </div>

            <p className="mt-4 text-[12px] leading-snug" style={{ color: C.text3 }}>
              The lesson lives in the parameters. It{' '}
              <span style={{ color: C.emerald, fontWeight: 600 }}>persists</span> and
              transfers — no feedback needed at test time.
            </p>
          </section>
        </div>
      </div>

      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure:</strong> Same insight (reflect in language, then improve), opposite
        ontology &mdash; Reflexion writes the lesson into a context buffer that evaporates
        with the episode; Ditto writes it into the weights, where it persists and transfers,
        needing no feedback at test time.
      </figcaption>

      <style>{`
        /* ===== shared clock pulse ===== */
        .rvd-clockdot {
          animation: rvd-clockpulse 1.6s ease-in-out infinite;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5);
        }
        @keyframes rvd-clockpulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
          50%      { box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); }
        }

        /* ===== flowing arrows (continuous) ===== */
        .rvd-flow-line {
          stroke-dasharray: 6 5;
          animation: rvd-flow 0.9s linear infinite;
        }
        @keyframes rvd-flow {
          to { stroke-dashoffset: -22; }
        }

        /* ===== left: memory line ===== */
        .rvd-memline {
          transition: opacity 0.45s ease, transform 0.45s ease, filter 0.45s ease;
        }
        .rvd-memline-in {
          animation: rvd-typein 0.6s ease both;
        }
        .rvd-memline-out {
          opacity: 0;
          transform: translateX(10px);
          filter: blur(2px);
        }
        @keyframes rvd-typein {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ===== left: wipe sweep across the memory panel ===== */
        .rvd-wipe {
          position: absolute;
          inset: 0;
          border-radius: 12px;
          pointer-events: none;
          opacity: 0;
          background: linear-gradient(
            100deg,
            rgba(248, 250, 252, 0) 0%,
            rgba(220, 38, 38, 0.10) 40%,
            rgba(248, 250, 252, 0.92) 55%,
            rgba(248, 250, 252, 0) 100%
          );
          transform: translateX(-110%);
        }
        .rvd-wipe-on {
          opacity: 1;
          animation: rvd-sweep 1s ease-in-out both;
        }
        @keyframes rvd-sweep {
          0%   { transform: translateX(-110%); }
          100% { transform: translateX(110%); }
        }

        /* ===== right: neurons ===== */
        .rvd-neuron {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 1 / 1;
          width: 100%;
        }
        .rvd-neuron-core {
          display: block;
          width: 62%;
          height: 62%;
          border-radius: 9999px;
          background: ${C.faint};
          box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.25);
          transition: background 0.5s ease, box-shadow 0.5s ease, transform 0.5s ease;
        }
        .rvd-neuron-lit .rvd-neuron-core {
          background: radial-gradient(circle at 35% 30%, ${C.emeraldSoft}, ${C.emerald} 70%);
          box-shadow:
            0 0 0 1px rgba(124, 58, 237, 0.18),
            0 0 8px rgba(16, 185, 129, 0.45);
        }
        /* persistent lit neurons gently breathe so the panel stays alive */
        .rvd-neuron-lit .rvd-neuron-core {
          animation: rvd-breathe 3.2s ease-in-out infinite;
        }
        @keyframes rvd-breathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.07); }
        }
        /* freshly internalized this episode: pop + ripple */
        .rvd-neuron-fresh .rvd-neuron-core {
          background: radial-gradient(circle at 35% 30%, #c4b5fd, ${C.violet} 72%);
          box-shadow:
            0 0 0 1px rgba(124, 58, 237, 0.3),
            0 0 10px rgba(124, 58, 237, 0.5);
          animation: rvd-pop 0.6s ease both, rvd-breathe 3.2s ease-in-out 0.6s infinite;
        }
        @keyframes rvd-pop {
          0%   { transform: scale(0.5); }
          60%  { transform: scale(1.18); }
          100% { transform: scale(1); }
        }
        .rvd-neuron-ripple {
          position: absolute;
          width: 62%;
          height: 62%;
          border-radius: 9999px;
          border: 1.5px solid rgba(124, 58, 237, 0.55);
          animation: rvd-ripple 1.1s ease-out infinite;
          pointer-events: none;
        }
        @keyframes rvd-ripple {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.1); opacity: 0; }
        }

        /* ===== chip subtle idle glow on accent chips ===== */
        .rvd-chip-accent {
          animation: rvd-chipglow 2.4s ease-in-out infinite;
        }
        @keyframes rvd-chipglow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
          50%      { box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12); }
        }

        /* ===== reduced motion: hold a complete, static figure ===== */
        @media (prefers-reduced-motion: reduce) {
          .rvd-clockdot,
          .rvd-flow-line,
          .rvd-memline,
          .rvd-memline-in,
          .rvd-wipe,
          .rvd-wipe-on,
          .rvd-neuron-core,
          .rvd-neuron-fresh .rvd-neuron-core,
          .rvd-neuron-ripple,
          .rvd-chip-accent {
            animation: none !important;
          }
          .rvd-wipe { opacity: 0 !important; }
          .rvd-neuron-ripple { display: none; }
          .rvd-memline { opacity: 1 !important; transform: none !important; filter: none !important; }
        }
      `}</style>
    </figure>
  )
}

/* ---------- small presentational pieces ---------- */

function PanelHeader({
  tag,
  title,
  dot,
  note,
}: {
  tag: string
  title: string
  dot: string
  note: string
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: C.textFaint }}>
          {tag}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: dot }} aria-hidden="true" />
          <h3 className="text-[15px] font-semibold leading-none" style={{ color: C.textStrong }}>
            {title}
          </h3>
        </div>
      </div>
      <span className="max-w-[44%] text-right text-[10.5px] leading-tight" style={{ color: C.textMuted }}>
        {note}
      </span>
    </div>
  )
}

function Chip({
  label,
  color,
  accent = false,
}: {
  label: string
  color: string
  accent?: boolean
}) {
  return (
    <span
      className={
        'inline-flex flex-1 items-center justify-center rounded-lg px-2 py-2 text-center text-[11px] font-medium' +
        (accent ? ' rvd-chip-accent' : '')
      }
      style={{
        color,
        background: accent ? 'rgba(16,185,129,0.06)' : C.panel,
        border: `1px solid ${accent ? 'rgba(16,185,129,0.28)' : C.border}`,
      }}
    >
      {label}
    </span>
  )
}

function FlowArrow({ color }: { color: string }) {
  return (
    <svg
      className="self-center"
      width="40"
      height="20"
      viewBox="0 0 40 20"
      fill="none"
      aria-hidden="true"
      style={{ flex: '0 0 auto' }}
    >
      <line className="rvd-flow-line" x1="2" y1="10" x2="30" y2="10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M28 5 L36 10 L28 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function MemoryLine({
  text,
  color,
  wiping,
}: {
  text: string
  color: string
  wiping: boolean
}) {
  return (
    <div
      key={text}
      className={'rvd-memline ' + (wiping ? 'rvd-memline-out' : 'rvd-memline-in')}
    >
      <div className="flex items-start gap-2">
        <span
          className="mt-[3px] inline-block h-2.5 w-2.5 flex-none rounded-sm"
          style={{ background: color, opacity: 0.85 }}
          aria-hidden="true"
        />
        <span className="text-[12.5px] leading-snug" style={{ color: C.text2 }}>
          &ldquo;{text}&rdquo;
        </span>
      </div>
    </div>
  )
}
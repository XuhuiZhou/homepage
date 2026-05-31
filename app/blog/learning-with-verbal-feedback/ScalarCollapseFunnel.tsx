'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/**
 * ScalarCollapseFunnel
 * Thesis image: rich multi-dimensional verbal feedback being compressed into
 * a single scalar number. Toggle between "scalar reward" (collapse to one grey
 * number through a funnel) and "verbal feedback" (strands reroute around the
 * funnel and stay coloured + intact as critique chips).
 */

type Dimension = {
  id: string
  label: string
  color: string
  critique: string
  /** vertical anchor on the right edge */
  y: number
}

const DIMENSIONS: Dimension[] = [
  {
    id: 'believable',
    label: 'Believable',
    color: '#10b981',
    critique: 'polished, broke character turn 3',
    y: 70,
  },
  {
    id: 'in-character',
    label: 'In character',
    color: '#818cf8',
    critique: 'voice drifted formal under pressure',
    y: 130,
  },
  {
    id: 'empathetic',
    label: 'Empathetic',
    color: '#f59e0b',
    critique: 'warm open, rushed the close',
    y: 190,
  },
  {
    id: 'hidden-goal',
    label: 'Hit the hidden goal',
    color: '#7c3aed',
    critique: 'surfaced the refund only late',
    y: 250,
  },
  {
    id: 'right-length',
    label: 'Right length',
    color: '#0ea5e9',
    critique: 'two turns longer than needed',
    y: 310,
  },
]

// Funnel geometry (SVG user units; viewBox 0 0 760 380)
const RIGHT_X = 690 // where strands start (right edge anchors)
const FUNNEL_MOUTH_X = 430 // wide opening of the funnel
const FUNNEL_TIP_X = 250 // narrow end / spout
const FUNNEL_TOP_Y = 110
const FUNNEL_BOT_Y = 270
const FUNNEL_MID_Y = (FUNNEL_TOP_Y + FUNNEL_BOT_Y) / 2 // 190
const SPOUT_HALF = 14
const NUMBER_X = 120 // where the grey "0.6" sits

/** Path that funnels a strand from its right anchor to the funnel spout. */
function scalarPath(y: number): string {
  // gentle curve from the right anchor into the wide mouth, then converge to mid
  const c1x = RIGHT_X - 70
  const c2x = FUNNEL_MOUTH_X + 60
  return [
    `M ${RIGHT_X} ${y}`,
    `C ${c1x} ${y} ${c2x} ${y} ${FUNNEL_MOUTH_X} ${y}`,
    `C ${FUNNEL_MOUTH_X - 60} ${y} ${FUNNEL_TIP_X + 70} ${FUNNEL_MID_Y} ${FUNNEL_TIP_X} ${FUNNEL_MID_Y}`,
  ].join(' ')
}

/** Path that reroutes a strand AROUND the funnel, arriving intact on the left. */
function verbalPath(y: number, index: number): string {
  // splay outward to dodge the funnel body, then settle to the chip row on the left
  const targetY = 56 + index * 64 // left-side chip anchors
  const bow = y < FUNNEL_MID_Y ? -1 : 1 // arc above or below
  const midX = (RIGHT_X + 200) / 2
  const midY = (y + targetY) / 2 + bow * 46
  return [
    `M ${RIGHT_X} ${y}`,
    `C ${RIGHT_X - 80} ${y} ${midX + 60} ${midY} ${midX} ${midY}`,
    `C ${midX - 120} ${midY} ${260} ${targetY} ${200} ${targetY}`,
  ].join(' ')
}

export default function ScalarCollapseFunnel() {
  const [mode, setMode] = useState<'scalar' | 'verbal'>('scalar')
  const isScalar = mode === 'scalar'

  return (
    <figure className="fullwidth not-prose my-8">
      <div
        role="img"
        aria-label="A funnel diagram showing five coloured strands of verbal feedback (believable, in character, empathetic, hit the hidden goal, right length) flowing into a funnel that collapses them into a single grey number 0.6. A toggle switches to verbal feedback mode, where the strands reroute around the funnel and stay coloured, ending in short critique chips."
        className="mx-auto max-w-[820px] rounded-2xl border border-[#e5e7eb] bg-white px-3 py-5 shadow-sm sm:px-6"
      >
        {/* Toggle pill */}
        <div className="mb-3 flex items-center justify-center">
          <div className="relative inline-flex items-center rounded-full border border-[#e5e7eb] bg-[#f8fafc] p-1 text-[12px] font-medium">
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="absolute inset-y-1 w-[120px] rounded-full shadow-sm"
              style={{
                left: isScalar ? 4 : 124,
                background: isScalar ? '#94a3b8' : '#10b981',
              }}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => setMode('scalar')}
              className="relative z-10 w-[120px] rounded-full px-3 py-1.5 text-center transition-colors"
              style={{ color: isScalar ? '#ffffff' : '#64748b' }}
              aria-pressed={isScalar}
            >
              scalar reward
            </button>
            <button
              type="button"
              onClick={() => setMode('verbal')}
              className="relative z-10 w-[120px] rounded-full px-3 py-1.5 text-center transition-colors"
              style={{ color: !isScalar ? '#ffffff' : '#64748b' }}
              aria-pressed={!isScalar}
            >
              verbal feedback
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 870 380"
            width="100%"
            height="auto"
            className="block min-w-[680px]"
            role="presentation"
          >
            <defs>
              <linearGradient id="scf-funnel-fill" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#e2e8f0" />
              </linearGradient>
              {/* soft fade mask applied at the funnel mouth so colour bleeds to grey */}
              <linearGradient id="scf-grey-fade" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0" />
                <stop offset="55%" stopColor="#cbd5e1" stopOpacity="0.0" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.9" />
              </linearGradient>
              {DIMENSIONS.map((d) => (
                <linearGradient
                  key={d.id}
                  id={`scf-strand-${d.id}`}
                  x1="1"
                  y1="0"
                  x2="0"
                  y2="0"
                >
                  <stop offset="0%" stopColor={d.color} stopOpacity="0.95" />
                  <stop offset="62%" stopColor={d.color} stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.85" />
                </linearGradient>
              ))}
            </defs>

            {/* ---- FUNNEL BODY (only meaningful in scalar mode) ---- */}
            <g
              className="scf-funnel"
              style={{ opacity: isScalar ? 1 : 0.18 }}
            >
              <path
                d={`M ${FUNNEL_MOUTH_X} ${FUNNEL_TOP_Y}
                    L ${FUNNEL_TIP_X} ${FUNNEL_MID_Y - SPOUT_HALF}
                    L ${FUNNEL_TIP_X - 36} ${FUNNEL_MID_Y - SPOUT_HALF}
                    L ${FUNNEL_TIP_X - 36} ${FUNNEL_MID_Y + SPOUT_HALF}
                    L ${FUNNEL_TIP_X} ${FUNNEL_MID_Y + SPOUT_HALF}
                    L ${FUNNEL_MOUTH_X} ${FUNNEL_BOT_Y} Z`}
                fill="url(#scf-funnel-fill)"
                stroke="#cbd5e1"
                strokeWidth={1.5}
              />
              {/* mouth opening highlight */}
              <line
                x1={FUNNEL_MOUTH_X}
                y1={FUNNEL_TOP_Y}
                x2={FUNNEL_MOUTH_X}
                y2={FUNNEL_BOT_Y}
                stroke="#cbd5e1"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <text
                x={(FUNNEL_MOUTH_X + FUNNEL_TIP_X) / 2 + 8}
                y={FUNNEL_BOT_Y + 22}
                textAnchor="middle"
                fontSize="10"
                fill="#94a3b8"
              >
                projection &rarr; one number
              </text>
            </g>

            {/* ---- STRANDS ---- */}
            {DIMENSIONS.map((d, i) => {
              const sPath = scalarPath(d.y)
              const vPath = verbalPath(d.y, i)
              const path = isScalar ? sPath : vPath
              return (
                <g key={d.id}>
                  {/* base strand line */}
                  <motion.path
                    d={path}
                    fill="none"
                    stroke={
                      isScalar ? `url(#scf-strand-${d.id})` : d.color
                    }
                    strokeWidth={isScalar ? 3 : 3.5}
                    strokeLinecap="round"
                    initial={false}
                    animate={{ d: path }}
                    transition={{
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ opacity: 0.9 }}
                  />
                  {/* flowing dashed overlay = the travelling particles */}
                  <motion.path
                    className="scf-flow"
                    d={path}
                    fill="none"
                    stroke={isScalar ? '#94a3b8' : d.color}
                    strokeWidth={isScalar ? 3.2 : 3.6}
                    strokeLinecap="round"
                    strokeDasharray="2 26"
                    initial={false}
                    animate={{ d: path }}
                    transition={{
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      animationDelay: `${i * -0.5}s`,
                      opacity: 0.95,
                    }}
                  />
                </g>
              )
            })}

            {/* ---- RIGHT-SIDE SOURCE LABELS (always present) ---- */}
            <g>
              <text
                x={RIGHT_X + 8}
                y={34}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
                fontWeight={600}
              >
                feedback on a simulated-user rollout
              </text>
              {DIMENSIONS.map((d) => (
                <g key={`src-${d.id}`}>
                  <circle cx={RIGHT_X} cy={d.y} r={4.5} fill={d.color} />
                  <circle
                    cx={RIGHT_X}
                    cy={d.y}
                    r={8}
                    fill="none"
                    stroke={d.color}
                    strokeOpacity={0.35}
                    strokeWidth={1.5}
                    className="scf-source-pulse"
                  />
                  <text
                    x={RIGHT_X + 14}
                    y={d.y + 4}
                    fontSize="11.5"
                    fill="#334155"
                    fontWeight={600}
                  >
                    {d.label}
                  </text>
                </g>
              ))}
            </g>

            {/* ---- OUTPUT: SCALAR NUMBER vs VERBAL CHIPS ---- */}
            <AnimatePresence mode="wait">
              {isScalar ? (
                <motion.g
                  key="scalar-out"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <text
                    x={NUMBER_X}
                    y={FUNNEL_MID_Y + 6}
                    textAnchor="middle"
                    fontSize="13"
                    fill="#94a3b8"
                  />
                  <g className="scf-number">
                    <text
                      x={NUMBER_X}
                      y={FUNNEL_MID_Y + 26}
                      textAnchor="middle"
                      fontSize="72"
                      fontWeight={700}
                      fill="#94a3b8"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      0.6
                    </text>
                  </g>
                  <text
                    x={NUMBER_X}
                    y={FUNNEL_MID_Y + 60}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#94a3b8"
                  >
                    scalar reward
                  </text>
                  <text
                    x={NUMBER_X}
                    y={FUNNEL_MID_Y + 78}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#cbd5e1"
                  >
                    how good &mdash; nothing more
                  </text>
                </motion.g>
              ) : (
                <motion.g
                  key="verbal-out"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {DIMENSIONS.map((d, i) => {
                    const cy = 56 + i * 64
                    return (
                      <motion.g
                        key={`chip-${d.id}`}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 + i * 0.07, duration: 0.4 }}
                      >
                        <rect
                          x={18}
                          y={cy - 22}
                          width={184}
                          height={44}
                          rx={10}
                          fill="#ffffff"
                          stroke={d.color}
                          strokeWidth={1.5}
                        />
                        <rect
                          x={18}
                          y={cy - 22}
                          width={6}
                          height={44}
                          rx={3}
                          fill={d.color}
                        />
                        <text
                          x={34}
                          y={cy - 5}
                          fontSize="11"
                          fontWeight={700}
                          fill={d.color}
                        >
                          {d.label}
                        </text>
                        <text x={34} y={cy + 11} fontSize="10" fill="#475569">
                          {d.critique}
                        </text>
                      </motion.g>
                    )
                  })}
                </motion.g>
              )}
            </AnimatePresence>

            {/* arrival pulse target marker (scalar mode) */}
            {isScalar && (
              <circle
                cx={FUNNEL_TIP_X - 36}
                cy={FUNNEL_MID_Y}
                r={5}
                fill="#94a3b8"
                className="scf-arrival"
              />
            )}
          </svg>
        </div>

        {/* legend / caption-in-figure */}
        <p className="mt-2 px-2 text-center text-[11px] text-[#94a3b8]">
          {isScalar
            ? 'five dimensions of critique → collapsed into 0.6'
            : 'five dimensions of critique → kept intact, each with its own note'}
        </p>
      </div>

      <style>{`
        /* travelling particles flowing toward the funnel / chips */
        .scf-flow {
          animation: scf-flow-move 1.9s linear infinite;
        }
        @keyframes scf-flow-move {
          from { stroke-dashoffset: 280; }
          to   { stroke-dashoffset: 0; }
        }
        /* the grey number gently pulses as information "arrives" */
        .scf-number {
          transform-box: fill-box;
          transform-origin: center;
          animation: scf-pulse 1.9s ease-in-out infinite;
        }
        @keyframes scf-pulse {
          0%, 100% { opacity: 0.78; transform: scale(0.985); }
          50%      { opacity: 1;    transform: scale(1.025); }
        }
        .scf-arrival {
          animation: scf-arrival-pulse 1.9s ease-out infinite;
        }
        @keyframes scf-arrival-pulse {
          0%   { r: 4; opacity: 0.9; }
          60%  { r: 14; opacity: 0; }
          100% { r: 14; opacity: 0; }
        }
        .scf-source-pulse {
          transform-box: fill-box;
          transform-origin: center;
          animation: scf-source 2.4s ease-in-out infinite;
        }
        @keyframes scf-source {
          0%, 100% { opacity: 0.15; transform: scale(0.9); }
          50%      { opacity: 0.5;  transform: scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .scf-flow,
          .scf-number,
          .scf-arrival,
          .scf-source-pulse {
            animation: none !important;
          }
        }
      `}</style>

      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure:</strong> a scalar is a lossy projection of the verbal
        critique; toggle to see the dimensions kept intact (&ldquo;verbal&rdquo;)
        vs collapsed to one number (&ldquo;scalar&rdquo;). Following Ditto&rsquo;s
        framing, a scalar says only <em>how good</em>, while verbal feedback says{' '}
        <em>what</em>, <em>why</em>, and <em>how</em>.
      </figcaption>
    </figure>
  )
}
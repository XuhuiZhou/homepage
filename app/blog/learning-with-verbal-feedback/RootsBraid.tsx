'use client'

import { useId } from 'react'

export default function RootsBraid() {
  // Unique id prefix so gradient/filter ids never collide across instances.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  // Source definitions: x position across the top, color, label, gloss.
  const sources = [
    {
      key: 'lupi',
      x: 130,
      color: '#7c3aed', // violet — privileged information
      label: 'Privileged Information (LUPI)',
      gloss: 'feedback at train, gone at test',
    },
    {
      key: 'distill',
      x: 350,
      color: '#818cf8', // indigo — distillation
      label: 'Distillation',
      gloss: 'keep a teacher in a student',
    },
    {
      key: 'her',
      x: 570,
      color: '#f59e0b', // amber — hindsight relabeling
      label: 'Hindsight Relabeling (HER/HIR)',
      gloss: 're-run as if you knew the answer',
    },
    {
      key: 'grpo',
      x: 790,
      color: '#10b981', // emerald — on-policy RL
      label: 'On-Policy RL (GRPO)',
      gloss: 'sample rollouts, grade them',
    },
  ]

  // Geometry constants.
  const topY = 96 // bottom of source cards where streams begin
  const convX = 450 // x of convergence point
  const convY = 300 // y of convergence point
  const dittoY = 372 // y of the Ditto node

  // Build a smooth bezier from a source down to the convergence point.
  const streamPath = (sx: number) => {
    const c1y = topY + 90
    const c2y = convY - 70
    return `M ${sx} ${topY} C ${sx} ${c1y}, ${convX} ${c2y}, ${convX} ${convY}`
  }

  return (
    <figure className="fullwidth not-prose my-8">
      <div
        role="img"
        aria-label="Genealogy diagram: four methodological roots — Privileged Information (LUPI), Distillation, Hindsight Relabeling, and On-Policy RL (GRPO) — flow downward and braid into a single emerald rope ending in a node labeled Ditto."
        className="overflow-x-auto rounded-2xl border border-[#e5e7eb] bg-[#ffffff] shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
      >
        <div className="min-w-[760px] px-2 py-3">
          <svg
            viewBox="0 0 900 420"
            width="100%"
            height="auto"
            className={`rb-${uid}-svg`}
            style={{ display: 'block' }}
          >
            <defs>
              {/* Soft glow for the convergence + ditto pulses */}
              <filter
                id={`rb-${uid}-glow`}
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
              >
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Thick emerald rope gradient */}
              <linearGradient
                id={`rb-${uid}-rope`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Ditto node radial */}
              <radialGradient id={`rb-${uid}-ditto`} cx="50%" cy="38%" r="70%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
              </radialGradient>
            </defs>

            {/* faint baseline gridline under the sources */}
            <line
              x1="40"
              y1={topY + 4}
              x2="860"
              y2={topY + 4}
              stroke="#eef0f2"
              strokeWidth="1"
            />

            {/* ===== STREAMS (drawn first, under nodes) ===== */}
            {sources.map((s, i) => {
              const d = streamPath(s.x)
              return (
                <g key={s.key}>
                  {/* static base stream — readable even with no animation */}
                  <path
                    d={d}
                    fill="none"
                    stroke={s.color}
                    strokeOpacity="0.22"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  {/* flowing dashes traveling downward */}
                  <path
                    d={d}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray="2 22"
                    className={`rb-${uid}-flow rb-${uid}-flow-${i}`}
                    style={{ animationDelay: `${i * -0.45}s` }}
                  />
                </g>
              )
            })}

            {/* ===== BRAID: convergence -> Ditto (thick emerald rope) ===== */}
            <path
              d={`M ${convX} ${convY} C ${convX} ${convY + 36}, ${convX} ${dittoY - 30}, ${convX} ${dittoY}`}
              fill="none"
              stroke={`url(#rb-${uid}-rope)`}
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* flowing highlight along the rope */}
            <path
              d={`M ${convX} ${convY} C ${convX} ${convY + 36}, ${convX} ${dittoY - 30}, ${convX} ${dittoY}`}
              fill="none"
              stroke="#ecfdf5"
              strokeWidth="4"
              strokeLinecap="round"
              strokeOpacity="0.9"
              strokeDasharray="3 18"
              className={`rb-${uid}-rope-flow`}
            />

            {/* convergence pulse */}
            <g filter={`url(#rb-${uid}-glow)`}>
              <circle
                cx={convX}
                cy={convY}
                r="11"
                fill="#10b981"
                className={`rb-${uid}-conv`}
              />
              <circle
                cx={convX}
                cy={convY}
                r="11"
                fill="none"
                stroke="#6ee7b7"
                strokeWidth="2"
              >
                <animate attributeName="r" values="9;28" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur="2.4s" repeatCount="indefinite" />
              </circle>
            </g>

            {/* ===== SOURCE NODES (top) ===== */}
            {sources.map((s, i) => {
              const cardW = 196
              const cardH = 54
              const cx = s.x - cardW / 2
              const cy = 18
              return (
                <g key={`card-${s.key}`}>
                  {/* tiny pulsing dot connecting card to its stream */}
                  <circle
                    cx={s.x}
                    cy={topY}
                    r="6"
                    fill={s.color}
                    className={`rb-${uid}-dot`}
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                  <circle cx={s.x} cy={topY} r="3" fill="#ffffff" />

                  {/* card */}
                  <rect
                    x={cx}
                    y={cy}
                    width={cardW}
                    height={cardH}
                    rx="11"
                    fill="#f8fafc"
                    stroke={s.color}
                    strokeOpacity="0.55"
                    strokeWidth="1.4"
                  />
                  {/* color tab on the left of card */}
                  <rect
                    x={cx}
                    y={cy + 10}
                    width="4"
                    height={cardH - 20}
                    rx="2"
                    fill={s.color}
                  />
                  <text
                    x={s.x}
                    y={cy + 22}
                    textAnchor="middle"
                    fontSize="11.5"
                    fontWeight={700}
                    fill="#0f172a"
                  >
                    {s.label}
                  </text>
                  <text
                    x={s.x}
                    y={cy + 39}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#64748b"
                  >
                    {s.gloss}
                  </text>
                </g>
              )
            })}

            {/* ===== DITTO NODE (bottom) ===== */}
            <g filter={`url(#rb-${uid}-glow)`} className={`rb-${uid}-ditto-pulse`}>
              <circle
                cx={convX}
                cy={dittoY}
                r="34"
                fill={`url(#rb-${uid}-ditto)`}
                stroke="#10b981"
                strokeWidth="2"
              />
            </g>
            {/* expanding halo ring around Ditto (SMIL — centered, no drift) */}
            <circle cx={convX} cy={dittoY} r="34" fill="none" stroke="#10b981" strokeWidth="2">
              <animate attributeName="r" values="30;46" dur="2.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0" dur="2.8s" repeatCount="indefinite" />
            </circle>
            <text
              x={convX}
              y={dittoY + 5}
              textAnchor="middle"
              fontSize="17"
              fontWeight={800}
              fill="#ffffff"
              style={{ letterSpacing: '0.3px' }}
            >
              Ditto
            </text>
            <text
              x={convX}
              y={dittoY + 58}
              textAnchor="middle"
              fontSize="10.5"
              fill="#475569"
              fontWeight={600}
            >
              a synthesis of four roots
            </text>
          </svg>
        </div>
      </div>

      <style>{`
        /* Flowing dashes travel DOWN each source stream toward the braid. */
        .rb-${uid}-flow {
          animation: rb-${uid}-flow 1.6s linear infinite;
        }
        @keyframes rb-${uid}-flow {
          to { stroke-dashoffset: -24; }
        }

        /* Emerald rope highlight flows down into Ditto. */
        .rb-${uid}-rope-flow {
          animation: rb-${uid}-rope 1.1s linear infinite;
        }
        @keyframes rb-${uid}-rope {
          to { stroke-dashoffset: -21; }
        }

        /* Convergence node breathes (opacity only — no transform drift). */
        .rb-${uid}-conv {
          animation: rb-${uid}-pulse 2.4s ease-in-out infinite;
        }
        @keyframes rb-${uid}-pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }

        /* Source dots pulse gently (opacity only). */
        .rb-${uid}-dot {
          animation: rb-${uid}-dot 2s ease-in-out infinite;
        }
        @keyframes rb-${uid}-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        /* Ditto node gently pulses emerald (opacity only). */
        .rb-${uid}-ditto-pulse {
          animation: rb-${uid}-ditto 2.8s ease-in-out infinite;
        }
        @keyframes rb-${uid}-ditto {
          0%, 100% { opacity: 0.95; }
          50% { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .rb-${uid}-flow,
          .rb-${uid}-rope-flow,
          .rb-${uid}-conv,
          .rb-${uid}-dot,
          .rb-${uid}-ditto-pulse {
            animation: none !important;
          }
        }
      `}</style>

      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure:</strong> Ditto is a synthesis, not a one-off &mdash;
        feedback as privileged information (LUPI), kept by distillation, produced
        by hindsight relabeling, trained on-policy with GRPO.
      </figcaption>
    </figure>
  )
}
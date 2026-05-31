'use client'

import { useId } from 'react'

/**
 * ArcTimeline — the hero figure.
 * An animated horizontal "river" timeline of the arc of feedback signals
 * in RL for LLMs (~2017 to 2026). A thick grey "scalar" mainline and a
 * thinner emerald "verbal" tributary flow left-to-right; the verbal thread
 * twice branches up and gets "filtered back to a number", then finally
 * swells and merges into the mainline at "Ditto", after which the merged
 * channel is emerald.
 */
export default function ArcTimeline() {
  // Unique id so multiple instances / other figures never collide on defs.
  const uid = useId().replace(/[:]/g, '')

  // ---- palette ---------------------------------------------------------
  const grey = '#94a3b8'
  const greyLight = '#cbd5e1'
  const greyFaint = '#e2e8f0'
  const emerald = '#10b981'
  const emeraldSoft = '#6ee7b7'
  const textStrong = '#0f172a'
  const textMid = '#334155'
  const textMuted = '#64748b'
  const textFaint = '#94a3b8'
  const gridline = '#eef0f2'

  // ---- geometry --------------------------------------------------------
  // Map a year (2017..2026) to an x coordinate.
  const x0 = 70
  const x1 = 940
  const y2017 = 2017
  const y2026 = 2026
  const X = (year: number) =>
    x0 + ((year - y2017) / (y2026 - y2017)) * (x1 - x0)

  const scalarY = 150 // upper-middle mainline
  const verbalY = 280 // lower tributary
  const mergeX = X(2025.55) // where Ditto sits
  const mergeY = scalarY

  // Year ticks
  const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]

  // ---- main channel paths ---------------------------------------------
  // Scalar mainline: grey up to the merge, emerald after the merge.
  const scalarGreyPath = `M ${x0} ${scalarY} L ${mergeX} ${scalarY}`
  const scalarEmeraldPath = `M ${mergeX} ${scalarY} L ${x1} ${scalarY}`

  // Verbal tributary: emerald, then swells up to merge at Ditto.
  const verbalStartX = X(2022.7)
  const verbalPath =
    `M ${verbalStartX} ${verbalY} ` +
    `L ${X(2024.9)} ${verbalY} ` +
    `C ${X(2025.25)} ${verbalY} ${mergeX - 30} ${mergeY + 6} ${mergeX} ${mergeY}`

  // Two upward "filtered" branches: emerald going up, grey coming back down.
  // Branch A — RLAIF / Constitutional (2022)
  const branchAx = X(2022)
  const branchAStartX = X(2022.2)
  const branchAEmerald =
    `M ${branchAStartX} ${verbalY} ` +
    `C ${branchAStartX - 14} ${verbalY - 40} ${branchAx} ${scalarY + 46} ${branchAx} ${scalarY}`
  // grey return (filtered to a number) — re-enters mainline just to the right
  const branchAGrey =
    `M ${branchAx} ${scalarY} ` +
    `C ${branchAx} ${scalarY + 30} ${branchAx + 24} ${scalarY + 18} ${branchAx + 40} ${scalarY}`

  // Branch B — Generative verifiers / rubrics (2025)
  const branchBx = X(2024.65)
  const branchBStartX = X(2024.45)
  const branchBEmerald =
    `M ${branchBStartX} ${verbalY} ` +
    `C ${branchBStartX - 12} ${verbalY - 44} ${branchBx} ${scalarY + 48} ${branchBx} ${scalarY}`
  const branchBGrey =
    `M ${branchBx} ${scalarY} ` +
    `C ${branchBx} ${scalarY + 30} ${branchBx + 24} ${scalarY + 18} ${branchBx + 40} ${scalarY}`

  // ---- nodes -----------------------------------------------------------
  type Node = {
    x: number
    y: number
    label: string
    year: string
    color: string
    align?: 'above' | 'below'
    delay: number
  }

  const scalarNodes: Node[] = [
    { x: X(2017.3), y: scalarY, label: 'RLHF', year: '2017 / 2022', color: grey, align: 'above', delay: 0 },
    { x: X(2023), y: scalarY, label: 'Fine-grained rewards', year: '2023', color: grey, align: 'above', delay: 0.6 },
    { x: X(2024.1), y: scalarY, label: 'RLVR', year: '2024–25', color: grey, align: 'above', delay: 1.2 },
  ]

  const verbalNodes: Node[] = [
    { x: X(2022.6), y: verbalY, label: 'Reflexion', year: '2023 · inference-time', color: emerald, align: 'below', delay: 0.3 },
    { x: X(2023.7), y: verbalY, label: 'Chain-of-Hindsight / ILF', year: '2023 · train-time', color: emerald, align: 'below', delay: 0.9 },
    { x: X(2024.85), y: verbalY, label: 'Critique-GRPO / FCP', year: '2025', color: emerald, align: 'below', delay: 1.5 },
  ]

  // upward filtered-branch labels
  const branchLabels = [
    { x: branchAx, y: scalarY - 30, label: 'RLAIF / Constitutional', year: '2022' },
    { x: branchBx, y: scalarY - 30, label: 'Generative verifiers / rubrics', year: '2025' },
  ]

  const c = `arc_${uid}` // class prefix

  return (
    <figure className="fullwidth not-prose my-8">
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div
            role="img"
            aria-label="A flowing river timeline of feedback signals in reinforcement learning for large language models from 2017 to 2026. A thick grey scalar mainline runs along the top with nodes RLHF, fine-grained process rewards, and RLVR. A thinner emerald verbal tributary runs below with nodes Reflexion, Chain-of-Hindsight and ILF, and Critique-GRPO and FCP. The verbal thread branches upward twice — at RLAIF / Constitutional and at Generative verifiers / rubrics — entering as language critique and leaving as a grey number. Near 2026 the verbal tributary swells and merges into the mainline at the Ditto node, after which the merged channel turns emerald and the words finally stay as the training signal."
          >
            <svg
              viewBox="0 0 1000 380"
              width="100%"
              height="auto"
              role="presentation"
              style={{ display: 'block' }}
            >
              <defs>
                {/* soft glow for node dots */}
                <filter id={`soft_${uid}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* swell gradient for the merge area */}
                <linearGradient id={`merge_${uid}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={emerald} stopOpacity="0.0" />
                  <stop offset="100%" stopColor={emerald} stopOpacity="0.16" />
                </linearGradient>
                <radialGradient id={`dittoGlow_${uid}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={emeraldSoft} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={emeraldSoft} stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* ---- faint year axis gridlines ---- */}
              {years.map((yr) => (
                <line
                  key={`grid-${yr}`}
                  x1={X(yr)}
                  y1={42}
                  x2={X(yr)}
                  y2={336}
                  stroke={gridline}
                  strokeWidth={1}
                />
              ))}

              {/* ---- era band labels ---- */}
              <text
                x={X(2019.6)}
                y={70}
                textAnchor="middle"
                fontSize={11}
                letterSpacing={2.5}
                fill={textFaint}
                fontWeight={600}
                opacity={0.85}
              >
                THE SCALAR ERA
              </text>
              <line x1={X(2017.4)} y1={78} x2={X(2024)} y2={78} stroke={greyFaint} strokeWidth={1} strokeDasharray="3 4" />

              <text
                x={X(2023.6)}
                y={332}
                textAnchor="middle"
                fontSize={11}
                letterSpacing={2.5}
                fill={emerald}
                fontWeight={600}
                opacity={0.7}
              >
                THE VERBAL THREAD
              </text>
              <line x1={X(2022.4)} y1={324} x2={X(2025)} y2={324} stroke={emeraldSoft} strokeWidth={1} strokeDasharray="3 4" opacity={0.8} />

              {/* ---- merge swell halo behind Ditto ---- */}
              <rect
                x={mergeX - 150}
                y={scalarY - 26}
                width={150}
                height={52}
                fill={`url(#merge_${uid})`}
                rx={26}
              />
              <circle cx={mergeX} cy={mergeY} r={38} fill={`url(#dittoGlow_${uid})`} className={`${c}_dittoHalo`} />

              {/* ============ CHANNELS (base strokes — always visible) ============ */}

              {/* Scalar mainline base — grey segment */}
              <path d={scalarGreyPath} stroke={greyLight} strokeWidth={11} fill="none" strokeLinecap="round" opacity={0.55} />
              {/* Scalar mainline base — emerald segment (post-merge) */}
              <path d={scalarEmeraldPath} stroke={emeraldSoft} strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.6} />

              {/* Verbal tributary base */}
              <path d={verbalPath} stroke={emeraldSoft} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.6} />

              {/* filtered branches base */}
              <path d={branchAEmerald} stroke={emeraldSoft} strokeWidth={3} fill="none" opacity={0.7} />
              <path d={branchAGrey} stroke={greyLight} strokeWidth={3} fill="none" opacity={0.8} />
              <path d={branchBEmerald} stroke={emeraldSoft} strokeWidth={3} fill="none" opacity={0.7} />
              <path d={branchBGrey} stroke={greyLight} strokeWidth={3} fill="none" opacity={0.8} />

              {/* ============ FLOWING DASH OVERLAYS (the animation) ============ */}

              {/* scalar flow — grey particles */}
              <path
                d={scalarGreyPath}
                stroke={grey}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="2 22"
                className={`${c}_flowGrey`}
              />
              {/* scalar emerald flow (post-merge — words stay) */}
              <path
                d={scalarEmeraldPath}
                stroke={emerald}
                strokeWidth={3.5}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="2 20"
                className={`${c}_flowEmerald`}
              />
              {/* verbal tributary flow — emerald particles */}
              <path
                d={verbalPath}
                stroke={emerald}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="2 18"
                className={`${c}_flowEmeraldFast`}
              />
              {/* branch A: emerald up */}
              <path
                d={branchAEmerald}
                stroke={emerald}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="2 14"
                className={`${c}_flowBranchUp`}
              />
              {/* branch A: grey back to a number */}
              <path
                d={branchAGrey}
                stroke={grey}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="2 12"
                className={`${c}_flowBranchDown`}
              />
              {/* branch B: emerald up */}
              <path
                d={branchBEmerald}
                stroke={emerald}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="2 14"
                className={`${c}_flowBranchUp`}
              />
              {/* branch B: grey back to a number */}
              <path
                d={branchBGrey}
                stroke={grey}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeDasharray="2 12"
                className={`${c}_flowBranchDown`}
              />

              {/* small "score" chips at the top of each filtered branch */}
              {branchLabels.map((b, i) => (
                <g key={`chip-${i}`} className={`${c}_chip`} style={{ animationDelay: `${i * 0.9}s` }}>
                  <rect x={b.x + 6} y={scalarY - 14} width={26} height={15} rx={4} fill="#ffffff" stroke={greyFaint} strokeWidth={1} />
                  <text x={b.x + 19} y={scalarY - 3} textAnchor="middle" fontSize={9} fill={textMuted} fontWeight={600}>
                    +r
                  </text>
                </g>
              ))}

              {/* ============ NODES ============ */}

              {/* scalar nodes */}
              {scalarNodes.map((n, i) => (
                <g key={`s-${i}`}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={6.5}
                    fill="#ffffff"
                    stroke={n.color}
                    strokeWidth={2.5}
                    filter={`url(#soft_${uid})`}
                    className={`${c}_pulse`}
                    style={{ animationDelay: `${n.delay}s`, transformOrigin: `${n.x}px ${n.y}px` }}
                  />
                  <text x={n.x} y={n.y - 18} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={textStrong}>
                    {n.label}
                  </text>
                  <text x={n.x} y={n.y - 32} textAnchor="middle" fontSize={9.5} fill={textFaint} fontWeight={500}>
                    {n.year}
                  </text>
                </g>
              ))}

              {/* verbal nodes — labels spread by anchoring (left node right-aligned,
                  middle centered, right node left-aligned) so they never overlap */}
              {verbalNodes.map((n, i) => {
                const anchor = i === 0 ? 'end' : i === verbalNodes.length - 1 ? 'start' : 'middle'
                const lx = anchor === 'end' ? n.x - 9 : anchor === 'start' ? n.x + 9 : n.x
                return (
                  <g key={`v-${i}`}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={5.5}
                      fill="#ffffff"
                      stroke={n.color}
                      strokeWidth={2.5}
                      filter={`url(#soft_${uid})`}
                      className={`${c}_pulse`}
                      style={{ animationDelay: `${n.delay}s`, transformOrigin: `${n.x}px ${n.y}px` }}
                    />
                    <text x={lx} y={n.y + 22} textAnchor={anchor} fontSize={11} fontWeight={600} fill={textMid}>
                      {n.label}
                    </text>
                    <text x={lx} y={n.y + 35} textAnchor={anchor} fontSize={9.5} fill={textFaint} fontWeight={500}>
                      {n.year}
                    </text>
                  </g>
                )
              })}

              {/* branch labels (filtered) */}
              {branchLabels.map((b, i) => (
                <g key={`bl-${i}`}>
                  <text x={b.x} y={b.y - 12} textAnchor="middle" fontSize={10} fontWeight={600} fill={emerald} opacity={0.9}>
                    {b.label}
                  </text>
                  <text x={b.x} y={b.y - 1} textAnchor="middle" fontSize={9} fill={textFaint} fontWeight={500}>
                    {b.year} · critique &rarr; number
                  </text>
                </g>
              ))}

              {/* Ditto merge node — the hero moment */}
              <g>
                <circle
                  cx={mergeX}
                  cy={mergeY}
                  r={9.5}
                  fill={emerald}
                  stroke="#ffffff"
                  strokeWidth={2.5}
                  filter={`url(#soft_${uid})`}
                  className={`${c}_pulseHero`}
                  style={{ transformOrigin: `${mergeX}px ${mergeY}px` }}
                />
                <text x={mergeX} y={mergeY - 20} textAnchor="middle" fontSize={14} fontWeight={700} fill={emerald}>
                  Ditto
                </text>
                <text x={mergeX} y={mergeY - 34} textAnchor="middle" fontSize={9.5} fill={textFaint} fontWeight={500}>
                  2026 · the words stay
                </text>
                <text x={mergeX + 70} y={mergeY + 4} textAnchor="middle" fontSize={9.5} fill={emerald} fontWeight={600} opacity={0.85}>
                  verbal = signal
                </text>
              </g>

              {/* ---- year axis labels ---- */}
              {years.map((yr) => (
                <text
                  key={`yr-${yr}`}
                  x={X(yr)}
                  y={356}
                  textAnchor="middle"
                  fontSize={10}
                  fill={textFaint}
                  fontWeight={500}
                >
                  {yr === 2017 || yr === 2026 || yr % 1 === 0 ? `'${String(yr).slice(2)}` : ''}
                </text>
              ))}
              <line x1={x0 - 10} y1={342} x2={x1 + 10} y2={342} stroke={greyFaint} strokeWidth={1} />
            </svg>
          </div>
        </div>
      </div>

      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure:</strong> The arc of feedback in RL for LLMs. The thick grey{' '}
        <span style={{ color: '#64748b' }}>scalar mainline</span> (RLHF &rarr; process rewards &rarr; RLVR)
        carries feedback as a single number. The thinner{' '}
        <span style={{ color: '#10b981' }}>verbal tributary</span> carries feedback as language. Twice the
        verbal thread branches up into the mainline &mdash; at RLAIF / Constitutional and at generative
        verifiers / rubrics &mdash; where language <em>enters as critique and leaves as a number</em> (the
        branch turns grey). Only at the <span style={{ color: '#10b981' }}>Ditto</span> merge (~2026) does the
        verbal tributary swell and join for good: the channel turns emerald and the words finally stay as the
        training signal.
      </figcaption>

      <style>{`
        @keyframes ${c}_dash {
          to { stroke-dashoffset: -240; }
        }
        @keyframes ${c}_dashFast {
          to { stroke-dashoffset: -200; }
        }
        @keyframes ${c}_dashUp {
          to { stroke-dashoffset: -160; }
        }
        @keyframes ${c}_pulseK {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.28); opacity: 0.82; }
        }
        @keyframes ${c}_heroK {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
        @keyframes ${c}_haloK {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.12); }
        }
        @keyframes ${c}_chipK {
          0%, 70%, 100% { opacity: 0.35; }
          82% { opacity: 1; }
        }

        .${c}_flowGrey {
          animation: ${c}_dash 3.2s linear infinite;
        }
        .${c}_flowEmerald {
          animation: ${c}_dash 3.2s linear infinite;
        }
        .${c}_flowEmeraldFast {
          animation: ${c}_dashFast 2.4s linear infinite;
        }
        .${c}_flowBranchUp {
          animation: ${c}_dashUp 2s linear infinite;
        }
        .${c}_flowBranchDown {
          animation: ${c}_dashUp 2s linear infinite;
        }
        .${c}_pulse {
          animation: ${c}_pulseK 2.8s ease-in-out infinite;
          transform-box: fill-box;
        }
        .${c}_pulseHero {
          animation: ${c}_heroK 2s ease-in-out infinite;
          transform-box: fill-box;
        }
        .${c}_dittoHalo {
          animation: ${c}_haloK 2.6s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        .${c}_chip {
          animation: ${c}_chipK 3.6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .${c}_flowGrey,
          .${c}_flowEmerald,
          .${c}_flowEmeraldFast,
          .${c}_flowBranchUp,
          .${c}_flowBranchDown,
          .${c}_pulse,
          .${c}_pulseHero,
          .${c}_dittoHalo,
          .${c}_chip {
            animation: none !important;
          }
        }
      `}</style>
    </figure>
  )
}

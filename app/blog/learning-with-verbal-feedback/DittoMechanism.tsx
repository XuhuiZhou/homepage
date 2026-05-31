'use client'

import { useId } from 'react'

/**
 * DittoMechanism
 * An animated diagram of the Ditto training loop / GRPO group mechanism.
 * Training time: x -> student rollout y0 -> judge (r0 scalar + h verbal critique)
 * -> feedback-conditioned teacher rollout y1 -> r1 -> GRPO group (advantage bars,
 * teacher highlighted with extra L_fb update) -> distilled into internalized pi_theta.
 * Test time: new prompt x' -> internalized policy -> human-like output (no judge).
 */
export default function DittoMechanism() {
  // Unique id base so multiple instances / gradients never collide.
  const uid = useId().replace(/[:]/g, '')
  const C = `ditto-${uid}`

  // Palette tokens
  const slate = '#94a3b8'
  const slateLight = '#cbd5e1'
  const emerald = '#10b981'
  const emeraldSoft = '#6ee7b7'
  const emeraldWash = '#ecfdf5'
  const indigo = '#818cf8'
  const red = '#dc2626'
  const violet = '#7c3aed'
  const textStrong = '#0f172a'
  const textMid = '#334155'
  const textMuted = '#64748b'
  const border = '#e5e7eb'
  const grid = '#eef0f2'

  return (
    <figure className="fullwidth not-prose my-8">
      <div className="overflow-x-auto">
        <div
          role="img"
          aria-label="The Ditto training loop: a prompt x produces a student rollout y0, which a judge critiques with a scalar reward and a verbal critique h. The verbal feedback threads into a feedback-conditioned teacher rollout y1. Both rollouts are optimized in one GRPO group where the teacher has the larger advantage and an extra L_fb update, then the teacher is distilled into an internalized policy. At test time a new prompt flows through the internalized policy to a human-like output with no judge and no feedback needed."
          className="min-w-[640px]"
        >
          <svg
            viewBox="0 0 920 560"
            width="100%"
            height="auto"
            role="presentation"
            style={{ display: 'block', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
          >
            <defs>
              {/* Arrowheads */}
              <marker id={`${C}-arr-slate`} markerWidth="9" markerHeight="9" refX="6.5" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={slate} />
              </marker>
              <marker id={`${C}-arr-emerald`} markerWidth="9" markerHeight="9" refX="6.5" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={emerald} />
              </marker>
              <marker id={`${C}-arr-violet`} markerWidth="9" markerHeight="9" refX="6.5" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={violet} />
              </marker>
              <marker id={`${C}-arr-red`} markerWidth="9" markerHeight="9" refX="6.5" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={red} />
              </marker>

              {/* Soft node shadow */}
              <filter id={`${C}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.08" />
              </filter>

              {/* Group box wash */}
              <linearGradient id={`${C}-grpoWash`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff5f5" />
                <stop offset="100%" stopColor="#fffafa" />
              </linearGradient>
            </defs>

            {/* ============ BACKGROUND PANELS ============ */}
            {/* Training panel */}
            <rect x="14" y="14" width="892" height="372" rx="14" fill="#f8fafc" stroke={border} />
            <text x="34" y="40" fontSize="11" fontWeight={700} fill={textMuted} letterSpacing="1.2">
              TRAINING TIME
            </text>
            <text x="146" y="40" fontSize="10.5" fill={textMuted} fontStyle="italic">
              feedback is available
            </text>

            {/* Test panel */}
            <rect x="14" y="402" width="892" height="142" rx="14" fill="#ffffff" stroke={border} />
            <text x="34" y="428" fontSize="11" fontWeight={700} fill={textMuted} letterSpacing="1.2">
              TEST TIME
            </text>
            <text x="138" y="428" fontSize="10.5" fill={textMuted} fontStyle="italic">
              privileged information is gone
            </text>

            {/* ============ TRAINING ARROWS (drawn first, under nodes) ============ */}
            {/* x -> y0 (student) */}
            <path
              className={`${C}-flow ${C}-flow-slate`}
              d="M 150 116 L 222 116"
              fill="none"
              stroke={slateLight}
              strokeWidth="2.5"
              markerEnd={`url(#${C}-arr-slate)`}
            />
            {/* y0 -> judge */}
            <path
              className={`${C}-flow ${C}-flow-slate`}
              d="M 396 116 L 472 116"
              fill="none"
              stroke={slateLight}
              strokeWidth="2.5"
              markerEnd={`url(#${C}-arr-slate)`}
            />
            {/* judge scalar r0 -> down to group (the number channel) */}
            <path
              className={`${C}-flow ${C}-flow-slate`}
              d="M 556 168 C 556 220, 472 224, 430 256"
              fill="none"
              stroke={slateLight}
              strokeWidth="2.5"
              markerEnd={`url(#${C}-arr-slate)`}
            />
            {/* y0 -> down into group (rollout itself) */}
            <path
              className={`${C}-flow ${C}-flow-slate`}
              d="M 309 142 C 309 210, 330 220, 348 256"
              fill="none"
              stroke={slateLight}
              strokeWidth="2.5"
              markerEnd={`url(#${C}-arr-slate)`}
            />

            {/* VERBAL h channel: judge -> teacher (emerald, the privileged thread) */}
            <path
              className={`${C}-flow ${C}-flow-emerald`}
              d="M 644 130 C 720 150, 740 196, 700 230"
              fill="none"
              stroke={emerald}
              strokeWidth="3"
              markerEnd={`url(#${C}-arr-emerald)`}
            />
            {/* x -> teacher (prompt also conditions teacher) */}
            <path
              className={`${C}-flow ${C}-flow-emerald`}
              d="M 110 142 C 110 230, 470 240, 612 250"
              fill="none"
              stroke={emeraldSoft}
              strokeWidth="2"
              strokeDasharray="2 6"
              markerEnd={`url(#${C}-arr-emerald)`}
            />
            {/* teacher y1 -> group (down-left into group) */}
            <path
              className={`${C}-flow ${C}-flow-emerald`}
              d="M 660 296 C 600 330, 520 320, 466 322"
              fill="none"
              stroke={emerald}
              strokeWidth="2.8"
              markerEnd={`url(#${C}-arr-emerald)`}
            />

            {/* ============ NODE: prompt x ============ */}
            <g filter={`url(#${C}-shadow)`}>
              <rect x="40" y="90" width="110" height="52" rx="10" fill="#ffffff" stroke={slate} strokeWidth="1.5" />
            </g>
            <circle className={`${C}-pulse`} cx="58" cy="106" r="4" fill={slate} />
            <text x="72" y="110" fontSize="12" fontWeight={700} fill={textStrong}>
              prompt
            </text>
            <text x="72" y="128" fontSize="13" fontWeight={700} fill={textMid} fontFamily="ui-monospace, monospace">
              x
            </text>

            {/* ============ NODE: student rollout y0 (indigo) ============ */}
            <g filter={`url(#${C}-shadow)`}>
              <rect x="222" y="84" width="174" height="64" rx="10" fill="#ffffff" stroke={indigo} strokeWidth="1.5" />
            </g>
            <circle className={`${C}-pulse`} cx="240" cy="104" r="4" fill={indigo} style={{ animationDelay: '0.4s' }} />
            <text x="254" y="108" fontSize="11.5" fontWeight={700} fill={indigo}>
              STUDENT rollout
            </text>
            <text x="254" y="130" fontSize="13" fontWeight={600} fill={textMid} fontFamily="ui-monospace, monospace">
              y0 ~ pi(.|x)
            </text>

            {/* ============ NODE: judge (returns tuple) ============ */}
            <g filter={`url(#${C}-shadow)`}>
              <rect x="472" y="76" width="184" height="80" rx="14" fill="#ffffff" stroke={slate} strokeWidth="1.5" />
            </g>
            <circle className={`${C}-pulse`} cx="490" cy="96" r="4" fill={slate} style={{ animationDelay: '0.8s' }} />
            <text x="504" y="100" fontSize="11.5" fontWeight={700} fill={textStrong}>
              JUDGE
            </text>
            <text x="486" y="122" fontSize="11.5" fontWeight={600} fill={textMid} fontFamily="ui-monospace, monospace">
              (
              <tspan fill={slate} fontWeight={700}>r0</tspan>
              <tspan fill={textMuted}> scalar,</tspan>
            </text>
            <text x="494" y="140" fontSize="11.5" fontWeight={700} fill={emerald} fontFamily="ui-monospace, monospace">
              h verbal critique
              <tspan fill={textMuted} fontWeight={600}> )</tspan>
            </text>

            {/* ============ NODE: teacher rollout y1 (emerald) ============ */}
            <g filter={`url(#${C}-shadow)`}>
              <rect x="612" y="232" width="200" height="64" rx="10" fill={emeraldWash} stroke={emerald} strokeWidth="1.8" />
            </g>
            <circle className={`${C}-pulse`} cx="630" cy="252" r="4" fill={emerald} style={{ animationDelay: '1.2s' }} />
            <text x="644" y="256" fontSize="11.5" fontWeight={700} fill={emerald}>
              TEACHER rollout
            </text>
            <text x="644" y="278" fontSize="12.5" fontWeight={600} fill={textMid} fontFamily="ui-monospace, monospace">
              y1 ~ pi(.|x, h)
            </text>
            <text x="616" y="312" fontSize="9.5" fill={textMuted} fontStyle="italic">
              hindsight, feedback-conditioned
            </text>

            {/* small h tag riding the emerald thread */}
            <g className={`${C}-htag`}>
              <rect x="690" y="172" width="40" height="22" rx="11" fill={emerald} />
              <text x="710" y="187" fontSize="12" fontWeight={700} fill="#ffffff" textAnchor="middle" fontFamily="ui-monospace, monospace">
                h
              </text>
            </g>

            {/* ============ NODE: GRPO group box (red) ============ */}
            <g filter={`url(#${C}-shadow)`}>
              <rect x="300" y="256" width="166" height="108" rx="12" fill={`url(#${C}-grpoWash)`} stroke={red} strokeWidth="1.8" />
            </g>
            <text x="316" y="278" fontSize="11.5" fontWeight={700} fill={red}>
              GRPO group
            </text>

            {/* group mean mu dashed baseline */}
            <line x1="312" y1="334" x2="454" y2="334" stroke={slate} strokeWidth="1.2" strokeDasharray="4 4" />
            <text x="456" y="338" fontSize="10" fill={slate} fontStyle="italic">
              mu
            </text>

            {/* advantage bars relative to mean. baseline y = 334 */}
            {/* y0 bar: slightly below mean (negative-ish) */}
            <rect
              className={`${C}-bar ${C}-bar-y0`}
              x="330"
              y="334"
              width="22"
              height="14"
              rx="3"
              fill={slate}
            />
            <text x="341" y="360" fontSize="9.5" fill={textMuted} textAnchor="middle" fontFamily="ui-monospace, monospace">
              y0
            </text>

            {/* y1 bar: tall positive, highlighted */}
            <rect
              className={`${C}-bar ${C}-bar-y1`}
              x="402"
              y="296"
              width="24"
              height="38"
              rx="3"
              fill={emerald}
            />
            <text x="414" y="360" fontSize="9.5" fill={emerald} fontWeight={700} textAnchor="middle" fontFamily="ui-monospace, monospace">
              y1
            </text>

            {/* L_fb extra update tag on teacher bar */}
            <g className={`${C}-lfb`}>
              <rect x="392" y="270" width="62" height="20" rx="10" fill="#ffffff" stroke={red} strokeWidth="1.2" />
              <text x="423" y="284" fontSize="10" fontWeight={700} fill={red} textAnchor="middle" fontFamily="ui-monospace, monospace">
                + L_fb
              </text>
            </g>

            {/* ============ ARROW: group -> internalized (distill, violet) ============ */}
            <path
              className={`${C}-flow ${C}-flow-violet`}
              d="M 466 300 C 560 300, 600 340, 660 348"
              fill="none"
              stroke={violet}
              strokeWidth="2.8"
              markerEnd={`url(#${C}-arr-violet)`}
            />
            <text x="540" y="296" fontSize="10" fontWeight={700} fill={violet}>
              distill
            </text>

            {/* ============ NODE: internalized pi_theta (violet) ============ */}
            <g filter={`url(#${C}-shadow)`}>
              <rect x="660" y="326" width="186" height="46" rx="10" fill="#ffffff" stroke={violet} strokeWidth="1.8" />
            </g>
            <circle className={`${C}-pulse`} cx="678" cy="349" r="4" fill={violet} style={{ animationDelay: '1.6s' }} />
            <text x="692" y="345" fontSize="10.5" fontWeight={700} fill={violet}>
              internalized
            </text>
            <text x="692" y="362" fontSize="12.5" fontWeight={700} fill={textMid} fontFamily="ui-monospace, monospace">
              pi_theta
            </text>

            {/* ============ TEST-TIME STRIP ============ */}
            {/* arrow from internalized down into test panel (the same weights carry over) */}
            <path
              className={`${C}-flow ${C}-flow-violet`}
              d="M 753 372 L 482 468"
              fill="none"
              stroke={violet}
              strokeWidth="2"
              strokeDasharray="3 5"
              markerEnd={`url(#${C}-arr-violet)`}
            />

            {/* new prompt x' */}
            <g filter={`url(#${C}-shadow)`}>
              <rect x="40" y="452" width="120" height="48" rx="10" fill="#ffffff" stroke={slate} strokeWidth="1.5" />
            </g>
            <circle className={`${C}-pulse`} cx="58" cy="470" r="4" fill={slate} style={{ animationDelay: '0.6s' }} />
            <text x="72" y="472" fontSize="11" fontWeight={700} fill={textStrong}>
              new prompt
            </text>
            <text x="72" y="490" fontSize="13" fontWeight={700} fill={textMid} fontFamily="ui-monospace, monospace">
              x&rsquo;
            </text>

            <path
              className={`${C}-flow ${C}-flow-violet`}
              d="M 160 476 L 410 476"
              fill="none"
              stroke={violet}
              strokeWidth="2.5"
              markerEnd={`url(#${C}-arr-violet)`}
            />

            {/* internalized policy (test) */}
            <g filter={`url(#${C}-shadow)`}>
              <rect x="410" y="448" width="172" height="56" rx="10" fill="#ffffff" stroke={violet} strokeWidth="1.8" />
            </g>
            <circle className={`${C}-pulse`} cx="428" cy="468" r="4" fill={violet} style={{ animationDelay: '1.0s' }} />
            <text x="442" y="470" fontSize="10.5" fontWeight={700} fill={violet}>
              internalized policy
            </text>
            <text x="442" y="491" fontSize="12.5" fontWeight={600} fill={textMid} fontFamily="ui-monospace, monospace">
              pi_theta(.|x&rsquo;)
            </text>

            <path
              className={`${C}-flow ${C}-flow-violet`}
              d="M 582 476 L 700 476"
              fill="none"
              stroke={violet}
              strokeWidth="2.5"
              markerEnd={`url(#${C}-arr-violet)`}
            />

            {/* human-like output */}
            <g filter={`url(#${C}-shadow)`}>
              <rect x="700" y="452" width="150" height="48" rx="10" fill={emeraldWash} stroke={emerald} strokeWidth="1.5" />
            </g>
            <circle className={`${C}-pulse`} cx="718" cy="470" r="4" fill={emerald} style={{ animationDelay: '1.4s' }} />
            <text x="732" y="472" fontSize="11" fontWeight={700} fill={emerald}>
              human-like
            </text>
            <text x="732" y="490" fontSize="11" fontWeight={700} fill={emerald}>
              output
            </text>

            {/* test-time note: no judge, no feedback */}
            <g>
              <rect x="40" y="514" width="262" height="22" rx="11" fill="#ffffff" stroke={border} />
              <circle cx="58" cy="525" r="3.5" fill={red} />
              <text x="70" y="529" fontSize="10.5" fontWeight={600} fill={textMid}>
                no judge, no feedback needed
              </text>
            </g>
            <text x="320" y="529" fontSize="10" fill={textMuted} fontStyle="italic">
              the privileged-information asymmetry
            </text>

            {/* faint inner gridline separating training/test for rhythm */}
            <line x1="14" y1="386" x2="906" y2="386" stroke={grid} strokeWidth="1" />
          </svg>
        </div>
      </div>

      <style>{`
        /* Flowing particle dashes along arrows */
        .${C}-flow {
          stroke-dasharray: 7 12;
          animation: ${C}-dash 1.4s linear infinite;
        }
        .${C}-flow-emerald { animation-duration: 1.1s; }
        .${C}-flow-violet { animation-duration: 1.6s; }
        .${C}-flow-red { animation-duration: 1.3s; }
        @keyframes ${C}-dash {
          to { stroke-dashoffset: -38; }
        }

        /* Node dots pulse */
        .${C}-pulse {
          animation: ${C}-pulse 2.4s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes ${C}-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.45); }
        }

        /* h tag riding the emerald channel, glowing */
        .${C}-htag {
          animation: ${C}-htag 1.8s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes ${C}-htag {
          0%, 100% { opacity: 0.85; transform: translateY(0) scale(1); }
          50%      { opacity: 1;    transform: translateY(3px) scale(1.06); }
        }

        /* Advantage bars gently breathe */
        .${C}-bar {
          transform-box: fill-box;
          transform-origin: bottom;
        }
        .${C}-bar-y1 {
          animation: ${C}-bar-grow 3s ease-in-out infinite;
        }
        .${C}-bar-y0 {
          animation: ${C}-bar-shrink 3s ease-in-out infinite;
        }
        @keyframes ${C}-bar-grow {
          0%, 100% { transform: scaleY(0.82); }
          50%      { transform: scaleY(1.0); }
        }
        @keyframes ${C}-bar-shrink {
          0%, 100% { transform: scaleY(0.7); }
          50%      { transform: scaleY(1.0); }
        }

        /* L_fb tag flashes to mark the extra update */
        .${C}-lfb {
          animation: ${C}-lfb 3s ease-in-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes ${C}-lfb {
          0%, 40%, 100% { opacity: 0.55; }
          55%, 70%      { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .${C}-flow,
          .${C}-pulse,
          .${C}-htag,
          .${C}-bar-y0,
          .${C}-bar-y1,
          .${C}-lfb {
            animation: none !important;
          }
          .${C}-flow { stroke-dasharray: none; }
        }
      `}</style>

      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure:</strong> the Ditto loop &mdash; a student rollout is critiqued in
        natural language; a feedback-conditioned teacher rollout is generated; both are
        optimized in one GRPO group (plus an L<sub>fb</sub> update on the teacher); the teacher
        is distilled into the base policy. Verbal feedback is privileged information: present in
        training, gone at test time.
      </figcaption>
    </figure>
  )
}
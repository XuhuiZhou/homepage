'use client'

import { useId } from 'react'

/**
 * HonestyMeter
 * Two side-by-side cards contrasting a VERIFIABLE task (math) where the scalar
 * reward and the verbal critique agree (the number is honest) versus a
 * SUBJECTIVE task (social simulation) where the scalar compresses away the very
 * thing being judged (dishonest). A looping "population of raters" animation
 * converges on the left and fans out on the right; the gauge needles settle
 * low (green) and high (red) respectively.
 */

type RaterDot = {
  left: string
  delay: string
}

// Twelve raters; each has a tidy resting position plus a CSS var for the
// fanned-out target. We compute resting positions evenly across the track.
const RATERS: RaterDot[] = Array.from({ length: 12 }, (_, i) => ({
  left: `${6 + i * 8}%`,
  delay: `${(i % 6) * 0.12}s`,
}))

// Per-rater horizontal offsets (in %) used by the fan-out animation on the
// subjective card. Mix of left/right scatter so the spread looks organic.
const FAN_OFFSETS = [-34, 28, -18, 40, -42, 12, 34, -26, 22, -38, 30, -14]

export default function HonestyMeter() {
  const uid = useId().replace(/[:]/g, '')
  const C = `hm-${uid}`

  return (
    <figure className="fullwidth not-prose my-8">
      <div
        role="img"
        aria-label="Two cards comparing reward signals. Left: a verifiable math problem where the scalar reward of 1.0 and the verbal critique agree, raters converge into a tight cluster, and the honesty gauge needle stays low in the green zone. Right: a subjective social-simulation turn where the scalar reward of 0.7 hides a long divergent critique, raters fan out in disagreement, and the gauge needle is pegged high in the red zone."
        className={`${C}-root`}
      >
        <style>{`
          .${C}-root {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
          @media (min-width: 640px) {
            .${C}-root { grid-template-columns: 1fr 1fr; }
          }

          .${C}-card {
            position: relative;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 18px 18px 20px;
            box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04),
                        0 8px 24px -16px rgba(15, 23, 42, 0.18);
            overflow: hidden;
          }
          .${C}-card::before {
            content: "";
            position: absolute;
            inset: 0 0 auto 0;
            height: 4px;
          }
          .${C}-card-v::before { background: linear-gradient(90deg, #10b981, #6ee7b7); }
          .${C}-card-s::before { background: linear-gradient(90deg, #f59e0b, #dc2626); }

          .${C}-kicker {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 3px 9px;
            border-radius: 999px;
            margin-bottom: 8px;
          }
          .${C}-kicker-v { color: #047857; background: #ecfdf5; }
          .${C}-kicker-s { color: #b91c1c; background: #fef2f2; }

          .${C}-title {
            font-size: 14px;
            font-weight: 650;
            color: #0f172a;
            margin: 0 0 2px;
            line-height: 1.25;
          }
          .${C}-subtitle {
            font-size: 11px;
            color: #64748b;
            margin: 0 0 14px;
          }

          .${C}-scalar-row {
            display: flex;
            align-items: baseline;
            gap: 8px;
            margin-bottom: 14px;
          }
          .${C}-scalar-label {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #94a3b8;
          }
          .${C}-scalar-num {
            font-size: 30px;
            font-weight: 700;
            line-height: 1;
            font-variant-numeric: tabular-nums;
            color: #475569;
          }
          .${C}-scalar-num-s { color: #b45309; }

          .${C}-critique {
            font-size: 11.5px;
            line-height: 1.5;
            color: #334155;
            background: #f8fafc;
            border: 1px solid #eef0f2;
            border-radius: 10px;
            padding: 9px 11px;
            margin-bottom: 16px;
          }
          .${C}-critique-tag {
            display: block;
            font-size: 9.5px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #94a3b8;
            margin-bottom: 4px;
          }
          .${C}-agree { color: #047857; font-weight: 600; }
          .${C}-flag { color: #b91c1c; font-weight: 600; }

          /* ---------- Raters track ---------- */
          .${C}-raters-label {
            font-size: 9.5px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #94a3b8;
            margin-bottom: 6px;
          }
          .${C}-track {
            position: relative;
            height: 30px;
            border-radius: 8px;
            background:
              repeating-linear-gradient(90deg, #eef0f2 0 1px, transparent 1px 40px);
            background-color: #fbfcfd;
            border: 1px solid #eef0f2;
            margin-bottom: 16px;
          }
          .${C}-dot {
            position: absolute;
            top: 50%;
            width: 9px;
            height: 9px;
            border-radius: 50%;
            margin-left: -4.5px;
            margin-top: -4.5px;
          }
          .${C}-dot-v {
            background: #10b981;
            box-shadow: 0 0 0 2px #ecfdf5;
            animation: ${C}-converge 5.5s ease-in-out infinite;
          }
          .${C}-dot-s {
            background: #dc2626;
            box-shadow: 0 0 0 2px #fef2f2;
            animation: ${C}-fanout 5.5s ease-in-out infinite;
          }

          /* Converge: drift toward the centre (50%) then ease back out a touch. */
          @keyframes ${C}-converge {
            0%   { transform: translateX(0); opacity: 0.85; }
            45%  { transform: translateX(var(--hm-conv)); opacity: 1; }
            70%  { transform: translateX(var(--hm-conv)); opacity: 1; }
            100% { transform: translateX(0); opacity: 0.85; }
          }
          /* Fan out: scatter far from centre, hold the spread, then regroup. */
          @keyframes ${C}-fanout {
            0%   { transform: translateX(0); opacity: 0.8; }
            45%  { transform: translateX(var(--hm-fan)); opacity: 1; }
            70%  { transform: translateX(var(--hm-fan)); opacity: 1; }
            100% { transform: translateX(0); opacity: 0.8; }
          }

          /* ---------- Gauge ---------- */
          .${C}-gauge-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .${C}-gauge-label {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.05em;
            color: #64748b;
            margin-top: 2px;
            text-align: center;
          }
          .${C}-needle {
            transform-box: fill-box;
            transform-origin: 50% 100%;
          }
          /* Low, green-zone needle with a gentle settle wobble. */
          .${C}-needle-v {
            animation: ${C}-needle-low 5.5s ease-in-out infinite;
          }
          @keyframes ${C}-needle-low {
            0%   { transform: rotate(-72deg); }
            20%  { transform: rotate(-68deg); }
            45%  { transform: rotate(-64deg); }
            55%  { transform: rotate(-67deg); }
            70%  { transform: rotate(-64deg); }
            100% { transform: rotate(-72deg); }
          }
          /* High, red-zone needle pegging right, then a small overshoot settle. */
          .${C}-needle-s {
            animation: ${C}-needle-high 5.5s ease-in-out infinite;
          }
          @keyframes ${C}-needle-high {
            0%   { transform: rotate(-72deg); }
            18%  { transform: rotate(60deg); }
            30%  { transform: rotate(74deg); }
            42%  { transform: rotate(66deg); }
            70%  { transform: rotate(70deg); }
            100% { transform: rotate(-72deg); }
          }
          .${C}-needle-hub { fill: #0f172a; }

          .${C}-verdict {
            font-size: 10.5px;
            text-align: center;
            margin-top: 4px;
            font-weight: 600;
          }
          .${C}-verdict-v { color: #047857; }
          .${C}-verdict-s { color: #b91c1c; }

          @media (prefers-reduced-motion: reduce) {
            .${C}-dot-v,
            .${C}-dot-s,
            .${C}-needle-v,
            .${C}-needle-s {
              animation: none !important;
            }
            /* Resting state: dots stay on their tidy track positions and the
               needles sit at their characteristic angles so the figure reads
               correctly with no motion. */
            .${C}-needle-v { transform: rotate(-66deg); }
            .${C}-needle-s { transform: rotate(70deg); }
          }
        `}</style>

        {/* ============ LEFT: verifiable / math ============ */}
        <div className={`${C}-card ${C}-card-v`}>
          <span className={`${C}-kicker ${C}-kicker-v`}>Verifiable task</span>
          <p className={`${C}-title`}>A math problem</p>
          <p className={`${C}-subtitle`}>Answer can be checked exactly.</p>

          <div className={`${C}-scalar-row`}>
            <span className={`${C}-scalar-label`}>Scalar reward</span>
            <span className={`${C}-scalar-num`}>1.0</span>
          </div>

          <div className={`${C}-critique`}>
            <span className={`${C}-critique-tag`}>Verbal critique</span>
            <span className={`${C}-agree`}>Correct;</span> verified by the
            checker. Nothing the number leaves out.
          </div>

          <div className={`${C}-raters-label`}>Population of raters</div>
          <div className={`${C}-track`} aria-hidden="true">
            {RATERS.map((r, i) => {
              const center = 50
              const restPct = 6 + i * 8
              // Converge target: move toward centre, expressed in % of track width.
              const conv = (center - restPct) * 0.9
              return (
                <span
                  key={i}
                  className={`${C}-dot ${C}-dot-v`}
                  style={{
                    left: r.left,
                    animationDelay: r.delay,
                    ['--hm-conv' as string]: `${conv}%`,
                  }}
                />
              )
            })}
          </div>

          <Gauge prefix={C} variant="v" label="How much the scalar hides" />
          <div className={`${C}-verdict ${C}-verdict-v`}>
            Number and critique agree &mdash; the scalar is honest.
          </div>
        </div>

        {/* ============ RIGHT: subjective / social ============ */}
        <div className={`${C}-card ${C}-card-s`}>
          <span className={`${C}-kicker ${C}-kicker-s`}>Subjective task</span>
          <p className={`${C}-title`}>A social-simulation turn</p>
          <p className={`${C}-subtitle`}>Quality lives in the details.</p>

          <div className={`${C}-scalar-row`}>
            <span className={`${C}-scalar-label`}>Scalar reward</span>
            <span className={`${C}-scalar-num ${C}-scalar-num-s`}>0.7</span>
          </div>

          <div className={`${C}-critique`}>
            <span className={`${C}-critique-tag`}>Verbal critique</span>
            Reached the goal, but <span className={`${C}-flag`}>broke
            character in turn&nbsp;3</span>; over-polite; and{' '}
            <span className={`${C}-flag`}>leaked the secret</span> it should
            have kept.
          </div>

          <div className={`${C}-raters-label`}>Population of raters</div>
          <div className={`${C}-track`} aria-hidden="true">
            {RATERS.map((r, i) => (
              <span
                key={i}
                className={`${C}-dot ${C}-dot-s`}
                style={{
                  left: r.left,
                  animationDelay: r.delay,
                  ['--hm-fan' as string]: `${FAN_OFFSETS[i]}%`,
                }}
              />
            ))}
          </div>

          <Gauge prefix={C} variant="s" label="How much the scalar hides" />
          <div className={`${C}-verdict ${C}-verdict-s`}>
            Number hides the verdict &mdash; the scalar is dishonest.
          </div>
        </div>
      </div>

      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure:</strong> where correctness is checkable the scalar and
        the critique agree (the number is honest); in subjective tasks the
        scalar compresses away the very thing being judged (dishonest). Verbal
        feedback helps most exactly where the scalar hides the most.
      </figcaption>
    </figure>
  )
}

/* ----------------------------- Gauge ----------------------------- */

function Gauge({
  prefix,
  variant,
  label,
}: {
  prefix: string
  variant: 'v' | 's'
  label: string
}) {
  const C = prefix
  // Semicircle from 180deg (left) to 0deg (right). We draw three coloured zones
  // plus tick marks, then a pivoting needle. Center of the dial is (100, 92).
  return (
    <div className={`${C}-gauge-wrap`}>
      <svg
        viewBox="0 0 200 110"
        width="100%"
        height="auto"
        style={{ maxWidth: 200 }}
        aria-hidden="true"
      >
        {/* zone arcs */}
        <path
          d={arc(100, 92, 74, 180, 132)}
          fill="none"
          stroke="#6ee7b7"
          strokeWidth={12}
          strokeLinecap="round"
        />
        <path
          d={arc(100, 92, 74, 132, 48)}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={12}
        />
        <path
          d={arc(100, 92, 74, 48, 0)}
          fill="none"
          stroke="#f87171"
          strokeWidth={12}
          strokeLinecap="round"
        />
        {/* inner faint guide */}
        <path
          d={arc(100, 92, 74, 180, 0)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={1}
          opacity={0.6}
        />
        {/* zone labels */}
        <text x={26} y={104} fontSize={8} fill="#047857" fontWeight={600}>
          low
        </text>
        <text
          x={174}
          y={104}
          fontSize={8}
          fill="#b91c1c"
          fontWeight={600}
          textAnchor="end"
        >
          high
        </text>

        {/* needle: drawn pointing up from the hub; rotated by CSS keyframes.
            Resting (no-anim) angle handled in CSS for reduced motion. */}
        <g
          className={`${C}-needle ${
            variant === 'v' ? `${C}-needle-v` : `${C}-needle-s`
          }`}
        >
          <polygon
            points="100,30 96,90 104,90"
            fill={variant === 'v' ? '#10b981' : '#dc2626'}
          />
        </g>
        <circle cx={100} cy={92} r={6} className={`${C}-needle-hub`} />
        <circle cx={100} cy={92} r={2.5} fill="#ffffff" />
      </svg>
      <div className={`${C}-gauge-label`}>{label}</div>
    </div>
  )
}

/**
 * Build an SVG arc path between two angles (degrees, measured CCW from +x axis,
 * so 180 = left, 0 = right) on a circle of the given radius, centred at (cx,cy).
 * Drawn as the top semicircle (y above the centre).
 */
function arc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const toRad = (d: number) => (d * Math.PI) / 180
  const sx = cx + r * Math.cos(toRad(startDeg))
  const sy = cy - r * Math.sin(toRad(startDeg))
  const ex = cx + r * Math.cos(toRad(endDeg))
  const ey = cy - r * Math.sin(toRad(endDeg))
  // sweep flag 1 draws the short clockwise arc over the top for start > end.
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${r} ${r} 0 0 1 ${ex.toFixed(
    2,
  )} ${ey.toFixed(2)}`
}
'use client'

// Illustrates the paper's qualitative finding (Table 2): as the policy improves,
// the verbal critique gets finer-grained — early feedback flags blunt failures,
// later feedback targets subtle ones. Paraphrased, not verbatim quotes.

const STAGES = [
  {
    when: 'Early training',
    dot: '#f59e0b',
    grain: 'coarse',
    critique:
      'The agent barely negotiated at all — it accepted the first offer and never stated what it actually wanted.',
    note: 'Blunt, structural failures',
  },
  {
    when: 'Late training',
    dot: '#10b981',
    grain: 'fine',
    critique:
      'The negotiation scheme was over-complicated and the constraints were left unclear, so the counterpart could not tell which terms were firm.',
    note: 'Subtle, higher-order failures',
  },
]

const FeedbackEvolutionCard = () => {
  return (
    <figure
      className="fullwidth not-prose my-8"
      role="img"
      aria-label="Two example critiques showing how verbal feedback gets finer-grained over training: early feedback flags blunt failures like not negotiating at all, while later feedback targets subtle failures like an over-complicated scheme with unclear constraints."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {STAGES.map((s) => (
          <div
            key={s.when}
            className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: s.dot }}
                />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  {s.when}
                </span>
              </div>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ background: `${s.dot}1a`, color: s.dot }}
              >
                {s.grain}-grained
              </span>
            </div>
            <p className="text-[14px] italic leading-snug text-zinc-700">
              &ldquo;{s.critique}&rdquo;
            </p>
            <div className="mt-auto border-t border-zinc-100 pt-2 text-[12px] text-zinc-400">
              {s.note}
            </div>
          </div>
        ))}
      </div>
      <figcaption className="mt-4 text-center text-sm text-zinc-500">
        <strong>Figure (illustrative, after the paper&rsquo;s Table 2):</strong> The
        critique sharpens as the policy improves. Early on it names blunt,
        structural failures; later it targets subtle ones a scalar reward would
        never surface. This is why the verbal channel keeps producing a better
        target even as scores saturate.
      </figcaption>
    </figure>
  )
}

export default FeedbackEvolutionCard

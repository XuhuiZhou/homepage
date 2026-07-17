'use client'

const rows = [
  {
    name: 'REINFORCE',
    signal: 'R',
    baseline: 'optional moving average',
    idea: 'Push up sampled answers in proportion to return.',
  },
  {
    name: 'RLOO',
    signal: 'A_i = R_i - mean(R_-i)',
    baseline: 'other samples for the same prompt',
    idea: 'Compare each answer to sibling answers without training a critic.',
  },
  {
    name: 'GRPO',
    signal: 'A_i = (R_i - mean(R_group)) / std(R_group)',
    baseline: 'other answers to the same prompt',
    idea: 'Normalize the group comparison before applying a PPO-style update.',
  },
  {
    name: 'Actor-Critic / PPO',
    signal: 'A = R_t - V(s_t) or GAE',
    baseline: 'learned critic',
    idea: 'Use a value model to reduce variance; PPO also clips large updates.',
  },
]

export default function AlgorithmMap() {
  return (
    <figure className="not-prose my-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Same skeleton, different advantage estimates
        </div>
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Most policy-gradient variants change how they estimate "better than
          expected."
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs tracking-[0.12em] text-zinc-500 uppercase dark:border-zinc-800">
              <th className="px-5 py-3 font-semibold">method</th>
              <th className="px-5 py-3 font-semibold">weight on log-prob</th>
              <th className="px-5 py-3 font-semibold">baseline</th>
              <th className="px-5 py-3 font-semibold">plain meaning</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.name}
                className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
              >
                <td className="px-5 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                  {row.name}
                </td>
                <td className="px-5 py-4 font-mono text-[13px] text-zinc-700 dark:text-zinc-300">
                  {row.signal}
                </td>
                <td className="px-5 py-4 text-zinc-700 dark:text-zinc-300">
                  {row.baseline}
                </td>
                <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">
                  {row.idea}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

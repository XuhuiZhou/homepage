import type { Metadata } from 'next'
import { ALL_GROUPS, MODEL_KEYS } from './data'
import { BenchmarkLifecycle } from './BenchmarkLifecycle'
import { CurrentReleaseMatrix } from './CurrentReleaseMatrix'
import { RELEASE_REPORTS } from './history-data'
import { SafetyCoverage } from './SafetyCoverage'
import { SAFETY_EVALUATIONS } from './safety-data'

const CURRENT_BENCHMARK_ROWS = ALL_GROUPS.flatMap((group) => group.rows)
const CURRENT_REPORTING_DISTRIBUTION = CURRENT_BENCHMARK_ROWS.reduce<
  Record<number, number>
>((counts, row) => {
  const reportCount = MODEL_KEYS.filter(
    (model) => (row[model] ?? 'NR') !== 'NR',
  ).length
  counts[reportCount] = (counts[reportCount] ?? 0) + 1
  return counts
}, {})
const CURRENT_SINGLE_REPORT_ROWS = CURRENT_REPORTING_DISTRIBUTION[1] ?? 0
const CURRENT_SHARED_ROWS =
  CURRENT_BENCHMARK_ROWS.length - CURRENT_SINGLE_REPORT_ROWS
const CURRENT_ALL_REPORT_ROWS =
  CURRENT_REPORTING_DISTRIBUTION[MODEL_KEYS.length] ?? 0
const CURRENT_SAFETY_SINGLE_REPORT_ROWS = SAFETY_EVALUATIONS.filter(
  (evaluation) => Object.keys(evaluation.coverage).length === 1,
).length

const SITE_URL = 'https://xuhuiz.com'
const PAGE_URL = `${SITE_URL}/benchmarks/frontier-models`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Frontier Model Benchmark Matrix | Xuhui Zhou',
  description: `An audited ${CURRENT_BENCHMARK_ROWS.length}-row current-release capability matrix, safety-reporting map, and interactive history of frontier benchmark reporting.`,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Frontier Model Benchmark Matrix',
    description: `An ${CURRENT_BENCHMARK_ROWS.length}-row current-release capability matrix, ${SAFETY_EVALUATIONS.length} safety-evaluation rows, and ${RELEASE_REPORTS.length} release bundles of reporting history.`,
    type: 'article',
    url: PAGE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frontier Model Benchmark Matrix',
    description: `An ${CURRENT_BENCHMARK_ROWS.length}-row current-release capability matrix, ${SAFETY_EVALUATIONS.length} safety-evaluation rows, and ${RELEASE_REPORTS.length} release bundles of reporting history.`,
    creator: '@nlpxuhui',
  },
}

export default function FrontierModelsPage() {
  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
      <header className="mb-8 border-b border-zinc-200 pb-7 dark:border-zinc-800">
        <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
          Audited July 16, 2026
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Frontier Model Benchmark Matrix
        </h1>
        <p className="mt-3 max-w-4xl text-base text-zinc-600 dark:text-zinc-400">
          Public numeric capability results for GPT-5.6 Sol, Claude Mythos and
          Fable 5, Muse Spark 1.1, Grok 4.5, Thinking Machines&apos; Inkling,
          and Kimi K3. NR means no public numeric result was found in the
          audited sources.
        </p>
        <p className="mt-3 max-w-4xl text-base text-zinc-600 dark:text-zinc-400">
          A benchmark is only one projection of model behavior. Increasingly, a
          compelling real-world demo, such as watching a model build a game, can
          feel more persuasive than another leaderboard point because people
          care whether a model is capable, reliable, and pleasant to work with.
          That instinct is a useful response to Goodhart&apos;s law, but science
          needs more than vibes: the challenge is to turn those real-use
          qualities into repeatable evaluations.
        </p>
        <nav
          className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm"
          aria-label="Page sections"
        >
          <a className="underline underline-offset-4" href="#current-releases">
            Current releases
          </a>
          <a className="underline underline-offset-4" href="#safety">
            Safety reporting
          </a>
          <a className="underline underline-offset-4" href="#lifecycle">
            Reporting history
          </a>
        </nav>
      </header>

      <details
        open
        className="mb-8 rounded-md border border-zinc-200 bg-zinc-50/70 p-4 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400"
      >
        <summary className="cursor-pointer text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Interpretation warning
        </summary>
        <p className="mt-2">
          These numbers are not a clean apples-to-apples leaderboard. Labs and
          third-party evaluators often use different harnesses, tool access,
          prompts, checkpoints, compute budgets, and reporting conventions; even
          the same benchmark name can refer to multiple non-identical settings.
          I use public numbers from official releases or third-party sources
          when available, treating them as good-faith reports of the strongest
          result each source chose to publish. I also assume labs often run many
          internal evaluations that never appear in public launch materials.
          This table is about what an outside reader can verify and compare from
          public evidence. More public reporting would be useful even when
          numbers are not perfectly compatible, as long as the harness, tools,
          checkpoints, and other settings are clear enough to interpret the
          result.
        </p>
      </details>

      <section
        className="mb-10 border-y border-zinc-200 py-5 dark:border-zinc-800"
        aria-labelledby="tldr-heading"
      >
        <h2 id="tldr-heading" className="text-sm font-medium uppercase">
          TL;DR
        </h2>
        <div className="mt-4 grid gap-5 text-sm leading-relaxed text-zinc-600 md:grid-cols-3 dark:text-zinc-400">
          <p>
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">
              Reporting choices shape the story:
            </strong>{' '}
            For {CURRENT_BENCHMARK_ROWS.length} capability benchmark rows in the
            current matrix, {CURRENT_SINGLE_REPORT_ROWS} are unique;{' '}
            {CURRENT_SHARED_ROWS} appear in two or more releases; only{' '}
            {CURRENT_ALL_REPORT_ROWS}{' '}
            {CURRENT_ALL_REPORT_ROWS === 1 ? 'appears' : 'appear'} in all{' '}
            {MODEL_KEYS.length}. Safety reporting is even more fragmented:{' '}
            {CURRENT_SAFETY_SINGLE_REPORT_ROWS} of {SAFETY_EVALUATIONS.length}{' '}
            normalized rows appear once in the current {MODEL_KEYS.length}{' '}
            releases.
          </p>
          <p>
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">
              Evaluation is moving toward real work.
            </strong>{' '}
            New additions concentrate in coding, professional tasks,
            agents/tools, and science rather than another round of static exams.
          </p>
          <p>
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">
              Benchmark reporting turns over quickly.
            </strong>{' '}
            Across 14 same-lab release transitions, only 56% of previously
            reported benchmark editions appear again in the next report; 44% are
            not carried into the next public report, though that does not prove
            the evaluation itself was retired.
          </p>
        </div>
      </section>

      <section id="current-releases" className="scroll-mt-6">
        <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_520px] lg:items-end">
          <div>
            <h2 className="text-2xl font-semibold">Current releases</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Public numeric results from the {MODEL_KEYS.length} current
              release bundles. NR means no public numeric result was found in
              the audited source.
            </p>
          </div>
          <p className="text-sm leading-relaxed text-zinc-600 lg:text-right dark:text-zinc-400">
            <strong className="font-medium text-zinc-900 dark:text-zinc-100">
              Reporting coverage is not model quality.
            </strong>{' '}
            More reported benchmark rows do not imply a better model, and NR
            does not establish that an evaluation was never run.
          </p>
        </div>

        <dl className="mb-6 grid grid-cols-2 border-y border-zinc-200 sm:grid-cols-4 dark:border-zinc-800">
          {[
            [CURRENT_BENCHMARK_ROWS.length, 'Benchmark rows'],
            [CURRENT_SINGLE_REPORT_ROWS, 'Unique to one release'],
            [CURRENT_SHARED_ROWS, 'Shared across 2+ releases'],
            [CURRENT_ALL_REPORT_ROWS, `All ${MODEL_KEYS.length} reports`],
          ].map(([value, label], index) => (
            <div
              key={label}
              className={`py-3 ${index % 2 === 1 ? 'border-l border-zinc-200 dark:border-zinc-800' : ''} ${index > 1 ? 'border-t border-zinc-200 sm:border-t-0 dark:border-zinc-800' : ''} ${index > 0 ? 'sm:border-l sm:border-zinc-200 sm:pl-4 dark:sm:border-zinc-800' : ''}`}
            >
              <dt className="text-xs text-zinc-500 uppercase dark:text-zinc-400">
                {label}
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <CurrentReleaseMatrix />
      </section>

      <SafetyCoverage />

      <BenchmarkLifecycle />

      <footer className="mt-8 border-t border-zinc-200 pt-5 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <p>
            Reporting more benchmark rows does not imply a better model. Tint
            marks the best directly comparable score. * indicates a different
            setup, metric, checkpoint, or leaderboard snapshot. Inkling results
            use effort 0.99; its forecasting rows use a nearby pre-release
            checkpoint. Kimi K3 uses max reasoning, and its launch table
            discloses benchmark-specific agent harnesses. Its DeepSWE score uses
            KimiCode on the v1.1 tasks; Kimi also reports 67.3 with
            mini-SWE-agent. Kimi says a fuller technical report will follow; no
            report was linked at audit time. S10 denotes MMMU Pro Standard 10.
            M/F denotes Claude Mythos/Fable; U denotes GPT-5.6 Sol Ultra.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 lg:justify-end">
            <a
              className="underline underline-offset-4"
              href="https://openai.com/index/gpt-5-6/"
              target="_blank"
              rel="noreferrer"
            >
              OpenAI
            </a>
            <a
              className="underline underline-offset-4"
              href="https://www-cdn.anthropic.com/d00db56fa754a1b115b6dd7cb2e3c342ee809620.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Anthropic
            </a>
            <a
              className="underline underline-offset-4"
              href="https://ai.meta.com/static-resource/muse-spark-1-1-evaluation-report"
              target="_blank"
              rel="noreferrer"
            >
              Meta
            </a>
            <a
              className="underline underline-offset-4"
              href="https://x.ai/news/grok-4-5"
              target="_blank"
              rel="noreferrer"
            >
              xAI
            </a>
            <a
              className="underline underline-offset-4"
              href="https://thinkingmachines.ai/news/introducing-inkling/"
              target="_blank"
              rel="noreferrer"
            >
              Thinking Machines
            </a>
            <a
              className="underline underline-offset-4"
              href="https://www.kimi.com/blog/kimi-k3"
              target="_blank"
              rel="noreferrer"
            >
              Kimi
            </a>
          </div>
        </div>
        <p className="mt-4 max-w-5xl border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <strong className="font-medium text-zinc-700 dark:text-zinc-300">
            Transparency note:
          </strong>{' '}
          This matrix, safety map, and reporting-history audit were created with
          assistance from AI agents and checked against the linked first-party
          sources. Mistakes may remain. If you spot one, please{' '}
          <a
            className="underline underline-offset-4"
            href="mailto:xuhuiz@cs.cmu.edu?subject=Frontier%20benchmark%20matrix%20correction"
          >
            let me know
          </a>
          ; corrections are welcome and I will update the page.
        </p>
        <p className="mt-3 max-w-5xl">
          Thanks to{' '}
          <a
            className="underline underline-offset-4"
            href="https://mars-tin.github.io/"
            target="_blank"
            rel="noreferrer"
          >
            Martin Ziqiao Ma
          </a>{' '}
          for helpful input on benchmark comparability and reporting caveats.
        </p>
      </footer>
    </main>
  )
}

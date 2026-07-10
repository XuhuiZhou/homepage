import type { Metadata } from 'next'
import {
  ALL_GROUPS,
  LEFT_GROUPS,
  MODEL_KEYS,
  MODEL_LABELS,
  RIGHT_GROUPS,
  type BenchmarkGroup,
  type ModelKey,
} from './data'
import { BenchmarkLifecycle } from './BenchmarkLifecycle'
import { SafetyCoverage } from './SafetyCoverage'

const CURRENT_BENCHMARK_ROWS = ALL_GROUPS.flatMap((group) => group.rows)
const CURRENT_REPORTING_DISTRIBUTION = CURRENT_BENCHMARK_ROWS.reduce<
  Record<number, number>
>((counts, row) => {
  const reportCount = MODEL_KEYS.filter((model) => row[model] !== 'NR').length
  counts[reportCount] = (counts[reportCount] ?? 0) + 1
  return counts
}, {})
const CURRENT_SINGLE_REPORT_ROWS = CURRENT_REPORTING_DISTRIBUTION[1] ?? 0
const CURRENT_SHARED_ROWS =
  CURRENT_BENCHMARK_ROWS.length - CURRENT_SINGLE_REPORT_ROWS
const CURRENT_ALL_REPORT_ROWS = CURRENT_REPORTING_DISTRIBUTION[4] ?? 0

const SITE_URL = 'https://xuhuiz.com'
const PAGE_URL = `${SITE_URL}/benchmarks/frontier-models`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Frontier Model Benchmark Matrix | Xuhui Zhou',
  description:
    'An audited 68-row current-release capability matrix, safety-reporting map, and interactive history of frontier benchmark reporting.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Frontier Model Benchmark Matrix',
    description:
      'A 68-row current-release capability matrix, 80 safety-evaluation rows, and one year of reporting history.',
    type: 'article',
    url: PAGE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frontier Model Benchmark Matrix',
    description:
      'A 68-row current-release capability matrix, 80 safety-evaluation rows, and one year of reporting history.',
    creator: '@nlpxuhui',
  },
}

const MODEL_STYLES: Record<ModelKey, { header: string; winner: string }> = {
  gpt: {
    header: 'border-violet-600 dark:border-violet-400',
    winner:
      'bg-violet-50 font-medium shadow-[inset_3px_0_0_#7c3aed] dark:bg-violet-500/10',
  },
  claude: {
    header: 'border-orange-600 dark:border-orange-400',
    winner:
      'bg-orange-50 font-medium shadow-[inset_3px_0_0_#ea580c] dark:bg-orange-500/10',
  },
  muse: {
    header: 'border-blue-600 dark:border-blue-400',
    winner:
      'bg-blue-50 font-medium shadow-[inset_3px_0_0_#2563eb] dark:bg-blue-500/10',
  },
  grok: {
    header: 'border-zinc-950 dark:border-zinc-100',
    winner:
      'bg-zinc-100 font-medium shadow-[inset_3px_0_0_#18181b] dark:bg-zinc-800 dark:shadow-[inset_3px_0_0_#f4f4f5]',
  },
}

function BenchmarkTable({
  groups,
  label,
}: {
  groups: BenchmarkGroup[]
  label: string
}) {
  return (
    <table
      className="w-full table-fixed border-collapse text-[12px] leading-[1.25] sm:text-[13px]"
      aria-label={label}
    >
      <colgroup>
        <col className="w-[42%]" />
        {MODEL_KEYS.map((model) => (
          <col key={model} className="w-[14.5%]" />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th className="border-t-4 border-zinc-300 px-2 py-2 text-left font-medium dark:border-zinc-700">
            Benchmark
          </th>
          {MODEL_KEYS.map((model) => (
            <th
              key={model}
              className={`border-t-4 px-1 py-2 text-center font-medium ${MODEL_STYLES[model].header}`}
            >
              <span className="block">{MODEL_LABELS[model].name}</span>
              <span className="mt-0.5 block font-normal text-zinc-500 dark:text-zinc-400">
                {MODEL_LABELS[model].variant}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      {groups.map((group) => (
        <tbody key={group.name}>
          <tr>
            <th
              scope="rowgroup"
              colSpan={5}
              className="border-y border-zinc-200 bg-zinc-100 px-2 py-1.5 text-left font-medium text-zinc-500 uppercase dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
            >
              {group.name}
            </th>
          </tr>
          {group.rows.map((row) => (
            <tr
              key={row.benchmark}
              className="border-b border-zinc-200 dark:border-zinc-800"
            >
              <th
                scope="row"
                className="px-2 py-1.5 text-left font-normal break-words"
              >
                {row.benchmark}
              </th>
              {MODEL_KEYS.map((model) => {
                const value = row[model]
                return (
                  <td
                    key={model}
                    className={`px-1 py-1.5 text-center break-words tabular-nums ${
                      value === 'NR' ? 'text-zinc-400 dark:text-zinc-600' : ''
                    } ${row.winner === model ? MODEL_STYLES[model].winner : ''}`}
                  >
                    {value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      ))}
    </table>
  )
}

export default function FrontierModelsPage() {
  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
      <header className="mb-8 border-b border-zinc-200 pb-7 dark:border-zinc-800">
        <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
          Audited July 9, 2026
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Frontier Model Benchmark Matrix
        </h1>
        <p className="mt-3 max-w-4xl text-base text-zinc-600 dark:text-zinc-400">
          Public numeric capability results for GPT-5.6 Sol, Claude Mythos and
          Fable 5, Muse Spark 1.1, and Grok 4.5. NR means no public numeric
          result was found in the audited sources.
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
              Current reports use different benchmark portfolios.
            </strong>{' '}
            Of {CURRENT_BENCHMARK_ROWS.length} capability rows in the current
            matrix, {CURRENT_SINGLE_REPORT_ROWS} are unique to one current
            release&apos;s public report and {CURRENT_SHARED_ROWS} are shared
            across at least two; only {CURRENT_ALL_REPORT_ROWS} appear in all
            four. This measures reporting overlap, not model quality: more
            reported benchmark results do not imply a better model. Safety
            reporting is also fragmented: 71 of 80 normalized rows appear in one
            current release bundle, and an unreported result does not prove the
            test was not run.
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
              Public numeric results from the four current release bundles. NR
              means no public numeric result was found in the audited source.
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
            [CURRENT_ALL_REPORT_ROWS, 'All four reports'],
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

        <div className="grid items-start gap-6 xl:grid-cols-2">
          <BenchmarkTable
            groups={LEFT_GROUPS}
            label="Professional, agent, coding, and AI self-improvement benchmarks"
          />
          <BenchmarkTable
            groups={RIGHT_GROUPS}
            label="Reasoning, science, health, multimodal, and cybersecurity benchmarks"
          />
        </div>
      </section>

      <SafetyCoverage />

      <BenchmarkLifecycle />

      <footer className="mt-8 border-t border-zinc-200 pt-5 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <p>
            Reporting more benchmark rows does not imply a better model. Tint
            marks the best directly comparable score. * indicates a different
            setup, metric, or leaderboard snapshot. M/F denotes Claude
            Mythos/Fable; U denotes GPT-5.6 Sol Ultra.
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
      </footer>
    </main>
  )
}

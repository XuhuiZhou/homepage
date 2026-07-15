'use client'

import { Check, ExternalLink } from 'lucide-react'
import { useMemo, useState } from 'react'
import { MODEL_KEYS, MODEL_LABELS, type ModelKey } from './data'
import {
  PRIOR_GROK_SAFETY_REPORT,
  SAFETY_CATEGORIES,
  SAFETY_EVALUATIONS,
  SAFETY_REPORTS,
  type SafetyCategoryId,
} from './safety-data'

type CategoryFilter = SafetyCategoryId | 'all'

const MODEL_STYLES: Record<
  ModelKey,
  { border: string; check: string; soft: string }
> = {
  gpt: {
    border: 'border-violet-600 dark:border-violet-400',
    check: 'text-violet-700 dark:text-violet-300',
    soft: 'bg-violet-50 dark:bg-violet-500/10',
  },
  claude: {
    border: 'border-orange-600 dark:border-orange-400',
    check: 'text-orange-700 dark:text-orange-300',
    soft: 'bg-orange-50 dark:bg-orange-500/10',
  },
  muse: {
    border: 'border-blue-600 dark:border-blue-400',
    check: 'text-blue-700 dark:text-blue-300',
    soft: 'bg-blue-50 dark:bg-blue-500/10',
  },
  grok: {
    border: 'border-zinc-950 dark:border-zinc-100',
    check: 'text-zinc-950 dark:text-zinc-100',
    soft: 'bg-zinc-100 dark:bg-zinc-800',
  },
  inkling: {
    border: 'border-emerald-600 dark:border-emerald-400',
    check: 'text-emerald-700 dark:text-emerald-300',
    soft: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
}

function reportedCount(model: ModelKey) {
  return SAFETY_EVALUATIONS.filter((evaluation) => evaluation.coverage[model])
    .length
}

const SAFETY_REPORTING_MODEL_COUNT = MODEL_KEYS.filter(
  (model) => reportedCount(model) > 0,
).length
const SAFETY_SINGLE_REPORT_ROWS = SAFETY_EVALUATIONS.filter(
  (evaluation) => Object.keys(evaluation.coverage).length === 1,
).length
const SAFETY_MAX_REPORT_COUNT = Math.max(
  ...SAFETY_EVALUATIONS.map(
    (evaluation) => Object.keys(evaluation.coverage).length,
  ),
)
const SAFETY_MAX_REPORT_NAMES = SAFETY_EVALUATIONS.filter(
  (evaluation) =>
    Object.keys(evaluation.coverage).length === SAFETY_MAX_REPORT_COUNT,
)
  .map((evaluation) => evaluation.name)
  .join(' and ')

export function SafetyCoverage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [selectedEvaluationId, setSelectedEvaluationId] = useState('vct')

  const visibleEvaluations = useMemo(
    () =>
      categoryFilter === 'all'
        ? SAFETY_EVALUATIONS
        : SAFETY_EVALUATIONS.filter(
            (evaluation) => evaluation.category === categoryFilter,
          ),
    [categoryFilter],
  )

  const selectedEvaluation =
    visibleEvaluations.find(
      (evaluation) => evaluation.id === selectedEvaluationId,
    ) ?? visibleEvaluations[0]

  const visibleGroups = SAFETY_CATEGORIES.map((category) => ({
    ...category,
    evaluations: visibleEvaluations.filter(
      (evaluation) => evaluation.category === category.id,
    ),
  })).filter((category) => category.evaluations.length > 0)

  return (
    <section
      id="safety"
      className="mt-16 scroll-mt-6 border-t border-zinc-300 pt-10 dark:border-zinc-700"
    >
      <header>
        <h2 className="text-2xl font-semibold sm:text-3xl">Safety reporting</h2>
      </header>

      <dl className="mt-7 grid max-w-4xl grid-cols-3 border-y border-zinc-200 py-4 dark:border-zinc-800">
        <div>
          <dt className="text-xs text-zinc-500 uppercase dark:text-zinc-400">
            Evaluation rows
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {SAFETY_EVALUATIONS.length}
          </dd>
        </div>
        <div className="border-l border-zinc-200 pl-4 dark:border-zinc-800">
          <dt className="text-xs text-zinc-500 uppercase dark:text-zinc-400">
            Safety dimensions
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {SAFETY_CATEGORIES.length}
          </dd>
        </div>
        <div className="border-l border-zinc-200 pl-4 dark:border-zinc-800">
          <dt className="text-xs text-zinc-500 uppercase dark:text-zinc-400">
            Release safety reports
          </dt>
          <dd className="mt-1 text-2xl font-semibold tabular-nums">
            {SAFETY_REPORTING_MODEL_COUNT} / {MODEL_KEYS.length}
          </dd>
        </div>
      </dl>

      <section
        className="mt-7 max-w-5xl border-y border-zinc-200 py-4 dark:border-zinc-800"
        aria-labelledby="safety-takeaway-heading"
      >
        <h3
          id="safety-takeaway-heading"
          className="text-sm font-medium uppercase"
        >
          Safety takeaway
        </h3>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          Safety reporting is broad but highly fragmented. Of{' '}
          {SAFETY_EVALUATIONS.length} normalized evaluation rows,{' '}
          {SAFETY_SINGLE_REPORT_ROWS} appear in only one current release
          document. The widest overlap is {SAFETY_MAX_REPORT_COUNT} reports,
          reached by {SAFETY_MAX_REPORT_NAMES}. These counts measure public
          disclosure overlap, not which model is safest or how much safety
          testing each lab performed.
        </p>
      </section>

      <div
        className="mt-8 grid border-y border-zinc-200 sm:grid-cols-2 lg:grid-cols-7 dark:border-zinc-800"
        role="group"
        aria-label="Filter safety evaluations by dimension"
      >
        <button
          type="button"
          aria-pressed={categoryFilter === 'all'}
          onClick={() => setCategoryFilter('all')}
          className={`border-b border-zinc-200 px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 sm:border-r lg:border-b-0 dark:border-zinc-800 dark:focus-visible:outline-zinc-100 ${
            categoryFilter === 'all'
              ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
              : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          <span className="block text-sm font-medium">All dimensions</span>
          <span
            className={`mt-1 block text-xs ${
              categoryFilter === 'all'
                ? 'text-zinc-300 dark:text-zinc-600'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            Across all six questions
          </span>
          <span
            className={`mt-1 block text-[11px] uppercase ${
              categoryFilter === 'all'
                ? 'text-zinc-300 dark:text-zinc-600'
                : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            {SAFETY_EVALUATIONS.length} rows
          </span>
        </button>
        {SAFETY_CATEGORIES.map((category) => {
          const count = SAFETY_EVALUATIONS.filter(
            (evaluation) => evaluation.category === category.id,
          ).length
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={categoryFilter === category.id}
              onClick={() => setCategoryFilter(category.id)}
              className={`border-b border-zinc-200 px-3 py-3 text-left transition-colors last:border-r-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 sm:border-r lg:border-b-0 dark:border-zinc-800 dark:focus-visible:outline-zinc-100 ${
                categoryFilter === category.id
                  ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <span className="block text-sm font-medium">
                {category.label}
              </span>
              <span
                className={`mt-1 block text-xs ${
                  categoryFilter === category.id
                    ? 'text-zinc-300 dark:text-zinc-600'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {category.question}
              </span>
              <span
                className={`mt-1 block text-[11px] uppercase ${
                  categoryFilter === category.id
                    ? 'text-zinc-300 dark:text-zinc-600'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {count} rows
              </span>
            </button>
          )
        })}
      </div>

      {selectedEvaluation ? (
        <div className="mt-6 grid gap-4 border-y border-zinc-200 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.75fr)] dark:border-zinc-800">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-base font-semibold">
                {selectedEvaluation.name}
              </h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {selectedEvaluation.provenance}
              </span>
            </div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {selectedEvaluation.description}
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-x-4 gap-y-2 text-xs">
            {MODEL_KEYS.filter(
              (model) => selectedEvaluation.coverage[model],
            ).map((model) => (
              <a
                key={model}
                className={`inline-flex items-center gap-1 underline underline-offset-4 ${MODEL_STYLES[model].check}`}
                href={SAFETY_REPORTS[model].url}
                target="_blank"
                rel="noreferrer"
              >
                {MODEL_LABELS[model].name}: {selectedEvaluation.coverage[model]}
                <ExternalLink aria-hidden="true" className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 overflow-x-auto border-y border-zinc-200 dark:border-zinc-800">
        <table
          className="w-full min-w-[880px] table-fixed border-collapse text-[12px] leading-[1.25] sm:text-[13px]"
          aria-label="Safety evaluation reporting coverage for current frontier model releases"
        >
          <colgroup>
            <col className="w-[40%]" />
            {MODEL_KEYS.map((model) => (
              <col key={model} className="w-[12%]" />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="border-t-4 border-zinc-300 px-2 py-2 text-left font-medium dark:border-zinc-700">
                Safety evaluation
              </th>
              {MODEL_KEYS.map((model) => (
                <th
                  key={model}
                  className={`border-t-4 px-1 py-2 text-center font-medium ${MODEL_STYLES[model].border}`}
                >
                  <a
                    className="inline-flex items-center justify-center gap-1 underline decoration-zinc-400 underline-offset-4"
                    href={SAFETY_REPORTS[model].url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {MODEL_LABELS[model].name}
                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                  </a>
                  <span className="mt-0.5 block font-normal text-zinc-500 dark:text-zinc-400">
                    {MODEL_LABELS[model].variant}
                  </span>
                  <span className="mt-1 block text-[11px] font-normal text-zinc-500 tabular-nums dark:text-zinc-400">
                    {reportedCount(model)} reported
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          {visibleGroups.map((group) => (
            <tbody key={group.id}>
              <tr>
                <th
                  scope="rowgroup"
                  colSpan={MODEL_KEYS.length + 1}
                  className="border-y border-zinc-200 bg-zinc-100 px-2 py-1.5 text-left font-medium text-zinc-500 uppercase dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                >
                  {group.label}
                </th>
              </tr>
              {group.evaluations.map((evaluation) => {
                const selected = selectedEvaluation?.id === evaluation.id
                return (
                  <tr
                    key={evaluation.id}
                    className="border-b border-zinc-200 dark:border-zinc-800"
                  >
                    <th scope="row" className="p-0 text-left font-normal">
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setSelectedEvaluationId(evaluation.id)}
                        className={`w-full px-2 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100 ${
                          selected
                            ? 'bg-zinc-100 font-medium dark:bg-zinc-900'
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                        }`}
                      >
                        {evaluation.name}
                      </button>
                    </th>
                    {MODEL_KEYS.map((model) => {
                      const reported = Boolean(evaluation.coverage[model])
                      return (
                        <td
                          key={model}
                          className={`px-1 py-2 text-center ${
                            reported ? MODEL_STYLES[model].soft : ''
                          }`}
                        >
                          {reported ? (
                            <a
                              className={`inline-flex items-center justify-center ${MODEL_STYLES[model].check}`}
                              href={SAFETY_REPORTS[model].url}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`${evaluation.name} is reported for ${MODEL_LABELS[model].name}; open source`}
                              title={`${MODEL_LABELS[model].name}: ${evaluation.coverage[model]}`}
                            >
                              <Check aria-hidden="true" className="h-4 w-4" />
                            </a>
                          ) : (
                            <span
                              className="text-zinc-300 dark:text-zinc-700"
                              aria-label={`Not publicly reported for ${MODEL_LABELS[model].name}`}
                            >
                              -
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          ))}
        </table>
      </div>

      <section
        className="mt-8 grid gap-3 border-y border-zinc-200 py-5 lg:grid-cols-[260px_1fr] dark:border-zinc-800"
        aria-labelledby="safety-taxonomy-heading"
      >
        <h3 id="safety-taxonomy-heading" className="text-base font-semibold">
          Where the categories come from
        </h3>
        <div className="max-w-5xl space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
          <p>
            These six categories are an editorial normalization for this audit,
            not a shared taxonomy endorsed by the labs. They align OpenAI&apos;s
            Model Safety, Alignment, and Preparedness sections; Anthropic&apos;s
            Safeguards, Agentic Safety, Alignment, and Responsible Scaling
            Policy sections; Meta&apos;s Advanced AI Scaling Framework,
            Adversarial Robustness, and Model Behavior scorecards; and the
            malicious-use, loss-of-control, and dual-use framing in xAI&apos;s
            earlier Grok 4.20 system card. Thinking Machines&apos; Inkling model
            card adds quantified refusal and jailbreak tests alongside broader
            dangerous-capability and human-impact testing.
          </p>
          <p>
            <strong className="font-medium text-zinc-800 dark:text-zinc-200">
              Control + authorization
            </strong>{' '}
            asks whether a tool-using model stays within the user&apos;s intent,
            seeks consent for consequential actions, and avoids destructive or
            malicious acts.{' '}
            <strong className="font-medium text-zinc-800 dark:text-zinc-200">
              Human impact
            </strong>{' '}
            groups mental health, child safety, health, bias, election
            integrity, and related effects on people and groups.
          </p>
        </div>
      </section>

      <div className="mt-5 grid gap-3 text-sm text-zinc-500 lg:grid-cols-[1fr_auto] dark:text-zinc-400">
        <p className="max-w-4xl">
          A check means the audited release document published a numeric result
          or quantified rate. Metrics and protocols are usually not directly
          comparable, so this map intentionally does not crown a safety winner.
          Cyber and AI self-improvement capability benchmarks already listed in
          the current matrix are not duplicated here.
        </p>
        <p className="max-w-xl lg:text-right">
          No quantified safety result was found in the audited Grok 4.5 launch
          post; that does not show no safety testing occurred. xAI&apos;s
          earlier{' '}
          <a
            className="underline underline-offset-4"
            href={PRIOR_GROK_SAFETY_REPORT}
            target="_blank"
            rel="noreferrer"
          >
            Grok 4.20 system card
          </a>{' '}
          did report safety evaluations; none are attributed to 4.5 here.
        </p>
      </div>
    </section>
  )
}

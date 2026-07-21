'use client'

import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

type Work = {
  id: string
  year: string
  title: string
  short: string
  detail: string
  url: string
  stage: number
}

const stages = [
  {
    title: 'Reassociate',
    subtitle: 'Turn a growing table into recurrent state',
  },
  { title: 'Control', subtitle: 'Decide what to forget and overwrite' },
  { title: 'Learn', subtitle: 'Treat the state as an online learner' },
  { title: 'Scale', subtitle: 'Improve optimization and hardware use' },
  { title: 'Reframe', subtitle: 'Test the boundaries of the story' },
]

const works: Work[] = [
  {
    id: 'linear',
    year: '2020',
    title: 'Transformers are RNNs',
    short: 'Kernelized linear attention',
    detail:
      'Uses associativity to obtain linear sequence complexity and an iterative recurrent form.',
    url: 'https://arxiv.org/abs/2006.16236',
    stage: 0,
  },
  {
    id: 'fastweights',
    year: '2021',
    title: 'Fast Weight Programmers',
    short: 'Linear attention as programmable memory',
    detail:
      'Connects linearized attention to fast weights and introduces a delta-rule update for correcting finite memory.',
    url: 'https://proceedings.mlr.press/v139/schlag21a.html',
    stage: 0,
  },
  {
    id: 'gla',
    year: '2023',
    title: 'Gated Linear Attention',
    short: 'Data-dependent forgetting',
    detail:
      'Adds expressive gates and a hardware-aware chunkwise algorithm to linear attention.',
    url: 'https://arxiv.org/abs/2312.06635',
    stage: 1,
  },
  {
    id: 'longhorn',
    year: '2024',
    title: 'Longhorn',
    short: 'Closed-form online learner',
    detail:
      'Derives state-space updates from an online associative-recall objective instead of choosing the recurrence ad hoc.',
    url: 'https://arxiv.org/abs/2407.14207',
    stage: 1,
  },
  {
    id: 'gdn',
    year: '2024',
    title: 'Gated DeltaNet',
    short: 'Forget globally, edit locally',
    detail:
      'Combines adaptive decay with targeted delta updates and shows why the two memory controls are complementary.',
    url: 'https://arxiv.org/abs/2412.06464',
    stage: 1,
  },
  {
    id: 'mesa',
    year: '2023',
    title: 'Mesa-optimization',
    short: 'In-context learning as optimization',
    detail:
      'Finds gradient-based subsidiary learning algorithms inside Transformers trained on synthetic sequence tasks.',
    url: 'https://arxiv.org/abs/2309.05858',
    stage: 2,
  },
  {
    id: 'ttt',
    year: '2024',
    title: 'TTT layers',
    short: 'A model as hidden state',
    detail:
      'Makes the recurrent hidden state a linear model or MLP and updates it with self-supervised learning on the test sequence.',
    url: 'https://arxiv.org/abs/2407.04620',
    stage: 2,
  },
  {
    id: 'regression',
    year: '2025',
    title: 'Test-time regression',
    short: 'A unifying design space',
    detail:
      'Organizes associative-memory layers by the regressor, its weights, and the optimization algorithm used at test time.',
    url: 'https://arxiv.org/abs/2501.12352',
    stage: 2,
  },
  {
    id: 'titans',
    year: '2025',
    title: 'Titans',
    short: 'Neural long-term memory',
    detail:
      'Pairs attention-like short-term access with a learned neural memory designed to retain longer-range context.',
    url: 'https://arxiv.org/abs/2501.00663',
    stage: 2,
  },
  {
    id: 'deltaproduct',
    year: '2025',
    title: 'DeltaProduct',
    short: 'Multiple corrections per token',
    detail:
      'Generalizes one online gradient step into a product of several structured updates for stronger state tracking.',
    url: 'https://arxiv.org/abs/2502.10297',
    stage: 3,
  },
  {
    id: 'lact',
    year: '2025',
    title: 'TTT Done Right',
    short: 'Very large chunk updates',
    detail:
      'Uses large chunks to improve accelerator utilization and make much larger nonlinear fast-weight states practical.',
    url: 'https://arxiv.org/abs/2505.23884',
    stage: 3,
  },
  {
    id: 'mesanet',
    year: '2025/26',
    title: 'MesaNet',
    short: 'Locally optimal TTT',
    detail:
      'Uses a fast solver to optimize an in-context objective more fully at each point, trading extra inference FLOPs for quality.',
    url: 'https://arxiv.org/abs/2506.05233',
    stage: 3,
  },
  {
    id: 'kimi',
    year: '2025',
    title: 'Kimi Linear',
    short: 'Hybrid Kimi Delta Attention',
    detail:
      'Combines fine-grained delta gating with full-attention layers and a specialized chunkwise implementation.',
    url: 'https://arxiv.org/abs/2510.26692',
    stage: 3,
  },
  {
    id: 'secret',
    year: '2026',
    title: 'TTT is secretly linear attention?',
    short: 'A useful counter-interpretation',
    detail:
      'Shows that a broad class of KV-binding TTT layers can be reduced to learned linear-attention operators, challenging a literal memorization story.',
    url: 'https://arxiv.org/abs/2602.21204',
    stage: 4,
  },
  {
    id: 'gdn2',
    year: '2026',
    title: 'Gated DeltaNet-2',
    short: 'Separate erase from write',
    detail:
      'Unties how much old content is removed from how much new content is committed, while retaining efficient chunkwise training.',
    url: 'https://arxiv.org/abs/2605.22791',
    stage: 4,
  },
]

const stageTones = [
  'border-sky-200 bg-sky-50 text-sky-950',
  'border-amber-200 bg-amber-50 text-amber-950',
  'border-emerald-200 bg-emerald-50 text-emerald-950',
  'border-violet-200 bg-violet-50 text-violet-950',
  'border-rose-200 bg-rose-50 text-rose-950',
]

export default function ResearchMap() {
  const [selectedId, setSelectedId] = useState('regression')
  const selected = works.find((work) => work.id === selectedId) ?? works[0]

  return (
    <figure className="fullwidth not-prose my-10 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4">
        <div className="text-sm font-semibold text-zinc-950">
          A reading map, not a single family tree
        </div>
        <div className="mt-1 text-sm text-zinc-600">
          Select a paper to see which design question it changes. Stages overlap
          on purpose.
        </div>
      </div>

      <div className="grid gap-0 sm:grid-cols-2 xl:grid-cols-5">
        {stages.map((stage, stageIndex) => (
          <section
            key={stage.title}
            className="border-b border-zinc-200 p-4 last:border-r-0 sm:border-r xl:border-b-0"
          >
            <div className="mb-4 min-h-16">
              <div className="text-xs font-semibold tracking-[0.12em] text-zinc-400 uppercase">
                0{stageIndex + 1}
              </div>
              <div className="mt-1 text-sm font-semibold text-zinc-950">
                {stage.title}
              </div>
              <div className="mt-1 text-xs leading-5 text-zinc-500">
                {stage.subtitle}
              </div>
            </div>
            <div className="space-y-2">
              {works
                .filter((work) => work.stage === stageIndex)
                .map((work) => (
                  <button
                    key={work.id}
                    type="button"
                    onClick={() => setSelectedId(work.id)}
                    aria-pressed={selectedId === work.id}
                    className={`w-full rounded-md border p-3 text-left transition-all ${
                      selectedId === work.id
                        ? `${stageTones[stageIndex]} ring-2 ring-zinc-900/10`
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm leading-5 font-semibold">
                        {work.title}
                      </span>
                      <span className="font-mono text-[11px] opacity-60">
                        {work.year}
                      </span>
                    </div>
                    <div className="mt-1 text-xs leading-5 opacity-70">
                      {work.short}
                    </div>
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>

      <div className="grid gap-4 border-t border-zinc-200 bg-zinc-950 px-5 py-5 text-white md:grid-cols-[11rem_1fr_auto] md:items-center">
        <div>
          <div className="font-mono text-xs text-zinc-400">{selected.year}</div>
          <div className="mt-1 text-sm font-semibold">{selected.title}</div>
        </div>
        <div className="text-sm leading-6 text-zinc-300">{selected.detail}</div>
        <a
          href={selected.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Paper <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>

      <figcaption className="border-t border-zinc-200 px-5 py-3 text-sm text-zinc-600">
        A selective path through the literature named in or adjacent to the
        video. It is organized by the idea each work contributes, not by
        priority or a claim of completeness.
      </figcaption>
    </figure>
  )
}

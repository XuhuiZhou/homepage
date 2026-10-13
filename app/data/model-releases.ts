export type ModelRelease = {
  name: string
  date: string
  organization: string
  url: string
  reportUrl: string
  reportLabel: string
  description: string
}

export const MODEL_RELEASES: ModelRelease[] = [
  {
    name: 'Muse Wonder',
    date: '2026-10-12',
    organization: 'Meta Superintelligence TBD Lab',
    url: 'https://research.meta.ai/blog/muse-wonder',
    reportUrl: 'https://research.meta.ai/static/muse-wonder-model-card',
    reportLabel: 'Model card',
    description: 'A model family for personal and professional AI agents, with Active Memory and Active Focus.',
  },
  {
    name: 'Muse Spark 1.3',
    date: '2026-09-02',
    organization: 'Meta Superintelligence TBD Lab',
    url: 'https://research.meta.ai/blog/introducing-muse-spark-1-3',
    reportUrl: 'https://research.meta.ai/static/muse-spark-1-3-multimodal-evaluation-methodology',
    reportLabel: 'Evaluation report',
    description: 'A model release focused on long-running agent workflows, user collaboration, and coding.',
  },
]

export type ModelKey = 'gpt' | 'claude' | 'muse' | 'grok'

export type BenchmarkRow = {
  benchmark: string
  gpt: string
  claude: string
  muse: string
  grok: string
  winner?: ModelKey
}

export type BenchmarkGroup = {
  name: string
  rows: BenchmarkRow[]
}

export const MODEL_KEYS: ModelKey[] = ['gpt', 'claude', 'muse', 'grok']

export const MODEL_LABELS: Record<ModelKey, { name: string; variant: string }> =
  {
    gpt: { name: 'GPT-5.6', variant: 'Sol' },
    claude: { name: 'Claude 5', variant: 'Mythos / Fable' },
    muse: { name: 'Muse Spark', variant: '1.1' },
    grok: { name: 'Grok', variant: '4.5' },
  }

export const LEFT_GROUPS: BenchmarkGroup[] = [
  {
    name: 'Professional',
    rows: [
      {
        benchmark: "Agents' Last Exam",
        gpt: '52.7',
        claude: '40.5 F',
        muse: 'NR',
        grok: 'NR',
        winner: 'gpt',
      },
      {
        benchmark: 'GDPval-AA v2*',
        gpt: '1747.8',
        claude: '1759.6 F',
        muse: '1381',
        grok: 'NR',
      },
      {
        benchmark: 'AA Intelligence Index v4.1',
        gpt: '58.9',
        claude: '59.9 F',
        muse: 'NR',
        grok: 'NR',
        winner: 'claude',
      },
      {
        benchmark: 'Management Consulting (internal)',
        gpt: '43.2',
        claude: '35.5 F',
        muse: 'NR',
        grok: 'NR',
        winner: 'gpt',
      },
      {
        benchmark: 'Finance Agent v2',
        gpt: 'NR',
        claude: '56.3 F',
        muse: '57.2',
        grok: 'NR',
        winner: 'muse',
      },
      {
        benchmark: 'Big Finance Bench',
        gpt: '53.0',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'JobBench',
        gpt: 'NR',
        claude: 'NR',
        muse: '54.7',
        grok: 'NR',
      },
      {
        benchmark: 'OfficeQA Pro',
        gpt: 'NR',
        claude: '57.9 F',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'Legal Agent (Harvey held-out)',
        gpt: 'NR',
        claude: '13.3 F',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'Legal Agent (full public)',
        gpt: 'NR',
        claude: '16.9 M',
        muse: 'NR',
        grok: 'NR',
      },
    ],
  },
  {
    name: 'Agents + tools',
    rows: [
      {
        benchmark: 'BrowseComp',
        gpt: '90.4',
        claude: '88.0 M',
        muse: 'NR',
        grok: 'NR',
        winner: 'gpt',
      },
      {
        benchmark: 'BrowseComp multi-agent*',
        gpt: '92.2 U',
        claude: '93.3 M',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'MCP Atlas',
        gpt: 'NR',
        claude: '83.3 F',
        muse: '88.1',
        grok: 'NR',
        winner: 'muse',
      },
      {
        benchmark: 'Toolathlon',
        gpt: '58.0',
        claude: '61.7 M',
        muse: 'NR',
        grok: 'NR',
        winner: 'claude',
      },
      {
        benchmark: 'Toolathlon-Verified',
        gpt: 'NR',
        claude: 'NR',
        muse: '75.6',
        grok: 'NR',
      },
      {
        benchmark: 'AutomationBench',
        gpt: '18.1',
        claude: '17.4 F',
        muse: 'NR',
        grok: 'NR',
        winner: 'gpt',
      },
      {
        benchmark: 'OSWorld 2.0*',
        gpt: '62.6',
        claude: 'NR',
        muse: '14.2 / 47.3',
        grok: 'NR',
      },
      {
        benchmark: 'OSWorld-Verified',
        gpt: 'NR',
        claude: '85.0 M/F',
        muse: '80.8',
        grok: 'NR',
        winner: 'claude',
      },
      {
        benchmark: 'WebArena-Verified',
        gpt: 'NR',
        claude: 'NR',
        muse: '69.0',
        grok: 'NR',
      },
      {
        benchmark: 'DeepSearchQA*',
        gpt: 'NR',
        claude: '94.2 M',
        muse: '84.9',
        grok: 'NR',
      },
    ],
  },
  {
    name: 'Coding',
    rows: [
      {
        benchmark: 'SWE-Bench Pro',
        gpt: '64.6',
        claude: '80.3 M',
        muse: '61.5',
        grok: '64.7',
        winner: 'claude',
      },
      {
        benchmark: 'Terminal-Bench 2.1',
        gpt: '88.8',
        claude: '88.0 M',
        muse: '80.0',
        grok: '83.3',
        winner: 'gpt',
      },
      {
        benchmark: 'DeepSWE 1.1',
        gpt: '72.7',
        claude: '69.7 F',
        muse: '53.3',
        grok: '53.0',
        winner: 'gpt',
      },
      {
        benchmark: 'DeepSWE 1.0',
        gpt: 'NR',
        claude: '66.1 F',
        muse: 'NR',
        grok: '62.0',
        winner: 'claude',
      },
      {
        benchmark: 'SWE Marathon',
        gpt: 'NR',
        claude: '24.0 F',
        muse: 'NR',
        grok: '29.0',
        winner: 'grok',
      },
      {
        benchmark: 'AA Coding Agent Index v1.1',
        gpt: '80.0',
        claude: '77.2 F',
        muse: 'NR',
        grok: 'NR',
        winner: 'gpt',
      },
      {
        benchmark: 'SWE-Bench Verified',
        gpt: 'NR',
        claude: '95.5 M',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'FrontierCode Diamond',
        gpt: 'NR',
        claude: '29.3 F',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'CritPt',
        gpt: 'NR',
        claude: '28.6 M',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'ArxivMath',
        gpt: 'NR',
        claude: '78.5 M',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'RiemannBench',
        gpt: 'NR',
        claude: '55.0 M',
        muse: 'NR',
        grok: 'NR',
      },
    ],
  },
  {
    name: 'AI self-improvement',
    rows: [
      {
        benchmark: 'Internal Research Debugging',
        gpt: '68.3',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'KernelGen 1P',
        gpt: '61.1',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'NanoGPT',
        gpt: '9.69',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'PostTrainBench Lite',
        gpt: '50.3',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'RSI Index',
        gpt: '57.9',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
    ],
  },
]

export const RIGHT_GROUPS: BenchmarkGroup[] = [
  {
    name: 'Reasoning + long context',
    rows: [
      {
        benchmark: "Humanity's Last Exam (no tools)*",
        gpt: 'NR',
        claude: '59.0 M',
        muse: '52.2',
        grok: 'NR',
      },
      {
        benchmark: "Humanity's Last Exam (with tools)*",
        gpt: 'NR',
        claude: '64.5 M',
        muse: '62.1',
        grok: 'NR',
      },
      {
        benchmark: 'GPQA Diamond',
        gpt: '94.6',
        claude: '94.1 M',
        muse: 'NR',
        grok: 'NR',
        winner: 'gpt',
      },
      {
        benchmark: 'FrontierMath Tier 1-3 v2',
        gpt: '89.0',
        claude: '87.0 F',
        muse: 'NR',
        grok: 'NR',
        winner: 'gpt',
      },
      {
        benchmark: 'FrontierMath Tier 4 v2',
        gpt: '83.0',
        claude: '87.8 F',
        muse: 'NR',
        grok: 'NR',
        winner: 'claude',
      },
      {
        benchmark: 'MRCR 256K-512K',
        gpt: '91.5',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'MRCR 512K-1M*',
        gpt: '73.8',
        claude: 'NR',
        muse: '54.1',
        grok: 'NR',
      },
      {
        benchmark: 'GraphWalks BFS 256K',
        gpt: '90.7',
        claude: '91.1 M',
        muse: 'NR',
        grok: 'NR',
        winner: 'claude',
      },
      {
        benchmark: 'GraphWalks BFS 1M',
        gpt: '77.1',
        claude: '79.4 M',
        muse: 'NR',
        grok: 'NR',
        winner: 'claude',
      },
      {
        benchmark: 'GraphWalks Parents 256K',
        gpt: 'NR',
        claude: '99.96 M',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'ARC-AGI-3',
        gpt: '7.78',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
    ],
  },
  {
    name: 'Science + health',
    rows: [
      {
        benchmark: 'HealthBench Professional*',
        gpt: '60.5',
        claude: '66.0 M',
        muse: '59.3',
        grok: 'NR',
      },
      {
        benchmark: 'HealthBench*',
        gpt: '57.0',
        claude: '62.7 M',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'GeneBench Pro',
        gpt: '28.7',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'LifeSciBench',
        gpt: '59.9',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'MedChemBench (internal)',
        gpt: '48.3',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'BioMysteryBench (hard)',
        gpt: 'NR',
        claude: '46.1 M',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'BioMysteryBench (human solved)',
        gpt: 'NR',
        claude: '83.9 M',
        muse: 'NR',
        grok: 'NR',
      },
    ],
  },
  {
    name: 'Multimodal',
    rows: [
      {
        benchmark: 'gdp.pdf',
        gpt: '30.7',
        claude: '29.8 F',
        muse: 'NR',
        grok: 'NR',
        winner: 'gpt',
      },
      {
        benchmark: 'BenchCAD',
        gpt: '70.6',
        claude: '38.4 M',
        muse: 'NR',
        grok: 'NR',
        winner: 'gpt',
      },
      {
        benchmark: 'BenchCAD + Python',
        gpt: '83.4',
        claude: '65.0 M',
        muse: 'NR',
        grok: 'NR',
        winner: 'gpt',
      },
      {
        benchmark: 'CharXiv Reasoning (no tools)',
        gpt: 'NR',
        claude: '88.9 M',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'CharXiv Reasoning (with tools)',
        gpt: 'NR',
        claude: '93.5 M',
        muse: '88.4',
        grok: 'NR',
        winner: 'claude',
      },
      {
        benchmark: 'BabyVision (with tools)',
        gpt: 'NR',
        claude: 'NR',
        muse: '76.3',
        grok: 'NR',
      },
      {
        benchmark: 'Blueprint-Bench 2',
        gpt: 'NR',
        claude: '38.6 M/F',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'MMMU Pro (no tools)',
        gpt: '83.0',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'MMMU Pro (with tools)',
        gpt: '84.6',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
    ],
  },
  {
    name: 'Cybersecurity',
    rows: [
      {
        benchmark: 'CyberGym',
        gpt: '84.5',
        claude: '83.8 M',
        muse: '59.0',
        grok: 'NR',
        winner: 'gpt',
      },
      {
        benchmark: 'ExploitBench',
        gpt: '73.5',
        claude: '78.0 M',
        muse: 'NR',
        grok: 'NR',
        winner: 'claude',
      },
      {
        benchmark: 'ExploitGym (2h)',
        gpt: '24.9',
        claude: 'NR',
        muse: '0.6',
        grok: 'NR',
        winner: 'gpt',
      },
      {
        benchmark: 'Capture-the-Flag Challenges',
        gpt: '96.7',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
      {
        benchmark: 'SEC-Bench Pro',
        gpt: '71.2',
        claude: 'NR',
        muse: 'NR',
        grok: 'NR',
      },
    ],
  },
]

export const ALL_GROUPS = [...LEFT_GROUPS, ...RIGHT_GROUPS]

export const COVERAGE = MODEL_KEYS.reduce<Record<ModelKey, number>>(
  (counts, model) => {
    counts[model] = ALL_GROUPS.flatMap((group) => group.rows).filter(
      (row) => row[model] !== 'NR',
    ).length
    return counts
  },
  { gpt: 0, claude: 0, muse: 0, grok: 0 },
)

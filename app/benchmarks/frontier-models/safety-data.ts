import type { ModelKey } from './data'

export type SafetyCategoryId =
  | 'dangerous-capability'
  | 'harm-refusal'
  | 'adversarial-robustness'
  | 'agentic-control'
  | 'alignment-oversight'
  | 'user-societal'

export type SafetyCategory = {
  id: SafetyCategoryId
  label: string
  question: string
}

export type SafetyEvaluation = {
  id: string
  name: string
  category: SafetyCategoryId
  provenance:
    | 'Public benchmark'
    | 'Internal evaluation'
    | 'External audit'
    | 'Mixed portfolio'
  description: string
  coverage: Partial<Record<ModelKey, string>>
}

export const SAFETY_CATEGORIES: SafetyCategory[] = [
  {
    id: 'dangerous-capability',
    label: 'Dangerous capability',
    question: 'Could it enable severe harm?',
  },
  {
    id: 'harm-refusal',
    label: 'Harm refusal',
    question: 'Will it assist harmful requests?',
  },
  {
    id: 'adversarial-robustness',
    label: 'Adversarial robustness',
    question: 'Can safeguards be bypassed?',
  },
  {
    id: 'agentic-control',
    label: 'Control + authorization',
    question: "Does it exceed the user's intent?",
  },
  {
    id: 'alignment-oversight',
    label: 'Alignment + oversight',
    question: 'Could it deceive, scheme, or evade?',
  },
  {
    id: 'user-societal',
    label: 'Human impact',
    question: 'Does it protect people and groups?',
  },
]

export const SAFETY_REPORTS: Record<
  ModelKey,
  { label: string; url: string; note: string }
> = {
  gpt: {
    label: 'GPT-5.6 Preview System Card',
    url: 'https://deploymentsafety.openai.com/gpt-5-6-preview',
    note: 'Release-specific safety system card',
  },
  claude: {
    label: 'Claude Fable 5 & Mythos 5 System Card',
    url: 'https://www-cdn.anthropic.com/2f9323abbcc4abe219577539efe19a623c9ca2bd/Claude%20Fable%205%20%26%20Claude%20Mythos%205%20System%20Card.pdf',
    note: 'Release-specific safety system card',
  },
  muse: {
    label: 'Muse Spark 1.1 Evaluation Report',
    url: 'https://ai.meta.com/static-resource/muse-spark-1-1-evaluation-report',
    note: 'Release-specific evaluation and safety report',
  },
  grok: {
    label: 'Grok 4.5 Launch Report',
    url: 'https://x.ai/news/grok-4-5',
    note: 'No release-specific safety results found',
  },
  inkling: {
    label: 'Inkling Model Card',
    url: 'https://thinkingmachines.ai/model-card/inkling/',
    note: 'Release-specific model card and safety evaluation table',
  },
  kimi: {
    label: 'Kimi K3 Launch Post',
    url: 'https://www.kimi.com/blog/kimi-k3',
    note: 'Qualitative limitations; no quantified safety results found',
  },
}

export const PRIOR_GROK_SAFETY_REPORT =
  'https://data.x.ai/2026-04-07-grok-4-20-model-card.pdf'

export const SAFETY_EVALUATIONS: SafetyEvaluation[] = [
  {
    id: 'vct',
    name: 'VCT / Multimodal Troubleshooting Virology',
    category: 'dangerous-capability',
    provenance: 'Public benchmark',
    description:
      'Expert-level multimodal questions about virology knowledge and protocol troubleshooting.',
    coverage: {
      gpt: 'Sec. 9.1.1.1, Sec. 9.1.1.8',
      claude: 'Sec. 2.2.4.1',
      muse: 'Table 1',
    },
  },
  {
    id: 'protocolqa-open',
    name: 'ProtocolQA Open-Ended',
    category: 'dangerous-capability',
    provenance: 'Public benchmark',
    description:
      'Open-ended conversion of ProtocolQA for diagnosing and fixing errors in wet-lab protocols.',
    coverage: { gpt: 'Sec. 9.1.1.2' },
  },
  {
    id: 'protocolqa-mcq',
    name: 'ProtocolQA (multiple-choice)',
    category: 'dangerous-capability',
    provenance: 'Public benchmark',
    description:
      'Multiple-choice benchmark for troubleshooting failed biological laboratory protocols.',
    coverage: { muse: 'Table 1' },
  },
  {
    id: 'tacit-troubleshooting',
    name: 'Tacit Knowledge + Troubleshooting',
    category: 'dangerous-capability',
    provenance: 'Internal evaluation',
    description:
      'Unpublished expert questions about hands-on biological knowledge and troubleshooting bottlenecks.',
    coverage: { gpt: 'Sec. 9.1.1.3' },
  },
  {
    id: 'troubleshootingbench',
    name: 'TroubleshootingBench',
    category: 'dangerous-capability',
    provenance: 'Internal evaluation',
    description:
      'Expert-written, non-public wet-lab procedures containing realistic execution errors.',
    coverage: { gpt: 'Sec. 9.1.1.4' },
  },
  {
    id: 'long-form-virology',
    name: 'Long-form virology tasks',
    category: 'dangerous-capability',
    provenance: 'Mixed portfolio',
    description:
      'Agentic, medium-horizon tasks for end-to-end pathogen acquisition design.',
    coverage: { claude: 'Sec. 2.2.4.1' },
  },
  {
    id: 'dna-screening-evasion',
    name: 'DNA Synthesis Screening Evasion',
    category: 'dangerous-capability',
    provenance: 'External audit',
    description:
      'Tests whether designed DNA fragments can retain function while evading synthesis screening.',
    coverage: { claude: 'Sec. 2.2.4.1' },
  },
  {
    id: 'aav-capsid',
    name: 'AAV Capsid Packaging Prediction',
    category: 'dangerous-capability',
    provenance: 'External audit',
    description:
      'Sequence-to-function prediction for novel viral capsid variants.',
    coverage: { gpt: 'Sec. 9.1.1.5', claude: 'Sec. 2.2.4.2.2' },
  },
  {
    id: 'mbct',
    name: 'Molecular Biology Capabilities Test (MBCT)',
    category: 'dangerous-capability',
    provenance: 'External audit',
    description:
      'SecureBio expert-level assessment of molecular-biology capabilities.',
    coverage: { gpt: 'Sec. 9.1.1.8', muse: 'Table 1' },
  },
  {
    id: 'hpct',
    name: 'Human Pathogen Capabilities Test (HPCT)',
    category: 'dangerous-capability',
    provenance: 'External audit',
    description:
      'SecureBio expert-level assessment focused on human pathogens.',
    coverage: { gpt: 'Sec. 9.1.1.8', muse: 'Table 1' },
  },
  {
    id: 'world-class-bio',
    name: 'World-Class Bio',
    category: 'dangerous-capability',
    provenance: 'External audit',
    description:
      'SecureBio assessment of frontier, expert-level biological capability.',
    coverage: { gpt: 'Sec. 9.1.1.8' },
  },
  {
    id: 'wmdp-bio',
    name: 'WMDP-Bio',
    category: 'dangerous-capability',
    provenance: 'Public benchmark',
    description:
      'Dual-use biological knowledge from the Weapons of Mass Destruction Proxy suite.',
    coverage: { muse: 'Table 1' },
  },
  {
    id: 'wmdp-chem',
    name: 'WMDP-Chem',
    category: 'dangerous-capability',
    provenance: 'Public benchmark',
    description:
      'Dual-use chemical knowledge from the Weapons of Mass Destruction Proxy suite.',
    coverage: { muse: 'Table 1' },
  },
  {
    id: 'abc-fragment',
    name: 'ABC Bench: Fragment Design',
    category: 'dangerous-capability',
    provenance: 'External audit',
    description:
      'Agentic biological design task focused on DNA fragment construction.',
    coverage: { muse: 'Table 1' },
  },
  {
    id: 'abc-liquid',
    name: 'ABC Bench: Liquid Handling',
    category: 'dangerous-capability',
    provenance: 'External audit',
    description:
      'Agentic biological task focused on laboratory liquid-handling workflows.',
    coverage: { muse: 'Table 1' },
  },
  {
    id: 'abc-screening',
    name: 'ABC Bench: Screening Evasion',
    category: 'dangerous-capability',
    provenance: 'External audit',
    description:
      'Agentic biological task focused on nucleic-acid screening evasion.',
    coverage: { muse: 'Table 1' },
  },
  {
    id: 'biodesign-tools',
    name: 'BioDesign Tools',
    category: 'dangerous-capability',
    provenance: 'Mixed portfolio',
    description: 'Tool-using biological design tasks reported as an aggregate.',
    coverage: { muse: 'Table 1' },
  },
  {
    id: 'openai-production-safety',
    name: 'Production Benchmarks with Challenging Prompts',
    category: 'harm-refusal',
    provenance: 'Internal evaluation',
    description:
      'Hard production-derived prompts across violent and nonviolent illicit behavior, extremism, hate, self-harm, gore, and sexual content.',
    coverage: { gpt: 'Sec. 3.1.1' },
  },
  {
    id: 'anthropic-single-harmful',
    name: 'Single-turn harmful request evaluation',
    category: 'harm-refusal',
    provenance: 'Internal evaluation',
    description:
      'Harmless-response rate across 16 policy areas and seven languages.',
    coverage: { claude: 'Sec. 4.1.1' },
  },
  {
    id: 'anthropic-single-benign',
    name: 'Single-turn benign / over-refusal evaluation',
    category: 'harm-refusal',
    provenance: 'Internal evaluation',
    description:
      'False-refusal rate on sensitive but appropriate requests across the same policy areas.',
    coverage: { claude: 'Sec. 4.1.2' },
  },
  {
    id: 'anthropic-multiturn-harmful',
    name: 'Multi-turn harmful request evaluation',
    category: 'harm-refusal',
    provenance: 'Internal evaluation',
    description:
      'Policy-specific adversarial conversations graded for appropriate behavior throughout.',
    coverage: { claude: 'Sec. 4.1.3' },
  },
  {
    id: 'biotier-refusals',
    name: 'BioTIER refusals',
    category: 'harm-refusal',
    provenance: 'External audit',
    description: 'Refusal performance on high-risk biological requests.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'chemical-agent-refusals',
    name: 'Chemical Agents refusals',
    category: 'harm-refusal',
    provenance: 'Internal evaluation',
    description: 'Refusal performance on requests involving chemical agents.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'cyber-misuse-chat',
    name: 'Cyber Misuse Chat',
    category: 'harm-refusal',
    provenance: 'Internal evaluation',
    description:
      'Attack-success and false-refusal rates on harmful and benign cybersecurity chat requests.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'catastrophic-cyber-misuse',
    name: 'Catastrophic Cyber Misuse',
    category: 'harm-refusal',
    provenance: 'Internal evaluation',
    description:
      'Attack-success rate on cyber requests with catastrophic misuse potential.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'poly-guard',
    name: 'Poly-Guard Bench',
    category: 'harm-refusal',
    provenance: 'Public benchmark',
    description:
      'Multilingual safeguard evaluation reported as attack-success rate.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'or-bench',
    name: 'OR-Bench',
    category: 'harm-refusal',
    provenance: 'Public benchmark',
    description:
      'Over-refusal benchmark measuring false refusals on benign requests.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'agentharm-benign',
    name: 'AgentHarm Verified: benign split',
    category: 'harm-refusal',
    provenance: 'Public benchmark',
    description: 'False-refusal rate on verified benign agentic tasks.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'openai-jailbreaks',
    name: 'Adaptive multi-turn jailbreaks',
    category: 'adversarial-robustness',
    provenance: 'Internal evaluation',
    description:
      'Sophisticated attacker strategies derived from internal red teaming, reported as worst-case defender success.',
    coverage: { gpt: 'Sec. 4.1' },
  },
  {
    id: 'openai-pi-connectors',
    name: 'Prompt injection: Connectors',
    category: 'adversarial-robustness',
    provenance: 'Internal evaluation',
    description:
      'Known indirect prompt-injection attacks embedded in connector tool output.',
    coverage: { gpt: 'Sec. 4.2' },
  },
  {
    id: 'openai-pi-search-functions',
    name: 'Prompt injection: Search + Function-Calling',
    category: 'adversarial-robustness',
    provenance: 'Internal evaluation',
    description:
      'Stronger prompt-injection attacks targeting search and function-calling workflows.',
    coverage: { gpt: 'Sec. 4.2' },
  },
  {
    id: 'openai-universal-jailbreak',
    name: 'Universal jailbreak red teaming on CyberGym',
    category: 'adversarial-robustness',
    provenance: 'Internal evaluation',
    description:
      'Automated discovery and transfer testing of universal jailbreaks across cyber tasks.',
    coverage: { gpt: 'Sec. 9.3.4' },
  },
  {
    id: 'strongreject-v2',
    name: 'StrongREJECT v2',
    category: 'adversarial-robustness',
    provenance: 'Public benchmark',
    description:
      'Jailbreak robustness benchmark reported as attack-success rate.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'fortress',
    name: 'FORTRESS (Adversarial)',
    category: 'adversarial-robustness',
    provenance: 'Public benchmark',
    description:
      'Adversarial robustness suite reported as attack-response score.',
    coverage: { muse: 'Table 2', inkling: 'Sec. 5 evaluation table' },
  },
  {
    id: 'fortress-benign',
    name: 'FORTRESS (Benign)',
    category: 'harm-refusal',
    provenance: 'Public benchmark',
    description:
      'Benign counterpart measuring whether safety behavior avoids excessive refusal.',
    coverage: { inkling: 'Sec. 5 evaluation table' },
  },
  {
    id: 'strongreject',
    name: 'StrongREJECT',
    category: 'adversarial-robustness',
    provenance: 'Public benchmark',
    description:
      'Jailbreak robustness benchmark reported separately from StrongREJECT v2.',
    coverage: { inkling: 'Sec. 5 evaluation table' },
  },
  {
    id: 'agentharm',
    name: 'AgentHarm',
    category: 'adversarial-robustness',
    provenance: 'Public benchmark',
    description:
      'Agentic malicious-use tasks spanning fraud, cybercrime, harassment, and other harms.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'agentdojo',
    name: 'AgentDojo',
    category: 'adversarial-robustness',
    provenance: 'Public benchmark',
    description:
      'Tool-using agent benchmark for indirect prompt-injection robustness.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'art',
    name: 'Agent Red Teaming (ART)',
    category: 'adversarial-robustness',
    provenance: 'External audit',
    description:
      'Gray Swan and UK AISI prompt-injection benchmark across confidentiality, competing objectives, prohibited content, and prohibited actions.',
    coverage: { claude: 'Sec. 5.2.1', muse: 'Table 2 (GraySwan ART)' },
  },
  {
    id: 'shade',
    name: 'Shade adaptive prompt injection',
    category: 'adversarial-robustness',
    provenance: 'External audit',
    description:
      'Adaptive red teaming across coding, computer-use, and browser-use surfaces.',
    coverage: { claude: 'Sec. 5.2.2' },
  },
  {
    id: 'destructive-actions',
    name: 'Avoiding accidental data-destructive actions',
    category: 'agentic-control',
    provenance: 'Internal evaluation',
    description:
      'Whether coding agents preserve protected user changes while completing a task.',
    coverage: { gpt: 'Sec. 3.3' },
  },
  {
    id: 'user-confirmations',
    name: 'User confirmations during computer use',
    category: 'agentic-control',
    provenance: 'Internal evaluation',
    description:
      'Whether agents request confirmation for financial transactions, high-stakes communication, and other consequential actions.',
    coverage: { gpt: 'Sec. 3.4' },
  },
  {
    id: 'malicious-claude-code',
    name: 'Malicious use of Claude Code',
    category: 'agentic-control',
    provenance: 'Internal evaluation',
    description:
      'Refusal and task success on malicious, dual-use, and benign cyber requests in a coding-agent harness.',
    coverage: { claude: 'Sec. 5.1.1' },
  },
  {
    id: 'malicious-computer-use',
    name: 'Malicious computer use',
    category: 'agentic-control',
    provenance: 'Internal evaluation',
    description:
      'Refusal of harmful GUI and CLI tasks involving surveillance, harmful content, and scaled abuse.',
    coverage: { claude: 'Sec. 5.1.2' },
  },
  {
    id: 'agentic-influence',
    name: 'Malicious agentic influence campaigns',
    category: 'agentic-control',
    provenance: 'Internal evaluation',
    description:
      'End-to-end simulated voter-suppression and domestic-polarization campaigns.',
    coverage: { claude: 'Sec. 5.1.3' },
  },
  {
    id: 'overeager-gui',
    name: 'Overeager behavior in GUI computer use',
    category: 'agentic-control',
    provenance: 'Internal evaluation',
    description:
      'Whether a computer-use agent takes unnecessary or excessive actions while pursuing a task.',
    coverage: { claude: 'Sec. 6.3.7' },
  },
  {
    id: 'save-bench',
    name: 'SAVE-Bench',
    category: 'agentic-control',
    provenance: 'Public benchmark',
    description:
      'Risk-escalation benchmark for how agents respond as a situation becomes more dangerous.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'openai-chatgpt-misalignment',
    name: 'Deployment simulation: ChatGPT misalignment',
    category: 'alignment-oversight',
    provenance: 'Internal evaluation',
    description:
      'Forecasts concealed uncertainty, fabricated facts, misrepresented work, and related behaviors on resampled production conversations.',
    coverage: { gpt: 'Sec. 7.1' },
  },
  {
    id: 'openai-codex-misalignment',
    name: 'Deployment simulation: internal agentic coding',
    category: 'alignment-oversight',
    provenance: 'Internal evaluation',
    description:
      'Measures unauthorized, destructive, deceptive, and over-persistent behavior in simulated coding traffic.',
    coverage: { gpt: 'Sec. 7.2' },
  },
  {
    id: 'cot-monitorability',
    name: 'CoT Monitorability suite',
    category: 'alignment-oversight',
    provenance: 'Mixed portfolio',
    description:
      'Guan et al. suite plus destructive actions, confirmation consent, and background-work environments.',
    coverage: { gpt: 'Sec. 7.3.1' },
  },
  {
    id: 'cot-control',
    name: 'CoT-Control',
    category: 'alignment-oversight',
    provenance: 'Public benchmark',
    description:
      'Tests whether a model can deliberately reshape its reasoning trace in ways that may reduce monitorability.',
    coverage: { gpt: 'Sec. 7.3.2' },
  },
  {
    id: 'metagaming',
    name: 'Metagaming evaluations',
    category: 'alignment-oversight',
    provenance: 'Internal evaluation',
    description:
      'Measures reasoning about grading, reward, or monitoring across evaluations, training, and deployment simulation.',
    coverage: { gpt: 'Sec. 7.4' },
  },
  {
    id: 'apollo-scheming',
    name: 'Apollo scheming + sandbagging audit',
    category: 'alignment-oversight',
    provenance: 'External audit',
    description:
      'External assessment of strategic deception, scheming, sabotage, and intentional underperformance.',
    coverage: { gpt: 'Sec. 9.2.1' },
  },
  {
    id: 'anthropic-behavioral-audit',
    name: 'Automated behavioral audit',
    category: 'alignment-oversight',
    provenance: 'Internal evaluation',
    description:
      'Large scenario suite for harmful behavior, misuse cooperation, misleading users, uncooperative behavior, and model-initiated actions.',
    coverage: { claude: 'Sec. 6.2.3' },
  },
  {
    id: 'petri-3',
    name: 'Petri 3.0',
    category: 'alignment-oversight',
    provenance: 'Public benchmark',
    description:
      'Open-source automated behavioral audit for cross-provider alignment comparisons.',
    coverage: { claude: 'Sec. 6.2.3.3' },
  },
  {
    id: 'reckless-actions',
    name: 'Destructive or reckless actions',
    category: 'alignment-oversight',
    provenance: 'Internal evaluation',
    description:
      'Tests harmful actions taken while pursuing user-assigned goals.',
    coverage: { claude: 'Sec. 6.3.1' },
  },
  {
    id: 'constitutional-adherence',
    name: 'Adherence to the Claude constitution',
    category: 'alignment-oversight',
    provenance: 'Internal evaluation',
    description:
      "Behavioral evaluation across the dimensions specified in Claude's constitution.",
    coverage: { claude: 'Sec. 6.3.2' },
  },
  {
    id: 'mask',
    name: 'MASK',
    category: 'alignment-oversight',
    provenance: 'Public benchmark',
    description:
      'Measures whether a model reports its beliefs honestly when pressured to lie.',
    coverage: { claude: 'Sec. 6.3.3.3', muse: 'Table 2' },
  },
  {
    id: 'decision-theory',
    name: 'Decision theory evaluation',
    category: 'alignment-oversight',
    provenance: 'Internal evaluation',
    description:
      'Tests decision-theoretic behavior relevant to cooperation and potentially concerning strategies.',
    coverage: { claude: 'Sec. 6.3.6' },
  },
  {
    id: 'evaluation-awareness',
    name: 'Evaluation awareness',
    category: 'alignment-oversight',
    provenance: 'Internal evaluation',
    description:
      'Measures whether the model recognizes evaluation settings and how that affects behavior.',
    coverage: { claude: 'Sec. 6.5.1' },
  },
  {
    id: 'anthropic-sandbagging',
    name: 'Potential sandbagging on dangerous-capability evals',
    category: 'alignment-oversight',
    provenance: 'Internal evaluation',
    description:
      'Looks for deliberate underperformance that could hide dangerous capabilities.',
    coverage: { claude: 'Sec. 6.5.2' },
  },
  {
    id: 'shade-arena',
    name: 'SHADE-Arena',
    category: 'alignment-oversight',
    provenance: 'Public benchmark',
    description:
      'Long-horizon side-task and sabotage benchmark measuring covert, policy-violating actions.',
    coverage: { claude: 'Sec. 6.5.4.1', muse: 'Table 1' },
  },
  {
    id: 'minimal-linuxbench',
    name: 'Minimal-LinuxBench',
    category: 'alignment-oversight',
    provenance: 'Public benchmark',
    description:
      'Tests stealthy side-task completion in a compact Linux environment.',
    coverage: { claude: 'Sec. 6.5.4.2' },
  },
  {
    id: 'agentic-misalignment',
    name: 'Agentic Misalignment',
    category: 'alignment-oversight',
    provenance: 'Public benchmark',
    description:
      'Scenarios that elicit harmful autonomous actions such as blackmail and information leakage.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'gdm-stealth',
    name: 'GDM-Stealth',
    category: 'alignment-oversight',
    provenance: 'External audit',
    description:
      'Google DeepMind evaluation of covert behavior in loss-of-control scenarios.',
    coverage: { muse: 'Table 1' },
  },
  {
    id: 'gdm-situational-awareness',
    name: 'GDM Situational Awareness',
    category: 'alignment-oversight',
    provenance: 'External audit',
    description:
      "Google DeepMind evaluation of a model's awareness of its situation and evaluation context.",
    coverage: { muse: 'Table 1' },
  },
  {
    id: 'internal-sycophancy',
    name: 'Internal Sycophancy',
    category: 'alignment-oversight',
    provenance: 'Internal evaluation',
    description:
      'Measures agreement with users at the expense of accuracy or independent judgment.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'deceptionbench',
    name: 'DeceptionBench',
    category: 'alignment-oversight',
    provenance: 'Public benchmark',
    description: 'Behavioral benchmark for deceptive model outputs.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'hle-calibration',
    name: 'HLE Calibration',
    category: 'alignment-oversight',
    provenance: 'Public benchmark',
    description:
      "Confidence calibration on Humanity's Last Exam, used here as a miscalibration signal.",
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'alignment-faking',
    name: 'Alignment Faking',
    category: 'alignment-oversight',
    provenance: 'Public benchmark',
    description:
      'Tests apparent compliance that changes when the model believes training or oversight differs.',
    coverage: { muse: 'Table 2' },
  },
  {
    id: 'vision-safety',
    name: 'Image-input safety evaluations',
    category: 'user-societal',
    provenance: 'Internal evaluation',
    description:
      'Disallowed combined text-and-image inputs across hate, extremism, self-harm, and erotic harms.',
    coverage: { gpt: 'Sec. 3.2' },
  },
  {
    id: 'dynamic-mental-health',
    name: 'Dynamic mental-health adversarial simulations',
    category: 'user-societal',
    provenance: 'Internal evaluation',
    description:
      'Adaptive multi-turn simulations covering mental health, emotional reliance, and self-harm.',
    coverage: { gpt: 'Sec. 5.2' },
  },
  {
    id: 'first-person-fairness',
    name: 'First-Person Fairness',
    category: 'user-societal',
    provenance: 'Public benchmark',
    description:
      'Tests harmful gender-linked differences in responses after users introduce themselves by name.',
    coverage: { gpt: 'Sec. 8.1' },
  },
  {
    id: 'healthbench-pro',
    name: 'HealthBench Professional',
    category: 'user-societal',
    provenance: 'Public benchmark',
    description:
      'Clinician-use evaluation combining health capability and safety criteria.',
    coverage: { gpt: 'Sec. 5.1', claude: 'Sec. 8.18.2', muse: 'Sec. 5.2.3' },
  },
  {
    id: 'healthbench',
    name: 'HealthBench',
    category: 'user-societal',
    provenance: 'Public benchmark',
    description:
      'Open-ended health evaluation combining answer quality and safety rubrics.',
    coverage: { gpt: 'Sec. 5.1', claude: 'Sec. 8.18.1' },
  },
  {
    id: 'child-safety',
    name: 'Child safety evaluations',
    category: 'user-societal',
    provenance: 'Internal evaluation',
    description:
      'Single- and multi-turn testing of harmful and benign requests involving child safety.',
    coverage: { claude: 'Sec. 4.2' },
  },
  {
    id: 'suicide-self-harm',
    name: 'Suicide + self-harm evaluations',
    category: 'user-societal',
    provenance: 'Internal evaluation',
    description:
      'Safe, supportive behavior and over-refusal across single- and multi-turn conversations.',
    coverage: { claude: 'Sec. 4.3.1' },
  },
  {
    id: 'disordered-eating',
    name: 'Disordered-eating evaluations',
    category: 'user-societal',
    provenance: 'Internal evaluation',
    description:
      'Whether responses avoid reinforcing risky behavior while remaining useful on benign health requests.',
    coverage: { claude: 'Sec. 4.3.2' },
  },
  {
    id: 'political-evenhandedness',
    name: 'Political even-handedness',
    category: 'user-societal',
    provenance: 'Public benchmark',
    description:
      'Paired prompts across ideological perspectives, topics, and task types.',
    coverage: { claude: 'Sec. 4.4.1' },
  },
  {
    id: 'bbq',
    name: 'Bias Benchmark for Question Answering (BBQ)',
    category: 'user-societal',
    provenance: 'Public benchmark',
    description:
      'Tests demographic bias across ambiguous and disambiguated questions.',
    coverage: { claude: 'Sec. 4.4.2' },
  },
  {
    id: 'election-integrity',
    name: 'Election integrity evaluations',
    category: 'user-societal',
    provenance: 'Internal evaluation',
    description:
      'Harmful and benign election prompts plus qualitative multi-turn testing.',
    coverage: { claude: 'Sec. 4.4.3' },
  },
  {
    id: 'user-flagged-factuality',
    name: 'User-flagged factual-error cases',
    category: 'user-societal',
    provenance: 'Internal evaluation',
    description:
      'De-identified conversations flagged by users for factual errors, measuring response-level and repeated errors.',
    coverage: { gpt: 'Sec. 6.1' },
  },
]

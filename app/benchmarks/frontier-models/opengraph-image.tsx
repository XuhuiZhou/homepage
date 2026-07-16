import { ImageResponse } from 'next/og'
import { ALL_GROUPS, MODEL_KEYS, MODEL_LABELS, type ModelKey } from './data'
import {
  BENCHMARK_FAMILIES,
  LABS,
  RELEASE_REPORTS,
  type BenchmarkCategory,
} from './history-data'
import { SAFETY_EVALUATIONS } from './safety-data'

export const runtime = 'edge'
export const alt =
  'Three findings from frontier model benchmark reporting: overlap, new evaluation areas, and reporting rotation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const MODEL_COLORS: Record<ModelKey, string> = {
  gpt: '#8b5cf6',
  claude: '#f97316',
  muse: '#3b82f6',
  grok: '#737373',
  inkling: '#10b981',
  kimi: '#06b6d4',
}

const CURRENT_ROWS = ALL_GROUPS.flatMap((group) => group.rows)
const SINGLE_REPORT_ROWS = CURRENT_ROWS.filter(
  (row) =>
    MODEL_KEYS.filter((model) => (row[model] ?? 'NR') !== 'NR').length === 1,
).length
const SINGLE_REPORT_PERCENT = Math.round(
  (SINGLE_REPORT_ROWS / CURRENT_ROWS.length) * 100,
)
const ONE_REPORT_SAFETY_ROWS = SAFETY_EVALUATIONS.filter(
  (evaluation) => Object.keys(evaluation.coverage).length === 1,
).length

const CATEGORY_BY_BENCHMARK = new Map(
  BENCHMARK_FAMILIES.map((benchmark) => [benchmark.id, benchmark.category]),
)
const ADDITION_COUNTS = new Map<BenchmarkCategory, number>()
let transitionCount = 0
let previousBenchmarkCount = 0
let retainedBenchmarkCount = 0

for (const lab of LABS) {
  const releases = RELEASE_REPORTS.filter(
    (release) => release.lab === lab.id,
  ).sort((a, b) => a.date.localeCompare(b.date))

  for (let index = 1; index < releases.length; index += 1) {
    const previousIds = new Set(Object.keys(releases[index - 1].benchmarks))
    const currentIds = new Set(Object.keys(releases[index].benchmarks))
    transitionCount += 1
    previousBenchmarkCount += previousIds.size
    retainedBenchmarkCount += [...previousIds].filter((benchmarkId) =>
      currentIds.has(benchmarkId),
    ).length

    for (const benchmarkId of currentIds) {
      if (previousIds.has(benchmarkId)) continue
      const category = CATEGORY_BY_BENCHMARK.get(
        benchmarkId as (typeof BENCHMARK_FAMILIES)[number]['id'],
      )
      if (!category) continue
      ADDITION_COUNTS.set(category, (ADDITION_COUNTS.get(category) ?? 0) + 1)
    }
  }
}

const RETENTION_PERCENT = Math.round(
  (retainedBenchmarkCount / previousBenchmarkCount) * 100,
)
const NON_RETENTION_PERCENT = 100 - RETENTION_PERCENT
const ADDITION_CATEGORIES: Array<{
  category: BenchmarkCategory
  label: string
  color: string
}> = [
  { category: 'Coding', label: 'Coding', color: '#a78bfa' },
  { category: 'Agents + tools', label: 'Agents + tools', color: '#60a5fa' },
  { category: 'Professional', label: 'Professional', color: '#f0b94d' },
  {
    category: 'Science + health',
    label: 'Science + health',
    color: '#4bc49a',
  },
]
const MAX_ADDITION_COUNT = Math.max(
  ...ADDITION_CATEGORIES.map(
    ({ category }) => ADDITION_COUNTS.get(category) ?? 0,
  ),
)

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#151515',
          color: '#f7f7f5',
          padding: '32px 52px 27px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 15,
                fontWeight: 700,
                color: '#b8dcff',
              }}
            >
              FRONTIER MODEL BENCHMARK AUDIT
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 5,
                fontSize: 29,
                fontWeight: 700,
              }}
            >
              Three findings from public release reporting
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              maxWidth: 390,
              flexDirection: 'column',
              alignItems: 'flex-end',
              fontSize: 14,
              lineHeight: 1.3,
              color: '#a3a3a3',
            }}
          >
            <div style={{ display: 'flex' }}>
              Six current releases + July 2025-July 2026 history
            </div>
            <div style={{ display: 'flex', marginTop: 4, color: '#d4d4d4' }}>
              Reporting coverage is not model quality.
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            width: '100%',
            flex: 1,
            marginTop: 24,
            borderTop: '1px solid #555555',
            borderBottom: '1px solid #555555',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '33.333%',
              flexDirection: 'column',
              padding: '18px 24px 17px 0',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 13,
                fontWeight: 700,
                color: '#f0cf63',
              }}
            >
              01 / CURRENT REPORTS
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 8,
                fontSize: 23,
                lineHeight: 1.1,
                fontWeight: 700,
              }}
            >
              Reporting choices shape the story.
            </div>
            <div
              style={{ display: 'flex', alignItems: 'flex-end', marginTop: 9 }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 67,
                  lineHeight: 0.9,
                  fontWeight: 800,
                }}
              >
                {SINGLE_REPORT_PERCENT}%
              </div>
              <div
                style={{
                  display: 'flex',
                  width: 180,
                  marginLeft: 13,
                  paddingBottom: 2,
                  fontSize: 14,
                  lineHeight: 1.2,
                  color: '#c9c9c5',
                }}
              >
                {SINGLE_REPORT_ROWS} of {CURRENT_ROWS.length} capability rows
                are unique to one current release
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                width: 233,
                flexWrap: 'wrap',
                gap: 5,
                marginTop: 14,
              }}
            >
              {CURRENT_ROWS.map((row, index) => (
                <div
                  key={`${row.benchmark}-${index}`}
                  style={{
                    display: 'flex',
                    width: 9,
                    height: 9,
                    backgroundColor:
                      index < SINGLE_REPORT_ROWS ? '#f0cf63' : '#6eafe8',
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 'auto',
                borderTop: '1px solid #4b4b4b',
                paddingTop: 10,
                alignItems: 'baseline',
              }}
            >
              <div style={{ display: 'flex', fontSize: 24, fontWeight: 700 }}>
                {ONE_REPORT_SAFETY_ROWS}/{SAFETY_EVALUATIONS.length}
              </div>
              <div
                style={{
                  display: 'flex',
                  marginLeft: 10,
                  fontSize: 13,
                  color: '#b7b7b3',
                }}
              >
                safety rows appear once
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              width: '33.333%',
              flexDirection: 'column',
              borderLeft: '1px solid #555555',
              padding: '18px 24px 17px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 13,
                fontWeight: 700,
                color: '#60a5fa',
              }}
            >
              02 / NEW REPORT ADDITIONS
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 8,
                fontSize: 23,
                lineHeight: 1.1,
                fontWeight: 700,
              }}
            >
              Evaluation is moving toward real work.
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 18,
              }}
            >
              {ADDITION_CATEGORIES.map(({ category, label, color }) => {
                const count = ADDITION_COUNTS.get(category) ?? 0
                return (
                  <div
                    key={category}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginBottom: 11,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 13,
                        color: '#d4d4d4',
                      }}
                    >
                      <div style={{ display: 'flex' }}>{label}</div>
                      <div style={{ display: 'flex', fontWeight: 700 }}>
                        {count}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        height: 6,
                        marginTop: 5,
                        backgroundColor: '#333333',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          width: `${(count / MAX_ADDITION_COUNT) * 100}%`,
                          height: '100%',
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 'auto',
                flexDirection: 'column',
                borderTop: '1px solid #4b4b4b',
                paddingTop: 9,
                fontSize: 12,
                lineHeight: 1.3,
                color: '#a3a3a3',
              }}
            >
              <div style={{ display: 'flex' }}>
                Added-report events across {transitionCount} same-lab
                transitions
              </div>
              <div style={{ display: 'flex', marginTop: 3 }}>
                Reasoning follows at {ADDITION_COUNTS.get('Reasoning') ?? 0}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              width: '33.333%',
              flexDirection: 'column',
              borderLeft: '1px solid #555555',
              padding: '18px 0 17px 24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 13,
                fontWeight: 700,
                color: '#d98aa2',
              }}
            >
              03 / REPORTING ROTATION
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 8,
                fontSize: 23,
                lineHeight: 1.1,
                fontWeight: 700,
              }}
            >
              Benchmark portfolios turn over quickly.
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 15,
                fontSize: 84,
                lineHeight: 0.9,
                fontWeight: 800,
              }}
            >
              {RETENTION_PERCENT}%
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 8,
                maxWidth: 285,
                fontSize: 16,
                lineHeight: 1.25,
                color: '#c9c9c5',
              }}
            >
              of previously reported editions reappear in the next public report
            </div>
            <div
              style={{
                display: 'flex',
                width: '100%',
                height: 16,
                marginTop: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: `${RETENTION_PERCENT}%`,
                  height: '100%',
                  backgroundColor: '#6eafe8',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  width: `${NON_RETENTION_PERCENT}%`,
                  height: '100%',
                  backgroundColor: '#c66f89',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 7,
                fontSize: 12,
                color: '#b7b7b3',
              }}
            >
              <div style={{ display: 'flex' }}>carried forward</div>
              <div style={{ display: 'flex' }}>
                {NON_RETENTION_PERCENT}% not carried forward
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 'auto',
                flexDirection: 'column',
                borderTop: '1px solid #4b4b4b',
                paddingTop: 9,
                fontSize: 12,
                lineHeight: 1.3,
                color: '#a3a3a3',
              }}
            >
              <div style={{ display: 'flex' }}>
                Across {transitionCount} same-lab release transitions
              </div>
              <div style={{ display: 'flex', marginTop: 3 }}>
                Absence from a later report does not prove retirement
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            width: '100%',
            marginTop: 18,
          }}
        >
          {MODEL_KEYS.map((model, index) => (
            <div
              key={model}
              style={{
                display: 'flex',
                flex: 1,
                minWidth: 0,
                flexDirection: 'column',
                borderTop: `5px solid ${MODEL_COLORS[model]}`,
                marginLeft: index === 0 ? 0 : 12,
                paddingTop: 7,
              }}
            >
              <div style={{ display: 'flex', fontSize: 15, fontWeight: 700 }}>
                {MODEL_LABELS[model].name}
              </div>
              <div
                style={{
                  display: 'flex',
                  marginTop: 2,
                  fontSize: 12,
                  color: '#a3a3a3',
                }}
              >
                {MODEL_LABELS[model].variant}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}

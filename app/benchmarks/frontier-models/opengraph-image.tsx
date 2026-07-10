import { ImageResponse } from 'next/og'
import {
  BENCHMARK_FAMILIES,
  LABS,
  RELEASE_REPORTS,
  type ReleaseReport,
} from './history-data'
import { SAFETY_EVALUATIONS } from './safety-data'

export const runtime = 'edge'
export const alt =
  'Frontier Model Benchmark Audit covering capability, safety, and reporting turnover'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CURRENT_RELEASES = [
  { name: 'GPT-5.6', variant: 'Sol', color: '#7c3aed' },
  { name: 'Claude 5', variant: 'Mythos / Fable', color: '#ea580c' },
  { name: 'Muse Spark', variant: '1.1', color: '#2563eb' },
  { name: 'Grok', variant: '4.5', color: '#18181b' },
]

function reportingNonRetention(releases: ReleaseReport[]) {
  let previousBenchmarkCount = 0
  let droppedBenchmarkCount = 0

  for (const lab of LABS) {
    const labReleases = releases
      .filter((release) => release.lab === lab.id)
      .sort((a, b) => a.date.localeCompare(b.date))

    for (let index = 1; index < labReleases.length; index += 1) {
      const previousIds = Object.keys(labReleases[index - 1].benchmarks)
      const currentIds = new Set(Object.keys(labReleases[index].benchmarks))
      previousBenchmarkCount += previousIds.length
      droppedBenchmarkCount += previousIds.filter(
        (benchmarkId) => !currentIds.has(benchmarkId),
      ).length
    }
  }

  return Math.round((droppedBenchmarkCount / previousBenchmarkCount) * 100)
}

function singleLabEditionCount(releases: ReleaseReport[]) {
  const labsByBenchmark = new Map<string, Set<ReleaseReport['lab']>>(
    BENCHMARK_FAMILIES.map((benchmark) => [
      benchmark.id,
      new Set<ReleaseReport['lab']>(),
    ]),
  )

  for (const release of releases) {
    for (const benchmarkId of Object.keys(release.benchmarks)) {
      labsByBenchmark.get(benchmarkId)?.add(release.lab)
    }
  }

  return [...labsByBenchmark.values()].filter((labs) => labs.size === 1).length
}

const NON_RETENTION_RATE = reportingNonRetention(RELEASE_REPORTS)
const SINGLE_LAB_EDITIONS = singleLabEditionCount(RELEASE_REPORTS)

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          color: '#18181b',
          padding: '48px 68px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', width: '100%', height: 8 }}>
          {CURRENT_RELEASES.map((release) => (
            <div
              key={release.name}
              style={{
                display: 'flex',
                width: '25%',
                backgroundColor: release.color,
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 24,
            fontSize: 21,
            color: '#71717a',
          }}
        >
          <div style={{ display: 'flex' }}>Xuhui Zhou · audited July 9, 2026</div>
          <div style={{ display: 'flex' }}>
            {RELEASE_REPORTS.length} first-party releases · {LABS.length} labs
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 28,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 58,
              lineHeight: 1.04,
              fontWeight: 700,
            }}
          >
            Frontier Model Benchmark Audit
          </div>
          <div
            style={{
              display: 'flex',
              maxWidth: 1020,
              marginTop: 13,
              fontSize: 25,
              lineHeight: 1.35,
              color: '#52525b',
            }}
          >
            Current results, safety reporting, and one year of benchmark
            turnover.
          </div>
        </div>

        <div style={{ display: 'flex', width: '100%', gap: 12, marginTop: 24 }}>
          {CURRENT_RELEASES.map((release) => (
            <div
              key={release.name}
              style={{
                display: 'flex',
                width: '25%',
                flexDirection: 'column',
                borderTop: `5px solid ${release.color}`,
                backgroundColor: '#fafafa',
                padding: '10px 14px 11px',
              }}
            >
              <div style={{ display: 'flex', fontSize: 20, fontWeight: 700 }}>
                {release.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  marginTop: 4,
                  fontSize: 15,
                  color: '#71717a',
                }}
              >
                {release.variant}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            width: '100%',
            minHeight: 132,
            marginTop: 'auto',
            backgroundColor: '#f4f4f5',
            borderTop: '1px solid #d4d4d8',
            borderBottom: '1px solid #d4d4d8',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '44%',
              alignItems: 'center',
              padding: '20px 26px',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 200,
                flexShrink: 0,
                fontSize: 52,
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              {SINGLE_LAB_EDITIONS}/{BENCHMARK_FAMILIES.length}
            </div>
            <div
              style={{
                display: 'flex',
                width: 190,
                flexDirection: 'column',
                gap: 6,
                marginLeft: 18,
                fontSize: 19,
                lineHeight: 1.2,
              }}
            >
              <div style={{ display: 'flex', fontWeight: 700 }}>
                reported by only one lab
              </div>
              <div
                style={{ display: 'flex', fontSize: 16, color: '#71717a' }}
              >
                at the exact-edition level
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              width: '28%',
              flexDirection: 'column',
              justifyContent: 'center',
              borderLeft: '1px solid #d4d4d8',
              padding: '20px 26px',
            }}
          >
            <div style={{ display: 'flex', fontSize: 44, fontWeight: 700 }}>
              {NON_RETENTION_RATE}%
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 5,
                fontSize: 17,
                lineHeight: 1.25,
                color: '#71717a',
              }}
            >
              not carried into the next public report
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              width: '28%',
              flexDirection: 'column',
              justifyContent: 'center',
              borderLeft: '1px solid #d4d4d8',
              padding: '20px 26px',
            }}
          >
            <div style={{ display: 'flex', fontSize: 44, fontWeight: 700 }}>
              {SAFETY_EVALUATIONS.length}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 5,
                fontSize: 17,
                lineHeight: 1.25,
                color: '#71717a',
              }}
            >
              safety evaluation rows
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}

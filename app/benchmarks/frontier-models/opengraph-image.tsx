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
  'Frontier Model Benchmark Audit covering capability, safety, and reporting attrition'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const LAB_COLORS = ['#7c3aed', '#ea580c', '#2563eb', '#18181b']

function reportingAttrition(releases: ReleaseReport[]) {
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

const ATTRITION_RATE = reportingAttrition(RELEASE_REPORTS)

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
          padding: '56px 68px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', width: '100%', height: 8 }}>
          {LAB_COLORS.map((color) => (
            <div
              key={color}
              style={{
                display: 'flex',
                width: '25%',
                backgroundColor: color,
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
            marginTop: 38,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 64,
              lineHeight: 1.04,
              fontWeight: 700,
            }}
          >
            Frontier Model Benchmark Audit
          </div>
          <div
            style={{
              display: 'flex',
              maxWidth: 970,
              marginTop: 18,
              fontSize: 27,
              lineHeight: 1.35,
              color: '#52525b',
            }}
          >
            Capability scores, safety reporting, and which benchmarks survive
            from one model release to the next.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            width: '100%',
            minHeight: 166,
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
              gap: 22,
              padding: '26px 30px',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 160,
                flexShrink: 0,
                fontSize: 64,
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              {ATTRITION_RATE}%
            </div>
            <div
              style={{
                display: 'flex',
                width: 205,
                flexDirection: 'column',
                gap: 7,
                marginLeft: 22,
                fontSize: 20,
                lineHeight: 1.2,
              }}
            >
              <div style={{ display: 'flex', fontWeight: 700 }}>
                next-report attrition
              </div>
              <div
                style={{ display: 'flex', fontSize: 18, color: '#71717a' }}
              >
                14 same-lab transitions
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
              padding: '26px 30px',
            }}
          >
            <div style={{ display: 'flex', fontSize: 48, fontWeight: 700 }}>
              {BENCHMARK_FAMILIES.length}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 5,
                fontSize: 19,
                lineHeight: 1.25,
                color: '#71717a',
              }}
            >
              capability benchmark editions
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              width: '28%',
              flexDirection: 'column',
              justifyContent: 'center',
              borderLeft: '1px solid #d4d4d8',
              padding: '26px 30px',
            }}
          >
            <div style={{ display: 'flex', fontSize: 48, fontWeight: 700 }}>
              {SAFETY_EVALUATIONS.length}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 5,
                fontSize: 19,
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

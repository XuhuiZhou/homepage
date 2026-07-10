import { ImageResponse } from 'next/og'
import { ALL_GROUPS, MODEL_KEYS, MODEL_LABELS, type ModelKey } from './data'

export const runtime = 'edge'
export const alt =
  'Current frontier release benchmark matrix: reporting coverage is not model quality'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const MODEL_COLORS: Record<ModelKey, string> = {
  gpt: '#8b5cf6',
  claude: '#f97316',
  muse: '#3b82f6',
  grok: '#737373',
}

const CURRENT_ROWS = ALL_GROUPS.flatMap((group) => group.rows)
const SINGLE_REPORT_ROWS = CURRENT_ROWS.filter(
  (row) => MODEL_KEYS.filter((model) => row[model] !== 'NR').length === 1,
).length
const SHARED_ROWS = CURRENT_ROWS.length - SINGLE_REPORT_ROWS
const SINGLE_REPORT_PERCENT = Math.round(
  (SINGLE_REPORT_ROWS / CURRENT_ROWS.length) * 100,
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
          padding: '38px 56px 32px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          <div style={{ display: 'flex', color: '#b8dcff' }}>
            FRONTIER MODEL BENCHMARK AUDIT
          </div>
          <div style={{ display: 'flex', color: '#a3a3a3', fontWeight: 400 }}>
            Xuhui Zhou · audited July 9, 2026
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            width: '100%',
            flex: 1,
            marginTop: 25,
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '54%',
              flexDirection: 'column',
              borderRight: '1px solid #555555',
              paddingRight: 48,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 17,
                fontWeight: 700,
                color: '#b8dcff',
              }}
            >
              CURRENT RELEASE BENCHMARK MATRIX
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 17,
                fontSize: 118,
                lineHeight: 0.9,
                fontWeight: 800,
              }}
            >
              {SINGLE_REPORT_PERCENT}%
            </div>
            <div
              style={{
                display: 'flex',
                maxWidth: 535,
                marginTop: 17,
                fontSize: 28,
                lineHeight: 1.2,
              }}
            >
              {SINGLE_REPORT_ROWS} of {CURRENT_ROWS.length} benchmark rows are
              unique to one current release&apos;s public report.
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 'auto',
                borderTop: '1px solid #555555',
                paddingTop: 14,
              }}
            >
              <div style={{ display: 'flex', fontSize: 18, fontWeight: 700 }}>
                Reporting coverage is not model quality.
              </div>
              <div
                style={{
                  display: 'flex',
                  marginTop: 5,
                  fontSize: 15,
                  lineHeight: 1.3,
                  color: '#b7b7b3',
                }}
              >
                More public benchmark results do not imply a better model.
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              width: '46%',
              flexDirection: 'column',
              paddingLeft: 44,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: 90,
                  lineHeight: 0.85,
                  fontWeight: 800,
                }}
              >
                {CURRENT_ROWS.length}
              </div>
              <div
                style={{
                  display: 'flex',
                  width: 190,
                  marginLeft: 18,
                  paddingBottom: 2,
                  fontSize: 17,
                  lineHeight: 1.2,
                  color: '#c9c9c5',
                }}
              >
                capability benchmark rows in the current matrix
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                width: 349,
                flexWrap: 'wrap',
                gap: 8,
                marginTop: 27,
              }}
            >
              {CURRENT_ROWS.map((row, index) => (
                <div
                  key={`${row.benchmark}-${index}`}
                  style={{
                    display: 'flex',
                    width: 13,
                    height: 13,
                    backgroundColor:
                      index < SINGLE_REPORT_ROWS ? '#f0cf63' : '#6eafe8',
                  }}
                />
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 20,
                gap: 24,
                fontSize: 14,
                color: '#c9c9c5',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    width: 12,
                    height: 12,
                    marginRight: 8,
                    backgroundColor: '#f0cf63',
                  }}
                />
                {SINGLE_REPORT_ROWS} unique to one release
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    width: 12,
                    height: 12,
                    marginRight: 8,
                    backgroundColor: '#6eafe8',
                  }}
                />
                {SHARED_ROWS} shared across 2+ releases
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 'auto',
                fontSize: 14,
                color: '#929292',
              }}
            >
              NR = no public numeric result found in the audited source
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            width: '100%',
            marginTop: 22,
            borderTop: '1px solid #555555',
            paddingTop: 15,
          }}
        >
          {MODEL_KEYS.map((model, index) => (
            <div
              key={model}
              style={{
                display: 'flex',
                width: '25%',
                flexDirection: 'column',
                borderTop: `5px solid ${MODEL_COLORS[model]}`,
                marginLeft: index === 0 ? 0 : 18,
                paddingTop: 8,
              }}
            >
              <div style={{ display: 'flex', fontSize: 18, fontWeight: 700 }}>
                {MODEL_LABELS[model].name}
              </div>
              <div
                style={{
                  display: 'flex',
                  marginTop: 3,
                  fontSize: 13,
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

import { ImageResponse } from 'next/og'
import { COVERAGE, MODEL_KEYS, MODEL_LABELS } from './data'

export const runtime = 'edge'
export const alt =
  'Frontier Model Benchmark Matrix across four leading AI models'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const COLORS = {
  gpt: '#7c3aed',
  claude: '#ea580c',
  muse: '#2563eb',
  grok: '#18181b',
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          color: '#18181b',
          padding: '64px 72px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', fontSize: 22, color: '#71717a' }}>
            Xuhui Zhou · audited July 9, 2026
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: '#71717a' }}>
            68 capability benchmark rows
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div
            style={{
              display: 'flex',
              maxWidth: 960,
              fontSize: 70,
              lineHeight: 1.02,
              fontWeight: 700,
            }}
          >
            Frontier Model Benchmark Matrix
          </div>
          <div
            style={{
              display: 'flex',
              maxWidth: 900,
              fontSize: 28,
              lineHeight: 1.35,
              color: '#52525b',
            }}
          >
            What each lab reported, what it did not, and the best directly
            comparable scores.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {MODEL_KEYS.map((model) => (
            <div
              key={model}
              style={{
                width: 252,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                borderTop: `8px solid ${COLORS[model]}`,
                background: '#f4f4f5',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', fontSize: 24, fontWeight: 700 }}>
                {MODEL_LABELS[model].name}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span
                  style={{ display: 'flex', fontSize: 18, color: '#71717a' }}
                >
                  {MODEL_LABELS[model].variant}
                </span>
                <span
                  style={{ display: 'flex', fontSize: 32, fontWeight: 700 }}
                >
                  {COVERAGE[model]}
                </span>
              </div>
              <div style={{ display: 'flex', fontSize: 16, color: '#71717a' }}>
                public scores
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}

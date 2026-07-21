import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Beyond Softmax: When Context Becomes a Learner'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  const cells = [0.85, 0.18, 0.38, 0.72, 0.12, 0.94, 0.58, 0.28, 0.76]

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#fffff8',
          padding: '66px 76px',
          fontFamily: 'Georgia, serif',
          color: '#18181b',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 62,
            right: 76,
            width: 232,
            height: 232,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          {cells.map((opacity, index) => (
            <div
              key={index}
              style={{
                width: 70,
                height: 70,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 7,
                border: '1px solid #bae6fd',
                background: `rgba(14, 165, 233, ${opacity})`,
                color: opacity > 0.55 ? '#ffffff' : '#0c4a6e',
                fontFamily: 'Arial, sans-serif',
                fontSize: 19,
              }}
            >
              S
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            color: '#52525b',
            fontFamily: 'Arial, sans-serif',
            fontSize: 21,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 36,
              height: 4,
              background: '#059669',
            }}
          />
          Interactive essay · 2026
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            maxWidth: 880,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 86,
              lineHeight: 1.02,
              fontWeight: 700,
            }}
          >
            Beyond Softmax
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 48,
              lineHeight: 1.12,
              color: '#3f3f46',
            }}
          >
            When Context Becomes a Learner
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div
            style={{ display: 'flex', gap: 12, fontSize: 24, color: '#3f3f46' }}
          >
            KV cache <span style={{ color: '#a1a1aa' }}>to</span> linear state{' '}
            <span style={{ color: '#a1a1aa' }}>to</span> delta rule{' '}
            <span style={{ color: '#a1a1aa' }}>to</span> TTT
          </div>
          <div style={{ display: 'flex', fontSize: 22, color: '#71717a' }}>
            Xuhui Zhou
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}

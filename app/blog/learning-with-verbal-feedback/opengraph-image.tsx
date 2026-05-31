import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Learning with Verbal Feedback — making verbal feedback a first-class RL signal'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

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
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* decorative base-vs-Ditto mini bars, top-right */}
        <div
          style={{
            position: 'absolute',
            top: 64,
            right: 80,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 14,
            height: 150,
            opacity: 0.9,
          }}
        >
          {[
            [0.78, 0.95],
            [0.58, 0.78],
            [0.68, 0.93],
            [0.47, 0.93],
            [0.43, 0.61],
          ].map(([base, ditto], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: 5 }}>
              <div
                style={{
                  display: 'flex',
                  width: 14,
                  height: base * 150,
                  background: '#dbe2ea',
                  borderRadius: 3,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  width: 14,
                  height: ditto * 150,
                  background: '#10b981',
                  borderRadius: 3,
                }}
              />
            </div>
          ))}
        </div>

        {/* top label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: 22,
            letterSpacing: '0.18em',
            color: '#64748b',
            textTransform: 'uppercase',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
          }}
        >
          <div style={{ width: 34, height: 4, background: '#10b981', display: 'flex' }} />
          Essay · Xuhui Zhou & Weiwei Sun
        </div>

        {/* title block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 86,
              lineHeight: 1.02,
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            Learning with Verbal Feedback
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              lineHeight: 1.35,
              color: '#475569',
              maxWidth: 940,
            }}
          >
            After scores and checkmarks, the next reward is a sentence — the
            arc of feedback in RL, from scalar rewards to verbal feedback.
          </div>
        </div>

        {/* bottom stat row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#10b981',
              color: '#ffffff',
              padding: '14px 26px',
              borderRadius: 999,
              fontSize: 30,
              fontWeight: 700,
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            +36% over base
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: '#334155',
              fontFamily: 'Helvetica, Arial, sans-serif',
            }}
          >
            Ditto · SOUL · beats GPT-5.4 on 6 of 10 tasks
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

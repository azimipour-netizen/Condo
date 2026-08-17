import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Condohill — Toronto Real Estate'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0a1628 0%, #0f2447 60%, #0e3a5c 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          right: -120,
          top: -120,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'rgba(20, 157, 196, 0.12)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute',
          right: 60,
          top: 60,
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'rgba(20, 157, 196, 0.08)',
          display: 'flex',
        }} />

        {/* Bottom bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, #149dc4 0%, #0e8fa8 50%, #0a7a90 100%)',
          display: 'flex',
        }} />

        {/* Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          padding: '0 100px',
        }}>
          {/* Logo area */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 48,
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: '#149dc4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M13 2L2 10.5V24H10V16H16V24H24V10.5L13 2Z" fill="white" />
              </svg>
            </div>
            <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px' }}>
              Condohill
            </span>
          </div>

          {/* Main headline */}
          <div style={{
            color: '#ffffff',
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-2px',
            marginBottom: 24,
          }}>
            Find Your Next
            <br />
            <span style={{ color: '#149dc4' }}>Toronto Home</span>
          </div>

          {/* Sub text */}
          <div style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 26,
            fontWeight: 400,
            letterSpacing: '-0.3px',
          }}>
            AI-powered search across the Greater Toronto Area
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            gap: 48,
            marginTop: 52,
          }}>
            {[
              { label: 'Active Listings', value: 'GTA' },
              { label: 'Condos, Homes & More', value: 'All Types' },
              { label: 'AI-Powered Search', value: '24/7' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ color: '#149dc4', fontSize: 22, fontWeight: 700 }}>{item.value}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

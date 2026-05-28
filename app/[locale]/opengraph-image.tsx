import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image({ params }: { params: { locale: string } }) {
  const subtitle =
    params.locale === 'mn'
      ? 'Монгол дахь ашигт малтмалын хайгуул'
      : 'Critical minerals exploration in Mongolia';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 52%, #38bdf8 100%)',
          color: '#ffffff',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            opacity: 0.8,
          }}
        >
          Azzoro Resources
        </div>
        <div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>Azzoro Resources</div>
          <div style={{ fontSize: 30, marginTop: 24, maxWidth: 760, opacity: 0.88 }}>{subtitle}</div>
        </div>
      </div>
    ),
    size
  );
}
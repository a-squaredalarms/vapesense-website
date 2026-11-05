import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Generated once at build time (the site is a static export).
export const dynamic = 'force-static';

// Default social-share image for every page that doesn't set its own.
export const alt = 'Vape Sense — catches the vape and the smoke, ignores the hairspray';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const logo = await readFile(join(process.cwd(), 'src/app/icon.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          background: '#040707',
          padding: '0 80px',
          gap: 60,
          fontFamily: 'sans-serif',
        }}
      >
        <img src={logoSrc} width={300} height={300} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 30, color: '#0FA8CC', letterSpacing: 4, textTransform: 'uppercase', marginBottom: 18 }}>
            Vape Sense
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.05 }}>
            Catches the vape and the smoke.
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, color: '#0FA8CC', lineHeight: 1.05 }}>
            Ignores the hairspray.
          </div>
          <div style={{ fontSize: 28, color: 'rgba(255,255,255,.6)', marginTop: 26 }}>
            No cameras · No microphones · Alerts in under 60 seconds
          </div>
        </div>
      </div>
    ),
    size,
  );
}

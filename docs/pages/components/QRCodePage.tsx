import { useState } from 'react';
import { QRCode, Input, Button, Card } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { QRCodeWorkbench } from '../../components/PropsWorkbench';

const QR_DEMO = `const [url, setUrl] = useState('https://github.com/esh');

<QRCode
  value={url}
  size={180}
  bordered
  title="Scan to visit documentation"
/>`;

const LOGO_QR_DEMO = `<QRCode
  value="https://hesh.dev"
  size={140}
  fgColor="#4f46e5"
  bordered
  logoUrl="/docs/assets/logo/hesh-logo.png"
/>`;

export function QRCodePage() {
  const [text, setText] = useState('https://github.com/esh');
  const [size, setSize] = useState(160);

  return (
    <DocPage
      eyebrow="Components"
      title="QRCode"
      lede="Zero-dependency SVG QR code generator with crisp vector scaling, Galois Field error correction, border framing, and center logo embedding."
      importStatement="import { QRCode } from 'hesh';"
    >
      <Section
        title="Interactive Props Workbench"
        description="Type any URL or secret token, resize pixel dimensions, customize brand colors, or edit live TypeScript code."
      >
        <QRCodeWorkbench />
      </Section>

      <Section
        title="Interactive Dynamic QR Code"
        description="Type any URL, secret token, or text string to see the QR matrix update instantly."
      >
        <Showcase code={QR_DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%', maxWidth: '340px' }}>
            <QRCode
              value={text}
              size={size}
              bordered
              title="Interactive Live QR Code"
            />

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--pui-fg)' }}>
                Target URL / Data Payload:
              </label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Custom Branding & Module Colors"
        description="Theme QR codes using brand hex colors or CSS custom properties."
      >
        <Showcase code={LOGO_QR_DEMO} width="full">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <QRCode
                value="https://hesh.dev"
                size={140}
                fgColor="#4f46e5"
                bordered
                logoUrl="/docs/assets/logo/hesh-logo.png"
              />
              <span className="cell-sub" style={{ marginTop: '0.5rem', display: 'block' }}>Hesh Brand</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <QRCode
                value="https://stripe.com"
                size={140}
                fgColor="#6366f1"
                bordered
              />
              <span className="cell-sub" style={{ marginTop: '0.5rem', display: 'block' }}>Indigo Accent</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <QRCode
                value="https://linear.app"
                size={140}
                fgColor="#059669"
                bordered
              />
              <span className="cell-sub" style={{ marginTop: '0.5rem', display: 'block' }}>Emerald Accent</span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <QRCode
                value="https://supabase.com"
                size={140}
                fgColor="#d97706"
                bordered
              />
              <span className="cell-sub" style={{ marginTop: '0.5rem', display: 'block' }}>Amber Accent</span>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Component Props">
        <PropsTable
          rows={[
            { name: 'value', type: 'string', required: true, description: 'The text, link, authentication token, or Wi-Fi string to encode.' },
            { name: 'size', type: 'number', default: '160', description: 'Width and height dimension in pixels.' },
            { name: 'fgColor', type: 'string', default: "'currentColor'", description: 'Color fill for QR modules.' },
            { name: 'bgColor', type: 'string', default: "'transparent'", description: 'Color fill for background surface.' },
            { name: 'bordered', type: 'boolean', default: 'false', description: 'Wraps the QR code in an elevated, padded card surface.' },
            { name: 'logoUrl', type: 'string', description: 'Optional center logo image or avatar URL.' },
            { name: 'logoSize', type: 'number', description: 'Size of center logo in pixels. Defaults to size * 0.22.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

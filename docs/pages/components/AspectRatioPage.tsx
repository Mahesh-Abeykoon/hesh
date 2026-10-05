import { AspectRatio, Card } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO = `<AspectRatio ratio={16 / 9}>
  <img
    src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80"
    alt="Gradient art"
    style={{ borderRadius: 'var(--pui-radius-lg)', objectFit: 'cover' }}
  />
</AspectRatio>`;

export function AspectRatioPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="AspectRatio"
      lede="Displays content within a desired geometric aspect ratio. Guarantees 100% responsiveness without aspect distortion across all screen widths."
      importStatement="import { AspectRatio } from 'hesh';"
    >
      <Section
        title="16:9 Video & Media Ratio"
        description="Preserves standard widescreen proportions for video players, photography cards, and canvas visualizers."
      >
        <Showcase code={DEMO} defaultOpen width="md">
          <div style={{ maxWidth: '32rem', width: '100%', margin: '0 auto' }}>
            <AspectRatio ratio={16 / 9}>
              <img
                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80"
                alt="Gradient art"
                style={{ borderRadius: 'var(--pui-radius-lg)', objectFit: 'cover' }}
              />
            </AspectRatio>
          </div>
        </Showcase>
      </Section>

      <Section
        title="1:1 Square & 4:3 Classical Ratios"
        description="Ideal for avatar galleries, product listings, and grid viewports."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))', gap: '1.25rem', width: '100%' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--pui-fg-muted)' }}>1:1 Ratio (Square)</div>
            <AspectRatio ratio={1}>
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
                alt="Abstract art"
                style={{ borderRadius: 'var(--pui-radius-lg)', objectFit: 'cover' }}
              />
            </AspectRatio>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--pui-fg-muted)' }}>4:3 Ratio (Classic)</div>
            <AspectRatio ratio={4 / 3}>
              <img
                src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80"
                alt="Colorful fluid"
                style={{ borderRadius: 'var(--pui-radius-lg)', objectFit: 'cover' }}
              />
            </AspectRatio>
          </div>
        </div>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'ratio', type: 'number', default: '16 / 9', description: 'Desired width / height ratio (e.g., 16/9, 4/3, 1).' },
            { name: 'children', type: 'ReactNode', description: 'Child element or media to be scaled proportionally.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

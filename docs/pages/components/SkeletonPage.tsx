import { useState } from 'react';
import { Skeleton, Card, Button, Avatar } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const SKELETON_DEMO = `<Skeleton variant="circle" width={48} height={48} />
<Skeleton width="60%" height={16} />
<Skeleton width="40%" height={12} />
<Skeleton lines={3} />`;

export function SkeletonPage() {
  const [loading, setLoading] = useState(true);

  return (
    <DocPage
      eyebrow="Components"
      title="Skeleton"
      lede="Placeholder preview shapes rendered while data loads asynchronously to prevent sudden content layout shifts (CLS)."
      importStatement="import { Skeleton } from 'hesh';"
    >
      <Section
        title="Interactive Loading State"
        description="Toggle between the loading skeleton placeholder and rendered content."
      >
        <Showcase code={SKELETON_DEMO} defaultOpen width="md">
          <div className="stack" style={{ gap: '1rem', maxWidth: '24rem', margin: '0 auto' }}>
            <Card padded>
              <div className="stack" style={{ gap: '0.75rem' }}>
                {loading ? (
                  <>
                    <div className="row-wrap" style={{ alignItems: 'center', gap: '0.75rem' }}>
                      <Skeleton variant="circle" width={44} height={44} />
                      <div className="stack" style={{ flex: 1, gap: '0.4rem' }}>
                        <Skeleton width="65%" height={14} />
                        <Skeleton width="40%" height={12} />
                      </div>
                    </div>
                    <Skeleton lines={2} />
                  </>
                ) : (
                  <>
                    <div className="row-wrap" style={{ alignItems: 'center', gap: '0.75rem' }}>
                      <Avatar name="Grace Hopper" size="md" />
                      <div className="stack" style={{ flex: 1, gap: '0.2rem' }}>
                        <strong style={{ fontSize: '0.875rem' }}>Grace Hopper</strong>
                        <span className="prose">grace@compiler.dev</span>
                      </div>
                    </div>
                    <p className="prose">
                      Senior systems engineer. Currently maintaining the core token parser.
                    </p>
                  </>
                )}
              </div>
            </Card>
            <div style={{ textAlign: 'center' }}>
              <Button size="sm" variant="secondary" onClick={() => setLoading(!loading)}>
                {loading ? 'Show loaded state' : 'Show skeleton state'}
              </Button>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Reduced Motion">
          Carries <code>aria-hidden="true"</code> so screen readers ignore placeholder shapes while awaiting content. The shimmer animation automatically disables under <code>prefers-reduced-motion</code>.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'variant', type: "'text' | 'rect' | 'circle'", default: "'text'", description: 'Geometric shape of the skeleton.' },
            { name: 'width', type: 'string | number', description: 'Explicit width in px or percentage.' },
            { name: 'height', type: 'string | number', description: 'Explicit height in px.' },
            { name: 'lines', type: 'number', description: 'Renders multiple paragraph text placeholder lines.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

import { useState } from 'react';
import { Rating } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO = `const [stars, setStars] = useState(4.5);

<Rating
  value={stars}
  onChange={setStars}
  precision={0.5}
  size="lg"
/>`;

export function RatingPage() {
  const [stars, setStars] = useState(4.5);
  const [simpleRating, setSimpleRating] = useState(3);

  return (
    <DocPage
      eyebrow="Components"
      title="Rating"
      lede="Displays intuitive star ratings and customer reviews with half-star precision, hover previews, and full keyboard navigation."
      importStatement="import { Rating } from 'hesh-ui';"
    >
      <Section
        title="Interactive Star Review"
        description="Supports hovering over left or right halves of each star to select 0.5 fractional ratings."
      >
        <Showcase code={DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', padding: '1rem 0', width: '100%', boxSizing: 'border-box' }}>
            <Rating
              value={stars}
              onChange={setStars}
              precision={0.5}
              size="lg"
            />
            <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
              Current Rating: <strong>{stars}</strong> / 5.0
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Sizes and Read-Only Mode"
        description="Available in small, medium, and large sizing, or as read-only summaries for customer testimonial cards."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ width: '4.5rem', fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>Small</span>
            <Rating value={4} readOnly size="sm" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ width: '4.5rem', fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>Medium</span>
            <Rating value={simpleRating} onChange={setSimpleRating} size="md" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ width: '4.5rem', fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>Large</span>
            <Rating value={4.5} readOnly precision={0.5} size="lg" />
          </div>
        </div>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'value', type: 'number', description: 'Controlled rating value.' },
            { name: 'onChange', type: '(val: number) => void', description: 'Callback fired when rating changes.' },
            { name: 'count', type: 'number', default: '5', description: 'Total number of stars.' },
            { name: 'precision', type: '1 | 0.5', default: '1', description: 'Full star or half star increments.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Dimension of star icons.' },
            { name: 'readOnly', type: 'boolean', default: 'false', description: 'Disables interaction for display purposes.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the control.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

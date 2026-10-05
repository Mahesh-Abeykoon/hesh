import { Spinner } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const SPINNER_DEMO = `<Spinner size="sm" label="Loading mini" />
<Spinner size="md" label="Loading medium" />
<Spinner size="lg" label="Loading large" />`;

export function SpinnerPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Spinner"
      lede="Indeterminate loading indicator conveying ongoing asynchronous background tasks and requests."
      importStatement="import { Spinner } from 'hesh';"
    >
      <Section
        title="Spinner Sizes"
        description="Available in sm, md, and lg sizes with accessible ARIA live status announcements."
      >
        <Showcase code={SPINNER_DEMO} defaultOpen width="md">
          <div className="row-wrap" style={{ alignItems: 'center', gap: '2rem' }}>
            <Spinner size="sm" label="Loading mini" />
            <Spinner size="md" label="Loading medium" />
            <Spinner size="lg" label="Loading large" />
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Automatic Screen Reader Announcements">
          Exposes semantic <code>role="status"</code> with an accessible <code>aria-label</code> (defaulting to "Loading…") so assistive technologies announce ongoing operations immediately on mount.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Dimension scale of the spinner.' },
            { name: 'label', type: 'string', default: "'Loading…'", description: 'Screen reader announcement string.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

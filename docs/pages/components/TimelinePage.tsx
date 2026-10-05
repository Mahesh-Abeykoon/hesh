import { Timeline, TimelineItem } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const TIMELINE_DEMO = `<Timeline>
  <TimelineItem timestamp="10m ago" title="Deployed to production" tone="success" active>
    Release v2.4.1 deployed across 12 edge clusters with zero downtime.
  </TimelineItem>
  <TimelineItem timestamp="2h ago" title="CI/CD Build Completed" tone="primary" description="Passed all 148 automated unit and e2e integration tests." />
  <TimelineItem timestamp="Yesterday" title="Pull Request Merged" tone="neutral" description="Merge #428 into develop branch by Ada Lovelace." />
  <TimelineItem timestamp="3 days ago" title="Security Incident Resolved" tone="warning" description="Firewall rate limits tuned to mitigate volumetric DDoS." />
</Timeline>`;

export function TimelinePage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Timeline"
      lede="Displays chronological sequences of events, deployments, audit records, or history milestones."
      importStatement="import { Timeline, TimelineItem } from 'hesh';"
    >
      <Section
        title="Chronological Event Stream"
        description="Renders milestone nodes connected with continuous lines and semantic tone indicators."
      >
        <Showcase code={TIMELINE_DEMO} defaultOpen width="md">
          <Timeline>
            <TimelineItem timestamp="10m ago" title="Deployed to production" tone="success" active>
              Release v2.4.1 deployed across 12 edge clusters with zero downtime.
            </TimelineItem>
            <TimelineItem timestamp="2h ago" title="CI/CD Build Completed" tone="primary" description="Passed all 148 automated unit and e2e integration tests." />
            <TimelineItem timestamp="Yesterday" title="Pull Request Merged" tone="neutral" description="Merge #428 into develop branch by Ada Lovelace." />
            <TimelineItem timestamp="3 days ago" title="Security Incident Resolved" tone="warning" description="Firewall rate limits tuned to mitigate volumetric DDoS." />
          </Timeline>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'TimelineItem.title', type: 'ReactNode', required: true, description: 'Event heading text.' },
            { name: 'TimelineItem.timestamp', type: 'ReactNode', description: 'Date or relative time string.' },
            { name: 'TimelineItem.tone', type: "'primary' | 'success' | 'warning' | 'danger' | 'neutral'", default: "'neutral'", description: 'Node bullet color.' },
            { name: 'TimelineItem.active', type: 'boolean', default: 'false', description: 'Pulsing active status dot on the latest event.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

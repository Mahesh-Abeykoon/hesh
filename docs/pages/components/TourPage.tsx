import { useState } from 'react';
import { Tour, Button, Card, Badge, ZapIcon, SettingsIcon, PaletteIcon } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const TOUR_DEMO = `const [open, setOpen] = useState(false);

const steps = [
  {
    target: '#tour-step-1',
    title: 'Workspace Overview',
    description: 'This card contains your key infrastructure performance statistics and deployment pipeline.',
    placement: 'bottom',
    icon: <ZapIcon size={18} />,
  },
  {
    target: '#tour-step-2',
    title: 'Theme Customizer',
    description: 'Tune brand color ramps, typography, and density settings across all components in real time.',
    placement: 'bottom',
    icon: <PaletteIcon size={18} />,
  },
  {
    target: '#tour-step-3',
    title: 'Ready to Ship',
    description: 'You are now ready to export themes, generate code snippets, and build production web applications.',
    placement: 'center',
  },
];

<Button onClick={() => setOpen(true)}>Start Product Tour</Button>

<Tour
  open={open}
  onClose={() => setOpen(false)}
  steps={steps}
/>`;

export function TourPage() {
  const [open, setOpen] = useState(false);

  const steps = [
    {
      target: '#tour-target-stats',
      title: 'Metrics & Health',
      description: 'Monitor real-time edge telemetry, response latencies, and serverless compute consumption.',
      placement: 'bottom' as const,
      icon: <ZapIcon size={18} />,
    },
    {
      target: '#tour-target-action',
      title: 'Theme & Customizer',
      description: 'Switch neutral palettes (Slate/Zinc/OLED) and inspect live WCAG APCA contrast compliance.',
      placement: 'bottom' as const,
      icon: <PaletteIcon size={18} />,
    },
    {
      target: '#tour-target-deploy',
      title: 'Instant Production Deploy',
      description: 'Ship versioned builds directly to global edge networks with zero downtime.',
      placement: 'top' as const,
      icon: <SettingsIcon size={18} />,
    },
  ];

  return (
    <DocPage
      eyebrow="Components"
      title="Tour"
      lede="Guided onboarding walkthrough with an elevated spotlight cutout mask, step indicators, and keyboard navigation."
      importStatement="import { Tour } from 'hesh-ui';"
    >
      <Section
        title="Interactive Guided Walkthrough"
        description="Click 'Start Walkthrough' below to launch the spotlight onboarding experience."
      >
        <Showcase code={TOUR_DEMO} defaultOpen width="full">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button variant="primary" onClick={() => setOpen(true)} leftIcon={<ZapIcon size={16} />}>
                Start Walkthrough
              </Button>
              <Badge tone="info">Press Esc or Arrow Keys to navigate</Badge>
            </div>

            {/* Target elements for the tour demo */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <Card id="tour-target-stats" style={{ padding: '1.25rem' }}>
                <span className="cell-sub">Step 1 Target</span>
                <h4 style={{ margin: '0.25rem 0', fontSize: '1.125rem' }}>Edge Performance</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--pui-fg-muted)' }}>
                  99.98% uptime across 38 global edge locations.
                </p>
              </Card>

              <Card id="tour-target-action" style={{ padding: '1.25rem' }}>
                <span className="cell-sub">Step 2 Target</span>
                <h4 style={{ margin: '0.25rem 0', fontSize: '1.125rem' }}>Theme Customizer</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--pui-fg-muted)' }}>
                  OLED true dark mode and WCAG accessibility.
                </p>
              </Card>

              <Card id="tour-target-deploy" style={{ padding: '1.25rem' }}>
                <span className="cell-sub">Step 3 Target</span>
                <h4 style={{ margin: '0.25rem 0', fontSize: '1.125rem' }}>Deploy Service</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--pui-fg-muted)' }}>
                  Continuous delivery pipeline connected.
                </p>
              </Card>
            </div>
          </div>
        </Showcase>

        <Tour
          open={open}
          onClose={() => setOpen(false)}
          steps={steps}
        />
      </Section>

      <Section title="Component Props">
        <PropsTable
          rows={[
            { name: 'steps', type: 'TourStep[]', required: true, description: 'List of tour steps with target selector, title, description, and placement.' },
            { name: 'open', type: 'boolean', required: true, description: 'Controlled open state.' },
            { name: 'onClose', type: '() => void', required: true, description: 'Callback fired on dismissal or completion.' },
            { name: 'current', type: 'number', description: 'Controlled active step index (0-indexed).' },
            { name: 'onChange', type: '(current: number) => void', description: 'Callback fired when active step changes.' },
            { name: 'mask', type: 'boolean', default: 'true', description: 'Renders dark backdrop with SVG spotlight cutout around the target.' },
            { name: 'maskClosable', type: 'boolean', default: 'false', description: 'Whether clicking backdrop dismisses the tour.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

import { Card, CardHeader, CardBody, CardFooter, Badge, Button, Separator, Stat } from '../../../src/index';
import { ArrowRightIcon } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const CARD_DEMO = `<Card>
  <CardHeader
    title="Usage this cycle"
    description="Resets on the 1st of each month."
    action={<Badge tone="success" dot>Healthy</Badge>}
  />
  <CardBody>
    <Stat label="API requests" value="2.4M" delta={18.2} />
  </CardBody>
  <CardFooter>
    <Button variant="secondary" size="sm" rightIcon={<ArrowRightIcon />}>
      View report
    </Button>
  </CardFooter>
</Card>`;

const CARD_ELEVATIONS = `<div className="grid-3">
  <Card elevation="flat" padded>
    <Badge tone="primary">Flat</Badge>
    <p>No drop shadow — ideal for placing inside an already-elevated container.</p>
  </Card>

  <Card elevation="default" padded>
    <Badge tone="neutral">Default</Badge>
    <p>Subtle 1px border with a soft diffuse elevation shadow.</p>
  </Card>

  <Card elevation="elevated" padded interactive>
    <Badge tone="info">Elevated + Interactive</Badge>
    <p>Enhanced depth with interactive hover-lift transition.</p>
  </Card>
</div>`;

export function CardPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Card"
      lede="Surfaces that group related content, actions, and metrics into a cohesive visual container."
      importStatement="import { Card, CardHeader, CardBody, CardFooter } from 'hesh';"
    >
      <Section
        title="Structured Card Layout"
        description="Composed with CardHeader, CardBody, and CardFooter for consistent layout hierarchy."
      >
        <Showcase code={CARD_DEMO} defaultOpen width="md">
          <div style={{ maxWidth: '24rem', margin: '0 auto' }}>
            <Card>
              <CardHeader
                title="Usage this cycle"
                description="Resets on the 1st of each month."
                action={<Badge tone="success" dot>Healthy</Badge>}
              />
              <CardBody>
                <Stat label="API requests" value="2.4M" delta={18.2} size="sm" />
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm" rightIcon={<ArrowRightIcon />}>
                  View report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Elevations & Interactivity"
        description="Choose between flat, default, and elevated shadow styles. Enable interactive hover lift for cards acting as links or buttons."
      >
        <Showcase code={CARD_ELEVATIONS} width="md">
          <div className="grid-3">
            <Card elevation="flat" padded>
              <div className="stack" style={{ gap: '0.5rem' }}>
                <Badge tone="primary">Flat</Badge>
                <Stat label="Errors" value="312" delta={-8.4} size="sm" />
                <Separator />
                <span className="prose">No shadow — sits inside an already-elevated parent.</span>
              </div>
            </Card>

            <Card elevation="default" padded>
              <div className="stack" style={{ gap: '0.5rem' }}>
                <Badge tone="neutral">Default</Badge>
                <Stat label="Active nodes" value="48" delta={2} size="sm" />
                <Separator />
                <span className="prose">Standard 1px border with crisp ambient glow.</span>
              </div>
            </Card>

            <Card elevation="elevated" padded interactive onClick={() => alert('Card clicked!')}>
              <div className="stack" style={{ gap: '0.5rem' }}>
                <Badge tone="info">Elevated + Interactive</Badge>
                <Stat label="p95 latency" value="184ms" delta={-3.1} size="sm" />
                <Separator />
                <span className="prose">Click to trigger action with smooth lift.</span>
              </div>
            </Card>
          </div>
        </Showcase>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'elevation', type: "'flat' | 'default' | 'elevated'", default: "'default'", description: 'Shadow depth style.' },
            { name: 'interactive', type: 'boolean', default: 'false', description: 'Enables hover elevation lift and pointer cursor.' },
            { name: 'padded', type: 'boolean', default: 'false', description: 'Adds default responsive content padding.' },
            { name: 'as', type: "'div' | 'button' | 'article' | 'section'", default: "'div'", description: 'Underlying HTML element.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

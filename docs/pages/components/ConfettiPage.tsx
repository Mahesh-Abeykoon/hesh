import { useState } from 'react';
import { Confetti, fireConfetti, Button, Card, ZapIcon } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const CONFETTI_DEMO = `// 1. Imperative trigger (anywhere in handlers):
fireConfetti({ particleCount: 90, spread: 80 });

// 2. Declarative component:
<Confetti active={isActive} onComplete={() => setIsActive(false)} />`;

export function ConfettiPage() {
  const [active, setActive] = useState(false);

  return (
    <DocPage
      eyebrow="Components"
      title="Confetti"
      lede="Lightweight zero-dependency canvas particle celebration blast with gravity, air drag, flutter rotations, and full 60fps performance."
      importStatement="import { Confetti, fireConfetti } from 'hesh';"
    >
      <Section
        title="Interactive Celebration Blasts"
        description="Celebrate successful form submissions, deployments, upgrades, and achievement milestones."
      >
        <Showcase code={CONFETTI_DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem 1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Ready to Celebrate?</h3>
            <p style={{ margin: 0, textAlign: 'center', color: 'var(--pui-fg-muted)', fontSize: '0.875rem' }}>
              Launch celebration confetti bursts with customizable velocities, particle counts, and origin coordinates.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="primary"
                onClick={() => fireConfetti({ particleCount: 100, spread: 80 })}
                leftIcon={<ZapIcon size={16} />}
              >
                Fire Confetti Blast
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  // Fire twin side cannons
                  fireConfetti({ particleCount: 60, angle: 60, origin: { x: 0, y: 0.7 } });
                  fireConfetti({ particleCount: 60, angle: 120, origin: { x: 1, y: 0.7 } });
                }}
              >
                Side Cannons (Left & Right)
              </Button>
            </div>
          </div>
        </Showcase>

        <Confetti active={active} onComplete={() => setActive(false)} />
      </Section>

      <Section title="Component Props & Options">
        <PropsTable
          rows={[
            { name: 'active', type: 'boolean', default: 'false', description: 'When transitioning to true, fires particle burst.' },
            { name: 'particleCount', type: 'number', default: '80', description: 'Total number of confetti particles emitted.' },
            { name: 'spread', type: 'number', default: '70', description: 'Cone angle spread in degrees.' },
            { name: 'startVelocity', type: 'number', default: '40', description: 'Initial particle launch speed.' },
            { name: 'decay', type: 'number', default: '0.92', description: 'Air drag decay multiplier.' },
            { name: 'gravity', type: 'number', default: '1', description: 'Downward gravity pull multiplier.' },
            { name: 'angle', type: 'number', default: '90', description: 'Launch direction in degrees (90 is straight up).' },
            { name: 'origin', type: '{ x?: number; y?: number }', default: '{ x: 0.5, y: 0.6 }', description: 'Normalized origin coordinate (0 to 1).' },
            { name: 'colors', type: 'string[]', description: 'Custom array of hex or hsl colors.' },
            { name: 'onComplete', type: '() => void', description: 'Callback fired after particles finish and canvas is removed.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

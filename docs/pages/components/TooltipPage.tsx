import { Tooltip, Button, IconButton, SettingsIcon, SparklesIcon } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const TOOLTIP_DEMO = `<Tooltip content="Create new deployment">
  <Button>New Deployment</Button>
</Tooltip>

<Tooltip content="Edit organization preferences">
  <IconButton aria-label="Settings" variant="secondary">
    <SettingsIcon />
  </IconButton>
</Tooltip>

<Tooltip content="Toggle colour scheme" side="bottom">
  <IconButton aria-label="Theme" variant="ghost">
    <SparklesIcon />
  </IconButton>
</Tooltip>`;

export function TooltipPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Tooltip"
      lede="Informative text bubble that appears when an element receives pointer hover or keyboard focus."
      importStatement="import { Tooltip } from 'hesh';"
    >
      <Section
        title="Hover & Focus Tooltips"
        description="Positioned relative to the trigger element with arrow pointers and collision avoidance."
      >
        <Showcase code={TOOLTIP_DEMO} defaultOpen width="md">
          <div className="row-wrap" style={{ gap: '1.5rem', alignItems: 'center' }}>
            <Tooltip content="Create new deployment">
              <Button>New Deployment</Button>
            </Tooltip>

            <Tooltip content="Edit organization preferences">
              <IconButton aria-label="Settings" variant="secondary">
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip content="Toggle colour scheme" placement="bottom">
              <IconButton aria-label="Theme" variant="ghost">
                <SparklesIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Hover and Keyboard Focus">
          Tooltips appear on both <code>mouseenter</code> and <code>focus</code> events. They can be dismissed at any time by pressing <kbd className="pui-kbd">Esc</kbd> without moving focus, satisfying WCAG 2.1 criterion 1.4.13.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'content', type: 'ReactNode', required: true, description: 'Text or element displayed inside the tooltip bubble.' },
            { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", description: 'Preferred side of the trigger element.' },
            { name: 'delay', type: 'number', default: '200', description: 'Hover appearance delay in milliseconds.' },
            { name: 'children', type: 'ReactElement', required: true, description: 'Trigger element that receives hover and focus.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

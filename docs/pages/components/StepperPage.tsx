import { useState } from 'react';
import { Stepper, Button } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const DEMO = `const [step, setStep] = useState(1);

<Stepper
  current={step}
  onChange={setStep}
  steps={[
    { title: 'Account', description: 'Personal details' },
    { title: 'Billing', description: 'Payment method' },
    { title: 'Confirm', description: 'Review order' },
  ]}
/>`;

export function StepperPage() {
  const [step, setStep] = useState(1);
  const [verticalStep, setVerticalStep] = useState(0);

  const steps = [
    { title: 'Account info', description: 'Email and password' },
    { title: 'Workspace', description: 'Organization setup' },
    { title: 'Review & pay', description: 'Confirm subscription' },
  ];

  return (
    <DocPage
      eyebrow="Components"
      title="Stepper"
      lede="Displays sequential steps in a multi-step checkout or onboarding wizard with completed, active, and upcoming indicators."
      importStatement="import { Stepper } from 'hesh';"
    >
      <Section
        title="Horizontal Wizard Flow"
        description="Click steps to navigate backwards or use the forward/back buttons. Connectors automatically highlight completed stages."
      >
        <Showcase code={DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem 0', width: '100%', boxSizing: 'border-box' }}>
            <Stepper
              current={step}
              onChange={setStep}
              steps={steps}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', width: '100%' }}>
              <Button
                variant="secondary"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Previous
              </Button>

              <div style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-muted)', fontWeight: 600 }}>
                Step {step + 1} of {steps.length}
              </div>

              <Button
                variant="primary"
                disabled={step === steps.length - 1}
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Vertical Stepper Layout"
        description="Great for mobile drawers, left-hand sidebar navigation, or detailed long-form workflows."
      >
        <div style={{ maxWidth: '20rem', width: '100%', boxSizing: 'border-box' }}>
          <Stepper
            orientation="vertical"
            current={verticalStep}
            onChange={setVerticalStep}
            steps={[
              { title: 'Upload documents', description: 'PDF or PNG files' },
              { title: 'Identity verification', description: 'Facial match scan' },
              { title: 'Approval review', description: 'Takes ~2-4 hours' },
            ]}
          />
        </div>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'steps', type: 'readonly StepItem[]', description: 'Array of step items with title, optional description, and custom icon.' },
            { name: 'current', type: 'number', description: 'Zero-based index of the currently active step.' },
            { name: 'onChange', type: '(step: number) => void', description: 'Callback fired when a step indicator is clicked.' },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Directional layout orientation.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Sizing scale.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

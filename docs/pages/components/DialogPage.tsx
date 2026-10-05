import { useState } from 'react';
import { Dialog, ConfirmDialog, Button, Input, Badge, Textarea, Select } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const SIZES_DEMO = `const [activeSize, setActiveSize] = useState<null | 'sm' | 'md' | 'lg' | 'xl' | 'full'>(null);

<div className="row-wrap">
  <Button variant="outline" size="sm" onClick={() => setActiveSize('sm')}>Small (sm)</Button>
  <Button variant="outline" size="sm" onClick={() => setActiveSize('md')}>Medium (md - Default)</Button>
  <Button variant="outline" size="sm" onClick={() => setActiveSize('lg')}>Large (lg)</Button>
  <Button variant="outline" size="sm" onClick={() => setActiveSize('xl')}>Extra Large (xl)</Button>
  <Button variant="outline" size="sm" onClick={() => setActiveSize('full')}>Full Screen (full)</Button>
</div>

<Dialog
  open={Boolean(activeSize)}
  onClose={() => setActiveSize(null)}
  size={activeSize || 'md'}
  title={\`Dialog Size: \${activeSize?.toUpperCase()}\`}
  description="All dialog sizes automatically constrain within viewport bounds on smaller screens."
  footer={<Button onClick={() => setActiveSize(null)}>Close</Button>}
>
  <p className="prose">
    Responsive max-width constraints guarantee zero overflow on mobile screens while maintaining comfortable proportions on large desktop displays.
  </p>
</Dialog>`;

const FORM_DEMO = `const [formOpen, setFormOpen] = useState(false);
const [submitting, setSubmitting] = useState(false);

<Button onClick={() => setFormOpen(true)}>Create New Team</Button>

<Dialog
  open={formOpen}
  onClose={() => setFormOpen(false)}
  size="md"
  title="Create Team Workspace"
  description="Set up a collaborative workspace for your engineering department."
  footer={
    <>
      <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
      <Button
        variant="primary"
        loading={submitting}
        onClick={() => {
          setSubmitting(true);
          setTimeout(() => { setSubmitting(false); setFormOpen(false); }, 900);
        }}
      >
        Create Workspace
      </Button>
    </>
  }
>
  <div className="stack" style={{ gap: '1rem', marginTop: '0.5rem' }}>
    <Input label="Workspace Name" placeholder="e.g. Core Platform Engine" autoFocus required />
    <Input label="URL Slug" prefix="app.hesh.design/" placeholder="core-platform" />
    <Select
      label="Data Region"
      options={[
        { value: 'us-east', label: 'US East (N. Virginia)' },
        { value: 'eu-west', label: 'EU West (Frankfurt)' },
        { value: 'ap-south', label: 'Asia Pacific (Mumbai)' },
      ]}
      defaultValue="us-east"
    />
    <Textarea label="Team Description" placeholder="Briefly describe what this workspace manages..." rows={3} />
  </div>
</Dialog>`;

const CONFIRM_DEMO = `const [confirmOpen, setConfirmOpen] = useState(false);
const [loading, setLoading] = useState(false);

<Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete Project</Button>

<ConfirmDialog
  open={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  onConfirm={() => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setConfirmOpen(false); }, 800);
  }}
  tone="danger"
  title="Permanently Delete Project?"
  description="This will destroy all associated database schemas, deployments, and audit logs. This action cannot be reversed."
  confirmLabel="Delete Forever"
  loading={loading}
/>`;

const WIZARD_DEMO = `const [wizardOpen, setWizardOpen] = useState(false);
const [step, setStep] = useState(1);

<Dialog
  open={wizardOpen}
  onClose={() => { setWizardOpen(false); setStep(1); }}
  size="lg"
  title={
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <span>Deploy Cluster</span>
      <Badge tone="info" size="sm">Step {step} of 3</Badge>
    </div>
  }
  description="Configure production Kubernetes cluster nodes and security groups."
  footer={
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      <Button
        variant="ghost"
        disabled={step === 1}
        onClick={() => setStep((s) => Math.max(1, s - 1))}
      >
        Previous
      </Button>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button variant="secondary" onClick={() => { setWizardOpen(false); setStep(1); }}>Cancel</Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
        ) : (
          <Button variant="success" onClick={() => { setWizardOpen(false); setStep(1); }}>Launch Cluster</Button>
        )}
      </div>
    </div>
  }
>
  {/* Step Content */}
</Dialog>`;

export function DialogPage() {
  const [activeSize, setActiveSize] = useState<null | 'sm' | 'md' | 'lg' | 'xl' | 'full'>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [mandatoryOpen, setMandatoryOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState(1);

  return (
    <DocPage
      eyebrow="Components"
      title="Dialog"
      lede="A modal window overlaid onto the viewport. Traps keyboard focus, locks background scrolling, and complies with the WAI-ARIA 1.2 modal dialog specification."
      importStatement="import { Dialog, ConfirmDialog } from 'hesh';"
    >
      <Section
        title="Dialog Sizes"
        description="Supports sizes ranging from compact prompt cards to wide multi-column dialogs and full-screen immersive views."
      >
        <Showcase code={SIZES_DEMO} defaultOpen width="md">
          <div className="row-wrap">
            <Button variant="outline" size="sm" onClick={() => setActiveSize('sm')}>Small (sm)</Button>
            <Button variant="outline" size="sm" onClick={() => setActiveSize('md')}>Medium (md - Default)</Button>
            <Button variant="outline" size="sm" onClick={() => setActiveSize('lg')}>Large (lg)</Button>
            <Button variant="outline" size="sm" onClick={() => setActiveSize('xl')}>Extra Large (xl)</Button>
            <Button variant="outline" size="sm" onClick={() => setActiveSize('full')}>Full Screen (full)</Button>
          </div>

          <Dialog
            open={Boolean(activeSize)}
            onClose={() => setActiveSize(null)}
            size={activeSize || 'md'}
            title={`Dialog Size: ${activeSize?.toUpperCase()}`}
            description="All dialog sizes automatically constrain within viewport bounds on smaller screens."
            footer={
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
                <Button variant="secondary" onClick={() => setActiveSize(null)}>Cancel</Button>
                <Button onClick={() => setActiveSize(null)}>Acknowledge</Button>
              </div>
            }
          >
            <div className="stack" style={{ gap: '0.75rem', marginTop: '0.5rem' }}>
              <p className="prose">
                This dialog demonstrates the <strong>{activeSize}</strong> width scale. It features smooth pop-in spring motion, an ambient blurred overlay backdrop, and automatic responsive boundary clamping on mobile devices.
              </p>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--pui-surface-subtle)', borderRadius: 'var(--pui-radius-md)', border: '1px solid var(--pui-border)' }}>
                <code style={{ fontSize: '0.8125rem', color: 'var(--pui-primary)' }}>
                  size=&quot;{activeSize}&quot;
                </code>
              </div>
            </div>
          </Dialog>
        </Showcase>
      </Section>

      <Section
        title="Form & Data Entry Dialog"
        description="Structured modals with sticky headers, scrollable form bodies, and pinned action footers for uninterrupted user workflows."
      >
        <Showcase code={FORM_DEMO} width="md">
          <Button onClick={() => setFormOpen(true)}>Create New Team</Button>

          <Dialog
            open={formOpen}
            onClose={() => setFormOpen(false)}
            size="md"
            title="Create Team Workspace"
            description="Set up a collaborative workspace for your engineering department."
            footer={
              <>
                <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
                <Button
                  variant="primary"
                  loading={submitting}
                  onClick={() => {
                    setSubmitting(true);
                    setTimeout(() => { setSubmitting(false); setFormOpen(false); }, 900);
                  }}
                >
                  Create Workspace
                </Button>
              </>
            }
          >
            <div className="stack" style={{ gap: '1rem', marginTop: '0.5rem' }}>
              <Input label="Workspace Name" placeholder="e.g. Core Platform Engine" autoFocus required />
              <Input label="URL Slug" prefix="app.hesh.design/" placeholder="core-platform" />
              <Select
                label="Data Region"
                options={[
                  { value: 'us-east', label: 'US East (N. Virginia)' },
                  { value: 'eu-west', label: 'EU West (Frankfurt)' },
                  { value: 'ap-south', label: 'Asia Pacific (Mumbai)' },
                ]}
                defaultValue="us-east"
              />
              <Textarea label="Team Description" placeholder="Briefly describe what this workspace manages..." rows={3} />
            </div>
          </Dialog>
        </Showcase>
      </Section>

      <Section
        title="Destructive Confirmation (ConfirmDialog)"
        description="Specialized high-stakes dialog designed to prevent accidental deletion, irreversible edits, or privilege revocations."
      >
        <Showcase code={CONFIRM_DEMO} width="md">
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>Delete Project</Button>

          <ConfirmDialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={() => {
              setConfirmLoading(true);
              setTimeout(() => { setConfirmLoading(false); setConfirmOpen(false); }, 900);
            }}
            tone="danger"
            title="Permanently Delete Project?"
            description="This will destroy all associated database schemas, deployments, and audit logs. This action cannot be reversed."
            confirmLabel="Delete Forever"
            cancelLabel="Keep Project"
            loading={confirmLoading}
          />
        </Showcase>
      </Section>

      <Section
        title="Multi-Step Wizard Dialog"
        description="Dialog with sequential stages, step badges, and dynamic previous/continue navigation controls."
      >
        <Showcase code={WIZARD_DEMO} width="md">
          <Button variant="outline" onClick={() => { setWizardOpen(true); setStep(1); }}>Launch Cluster Wizard</Button>

          <Dialog
            open={wizardOpen}
            onClose={() => { setWizardOpen(false); setStep(1); }}
            size="lg"
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span>Deploy Cluster</span>
                <Badge tone="info" size="sm">Step {step} of 3</Badge>
              </div>
            }
            description="Configure production Kubernetes cluster nodes, machine types, and security."
            footer={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
                <Button
                  variant="ghost"
                  disabled={step === 1}
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                >
                  Previous Step
                </Button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button variant="secondary" onClick={() => { setWizardOpen(false); setStep(1); }}>Cancel</Button>
                  {step < 3 ? (
                    <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
                  ) : (
                    <Button variant="success" onClick={() => { setWizardOpen(false); setStep(1); }}>Provision Now</Button>
                  )}
                </div>
              </div>
            }
          >
            <div className="stack" style={{ gap: '1rem', marginTop: '0.5rem' }}>
              {step === 1 && (
                <div className="stack" style={{ gap: '0.75rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>1. Cluster Identity</div>
                  <Input label="Cluster Name" defaultValue="prod-k8s-useast1" />
                  <Input label="VPC Network" defaultValue="vpc-09b9f712e" />
                </div>
              )}
              {step === 2 && (
                <div className="stack" style={{ gap: '0.75rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>2. Node Architecture</div>
                  <Select
                    label="Instance Type"
                    options={[
                      { value: 'c6g.xlarge', label: 'Compute Optimized (4 vCPU, 8 GiB RAM)' },
                      { value: 'm6g.2xlarge', label: 'General Purpose (8 vCPU, 32 GiB RAM)' },
                      { value: 'r6g.4xlarge', label: 'Memory Optimized (16 vCPU, 128 GiB RAM)' },
                    ]}
                    defaultValue="c6g.xlarge"
                  />
                  <Input label="Initial Worker Replicas" type="number" defaultValue="6" />
                </div>
              )}
              {step === 3 && (
                <div className="stack" style={{ gap: '0.75rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>3. Summary & Launch Verification</div>
                  <div style={{ padding: '1rem', background: 'var(--pui-surface-subtle)', borderRadius: 'var(--pui-radius-lg)', border: '1px solid var(--pui-border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>CLUSTER</div>
                        <div style={{ fontWeight: 600 }}>prod-k8s-useast1</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>WORKERS</div>
                        <div style={{ fontWeight: 600 }}>6 Nodes</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>SLA TIER</div>
                        <Badge tone="success" size="sm">99.99% Enterprise</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Dialog>
        </Showcase>
      </Section>

      <Section
        title="Mandatory Flow (Non-dismissible)"
        description="Prevent users from closing the dialog by clicking the backdrop or pressing Escape when immediate user acknowledgment is required."
      >
        <Showcase code={`<Dialog dismissOnBackdrop={false} hideCloseButton={true} ... />`} width="md">
          <Button variant="outline" onClick={() => setMandatoryOpen(true)}>Open Mandatory Notice</Button>

          <Dialog
            open={mandatoryOpen}
            onClose={() => setMandatoryOpen(false)}
            dismissOnBackdrop={false}
            hideCloseButton={true}
            size="sm"
            title="Service Terms Update"
            description="Please review and accept our updated privacy policy before proceeding."
            footer={
              <Button fullWidth variant="primary" onClick={() => setMandatoryOpen(false)}>
                I Accept the Terms
              </Button>
            }
          >
            <p className="prose" style={{ marginTop: '0.5rem' }}>
              We have updated our sub-processor security standards in accordance with SOC2 Type II compliance.
            </p>
          </Dialog>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="WAI-ARIA Dialog (Modal) Pattern">
          Focus is trapped strictly inside the panel via a looped tab key index trap. Body scroll is locked via viewport overflow styling. On close, focus returns cleanly to the triggering button.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'open', type: 'boolean', required: true, description: 'Controls whether the dialog is mounted and visible.' },
            { name: 'onClose', type: '() => void', required: true, description: 'Callback triggered when dismissed via backdrop or Esc.' },
            { name: 'title', type: 'ReactNode', description: 'Header title, automatically assigned as aria-labelledby.' },
            { name: 'description', type: 'ReactNode', description: 'Accessible subtitle, automatically assigned as aria-describedby.' },
            { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", default: "'md'", description: 'Viewport max-width constraint scale.' },
            { name: 'dismissOnBackdrop', type: 'boolean', default: 'true', description: 'Allows dismissing by clicking the scrim overlay.' },
            { name: 'hideCloseButton', type: 'boolean', default: 'false', description: 'Hides the top-right corner dismiss icon button.' },
            { name: 'footer', type: 'ReactNode', description: 'Pinned action bar rendered at the bottom.' },
            { name: 'children', type: 'ReactNode', description: 'Scrollable modal body content.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

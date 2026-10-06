import { useState } from 'react';
import { DocPage, Section } from '../components/DocPage';
import { LivePlayground } from '../components/LivePlayground';
import { Badge, Button, Card, Select } from '../../src/index';

const TEMPLATES = [
  {
    id: 'login',
    title: 'Authentication & Login Card',
    category: 'Forms & Auth',
    code: `function LoginForm() {
  const [email, setEmail] = useState('developer@hesh.dev');
  const [pwd, setPwd] = useState('SuperSecret123!');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Authentication Successful',
        description: 'Welcome back to your Hesh workspace!',
        tone: 'success',
      });
    }, 800);
  };

  return (
    <Card style={{ width: '100%', maxWidth: '24rem', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.125rem', fontWeight: 700 }}>
          Sign In to Workspace
        </h3>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
          Enter your credentials to access the control panel.
        </p>
      </div>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          required
        />

        <PasswordInput
          label="Password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          strengthMeter
          showRequirements={false}
          required
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Checkbox
            label="Remember this device"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
        </div>

        <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
          Sign In
        </Button>
      </form>
    </Card>
  );
}

render(<LoginForm />);`,
  },
  {
    id: 'otp',
    title: 'Two-Factor (2FA) Verification Modal',
    category: 'Security & Modals',
    code: `function TwoFactorDialog() {
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const { toast } = useToast();

  const handleComplete = (completed) => {
    if (completed === '123456') {
      setVerified(true);
      toast({
        title: 'Two-factor verified!',
        description: 'Identity confirmed via hardware security token.',
        tone: 'success',
      });
    } else {
      toast({
        title: 'Invalid code',
        description: 'Try entering code 123456.',
        tone: 'danger',
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%', maxWidth: '24rem', textAlign: 'center' }}>
      <Badge tone={verified ? 'success' : 'primary'} pill>
        {verified ? '✓ Verified Device' : '2FA Required'}
      </Badge>

      <div>
        <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700 }}>
          Enter Verification Code
        </h4>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
          Enter the 6-digit PIN sent to your authenticator app (tip: try <code>123456</code>).
        </p>
      </div>

      <OtpInput
        length={6}
        value={code}
        onChange={setCode}
        onComplete={handleComplete}
      />

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setCode('');
            setVerified(false);
          }}
        >
          Reset PIN
        </Button>
      </div>
    </div>
  );
}

render(<TwoFactorDialog />);`,
  },
  {
    id: 'settings',
    title: 'Organization Settings Switchboard',
    category: 'Application UI',
    code: `function OrgSettings() {
  const [canary, setCanary] = useState(true);
  const [telemetry, setTelemetry] = useState(false);
  const [backups, setBackups] = useState(true);
  const [frequency, setFrequency] = useState('weekly');

  return (
    <Card style={{ width: '100%', maxWidth: '28rem', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>Release Pipeline</h3>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>Configure automated deployment triggers</p>
        </div>
        <Badge tone="info" pill>Production</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Backup Frequency</span>
          <SegmentedControl
            size="sm"
            value={frequency}
            onChange={setFrequency}
            options={[
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
            ]}
          />
        </div>

        <Separator />

        <Switch
          label="Canary Deployment Ring"
          description="Direct 5% of customer traffic to green release cluster."
          checked={canary}
          onCheckedChange={setCanary}
        />

        <Switch
          label="Automated S3 Cold Backups"
          description="Capture hourly differential state snapshots."
          checked={backups}
          onCheckedChange={setBackups}
        />

        <Switch
          label="Detailed Audit Logs"
          description="Transmit high-resolution audit trails to Datadog."
          checked={telemetry}
          onCheckedChange={setTelemetry}
        />
      </div>
    </Card>
  );
}

render(<OrgSettings />);`,
  },
  {
    id: 'tags',
    title: 'Technology Stack Filter',
    category: 'Interactive Data',
    code: `function StackFilter() {
  const [tags, setTags] = useState(['React 19', 'TypeScript', 'Vite', 'CSS Tokens']);
  const [level, setLevel] = useState('production');

  return (
    <div style={{ width: '100%', maxWidth: '26rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700 }}>Project Dependencies</h4>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
          Type and hit Enter or comma to create chips in real time.
        </p>
      </div>

      <TagInput
        value={tags}
        onChange={setTags}
        placeholder="Add technology tag…"
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>
          {tags.length} active tag{tags.length !== 1 ? 's' : ''}
        </span>
        <Button size="xs" variant="ghost" onClick={() => setTags([])}>Clear All</Button>
      </div>
    </div>
  );
}

render(<StackFilter />);`,
  },
  {
    id: 'scratch',
    title: 'Custom Blank Sandbox',
    category: 'Freeform',
    code: `// Write any React code here!
// All Hesh components and React hooks are available in scope.

function CustomPlayground() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <Badge tone="primary" pill>Live Hesh Sandbox</Badge>
      <h3 style={{ margin: 0 }}>Clicked {count} times</h3>
      <Button variant="primary" onClick={() => setCount(c => c + 1)}>
        Increment Counter
      </Button>
    </div>
  );
}

render(<CustomPlayground />);`,
  },
];

export function PlaygroundPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState('login');

  const activeTemplate =
    TEMPLATES.find((t) => t.id === selectedTemplateId) ?? TEMPLATES[0]!;

  return (
    <DocPage
      eyebrow="Developer Tools"
      title="Live Code Playground"
      lede="An in-browser interactive code editor and runtime powered by instant client-side JSX transpilation. Type, compose, and live-test any Hesh components with zero build latency."
      importStatement="import * as Hesh from 'hesh';"
    >
      <Section
        title="Interactive Component Studio"
        description="Select a template or write your own TSX code directly in the browser editor. Edits compile in under 2ms with non-crashing runtime error protection."
      >
        <div style={{ marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pui-fg-muted)', marginRight: '0.5rem' }}>
            Choose Template:
          </span>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              className={`workbench__pill${selectedTemplateId === tmpl.id ? ' workbench__pill--active' : ''}`}
              onClick={() => setSelectedTemplateId(tmpl.id)}
            >
              {tmpl.title}
            </button>
          ))}
        </div>

        <LivePlayground
          key={activeTemplate.id}
          initialCode={activeTemplate.code}
          title={activeTemplate.title}
          badge={activeTemplate.category}
          description="Edit any JSX, props, or state in the editor below to see instant live evaluation."
        />
      </Section>
    </DocPage>
  );
}

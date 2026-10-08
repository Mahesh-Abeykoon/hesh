import { useEffect, useRef, useState, type ReactNode } from 'react';
import { LivePlayground } from '../components/LivePlayground';
import { Badge } from '../../src/index';

interface TemplateDef {
  id: string;
  title: string;
  category: string;
  defaultState: Record<string, any>;
  generateCode: (state: Record<string, any>) => string;
}

const TEMPLATES: TemplateDef[] = [
  {
    id: 'button',
    title: 'Buttons & Actions',
    category: 'Base & Actions',
    defaultState: { variant: 'primary', size: 'md', loading: false, disabled: false, withIcon: true },
    generateCode: (s) => {
      const iconJsx = s.withIcon ? '<ZapIcon size={14} /> ' : '';
      const loadingProp = s.loading ? ' loading' : '';
      const disabledProp = s.disabled ? ' disabled' : '';
      return `function ButtonDemo() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
      <Button
        variant="${s.variant}"
        size="${s.size}"${loadingProp}${disabledProp}
        onClick={() => setClickCount(c => c + 1)}
      >
        ${iconJsx}Action Button
      </Button>

      <span style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
        Clicked {clickCount} times • Live synced with controls
      </span>
    </div>
  );
}

render(<ButtonDemo />);`;
    },
  },
  {
    id: 'alert',
    title: 'Alerts & Banners',
    category: 'Feedback',
    defaultState: { tone: 'info', variant: 'subtle', dismissible: true, withIcon: true },
    generateCode: (s) => {
      const dismissProp = s.dismissible ? ' dismissible onClose={() => console.log("dismissed")}' : '';
      const iconProp = s.withIcon ? '' : ' icon={false}';
      const toneTitle = s.tone.charAt(0).toUpperCase() + s.tone.slice(1);
      return `function AlertDemo() {
  return (
    <div style={{ width: '100%', maxWidth: '28rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Alert
        tone="${s.tone}"
        variant="${s.variant}"
        title="${toneTitle} Notification"${dismissProp}${iconProp}
      >
        Real-time component state synced directly with the code editor.
      </Alert>
    </div>
  );
}

render(<AlertDemo />);`;
    },
  },
  {
    id: 'badge',
    title: 'Badges & Status',
    category: 'Data Display',
    defaultState: { tone: 'primary', pill: true },
    generateCode: (s) => {
      const isPill = !!s.pill;
      return `function BadgeDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Badge tone="${s.tone}" pill={${isPill}}>
          ${s.tone.toUpperCase()}
        </Badge>
        <Badge tone="primary" pill={${isPill}}>Production</Badge>
        <Badge tone="success" pill={${isPill}}>Active</Badge>
        <Badge tone="warning" pill={${isPill}}>Review</Badge>
        <Badge tone="danger" pill={${isPill}}>Failed</Badge>
      </div>

      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
        Change tones and pill shapes with the live customizers above.
      </p>
    </div>
  );
}

render(<BadgeDemo />);`;
    },
  },
  {
    id: 'login',
    title: 'Auth & Login Card',
    category: 'Forms & Auth',
    defaultState: { buttonVariant: 'primary', padding: 'Normal', rememberMe: true, strengthMeter: true },
    generateCode: (s) => {
      const paddingVal = s.padding === 'Compact' ? '1rem' : s.padding === 'Relaxed' ? '2rem' : '1.5rem';
      return `function LoginForm() {
  const [email, setEmail] = useState('developer@hesh.dev');
  const [pwd, setPwd] = useState('SuperSecret123!');
  const [remember, setRemember] = useState(${s.rememberMe});
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
    <Card style={{ width: '100%', maxWidth: '24rem', padding: '${paddingVal}' }}>
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
          strengthMeter={${s.strengthMeter}}
          required
        />
${s.rememberMe ? `
        <Checkbox
          label="Remember this device"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
` : ''}
        <Button type="submit" variant="${s.buttonVariant}" loading={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
          Sign In
        </Button>
      </form>
    </Card>
  );
}

render(<LoginForm />);`;
    },
  },
  {
    id: 'otp',
    title: 'Two-Factor (2FA)',
    category: 'Security & Modals',
    defaultState: { length: '6 Digits', tone: 'primary', pill: true },
    generateCode: (s) => {
      const len = s.length === '4 Digits' ? 4 : 6;
      return `function TwoFactorDialog() {
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const { toast } = useToast();

  const handleComplete = (completed) => {
    if (completed.length === ${len}) {
      setVerified(true);
      toast({
        title: 'Two-factor verified!',
        description: 'Identity confirmed via hardware security token.',
        tone: 'success',
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%', maxWidth: '24rem', textAlign: 'center' }}>
      <Badge tone="${s.tone}" pill={${s.pill}}>
        {verified ? '✓ Verified Device' : '2FA Required'}
      </Badge>

      <div>
        <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700 }}>
          Enter Verification Code
        </h4>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
          Enter the ${len}-digit PIN sent to your authenticator app.
        </p>
      </div>

      <OtpInput
        length={${len}}
        value={code}
        onChange={setCode}
        onComplete={handleComplete}
      />

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
  );
}

render(<TwoFactorDialog />);`;
    },
  },
  {
    id: 'settings',
    title: 'Org Settings',
    category: 'Application UI',
    defaultState: { frequency: 'weekly', canary: true, telemetry: false },
    generateCode: (s) => {
      return `function OrgSettings() {
  const [canary, setCanary] = useState(${s.canary});
  const [telemetry, setTelemetry] = useState(${s.telemetry});
  const [frequency, setFrequency] = useState('${s.frequency}');

  return (
    <Card style={{ width: '100%', maxWidth: '28rem', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>Release Pipeline</h3>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>Configure deployment triggers</p>
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
          description="Direct 5% customer traffic to green release cluster."
          checked={canary}
          onCheckedChange={setCanary}
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

render(<OrgSettings />);`;
    },
  },
  {
    id: 'analytics',
    title: 'SaaS Analytics',
    category: 'Dashboard & SaaS',
    defaultState: { timeframe: '7d', showSparkline: true, showProgress: true },
    generateCode: (s) => {
      const timeframeVal = s.timeframe || '7d';
      const showSpark = !!s.showSparkline;
      const showProg = !!s.showProgress;
      return `function SaaSMetricsDashboard() {
  const [timeframe, setTimeframe] = useState('${timeframeVal}');
  const sparkData = [28, 35, 32, 48, 44, 62, 58, 70, 68, 86];
  const revenue = timeframe === '24h' ? '$4,120' : timeframe === '7d' ? '$28,450' : '$118,900';
  const growth = timeframe === '24h' ? 8.4 : timeframe === '7d' ? 14.2 : 23.5;

  return (
    <div style={{ width: '100%', maxWidth: '34rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>SaaS Operations Pulse</h3>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
            Live customer volume and ARR tracking
          </p>
        </div>
        <SegmentedControl
          size="sm"
          value={timeframe}
          onChange={setTimeframe}
          options={[
            { value: '24h', label: '24h' },
            { value: '7d', label: '7d' },
            { value: '30d', label: '30d' },
          ]}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.875rem' }}>
        <Stat
          label="Recurring ARR"
          value={revenue}
          delta={growth}
          size="sm"
        >
          ${showSpark ? `<Sparkline data={sparkData} width={130} height={32} color="var(--pui-primary)" />` : ''}
        </Stat>

        <Stat
          label="Active Users"
          value="14,290"
          delta={4.8}
          size="sm"
        />

        <Stat
          label="System Health"
          value="99.99%"
          delta={0.01}
          size="sm"
        />
      </div>

      <Card style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Enterprise API Rate Limit</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>78,420 of 100,000 monthly calls consumed</div>
          </div>
          <Badge tone="success" pill>78.4% Normal</Badge>
        </div>
        ${showProg ? `<Progress value={78.4} tone="primary" size="md" />` : ''}
      </Card>
    </div>
  );
}

render(<SaaSMetricsDashboard />);`;
    },
  },
  {
    id: 'combobox',
    title: 'Combobox Select',
    category: 'Forms & Selects',
    defaultState: { multiple: false, size: 'md', clearable: true },
    generateCode: (s) => {
      const isMulti = !!s.multiple;
      const sizeVal = s.size || 'md';
      const clearVal = !!s.clearable;
      return `function ComboboxDemo() {
  const [val, setVal] = useState(${isMulti ? "['us', 'gb']" : "'us'"});
  const countries = [
    { value: 'us', label: 'United States', group: 'Americas' },
    { value: 'ca', label: 'Canada', group: 'Americas' },
    { value: 'gb', label: 'United Kingdom', group: 'Europe' },
    { value: 'de', label: 'Germany', group: 'Europe' },
    { value: 'jp', label: 'Japan', group: 'Asia-Pacific' },
    { value: 'sg', label: 'Singapore', group: 'Asia-Pacific' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '24rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Combobox
        label="Select Destinations"
        placeholder="Type to filter countries..."
        options={countries}
        size="${sizeVal}"
        ${isMulti ? 'multiple\n        values={val as string[]}\n        onValuesChange={setVal}' : 'value={val as string}\n        onValueChange={setVal}'}
        clearable={${clearVal}}
      />
      <span style={{ fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
        Selected: {Array.isArray(val) ? val.join(', ') : val}
      </span>
    </div>
  );
}

render(<ComboboxDemo />);`;
    },
  },
  {
    id: 'gauge',
    title: 'Gauge Telemetry',
    category: 'Visual & Metrics',
    defaultState: { type: 'arc', tone: 'primary', val: 78 },
    generateCode: (s) => {
      const gType = s.type || 'arc';
      const gTone = s.tone || 'primary';
      const gVal = s.val ?? 78;
      return `function GaugeDemo() {
  const [val, setVal] = useState(${gVal});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
      <Gauge
        value={val}
        type="${gType}"
        tone="${gTone}"
        size={170}
        strokeWidth={13}
        label="Production Load"
        sublabel="Real-time CPU telemetry"
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button size="sm" variant="outline" onClick={() => setVal(v => Math.max(0, v - 15))}>-15%</Button>
        <Button size="sm" variant="outline" onClick={() => setVal(v => Math.min(100, v + 15))}>+15%</Button>
      </div>
    </div>
  );
}

render(<GaugeDemo />);`;
    },
  },
  {
    id: 'confetti',
    title: 'Confetti Cannons',
    category: 'Delight & Feedback',
    defaultState: { count: 80, spread: 70 },
    generateCode: (s) => {
      const count = s.count || 80;
      const spread = s.spread || 70;
      return `function ConfettiDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center' }}>
      <Badge tone="success" pill>Production Deployed 🚀</Badge>
      <h3 style={{ margin: 0 }}>Celebration Launcher</h3>
      <p style={{ margin: 0, color: 'var(--pui-fg-muted)', fontSize: '0.875rem' }}>
        Particle blasts with physics gravity, air resistance, and 60fps canvas performance.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Button
          variant="primary"
          onClick={() => fireConfetti({ particleCount: ${count}, spread: ${spread} })}
          leftIcon={<ZapIcon size={14} />}
        >
          Fire Confetti Blast
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            fireConfetti({ particleCount: 50, angle: 60, origin: { x: 0, y: 0.7 } });
            fireConfetti({ particleCount: 50, angle: 120, origin: { x: 1, y: 0.7 } });
          }}
        >
          Twin Cannons
        </Button>
      </div>
    </div>
  );
}

render(<ConfettiDemo />);`;
    },
  },
  {
    id: 'qrcode',
    title: 'Live QR Code',
    category: 'Visual & Utilities',
    defaultState: { bordered: true, size: 160, color: 'default' },
    generateCode: (s) => {
      const bordered = !!s.bordered;
      const size = s.size || 160;
      const fgColor = s.color === 'brand' ? '#2563eb' : s.color === 'emerald' ? '#059669' : '#0f172a';
      return `function QRCodeDemo() {
  const [url, setUrl] = useState('https://github.com/hesh/ui-library');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%', maxWidth: '20rem' }}>
      <QRCode
        value={url}
        size={${size}}
        bordered={${bordered}}
        fgColor="${fgColor}"
      />
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Type any URL or text..."
      />
    </div>
  );
}

render(<QRCodeDemo />);`;
    },
  },
  {
    id: 'scratch',
    title: 'Blank Sandbox',
    category: 'Freeform',
    defaultState: {},
    generateCode: () => {
      return `// Write any React code here!
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

render(<CustomPlayground />);`;
    },
  },
];

export function PlaygroundPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState('button');
  const [templateStates, setTemplateStates] = useState<Record<string, any>>({
    button: { ...TEMPLATES[0]!.defaultState },
    alert: { ...TEMPLATES[1]!.defaultState },
    badge: { ...TEMPLATES[2]!.defaultState },
    login: { ...TEMPLATES[3]!.defaultState },
    otp: { ...TEMPLATES[4]!.defaultState },
    settings: { ...TEMPLATES[5]!.defaultState },
    analytics: { ...TEMPLATES[6]!.defaultState },
    combobox: { multiple: false, size: 'md', clearable: true },
    gauge: { type: 'arc', tone: 'primary', val: 78 },
    confetti: { count: 80, spread: 70 },
    qrcode: { bordered: true, size: 160, color: 'default' },
    scratch: {},
  });

  const activeTemplate =
    TEMPLATES.find((t) => t.id === selectedTemplateId) ?? TEMPLATES[0]!;

  const activeState = templateStates[activeTemplate.id] ?? {};

  // Controlled live code state
  const [liveCode, setLiveCode] = useState(() => activeTemplate.generateCode(activeState));
  const isFirstMount = useRef(true);

  // Check for shareable permalink on mount (#/playground?code=...)
  useEffect(() => {
    try {
      const hash = window.location.hash;
      const match = hash.match(/[?&]code=([^&]+)/);
      if (match && match[1]) {
        const decoded = decodeURIComponent(escape(atob(decodeURIComponent(match[1]))));
        if (decoded && decoded.trim()) {
          setSelectedTemplateId('scratch');
          setLiveCode(decoded);
        }
      }
    } catch (err) {
      console.warn('Could not parse shared code from URL:', err);
    }
  }, []);

  // Sync code whenever selected template changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      const hash = window.location.hash;
      if (hash.includes('code=')) return;
    }
    const currentTmpl = TEMPLATES.find((t) => t.id === selectedTemplateId) ?? TEMPLATES[0]!;
    const state = templateStates[currentTmpl.id] ?? currentTmpl.defaultState;
    setLiveCode(currentTmpl.generateCode(state));
  }, [selectedTemplateId]);

  // Update customize option: updates state AND immediately regenerates code in the live editor
  const updateCustomizerState = (patch: Record<string, any>) => {
    const nextState = { ...activeState, ...patch };
    setTemplateStates((prev) => ({
      ...prev,
      [activeTemplate.id]: nextState,
    }));
    const newCode = activeTemplate.generateCode(nextState);
    setLiveCode(newCode);
  };

  const handleReset = () => {
    const defaultState = activeTemplate.defaultState;
    setTemplateStates((prev) => ({
      ...prev,
      [activeTemplate.id]: { ...defaultState },
    }));
    setLiveCode(activeTemplate.generateCode(defaultState));
  };

  const handleInsertSnippet = (snippet: string) => {
    setLiveCode((current) => {
      if (current.includes('</div>')) {
        const lastDivIndex = current.lastIndexOf('</div>');
        return (
          current.slice(0, lastDivIndex) +
          `  ${snippet}\n    ` +
          current.slice(lastDivIndex)
        );
      }
      return current + '\n' + snippet;
    });
  };

  // Render the customize controls for the active template
  const renderCustomizers = (): ReactNode => {
    if (activeTemplate.id === 'button') {
      return (
        <div className="playground-studio__customizers">
          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Variant</span>
            <div className="playground-studio__cust-pills">
              {['primary', 'secondary', 'outline', 'ghost', 'danger'].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.variant === v ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ variant: v })}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Size</span>
            <div className="playground-studio__cust-pills">
              {['S', 'M', 'l'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.size === sz ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ size: sz })}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.loading ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ loading: !activeState.loading })}
          >
            ⚡ Loading
          </button>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.disabled ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ disabled: !activeState.disabled })}
          >
            🚫 Disabled
          </button>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.withIcon ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ withIcon: !activeState.withIcon })}
          >
            ★ Icon
          </button>
        </div>
      );
    }

    if (activeTemplate.id === 'alert') {
      return (
        <div className="playground-studio__customizers">
          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Tone</span>
            <div className="playground-studio__cust-pills">
              {['info', 'success', 'warning', 'danger'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.tone === t ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ tone: t })}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Style</span>
            <div className="playground-studio__cust-pills">
              {['subtle', 'solid', 'outline'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.variant === st ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ variant: st })}
                >
                  {st.charAt(0).toUpperCase() + st.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.dismissible ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ dismissible: !activeState.dismissible })}
          >
            ✕ Dismissible
          </button>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.withIcon ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ withIcon: !activeState.withIcon })}
          >
            🔔 Icon
          </button>
        </div>
      );
    }

    if (activeTemplate.id === 'badge') {
      return (
        <div className="playground-studio__customizers">
          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Tone</span>
            <div className="playground-studio__cust-pills">
              {['primary', 'success', 'warning', 'danger', 'neutral'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.tone === t ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ tone: t })}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Shape</span>
            <div className="playground-studio__cust-pills">
              <button
                type="button"
                className={`playground-studio__cust-btn${activeState.pill ? ' playground-studio__cust-btn--active' : ''}`}
                onClick={() => updateCustomizerState({ pill: true })}
              >
                Pill
              </button>
              <button
                type="button"
                className={`playground-studio__cust-btn${!activeState.pill ? ' playground-studio__cust-btn--active' : ''}`}
                onClick={() => updateCustomizerState({ pill: false })}
              >
                Rounded
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeTemplate.id === 'login') {
      return (
        <div className="playground-studio__customizers">
          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Button</span>
            <div className="playground-studio__cust-pills">
              {['primary', 'secondary', 'outline'].map((bv) => (
                <button
                  key={bv}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.buttonVariant === bv ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ buttonVariant: bv })}
                >
                  {bv.charAt(0).toUpperCase() + bv.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Padding</span>
            <div className="playground-studio__cust-pills">
              {['Compact', 'Normal', 'Relaxed'].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.padding === p ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ padding: p })}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.strengthMeter ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ strengthMeter: !activeState.strengthMeter })}
          >
            🔒 Password Strength
          </button>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.rememberMe ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ rememberMe: !activeState.rememberMe })}
          >
            ☑ Remember Me
          </button>
        </div>
      );
    }

    if (activeTemplate.id === 'otp') {
      return (
        <div className="playground-studio__customizers">
          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Digits</span>
            <div className="playground-studio__cust-pills">
              {['4 Digits', '6 Digits'].map((len) => (
                <button
                  key={len}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.length === len ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ length: len })}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Badge Tone</span>
            <div className="playground-studio__cust-pills">
              {['primary', 'success', 'info'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.tone === t ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ tone: t })}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTemplate.id === 'settings') {
      return (
        <div className="playground-studio__customizers">
          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Backup</span>
            <div className="playground-studio__cust-pills">
              {['daily', 'weekly', 'monthly'].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.frequency === f ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ frequency: f })}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.canary ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ canary: !activeState.canary })}
          >
            🟢 Canary Traffic
          </button>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.telemetry ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ telemetry: !activeState.telemetry })}
          >
            📊 Audit Logs
          </button>
        </div>
      );
    }

    if (activeTemplate.id === 'analytics') {
      return (
        <div className="playground-studio__customizers">
          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Period</span>
            <div className="playground-studio__cust-pills">
              {['24h', '7d', '30d'].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.timeframe === p ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ timeframe: p })}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.showSparkline ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ showSparkline: !activeState.showSparkline })}
          >
            📈 Sparkline
          </button>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.showProgress ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ showProgress: !activeState.showProgress })}
          >
            📊 Quota Bar
          </button>
        </div>
      );
    }

    if (activeTemplate.id === 'combobox') {
      return (
        <div className="playground-studio__customizers">
          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.multiple ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ multiple: !activeState.multiple })}
          >
            Multi-Select Tags
          </button>

          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Size</span>
            <div className="playground-studio__cust-pills">
              {['sm', 'md', 'lg'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.size === sz ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ size: sz })}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.clearable ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ clearable: !activeState.clearable })}
          >
            Clearable
          </button>
        </div>
      );
    }

    if (activeTemplate.id === 'gauge') {
      return (
        <div className="playground-studio__customizers">
          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Shape</span>
            <div className="playground-studio__cust-pills">
              {['arc', 'circle', 'semicircle'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.type === t ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ type: t })}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Tone</span>
            <div className="playground-studio__cust-pills">
              {['primary', 'success', 'warning', 'danger'].map((tn) => (
                <button
                  key={tn}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.tone === tn ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ tone: tn })}
                >
                  {tn.charAt(0).toUpperCase() + tn.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTemplate.id === 'confetti') {
      return (
        <div className="playground-studio__customizers">
          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Particle Burst</span>
            <div className="playground-studio__cust-pills">
              {[50, 80, 140].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.count === c ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ count: c })}
                >
                  {c} particles
                </button>
              ))}
            </div>
          </div>

          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Spread</span>
            <div className="playground-studio__cust-pills">
              {[45, 70, 100].map((sp) => (
                <button
                  key={sp}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.spread === sp ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ spread: sp })}
                >
                  {sp}° arc
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeTemplate.id === 'qrcode') {
      return (
        <div className="playground-studio__customizers">
          <div className="playground-studio__cust-group">
            <span className="playground-studio__cust-label">Color</span>
            <div className="playground-studio__cust-pills">
              {['default', 'brand', 'emerald'].map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`playground-studio__cust-btn${activeState.color === c ? ' playground-studio__cust-btn--active' : ''}`}
                  onClick={() => updateCustomizerState({ color: c })}
                >
                  {c.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={`playground-studio__cust-toggle${activeState.bordered ? ' playground-studio__cust-toggle--active' : ''}`}
            onClick={() => updateCustomizerState({ bordered: !activeState.bordered })}
          >
            Border Box
          </button>
        </div>
      );
    }

    if (activeTemplate.id === 'scratch') {
      return (
        <div className="playground-studio__customizers">
          <span className="playground-studio__cust-label">Insert:</span>
          <button
            type="button"
            className="playground-studio__cust-btn"
            onClick={() => handleInsertSnippet('<Button variant="primary">New Button</Button>')}
          >
            + Button
          </button>
          <button
            type="button"
            className="playground-studio__cust-btn"
            onClick={() => handleInsertSnippet('<Badge tone="success" pill>Online</Badge>')}
          >
            + Badge
          </button>
          <button
            type="button"
            className="playground-studio__cust-btn"
            onClick={() => handleInsertSnippet('<Alert tone="info" title="Note">Sample message</Alert>')}
          >
            + Alert
          </button>
          <button
            type="button"
            className="playground-studio__cust-btn"
            onClick={() => handleInsertSnippet('<Input label="Username" placeholder="Enter username..." />')}
          >
            + Input
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="playground-page">
      <header className="playground-page__header">
        <div className="playground-page__title-group">
          <h1 className="playground-page__title">Playground</h1>
          <code className="playground-page__quick-import">import * as Hesh from 'hesh-ui';</code>
        </div>

        <div className="playground-page__templates">
          <span className="playground-page__template-label">Presets:</span>
          {TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              type="button"
              className={`playground-page__template-btn${selectedTemplateId === tmpl.id ? ' playground-page__template-btn--active' : ''
                }`}
              onClick={() => setSelectedTemplateId(tmpl.id)}
            >
              {tmpl.title}
            </button>
          ))}
        </div>
      </header>

      <LivePlayground
        key={activeTemplate.id}
        initialCode={liveCode}
        code={liveCode}
        onChange={setLiveCode}
        onReset={handleReset}
        customizers={renderCustomizers()}
        description="Edit TSX code in real-time or click the customize controls above to see live code and preview updates."
      />
    </div>
  );
}

import { useState } from 'react';
import {
  AreaChart,
  AvatarGroup,
  Badge,
  Button,
  Calendar,
  Card,
  CardBody,
  CardHeader,
  Combobox,
  DatePicker,
  DonutChart,
  Kbd,
  Progress,
  Separator,
  Slider,
  Sparkline,
  Switch,
  Tabs,
  useToast,
  PresetSwitch,
} from '../../src/index';
import { ArrowRightIcon, CheckIcon, ZapIcon } from '../../src/index';

/* ------------------------------------------------------------------ hero */

function InstallCommand() {
  const [copied, setCopied] = useState(false);
  const command = 'npx hesh-ui add button';

  return (
    <button
      type="button"
      className="install"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(command);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
      aria-label={`Copy install command: ${command}`}
    >
      <span className="install__prompt">$</span>
      <code>{command}</code>
      <span className="install__action">{copied ? 'copied' : 'copy'}</span>
    </button>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero__mesh" aria-hidden="true">
        <span className="hero__blob hero__blob--1" />
        <span className="hero__blob hero__blob--2" />
        <span className="hero__blob hero__blob--3" />
        <span className="hero__grid" />
      </div>

      <div className="hero__inner">
        <div className="hero__brand-row">
          <div className="hero__brand-logo-wrap">
            <img
              src="/docs/assets/logo/hesh-logo.png"
              alt="Hesh UI"
              width="48"
              height="48"
              className="hero__brand-logo"
            />
          </div>
          <span className="hero__badge">
            <ZapIcon size={13} />
            Zero dependencies · 48 components · accessible by default
          </span>
        </div>

        <h1 className="hero__title">
          Ship interfaces that look
          <br />
          <span className="hero__grad">designed, not defaulted.</span>
        </h1>

        <p className="hero__sub">
          A React component library where every interaction detail is already
          finished — states, focus rings, keyboard behaviour, loading and empty
          states — and every visual decision routes through a token layer you can
          rewrite in ten lines.
        </p>

        <div className="hero__cta">
          <Button
            size="lg"
            className="hero__btn-get-started"
            rightIcon={<ArrowRightIcon />}
            onClick={() => (window.location.hash = '/getting-started')}
          >
            Get started
          </Button>
          <Button size="lg" variant="secondary" onClick={() => (window.location.hash = '/dashboard')}>
            See a dashboard
          </Button>
        </div>

        <InstallCommand />

        <p className="hero__hint">
          Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> anywhere on this site to jump to any page.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ live mosaic */

function Mosaic() {
  const [slider, setSlider] = useState(64);
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState('growth');
  const [date, setDate] = useState<Date | null>(new Date());

  const revenue = [
    { label: 'Jan', value: 28 }, { label: 'Feb', value: 31 },
    { label: 'Mar', value: 29 }, { label: 'Apr', value: 36 },
    { label: 'May', value: 42 }, { label: 'Jun', value: 40 },
    { label: 'Jul', value: 48 }, { label: 'Aug', value: 54 },
  ];

  return (
    <section className="section">
      <div className="section__head" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <div>
          <h2 className="section__title">Everything below is live</h2>
          <p className="section__desc">
            Not screenshots. Not sandboxed iframes. Real components on this page —
            switch the theme, color presets, or density to watch all of them respond instantly.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--pui-fg-muted)' }}>Color presets:</span>
          <PresetSwitch />
        </div>
      </div>

      <div className="mosaic">
        <Card padded>
          <div className="mosaic__label">Actions</div>
          <div className="mosaic__row">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="secondary">Secondary</Button>
            <Button size="sm" variant="outline">Outline</Button>
            <Button size="sm" variant="ghost">Ghost</Button>
          </div>
          <div className="mosaic__row">
            <Button size="sm" variant="danger">Danger</Button>
            <Button size="sm" variant="subtle">Subtle</Button>
            <Button size="sm" loading>Loading</Button>
          </div>
        </Card>

        <Card padded>
          <div className="mosaic__label">Inputs</div>
          <div className="mosaic__stack">
            <Combobox
              value={plan}
              onValueChange={setPlan}
              options={[
                { value: 'starter', label: 'Starter' },
                { value: 'growth', label: 'Growth' },
                { value: 'scale', label: 'Scale' },
              ]}
            />
            <DatePicker value={date} onChange={setDate} />
            <Slider value={slider} onValueChange={setSlider} label="Volume" />
            <span className="mosaic__value">{slider}%</span>
          </div>
        </Card>

        <Card padded>
          <div className="mosaic__label">Selection</div>
          <div className="mosaic__stack">
            <Switch checked={notifications} onCheckedChange={setNotifications} label="Email digest" />
            <Switch defaultChecked label="Product updates" />
            <Progress value={72} />
            <div className="mosaic__row">
              <Badge tone="success" dot>Live</Badge>
              <Badge tone="warning" dot>Trial</Badge>
              <Badge tone="info">Beta</Badge>
            </div>
          </div>
        </Card>

        <Card padded>
          <div className="mosaic__label">Charts</div>
          <AreaChart data={revenue} height={130} showGrid={false} format={(v) => `${v}k`} />
        </Card>

        <Card padded>
          <div className="mosaic__label">People</div>
          <div className="mosaic__stack">
            <AvatarGroup
              size="md"
              max={5}
              people={[
                { name: 'Ada Lovelace' }, { name: 'Grace Hopper' },
                { name: 'Alan Turing' }, { name: 'Katherine Johnson' },
                { name: 'Linus Torvalds' }, { name: 'Margaret Hamilton' },
              ]}
            />
            <Separator />
            <div className="mosaic__row">
              <Sparkline data={[12, 18, 14, 22, 28, 24, 31]} />
              <Sparkline data={[30, 26, 28, 22, 18, 20, 14]} color="var(--pui-chart-6)" />
            </div>
          </div>
        </Card>

        <Card padded>
          <div className="mosaic__label">Overlays & structure</div>
          <Tabs
            items={[
              { value: 'a', label: 'Tabs', content: <p className="prose">Roving tabindex, arrow keys, Home/End.</p> },
              { value: 'b', label: 'Accordion', content: <p className="prose">Panels announce expanded state.</p> },
              { value: 'c', label: 'Menus', content: <p className="prose">Type-to-search and activedescendant.</p> },
            ]}
          />
        </Card>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ why */

const WHY = [
  {
    title: 'Finished, not started',
    body: 'Most libraries hand you a starting point and a styling job. Every component here ships complete: hover, active, focus-visible, disabled, loading, empty and error states are already drawn and wired.',
  },
  {
    title: 'Ten-line rebrand',
    body: 'Components never touch a raw colour. They read semantic tokens, which read primitives. Replace the brand ramp and every button, badge, focus ring and chart follows.',
  },
  {
    title: 'Nothing to configure',
    body: 'No Tailwind config, no CLI, no PostCSS step, no CSS-in-JS provider. Install, import one stylesheet, wrap in a provider. Works identically in Vite, Next.js and Remix.',
  },
  {
    title: 'Accessibility that is tested',
    body: 'Every page in these docs is mounted in jsdom on each change, with behavioural assertions on the ARIA patterns the docs claim. Undocumented, untested behaviour is a bug waiting to happen.',
  },
  {
    title: 'Charts included',
    body: 'Area, bar, donut and sparkline, reading colour from the token layer. Dashboard-shaped problems usually need a charting dependency — here they do not.',
  },
  {
    title: 'Readable, ownable code',
    body: 'Semantic class names and plain CSS. No utility soup, no runtime style injection. If you need a variant that does not exist, copy the file — the API is small enough to own.',
  },
];

function Why() {
  return (
    <section className="section">
      <div className="section__head">
        <h2 className="section__title">What it optimises for</h2>
        <p className="section__desc">
          A narrow set of promises, kept completely, instead of a catalogue of
          half-finished components.
        </p>
      </div>
      <div className="why">
        {WHY.map((item) => (
          <div key={item.title} className="why__card">
            <div className="why__title">{item.title}</div>
            <p className="why__body">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ comparison */

const COMPARE = [
  { label: 'Setup', premium: 'import 1 stylesheet', tailwind: 'config + plugins + theme', primitives: 'style everything' },
  { label: 'Default look', premium: 'finished product UI', tailwind: 'you design it', primitives: 'unstyled' },
  { label: 'Rebranding', premium: 'token overrides', tailwind: 'edit every usage', primitives: 'edit every usage' },
  { label: 'Charts', premium: 'included', tailwind: 'buy or build', primitives: 'buy or build' },
  { label: 'Runtime deps', premium: 'none', tailwind: 'Tailwind build', primitives: 'Radix + others' },
  { label: 'Accessibility', premium: 'implemented + tested', tailwind: 'entirely your job', primitives: 'excellent, unstyled' },
  { label: 'Ecosystem', premium: 'new, small', tailwind: 'enormous', primitives: 'large' },
];

function Compare() {
  return (
    <section className="section">
      <div className="section__head">
        <h2 className="section__title">An honest comparison</h2>
        <p className="section__desc">
          The last row is the one that matters. Pick the library whose weaknesses
          you can live with — not the one with the best marketing.
        </p>
      </div>
      <div className="compare-table-wrap">
        <table className="compare-table">
          <thead>
            <tr>
              <th></th>
              <th className="compare-table__hl">Hesh</th>
              <th>Tailwind from scratch</th>
              <th>Unstyled primitives</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td className="compare-table__hl">
                  <CheckIcon size={13} />
                  {row.premium}
                </td>
                <td>{row.tailwind}</td>
                <td>{row.primitives}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ cta */

function CTA() {
  const { toast } = useToast();
  return (
    <section className="cta">
      <div className="cta__head">
        <h2 className="cta__title">Build your next screen today</h2>
        <p className="cta__sub">
          The dashboard example on this site is roughly 200 lines of component
          composition and 40 lines of layout CSS.
        </p>
        <div className="cta__actions">
          <Button
            size="lg"
            className="hero__btn-get-started"
            onClick={() => (window.location.hash = '/dashboard')}
          >
            Open the dashboard
          </Button>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => toast({ title: 'Docs are the source of truth', description: 'Every example here is live.', tone: 'success' })}
          >
            Browse components
          </Button>
        </div>
      </div>

      <div className="cta__stats">
        {[
          { value: '48+', label: 'components & patterns' },
          { value: '75', label: 'CLI registry items' },
          { value: '0', label: 'runtime dependencies' },
          { value: '78/78', label: 'routes tested' },
        ].map((stat) => (
          <div key={stat.label} className="cta__stat">
            <div className="cta__stat-value">{stat.value}</div>
            <div className="cta__stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <div className="home">
      <Hero />
      <Mosaic />
      <Why />
      <Compare />
      <CTA />
    </div>
  );
}

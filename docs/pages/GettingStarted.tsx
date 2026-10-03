import { Badge, Button, Card, Separator } from '../../src/index';
import { CodeBlock } from '../components/CodeBlock';
import { Callout, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const INSTALL = `npm install hesh`;

const SETUP = `// app/layout.tsx (Next.js) or src/main.tsx (Vite)
import 'hesh/styles.css';

import { ThemeProvider } from 'hesh';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultMode="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}`;

const FIRST = `import { Button, Input, Card, CardHeader } from 'hesh';

export function SignupCard() {
  return (
    <Card>
      <CardHeader
        title="Create your account"
        description="14 days free. No card required."
      />
      <CardBody>
        <Input label="Work email" type="email" placeholder="you@company.com" />
        <Button fullWidth size="lg">Start building</Button>
      </CardBody>
    </Card>
  );
}`;

const NEXT_SSR = `// app/layout.tsx — avoid a flash of the wrong theme on first paint
import { themeInitScript } from 'hesh';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}`;

const VITE = `// vite.config.ts — nothing special required.
// Tree-shaking works out of the box because the package ships ESM with
// "sideEffects": ["**/*.css"].`;

export function GettingStartedPage() {
  return (
    <DocPage
      eyebrow="Foundations"
      title="Getting started"
      lede={
        <>
          Hesh is a React component library with polished defaults, a small
          token layer for theming, and accessibility built into every interactive
          part. React is the only peer dependency.
        </>
      }
    >
      <Section title="Install">
        <div className="stack">
          <CodeBlock code={INSTALL} language="bash" />
          <div className="requirement-row">
            <Badge tone="success" dot>React 18+</Badge>
            <Badge tone="neutral">TypeScript first</Badge>
            <Badge tone="neutral">ESM + CJS</Badge>
            <Badge tone="neutral">~14 kB gzipped CSS</Badge>
          </div>
        </div>
      </Section>

      <Section
        title="Wrap your app"
        description="Import the stylesheet once, then wrap your tree in ThemeProvider. The provider writes data-pui-theme onto <html>; there is no runtime style injection."
      >
        <CodeBlock code={SETUP} />
        <Callout tone="info" title="Why a provider at all?">
          Every component reads its colours from CSS custom properties, so nothing
          breaks if you skip <code>ThemeProvider</code> — you simply get the light
          theme and <code>useTheme()</code> will throw. The provider exists to
          manage the attribute, persist the choice, and follow the OS setting.
        </Callout>
      </Section>

      <Section title="Build something" description="Every import is tree-shakeable. Nothing else is pulled in.">
        <Showcase
          code={FIRST}
          bleed={false}
          width="md"
          footer={
            <Callout tone="success">
              Notice there is no <code>className</code> anywhere. Layout, states and
              focus rings ship with the components — you add your own spacing and
              composition.
            </Callout>
          }
        >
          <div className="stack">
            <div style={{ maxWidth: 380, margin: '0 auto', width: '100%' }}>
              <div className="fake-card">
                <div className="fake-card__head">
                  <strong>Create your account</strong>
                  <span>14 days free. No card required.</span>
                </div>
                <div className="stack" style={{ marginTop: '1rem' }}>
                  <label className="pui-label" htmlFor="demo-email">
                    Work email
                  </label>
                  <input id="demo-email" className="pui-control" type="email" placeholder="you@company.com" />
                  <Button fullWidth size="lg">
                    Start building
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Server-side rendering">
        <p className="prose">
          All components render on the server without special handling: portals
          return <code>null</code> until mounted, and no component reads{' '}
          <code>window</code> or <code>localStorage</code> at module scope. The one
          thing server rendering cannot do for you is know the user's stored theme
          before the document arrives — drop in the init script to fix that.
        </p>
        <CodeBlock code={NEXT_SSR} />
        <Callout tone="warning" title="Add suppressHydrationWarning">
          The init script mutates <code>&lt;html&gt;</code> before React hydrates.
          React would otherwise warn about a mismatched attribute.
        </Callout>
      </Section>

      <Section title="Bundlers">
        <CodeBlock code={VITE} />
        <p className="prose">
          No plugin, no PostCSS step, no content-scanning config. The stylesheet is
          plain CSS with custom properties, and the JS is ESM with a{' '}
          <code>sideEffects</code> field so bundlers can drop unused components.
        </p>
      </Section>

      <Separator style={{ marginBlock: '2rem' }} />

      <Section title="What's in the box">
        <div className="inventory">
          {[
            { group: 'Forms', items: 'Button · IconButton · Input · Textarea · Select · Combobox · Checkbox · Radio · Switch' },
            { group: 'Display', items: 'Card · Badge · Avatar · Separator · Skeleton · Stat · Progress · Kbd' },
            { group: 'Overlays', items: 'Dialog · Drawer · DropdownMenu · Tooltip · Toast' },
            { group: 'Navigation', items: 'Tabs · SidebarNav · PageHeader · Breadcrumbs · Pagination' },
            { group: 'Data', items: 'DataTable with sorting, selection, loading and empty states' },
            { group: 'System', items: 'ThemeProvider · useTheme · design tokens · density presets' },
          ].map((entry) => (
            <div key={entry.group} className="inventory__row">
              <div className="inventory__group">{entry.group}</div>
              <div className="inventory__items">{entry.items}</div>
            </div>
          ))}
        </div>
      </Section>
    </DocPage>
  );
}

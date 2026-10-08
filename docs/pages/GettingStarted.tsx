import { Badge, Button, Card, Separator } from '../../src/index';
import { CodeBlock } from '../components/CodeBlock';
import { Callout, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const CLI_INIT = `npx hesh-ui init`;
const CLI_ADD = `npx hesh-ui add button dialog calendar`;

const INSTALL = `npm install hesh-ui`;

const SETUP = `// app/layout.tsx (Next.js) or src/main.tsx (Vite)
import 'hesh-ui/styles.css';

import { ThemeProvider } from 'hesh-ui';

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

const FIRST = `import { Button, Input, Card, CardHeader } from 'hesh-ui';

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
import { themeInitScript } from 'hesh-ui';

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

const TAILWIND_SETUP = `/* app/globals.css */
@import 'hesh-ui/styles.css';

@tailwind base;
@tailwind components;
@tailwind utilities;`;

const TAILWIND_USAGE = `import { Button, Badge } from 'hesh-ui';

export function Hero() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Badge tone="primary">New Feature</Badge>
      {/* Tailwind utility classes merge cleanly onto hesh-ui components */}
      <Button className="shadow-xl hover:shadow-indigo-500/25">
        Get Started
      </Button>
    </div>
  );
}`;

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
      <Section
        title="CLI: Own your components (Recommended)"
        description="Copy and own clean source code directly into your codebase. Zero black-box dependencies, complete customizability, and automatic transitive primitive resolution."
      >
        <div className="stack">
          <p className="prose">
            1. Initialize Hesh UI in your Next.js, Vite, or Remix project:
          </p>
          <CodeBlock code={CLI_INIT} language="bash" />
          <p className="prose" style={{ marginTop: '0.75rem' }}>
            2. Add any component directly into your <code>components/ui/</code> folder:
          </p>
          <CodeBlock code={CLI_ADD} language="bash" />
          <Callout tone="success" title="Zero External Radix Dependencies">
            Unlike shadcn which installs 15+ external <code>@radix-ui/*</code> npm packages,
            Hesh UI primitives are 100% self-contained. The CLI scaffolds clean, readable TSX
            files that you fully control and own.
          </Callout>
        </div>
      </Section>

      <Section title="Alternative: Install via npm" description="If you prefer installing pre-bundled components from the npm registry:">
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

      <Section
        title="Using with Tailwind CSS"
        description="hesh-ui works seamlessly alongside Tailwind CSS. It does not require Tailwind, but if your project uses Tailwind, they pair perfectly."
      >
        <p className="prose">
          Add <code>@import 'hesh-ui/styles.css';</code> to the top of your <code>app/globals.css</code> (or import it in <code>app/layout.tsx</code> before your globals):
        </p>
        <CodeBlock code={TAILWIND_SETUP} language="css" />
        <p className="prose" style={{ marginTop: '1rem' }}>
          All hesh-ui components accept a <code>className</code> prop. You can add Tailwind layout, spacing, and utility classes directly:
        </p>
        <CodeBlock code={TAILWIND_USAGE} />
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

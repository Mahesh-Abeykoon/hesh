import React, { useState } from 'react';
import { HoverCard, Avatar, Button, Badge } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { HoverCardWorkbench } from '../../components/PropsWorkbench';

const PROFILE_DEMO = `<HoverCard
  placement="top"
  arrow
  align="center"
  content={
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '18rem', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Avatar name="Sarah Connor" size="md" status="online" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Sarah Connor</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>@sconnor · Joined 2021</div>
        </div>
        <Button size="sm" variant="secondary">Follow</Button>
      </div>
      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)', lineHeight: 1.5 }}>
        Staff Systems Architect building distributed cloud runtimes and design systems.
      </p>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
        <div><strong>1.4k</strong> Following</div>
        <div><strong>24.8k</strong> Followers</div>
      </div>
    </div>
  }
>
  <span role="button" tabIndex={0} style={{ fontWeight: 700, color: 'var(--pui-primary)', cursor: 'pointer', textDecoration: 'underline' }}>
    @sconnor
  </span>
</HoverCard>`;

const REPO_DEMO = `<HoverCard
  placement="bottom"
  arrow
  width={320}
  content={
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--pui-fg)' }}>
          hesh/ui-library
        </span>
        <Badge tone="success" pill>v2.4.0</Badge>
      </div>
      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)' }}>
        Ultra-modern, production-grade accessible React component library.
      </p>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>
        <span>★ 12,480</span>
        <span>⑂ 1,320</span>
        <span>TypeScript</span>
      </div>
    </div>
  }
>
  <Button variant="outline" size="sm">hesh/ui-library</Button>
</HoverCard>`;

export function HoverCardPage() {
  const [following, setFollowing] = useState(false);

  const profileContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: '100%',
        maxWidth: '18rem',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Avatar name="Sarah Connor" size="md" status="online" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--pui-fg)' }}>
            Sarah Connor
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--pui-fg-muted)' }}>
            @sconnor · Joined 2021
          </div>
        </div>
        <Button
          size="sm"
          variant={following ? 'outline' : 'primary'}
          onClick={() => setFollowing(!following)}
        >
          {following ? 'Following' : 'Follow'}
        </Button>
      </div>

      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)', lineHeight: 1.5 }}>
        Staff Systems Architect building distributed cloud runtimes, edge networking, and high-performance design systems.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          fontSize: '0.75rem',
          color: 'var(--pui-fg-subtle)',
          paddingTop: '0.25rem',
          borderTop: '1px solid var(--pui-border)',
        }}
      >
        <div>
          <strong style={{ color: 'var(--pui-fg)' }}>1.4k</strong> Following
        </div>
        <div>
          <strong style={{ color: 'var(--pui-fg)' }}>{following ? '24,801' : '24.8k'}</strong> Followers
        </div>
      </div>
    </div>
  );

  const repoContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
        width: '100%',
        maxWidth: '18rem',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--pui-fg)' }}>
          hesh / ui-library
        </span>
        <Badge tone="success" pill>
          v2.4.0
        </Badge>
      </div>

      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--pui-fg-muted)', lineHeight: 1.4 }}>
        Ultra-modern, production-grade accessible React component library built with vanilla CSS.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          fontSize: '0.75rem',
          color: 'var(--pui-fg-subtle)',
        }}
      >
        <span>★ 12,480 stars</span>
        <span>⑂ 1,320 forks</span>
        <span>TypeScript</span>
      </div>
    </div>
  );

  return (
    <DocPage
      eyebrow="Components"
      title="HoverCard"
      lede="Displays rich preview cards on hover or keyboard focus, enabling users to glimpse contextual metadata without navigating away, featuring anchor arrows, custom widths, and smooth bridge timing."
      importStatement="import { HoverCard } from 'hesh-ui';"
    >
      <Section
        title="Interactive Props Workbench"
        description="Fine-tune placement sides, alignment, pointer arrows, card widths, and preview content presets."
      >
        <HoverCardWorkbench />
      </Section>

      <Section
        title="Interactive Profile Preview"
        description="Hover over the author link below. Notice how you can effortlessly glide your pointer into the floating preview card without it closing."
      >
        <Showcase code={PROFILE_DEMO} defaultOpen width="md">
          <div
            style={{
              padding: 'clamp(1rem, 4vw, 2rem) 0.5rem',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <span style={{ fontSize: '0.9375rem', color: 'var(--pui-fg-muted)' }}>
              Component crafted with care by{' '}
              <HoverCard content={profileContent} placement="top" arrow align="center">
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Sarah Connor Profile Preview"
                  style={{
                    fontWeight: 700,
                    color: 'var(--pui-primary)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  @sconnor
                </span>
              </HoverCard>{' '}
              and distributed under MIT open-source license.
            </span>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Repository & Package Preview"
        description="Hover over code badges or dependency names to preview metadata, statistics, and release versions."
      >
        <Showcase code={REPO_DEMO}>
          <div className="row-wrap" style={{ gap: '1rem', alignItems: 'center' }}>
            <HoverCard content={repoContent} placement="bottom" arrow width={300}>
              <Button variant="outline" size="sm">
                Inspect Repository
              </Button>
            </HoverCard>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Dual Pointer and Keyboard Support">
          The hover card uses <code>role="dialog"</code> and links its trigger with <code>aria-haspopup="dialog"</code> and <code>aria-controls</code>. It triggers on keyboard focus for screen reader and keyboard accessibility, and closes promptly on <kbd className="pui-kbd">Esc</kbd>.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            {
              name: 'content',
              type: 'ReactNode',
              required: true,
              description: 'Rich preview content rendered inside the floating card.',
            },
            {
              name: 'children',
              type: 'ReactElement',
              required: true,
              description: 'Single interactive element that triggers hover and focus.',
            },
            {
              name: 'placement',
              type: "'top' | 'bottom' | 'left' | 'right'",
              default: "'bottom'",
              description: 'Preferred direction relative to the trigger.',
            },
            {
              name: 'align',
              type: "'start' | 'center' | 'end'",
              default: "'start'",
              description: 'Alignment along trigger edge.',
            },
            {
              name: 'arrow',
              type: 'boolean',
              default: 'false',
              description: 'Renders an anchor arrow pointing towards the trigger.',
            },
            {
              name: 'width',
              type: 'number | string',
              description: 'Explicit width or max-width for the floating card.',
            },
            {
              name: 'openDelay',
              type: 'number',
              default: '200',
              description: 'Hover delay in milliseconds before opening.',
            },
            {
              name: 'closeDelay',
              type: 'number',
              default: '250',
              description: 'Grace period in milliseconds before closing after pointer leaves.',
            },
            {
              name: 'offset',
              type: 'number',
              default: '8',
              description: 'Pixel distance between trigger and card.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Whether the hover card is disabled.',
            },
            {
              name: 'open',
              type: 'boolean',
              description: 'Controlled open state.',
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean) => void',
              description: 'Callback fired when open state changes in controlled mode.',
            },
          ]}
        />
      </Section>
    </DocPage>
  );
}

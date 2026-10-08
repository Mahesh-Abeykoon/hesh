import React from 'react';
import {
  Tooltip,
  Button,
  IconButton,
  SettingsIcon,
  ZapIcon,
  CopyIcon,
} from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { TooltipWorkbench } from '../../components/PropsWorkbench';

const TOOLTIP_DEMO = `<Tooltip content="Create deployment" shortcut="⌘D">
  <Button>New Deployment</Button>
</Tooltip>

<Tooltip content="Edit project configuration" shortcut="⌘," placement="bottom" arrow>
  <IconButton aria-label="Settings" variant="secondary">
    <SettingsIcon />
  </IconButton>
</Tooltip>

<Tooltip content="View changelog" tone="primary" placement="top" arrow>
  <IconButton aria-label="Changelog" variant="ghost">
    <ZapIcon />
  </IconButton>
</Tooltip>`;

const TONES_DEMO = `<Tooltip content="Default Dark theme" tone="dark" arrow>
  <Button variant="secondary">Dark</Button>
</Tooltip>

<Tooltip content="Elevated Light surface" tone="light" arrow>
  <Button variant="secondary">Light</Button>
</Tooltip>

<Tooltip content="Primary accent highlight" tone="primary" arrow>
  <Button variant="secondary">Primary</Button>
</Tooltip>

<Tooltip content="Inverted theme contrast" tone="invert" arrow>
  <Button variant="secondary">Invert</Button>
</Tooltip>`;

const INTERACTIVE_DEMO = `<Tooltip
  interactive
  delay={100}
  content={
    <span>
      Need help? Read the{' '}
      <a
        href="#/getting-started"
        style={{ color: 'var(--pui-primary)', textDecoration: 'underline' }}
      >
        Documentation
      </a>
    </span>
  }
>
  <Button variant="outline">Interactive Help</Button>
</Tooltip>`;

export function TooltipPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Tooltip"
      lede="An informative text bubble that appears when an element receives pointer hover or keyboard focus, complete with anchor arrows, hotkey badges, tones, and interactive modes."
      importStatement="import { Tooltip } from 'hesh-ui';"
    >
      <Section
        title="Interactive Props Workbench"
        description="Switch tooltip tones, positions, pointer arrows, keyboard shortcuts, or live edit JSX."
      >
        <TooltipWorkbench />
      </Section>

      <Section
        title="Hover & Focus Tooltips"
        description="Positioned cleanly relative to the trigger element with anchor arrow pointers, shortcut badges, and collision avoidance."
      >
        <Showcase code={TOOLTIP_DEMO} defaultOpen width="md">
          <div className="row-wrap" style={{ gap: '1.5rem', alignItems: 'center' }}>
            <Tooltip content="Create deployment" shortcut="⌘D" arrow>
              <Button>New Deployment</Button>
            </Tooltip>

            <Tooltip content="Edit project settings" shortcut="⌘," placement="bottom" arrow>
              <IconButton aria-label="Settings" variant="secondary">
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip content="View changelog & updates" tone="primary" placement="top" arrow>
              <IconButton aria-label="Changelog" variant="ghost">
                <ZapIcon />
              </IconButton>
            </Tooltip>

            <Tooltip content="Copy shareable link" shortcut="⌘C" placement="right" arrow>
              <IconButton aria-label="Copy" variant="outline">
                <CopyIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Visual Tones"
        description="Select from Dark, Light (elevated card), Primary accent, or Inverted contrast themes."
      >
        <Showcase code={TONES_DEMO}>
          <div className="row-wrap" style={{ gap: '1.25rem', alignItems: 'center' }}>
            <Tooltip content="Default Dark theme" tone="dark" arrow>
              <Button variant="secondary">Dark Tone</Button>
            </Tooltip>

            <Tooltip content="Elevated Light surface" tone="light" arrow>
              <Button variant="secondary">Light Tone</Button>
            </Tooltip>

            <Tooltip content="Primary accent highlight" tone="primary" arrow>
              <Button variant="secondary">Primary Tone</Button>
            </Tooltip>

            <Tooltip content="Inverted theme contrast" tone="invert" arrow>
              <Button variant="secondary">Invert Tone</Button>
            </Tooltip>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Interactive Tooltips"
        description="When interactive is enabled, users can glide their pointer into the tooltip bubble to click links or select text."
      >
        <Showcase code={INTERACTIVE_DEMO}>
          <div className="row-wrap">
            <Tooltip
              interactive
              delay={100}
              tone="light"
              arrow
              content={
                <span style={{ fontSize: '0.8125rem' }}>
                  Need help? Check out our{' '}
                  <a
                    href="#/getting-started"
                    style={{ color: 'var(--pui-primary)', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Quickstart Guide
                  </a>
                </span>
              }
            >
              <Button variant="outline">Hover & Click Link Inside</Button>
            </Tooltip>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="info" title="Dual Input Support">
          Tooltips appear on both <code>mouseenter</code> and <code>focus</code> events. They can be dismissed at any time by pressing <kbd className="pui-kbd">Esc</kbd> without moving focus, satisfying WCAG 2.1 criterion 1.4.13.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            {
              name: 'content',
              type: 'ReactNode',
              required: true,
              description: 'Text or rich elements displayed inside the tooltip bubble.',
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
              default: "'top'",
              description: 'Preferred placement edge relative to trigger.',
            },
            {
              name: 'tone',
              type: "'dark' | 'light' | 'primary' | 'invert'",
              default: "'dark'",
              description: 'Color theme styling for the tooltip card.',
            },
            {
              name: 'arrow',
              type: 'boolean',
              default: 'false',
              description: 'Renders an anchor arrow pointing towards the trigger.',
            },
            {
              name: 'shortcut',
              type: 'string',
              description: 'Optional keyboard shortcut tag displayed in a badge (e.g. ⌘K).',
            },
            {
              name: 'interactive',
              type: 'boolean',
              default: 'false',
              description: 'Enables hovering into the tooltip content without dismiss.',
            },
            {
              name: 'delay',
              type: 'number',
              default: '180',
              description: 'Pointer hover appearance delay in milliseconds.',
            },
            {
              name: 'closeDelay',
              type: 'number',
              default: '100',
              description: 'Grace period before closing on mouse leave in interactive mode.',
            },
            {
              name: 'offset',
              type: 'number',
              default: '8',
              description: 'Pixel distance between trigger and tooltip card.',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Completely disables tooltip display.',
            },
            {
              name: 'open',
              type: 'boolean',
              description: 'Controlled open state.',
            },
            {
              name: 'onOpenChange',
              type: '(open: boolean) => void',
              description: 'Callback fired when open state changes.',
            },
          ]}
        />
      </Section>
    </DocPage>
  );
}

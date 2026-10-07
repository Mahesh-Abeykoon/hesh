import { useState } from 'react';
import {
  NotificationBadge,
  Avatar,
  Button,
  IconButton,
  BellIcon,
  InboxIcon,
  MailIcon,
} from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const BADGE_DEMO = `<NotificationBadge count={5}>
  <IconButton aria-label="Notifications" variant="secondary">
    <BellIcon />
  </IconButton>
</NotificationBadge>

<NotificationBadge count={120} max={99} tone="primary">
  <IconButton aria-label="Inbox" variant="secondary">
    <InboxIcon />
  </IconButton>
</NotificationBadge>

<NotificationBadge dot pulse tone="danger">
  <Avatar name="Sarah Connor" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" />
</NotificationBadge>`;

export function NotificationBadgePage() {
  const [unread, setUnread] = useState(8);

  return (
    <DocPage
      eyebrow="Components"
      title="NotificationBadge"
      lede="Floating corner badge counter or pulsating status dot anchored to avatars, buttons, or navigation icons."
      importStatement="import { NotificationBadge } from 'hesh';"
    >
      <Section
        title="Interactive Anchored Notification Badges"
        description="Supports automatic capping (99+), animated pulse rings, status dots, and corner placement."
      >
        <Showcase code={BADGE_DEMO} defaultOpen width="md">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
            <NotificationBadge count={unread} tone="danger">
              <IconButton aria-label="Notifications" variant="secondary" size="lg">
                <BellIcon size={20} />
              </IconButton>
            </NotificationBadge>

            <NotificationBadge count={142} max={99} tone="primary">
              <IconButton aria-label="Inbox" variant="secondary" size="lg">
                <InboxIcon size={20} />
              </IconButton>
            </NotificationBadge>

            <NotificationBadge dot pulse tone="danger">
              <Avatar
                size="lg"
                name="Sarah Connor"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              />
            </NotificationBadge>

            <NotificationBadge dot tone="success" placement="bottom-right">
              <Avatar size="lg" name="David Kim" />
            </NotificationBadge>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Simulated Live Notifications"
        description="Click buttons below to increment or clear unread notifications."
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button onClick={() => setUnread((c) => c + 1)}>
            Receive Notification (+1)
          </Button>
          <Button variant="ghost" onClick={() => setUnread(0)}>
            Mark All Read (Clear)
          </Button>
        </div>
      </Section>

      <Section title="Component Props">
        <PropsTable
          rows={[
            { name: 'count', type: 'number', description: 'Numeric count value to display.' },
            { name: 'max', type: 'number', default: '99', description: 'Maximum threshold before showing as {max}+.' },
            { name: 'dot', type: 'boolean', default: 'false', description: 'Displays as a compact status indicator dot.' },
            { name: 'pulse', type: 'boolean', default: 'false', description: 'Adds an animated radar pulse ping effect.' },
            { name: 'tone', type: "'danger' | 'primary' | 'success' | 'warning' | 'neutral'", default: "'danger'", description: 'Color tone of the badge.' },
            { name: 'placement', type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'", default: "'top-right'", description: 'Anchor position relative to children.' },
            { name: 'showZero', type: 'boolean', default: 'false', description: 'Whether to show the badge when count is 0.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

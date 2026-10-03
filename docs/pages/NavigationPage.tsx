import { useState } from 'react';
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  PageHeader,
  Pagination,
  Separator,
  SidebarNav,
} from '../../src/index';
import {
  BarChartIcon,
  BellIcon,
  CreditCardIcon,
  HomeIcon,
  PlusIcon,
  SettingsIcon,
  UsersIcon,
} from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const PAGE_HEADER = `<PageHeader
  eyebrow="Settings"
  title="Billing"
  description="Manage your plan, payment method and invoices."
  breadcrumbs={<Breadcrumbs items={[{ label: 'Home', href: '#' }, { label: 'Settings' }, { label: 'Billing' }]} />}
  actions={
    <>
      <Button variant="secondary">Download invoice</Button>
      <Button>Upgrade plan</Button>
    </>
  }
/>`;

const NAV = `<SidebarNav
  activeId="analytics"
  groups={[
    {
      items: [
        { id: 'overview', label: 'Overview', icon: <HomeIcon /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChartIcon />, badge: <Badge tone="primary">New</Badge> },
      ],
    },
    {
      label: 'Workspace',
      items: [
        { id: 'members', label: 'Members', icon: <UsersIcon /> },
        { id: 'billing', label: 'Billing', icon: <CreditCardIcon /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
      ],
    },
  ]}
/>`;

export function NavigationPage() {
  const [activeNav, setActiveNav] = useState('analytics');

  return (
    <DocPage
      eyebrow="Layout & display"
      title="Page header · Nav"
      lede="Structure for application screens. These are layout patterns built from the same primitives, so they inherit your theme and density settings."
    >
      <Section title="Page header" description="Exactly one <h1> per page, with breadcrumbs and actions arranged around it.">
        <Showcase code={PAGE_HEADER} defaultOpen>
          <PageHeader
            eyebrow="Settings"
            title="Billing"
            description="Manage your plan, payment method and invoices."
            breadcrumbs={
              <Breadcrumbs
                items={[{ label: 'Home', href: '#' }, { label: 'Settings', href: '#' }, { label: 'Billing' }]}
              />
            }
            actions={
              <>
                <Button variant="secondary">Download invoice</Button>
                <Button>Upgrade plan</Button>
              </>
            }
          />
        </Showcase>
        <Callout tone="info" title="Breadcrumbs are navigation, not headings">
          The last breadcrumb is marked <code>aria-current="page"</code> and is not a
          link, so it does not compete with the <code>&lt;h1&gt;</code> for the
          document outline.
        </Callout>
      </Section>

      <Section title="Sidebar navigation" description="Groups, icons, badges and disabled items. The active item is marked with aria-current='page' and an accent bar.">
        <Showcase code={NAV}>
          <div className="nav-demo">
            <SidebarNav
              activeId={activeNav}
              aria-label="Example navigation"
              groups={[
                {
                  items: [
                    { id: 'overview', label: 'Overview', icon: <HomeIcon />, onClick: () => setActiveNav('overview') },
                    {
                      id: 'analytics',
                      label: 'Analytics',
                      icon: <BarChartIcon />,
                      badge: <Badge tone="primary">New</Badge>,
                      onClick: () => setActiveNav('analytics'),
                    },
                    { id: 'alerts', label: 'Alerts', icon: <BellIcon />, badge: <Badge tone="danger">3</Badge>, onClick: () => setActiveNav('alerts') },
                  ],
                },
                {
                  label: 'Workspace',
                  items: [
                    { id: 'members', label: 'Members', icon: <UsersIcon />, onClick: () => setActiveNav('members') },
                    { id: 'billing', label: 'Billing', icon: <CreditCardIcon />, onClick: () => setActiveNav('billing') },
                    { id: 'settings', label: 'Settings', icon: <SettingsIcon />, onClick: () => setActiveNav('settings') },
                    { id: 'audit', label: 'Audit log', icon: <SettingsIcon />, disabled: true },
                  ],
                },
              ]}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <span className="mono-note">active: {activeNav}</span>
          </div>
        </Showcase>
      </Section>

      <Section title="Pagination">
        <Showcase
          code={`<Pagination page={page} pageCount={12} onPageChange={setPage} siblings={1} />`}
        >
          <div className="stack">
            <div className="row-between">
              <span className="prose">siblings = 0</span>
              <Pagination page={4} pageCount={12} onPageChange={() => {}} siblings={0} />
            </div>
            <Separator />
            <div className="row-between">
              <span className="prose">siblings = 1 (default)</span>
              <Pagination page={4} pageCount={12} onPageChange={() => {}} />
            </div>
            <Separator />
            <div className="row-between">
              <span className="prose">siblings = 2</span>
              <Pagination page={4} pageCount={12} onPageChange={() => {}} siblings={2} />
            </div>
            <Separator />
            <div className="row-between">
              <span className="prose">Short list — no ellipsis</span>
              <Pagination page={2} pageCount={5} onPageChange={() => {}} />
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Composing a settings screen">
        <Card>
          <CardBody>
            <div className="settings-shell">
              <SidebarNav
                activeId="general"
                aria-label="Settings sections"
                groups={[
                  {
                    label: 'Workspace',
                    items: [
                      { id: 'general', label: 'General' },
                      { id: 'members', label: 'Members' },
                      { id: 'security', label: 'Security' },
                    ],
                  },
                  {
                    label: 'Billing',
                    items: [{ id: 'plan', label: 'Plan' }, { id: 'invoices', label: 'Invoices' }],
                  },
                ]}
              />
              <div className="settings-body">
                <PageHeader
                  title="General"
                  description="Basic information about your workspace."
                  actions={
                    <Button size="sm" leftIcon={<PlusIcon />}>
                      Save
                    </Button>
                  }
                />
                <p className="prose">
                  Page header, sidebar and content compose without a layout
                  component. Nothing here assumes a router — pass <code>href</code>{' '}
                  for links or <code>onClick</code> for client-side navigation.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </Section>

      <Section title="API">
        <PropsTable
          rows={[
            { name: 'PageHeader.eyebrow', type: 'ReactNode', description: 'Small uppercase label above the title.' },
            { name: 'PageHeader.breadcrumbs', type: 'ReactNode', description: 'Rendered above the eyebrow.' },
            { name: 'PageHeader.actions', type: 'ReactNode', description: 'Right-aligned action cluster; wraps on narrow screens.' },
            { name: 'SidebarNav.groups', type: 'NavGroup[]', required: true, description: '{ label?, items } where items are { id, label, icon, href, onClick, badge, disabled }.' },
            { name: 'SidebarNav.activeId', type: 'string', description: 'Marks the current item with aria-current="page".' },
            { name: 'Breadcrumbs.items', type: 'BreadcrumbItem[]', required: true, description: 'The final item renders as plain text with aria-current." },' },
            { name: 'Pagination.siblings', type: 'number', default: '1', description: 'Page buttons shown either side of the current page.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  ZapIcon,
  BarChartIcon,
  CreditCardIcon,
  UsersIcon,
  LockIcon,
} from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const NAV_MENU_DEMO = `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem value="products">
      <NavigationMenuTrigger value="products">Products</NavigationMenuTrigger>
      <NavigationMenuContent value="products">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', width: 'min(100%, 420px)' }}>
          <NavigationMenuLink
            title="Analytics"
            description="Real-time conversion & funnel metrics."
            icon={<BarChartIcon size={18} />}
            href="#analytics"
          />
          <NavigationMenuLink
            title="Automations"
            description="Event-driven triggers and webhook pipelines."
            icon={<ZapIcon size={18} />}
            badge="New"
            href="#automations"
          />
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`;

export function NavigationMenuPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="NavigationMenu"
      lede="Desktop mega-menu navigation bar with accessible triggers, multi-column flyout panels, and rich preview links."
      importStatement="import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from 'hesh';"
    >
      <Section
        title="Interactive Mega-Menu"
        description="Click the navigation triggers to reveal styled flyout panels with icons and rich metadata."
      >
        <Showcase code={NAV_MENU_DEMO} defaultOpen width="full">
          <div style={{ minHeight: '260px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem value="features">
                  <NavigationMenuTrigger value="features">Features</NavigationMenuTrigger>
                  <NavigationMenuContent value="features">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', width: 'min(100%, 440px)' }}>
                      <NavigationMenuLink
                        title="Realtime Analytics"
                        description="Monitor stream metrics live with sub-second latencies."
                        icon={<BarChartIcon size={18} />}
                        href="#analytics"
                      />
                      <NavigationMenuLink
                        title="Workflow Automations"
                        description="Event-driven webhooks and background task runner."
                        icon={<ZapIcon size={18} />}
                        badge="Pro"
                        href="#automations"
                      />
                      <NavigationMenuLink
                        title="Team Collaboration"
                        description="Invite workspaces, manage roles, and share workspaces."
                        icon={<UsersIcon size={18} />}
                        href="#team"
                      />
                      <NavigationMenuLink
                        title="Enterprise Security"
                        description="SSO, audit log exports, and SOC2 compliant encryption."
                        icon={<LockIcon size={18} />}
                        href="#security"
                      />
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem value="billing">
                  <NavigationMenuTrigger value="billing">Pricing & Billing</NavigationMenuTrigger>
                  <NavigationMenuContent value="billing">
                    <div style={{ width: '280px' }}>
                      <NavigationMenuLink
                        title="Flexible Pricing"
                        description="From indie developers to enterprise scale tiers."
                        icon={<CreditCardIcon size={18} />}
                        href="#pricing"
                      />
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem value="docs">
                  <NavigationMenuLink title="Documentation" href="#docs" />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </Showcase>
      </Section>

      <Callout tone="tip" title="Responsive Auto-Fitting Grid">
        Use CSS grid with <code>repeat(auto-fit, minmax(180px, 1fr))</code> inside <code>NavigationMenuContent</code> to ensure flyouts seamlessly adapt between widescreen desktops and smaller laptop screens without overflow.
      </Callout>

      <Section title="Props Reference">
        <PropsTable
          items={[
            { name: 'NavigationMenu', type: 'HTMLElement props', description: 'Top level container holding navigation list.' },
            { name: 'NavigationMenuTrigger.value', type: 'string', description: 'Unique identifier for matching content panel.' },
            { name: 'NavigationMenuContent.value', type: 'string', description: 'Target panel id corresponding to active trigger.' },
            { name: 'NavigationMenuLink.title', type: 'string', description: 'Headline link text.' },
            { name: 'NavigationMenuLink.description', type: 'ReactNode', description: 'Subtext or summary below title.' },
            { name: 'NavigationMenuLink.icon', type: 'ReactNode', description: 'Prefix icon badge.' },
            { name: 'NavigationMenuLink.badge', type: 'ReactNode', description: 'Status pill badge next to title.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

import { IconButton } from '../../../src/index';
import { PaletteIcon, SettingsIcon, UsersIcon } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';

const ICON_BUTTON_DEMO = `<IconButton aria-label="Customize theme" variant="secondary">
  <PaletteIcon />
</IconButton>

<IconButton aria-label="Settings" variant="primary">
  <SettingsIcon />
</IconButton>

<IconButton aria-label="Manage users" variant="ghost">
  <UsersIcon />
</IconButton>`;

export function IconButtonPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="IconButton"
      lede="Square icon-only button requiring mandatory accessible labelling for screen readers."
      importStatement="import { IconButton } from 'hesh-ui';"
    >
      <Section
        title="Icon Button Variants"
        description="Available across all primary, secondary, outline, and ghost variants."
      >
        <Showcase code={ICON_BUTTON_DEMO} defaultOpen width="md">
          <div className="row-wrap" style={{ gap: '1rem', alignItems: 'center' }}>
            <IconButton aria-label="Customize theme" variant="secondary">
              <PaletteIcon />
            </IconButton>
            <IconButton aria-label="Settings" variant="primary">
              <SettingsIcon />
            </IconButton>
            <IconButton aria-label="Manage users" variant="ghost">
              <UsersIcon />
            </IconButton>
            <IconButton aria-label="Disabled option" variant="secondary" disabled>
              <SettingsIcon />
            </IconButton>
          </div>
        </Showcase>
      </Section>

      <Section title="Accessibility">
        <Callout tone="warning" title="Mandatory aria-label">
          Since icon buttons have no visible text content, TypeScript enforces a mandatory <code>aria-label</code> prop to guarantee screen readers announce their function clearly.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'aria-label', type: 'string', required: true, description: 'Accessible name announced to screen readers.' },
            { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'secondary'", description: 'Visual button style.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button dimensions and icon sizing.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables button interactions.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

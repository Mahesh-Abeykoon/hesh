import { Avatar, AvatarGroup, Separator } from '../../../src/index';
import { Callout, PropsTable, Showcase } from '../../components/Showcase';
import { DocPage, Section } from '../../components/DocPage';
import { AvatarWorkbench } from '../../components/PropsWorkbench';

const AVATAR_SIZES = `<Avatar name="Ada Lovelace" size="xs" />
<Avatar name="Grace Hopper" size="sm" />
<Avatar name="Alan Turing" size="md" status="online" />
<Avatar name="Katherine Johnson" size="lg" status="busy" />
<Avatar name="Linus Torvalds" size="xl" status="away" />
<Avatar name="Margaret Hamilton" size="lg" square />`;

const AVATAR_GROUP = `<AvatarGroup
  people={[
    { name: 'Ada Lovelace' },
    { name: 'Grace Hopper' },
    { name: 'Alan Turing' },
    { name: 'Katherine Johnson' },
    { name: 'Linus Torvalds' },
    { name: 'Margaret Hamilton' },
  ]}
  max={4}
  size="sm"
/>`;

export function AvatarPage() {
  return (
    <DocPage
      eyebrow="Components"
      title="Avatar"
      lede="Visual representation of an entity, user profile, or organization with automatic initial generation and deterministic hue calculation."
      importStatement="import { Avatar, AvatarGroup } from 'hesh-ui';"
    >
      <Section
        title="Interactive Props Workbench"
        description="Configure avatar sizes, presence indicators, shapes, and preview live TSX code."
      >
        <AvatarWorkbench />
      </Section>

      <Section
        title="Sizes & Status indicators"
        description="Available in xs through xl sizes, with optional presence dots (online, busy, away, offline) and square or circle variants."
      >
        <Showcase code={AVATAR_SIZES} defaultOpen width="md">
          <div className="row-wrap" style={{ alignItems: 'center', gap: '1rem' }}>
            <Avatar name="Ada Lovelace" size="xs" />
            <Avatar name="Grace Hopper" size="sm" />
            <Avatar name="Alan Turing" size="md" status="online" />
            <Avatar name="Katherine Johnson" size="lg" status="busy" />
            <Avatar name="Linus Torvalds" size="xl" status="away" />
            <Avatar name="Margaret Hamilton" size="lg" square />
          </div>
        </Showcase>
      </Section>

      <Section
        title="Avatar Group"
        description="Stacked overlapping avatars with an automated counter pill for excess members."
      >
        <Showcase code={AVATAR_GROUP} width="md">
          <AvatarGroup
            people={[
              { name: 'Ada Lovelace' },
              { name: 'Grace Hopper' },
              { name: 'Alan Turing' },
              { name: 'Katherine Johnson' },
              { name: 'Linus Torvalds' },
              { name: 'Margaret Hamilton' },
            ]}
            max={4}
            size="sm"
          />
        </Showcase>
      </Section>

      <Section title="Design Notes">
        <Callout tone="info" title="Deterministic Colors">
          When an image URL isn't supplied or fails to load, initials are rendered on top of a deterministic pastel hue generated from hashing the user's name. A user always gets the exact same color without storing additional color metadata.
        </Callout>
      </Section>

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'name', type: 'string', required: true, description: 'Display name used for initials, accessible aria-label, and color hashing.' },
            { name: 'src', type: 'string', description: 'URL of the profile image.' },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Dimension of the avatar.' },
            { name: 'status', type: "'online' | 'busy' | 'away' | 'offline'", description: 'Renders a colored presence dot.' },
            { name: 'square', type: 'boolean', default: 'false', description: 'Renders with rounded squircle corners instead of a full circle.' },
            { name: 'AvatarGroup.max', type: 'number', default: '4', description: 'Maximum visible avatars before truncating to +N.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

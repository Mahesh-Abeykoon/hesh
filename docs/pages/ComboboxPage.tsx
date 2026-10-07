import { useState } from 'react';
import { Badge, Button, Combobox, Separator } from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';
import { ComboboxWorkbench } from '../components/PropsWorkbench';

const COUNTRIES = [
  { value: 'us', label: 'United States', group: 'Americas' },
  { value: 'ca', label: 'Canada', group: 'Americas' },
  { value: 'br', label: 'Brazil', group: 'Americas' },
  { value: 'gb', label: 'United Kingdom', group: 'Europe' },
  { value: 'de', label: 'Germany', group: 'Europe' },
  { value: 'fr', label: 'France', group: 'Europe' },
  { value: 'se', label: 'Sweden', group: 'Europe' },
  { value: 'nl', label: 'Netherlands', group: 'Europe' },
  { value: 'jp', label: 'Japan', group: 'Asia-Pacific', keywords: ['nippon', 'tokyo'] },
  { value: 'sg', label: 'Singapore', group: 'Asia-Pacific' },
  { value: 'in', label: 'India', group: 'Asia-Pacific' },
  { value: 'lk', label: 'Sri Lanka', group: 'Asia-Pacific' },
  { value: 'au', label: 'Australia', group: 'Asia-Pacific' },
  { value: 'za', label: 'South Africa', group: 'Africa' },
];

const TECH_OPTIONS = [
  { value: 'react', label: 'React', description: 'Declarative component UI library' },
  { value: 'vue', label: 'Vue 3', description: 'Progressive JavaScript framework' },
  { value: 'svelte', label: 'Svelte', description: 'Cybernetically enhanced web apps' },
  { value: 'nextjs', label: 'Next.js', description: 'React framework for production' },
  { value: 'remix', label: 'Remix', description: 'Full stack web framework' },
  { value: 'astro', label: 'Astro', description: 'Content-driven island architecture' },
  { value: 'angular', label: 'Angular', description: 'Enterprise frontend platform' },
];

const TEAM_MEMBERS = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Chief Architect · Online', role: 'Staff Eng' },
  { value: 'grace', label: 'Grace Hopper', description: 'Compilers Lead · Active', role: 'Director' },
  { value: 'alan', label: 'Alan Turing', description: 'Security Systems · Away', role: 'Principal' },
  { value: 'katherine', label: 'Katherine Johnson', description: 'Orbital Math · Online', role: 'Staff Eng' },
  { value: 'margaret', label: 'Margaret Hamilton', description: 'Apollo Software · In Meeting', role: 'VP Eng' },
];

const BASIC_DEMO = `const [country, setCountry] = useState('lk');

<Combobox
  label="Country"
  placeholder="Search countries…"
  options={countries}
  value={country}
  onValueChange={setCountry}
  clearable
  hint="Type to filter — try searching for 'tokyo'."
/>`;

const MULTI_DEMO = `const [selectedTech, setSelectedTech] = useState(['react', 'nextjs']);

<Combobox
  label="Tech Stack"
  placeholder="Select technologies…"
  options={techOptions}
  multiple
  values={selectedTech}
  onValuesChange={setSelectedTech}
  clearable
  hint="Select multiple technologies with removable tags."
/>`;

const GROUPED_DEMO = `const [country, setCountry] = useState('jp');

<Combobox
  label="Region & Country"
  placeholder="Filter by country or region…"
  options={countriesWithGroups}
  value={country}
  onValueChange={setCountry}
  clearable
/>`;

const CUSTOM_DEMO = `const [assignee, setAssignee] = useState('ada');

<Combobox
  label="Task Assignee"
  placeholder="Assign teammate…"
  options={teamMembers}
  value={assignee}
  onValueChange={setAssignee}
  renderOption={(opt, { selected, active }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%' }}>
      <div style={{
        width: '1.75rem', height: '1.75rem', borderRadius: '9999px',
        background: 'var(--pui-primary-subtle)', color: 'var(--pui-primary-fg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.75rem', fontWeight: 600,
      }}>
        {opt.label.slice(0, 2).toUpperCase()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontWeight: 550 }}>{opt.label}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>{opt.description}</span>
      </div>
      <span className="pui-badge pui-badge--neutral pui-badge--sm">{opt.role}</span>
    </div>
  )}
/>`;

export function ComboboxPage() {
  const [country, setCountry] = useState('lk');
  const [selectedTech, setSelectedTech] = useState(['react', 'nextjs']);
  const [assignee, setAssignee] = useState('ada');
  const [groupedCountry, setGroupedCountry] = useState('jp');
  const [sizeSmVal, setSizeSmVal] = useState('us');
  const [sizeMdVal, setSizeMdVal] = useState('us');
  const [sizeLgVal, setSizeLgVal] = useState('us');
  const [asyncAssignee, setAsyncAssignee] = useState('');
  const [loading, setLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<{ value: string; label: string }[]>([
    { value: 'ada', label: 'Ada Lovelace' },
    { value: 'grace', label: 'Grace Hopper' },
    { value: 'alan', label: 'Alan Turing' },
  ]);

  const simulateFetch = () => {
    setLoading(true);
    setAsyncOptions([]);
    window.setTimeout(() => {
      setAsyncOptions([
        { value: 'ada', label: 'Ada Lovelace' },
        { value: 'grace', label: 'Grace Hopper' },
        { value: 'alan', label: 'Alan Turing' },
        { value: 'katherine', label: 'Katherine Johnson' },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <DocPage
      eyebrow="Forms"
      title="Combobox"
      lede="A high-performance searchable select with accessible WAI-ARIA combobox behavior, multi-select tag chips, categorized option groups, and custom option renderers."
      importStatement="import { Combobox } from 'hesh';"
    >
      <Section
        title="Interactive Props Workbench"
        description="Switch between single and multi-select, adjust sizes (sm, md, lg), toggle grouped options, or write live TypeScript code."
      >
        <ComboboxWorkbench />
      </Section>

      <Section title="Basic Searchable Select">
        <Showcase code={BASIC_DEMO} defaultOpen width="md">
          <div className="stack">
            <Combobox
              label="Country"
              placeholder="Search countries…"
              options={COUNTRIES}
              value={country}
              onValueChange={setCountry}
              clearable
              hint="Type to filter — try searching for 'tokyo' or 'india'."
            />
            <div>
              <span className="mono-note">Selected: {country || 'none'}</span>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Multi-Select with Removable Badges"
        description="Set multiple={true} to allow selecting multiple values rendered as interactive tags inside the combobox trigger with one-click removal and backspace deletion."
      >
        <Showcase code={MULTI_DEMO} width="md">
          <div className="stack">
            <Combobox
              label="Tech Stack"
              placeholder="Add technologies…"
              options={TECH_OPTIONS}
              multiple
              values={selectedTech}
              onValuesChange={setSelectedTech}
              clearable
              hint="Select multiple technologies. Backspace removes the latest tag."
            />
            <div>
              <span className="mono-note">Selected ({selectedTech.length}): {selectedTech.join(', ') || 'none'}</span>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Categorized Option Groups"
        description="Add a group property to options to automatically render organized category sections with headers that are skipped during keyboard navigation."
      >
        <Showcase code={GROUPED_DEMO} width="md">
          <div className="stack">
            <Combobox
              label="Country by Region"
              placeholder="Search grouped countries…"
              options={COUNTRIES}
              value={groupedCountry}
              onValueChange={setGroupedCountry}
              clearable
            />
            <div>
              <span className="mono-note">Selected: {groupedCountry || 'none'}</span>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section
        title="Custom Option Rendering"
        description="Use renderOption to build rich option rows with avatars, role badges, status indicators, and secondary descriptions."
      >
        <Showcase code={CUSTOM_DEMO} width="md">
          <div className="stack">
            <Combobox
              label="Assign Task"
              placeholder="Search teammates…"
              options={TEAM_MEMBERS}
              value={assignee}
              onValueChange={setAssignee}
              clearable
              renderOption={(opt) => {
                const member = TEAM_MEMBERS.find((m) => m.value === opt.value);
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%', padding: '0.25rem 0' }}>
                    <div
                      style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '9999px',
                        background: 'var(--pui-primary-subtle)',
                        color: 'var(--pui-primary-fg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      {opt.label.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: 550, color: 'var(--pui-fg)' }}>{opt.label}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--pui-fg-subtle)' }}>{opt.description}</span>
                    </div>
                    {member && (
                      <span className="pui-badge pui-badge--neutral pui-badge--sm">
                        {member.role}
                      </span>
                    )}
                  </div>
                );
              }}
            />
            <div>
              <span className="mono-note">Assignee: {assignee || 'none'}</span>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Sizes" description="Combobox comes in sm, md, and lg sizes matching standard input heights.">
        <Showcase width="lg">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', width: '100%' }}>
            <Combobox
              label="Small (sm)"
              size="sm"
              options={COUNTRIES.slice(0, 6)}
              value={sizeSmVal}
              onValueChange={setSizeSmVal}
              clearable
            />
            <Combobox
              label="Medium (md - default)"
              size="md"
              options={COUNTRIES.slice(0, 6)}
              value={sizeMdVal}
              onValueChange={setSizeMdVal}
              clearable
            />
            <Combobox
              label="Large (lg)"
              size="lg"
              options={COUNTRIES.slice(0, 6)}
              value={sizeLgVal}
              onValueChange={setSizeLgVal}
              clearable
            />
          </div>
        </Showcase>
      </Section>

      <Section title="Async Options" description="Built-in loading state with search spinner affix.">
        <Showcase width="md">
          <div className="stack">
            <Combobox
              label="Teammate (Async)"
              placeholder="Select a teammate…"
              options={asyncOptions}
              value={asyncAssignee}
              onValueChange={setAsyncAssignee}
              loading={loading}
              emptyMessage={loading ? 'Fetching teammates…' : 'No teammates found'}
              clearable
            />
            <Button onClick={simulateFetch} variant="secondary" size="sm">
              Simulate fetch
            </Button>
          </div>
        </Showcase>
      </Section>

      <Section title="Keyboard Navigation">
        <Showcase>
          <div className="key-grid">
            {[
              { keys: ['↓'], text: 'Open list / move to next option' },
              { keys: ['↑'], text: 'Move to previous option' },
              { keys: ['Enter'], text: 'Select highlighted option' },
              { keys: ['Backspace'], text: 'In multi-select mode with empty input, removes the last tag' },
              { keys: ['Esc'], text: 'Close list and revert input' },
              { keys: ['Home', 'End'], text: 'Jump to first / last selectable option' },
              { keys: ['Tab'], text: 'Close popup and advance focus' },
            ].map((row) => (
              <div key={row.text} className="key-row">
                <span className="key-row__keys">
                  {row.keys.map((key) => (
                    <kbd key={key} className="pui-kbd">{key}</kbd>
                  ))}
                </span>
                <span>{row.text}</span>
              </div>
            ))}
          </div>
        </Showcase>
      </Section>

      <Separator style={{ marginBlock: '2rem' }} />

      <Section title="API Reference">
        <PropsTable
          rows={[
            { name: 'options',        type: 'ComboboxOption[]',            required: true, description: 'List of option objects: { value, label, group?, description?, keywords?, disabled?, icon? }.' },
            { name: 'value',          type: 'string',                      description: 'Controlled single-selection value.' },
            { name: 'defaultValue',   type: 'string',                      description: 'Default uncontrolled single-selection value.' },
            { name: 'onValueChange',  type: '(value: string) => void',     description: 'Callback fired when a single option is selected.' },
            { name: 'multiple',       type: 'boolean',                     default: 'false', description: 'Enable multi-select mode with removable tags.' },
            { name: 'values',         type: 'string[]',                    description: 'Controlled multi-select array of selected values.' },
            { name: 'defaultValues',  type: 'string[]',                    default: '[]', description: 'Default uncontrolled multi-select values.' },
            { name: 'onValuesChange', type: '(values: string[]) => void',  description: 'Callback fired when multi-select array changes.' },
            { name: 'size',           type: "'sm' | 'md' | 'lg'",          default: "'md'", description: 'Height and padding size variant.' },
            { name: 'renderOption',   type: '(option, state) => ReactNode', description: 'Custom renderer function for option items.' },
            { name: 'searchable',     type: 'boolean',                     default: 'true', description: 'Allow typing into the input to filter options.' },
            { name: 'clearable',      type: 'boolean',                     default: 'false', description: 'Show clear button when a selection exists.' },
            { name: 'loading',        type: 'boolean',                     default: 'false', description: 'Display loading spinner in leading position.' },
            { name: 'emptyMessage',   type: 'string',                      default: "'No results found'", description: 'Message displayed when no options match query.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

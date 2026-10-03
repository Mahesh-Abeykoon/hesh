import { useState } from 'react';
import { Badge, Button, Combobox, Separator } from '../../src/index';
import { Callout, PropsTable, Showcase } from '../components/Showcase';
import { DocPage, Section } from '../components/DocPage';

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan', keywords: ['nippon', 'tokyo'] },
  { value: 'sg', label: 'Singapore' },
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'in', label: 'India' },
  { value: 'lk', label: 'Sri Lanka' },
  { value: 'za', label: 'South Africa' },
  { value: 'se', label: 'Sweden' },
  { value: 'nl', label: 'Netherlands' },
];

const BASIC = `import { Combobox } from 'hesh';

<Combobox
  label="Country"
  placeholder="Search countries…"
  options={countries}
  value={country}
  onValueChange={setCountry}
  clearable
/>`;

const ASYNC = `const [options, setOptions] = useState([]);
const [loading, setLoading] = useState(false);

// Debounce the request yourself — the component stays uncontrolled
// about how options arrive, so any data source works.
<Combobox
  label="Assign to"
  options={options}
  loading={loading}
  onValueChange={setAssignee}
/>`;

export function ComboboxPage() {
  const [country, setCountry] = useState('lk');
  const [assignee, setAssignee] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([
    { value: 'ada', label: 'Ada Lovelace' },
    { value: 'grace', label: 'Grace Hopper' },
    { value: 'alan', label: 'Alan Turing' },
  ]);

  const simulateFetch = () => {
    setLoading(true);
    setOptions([]);
    window.setTimeout(() => {
      setOptions([
        { value: 'ada', label: 'Ada Lovelace' },
        { value: 'grace', label: 'Grace Hopper' },
        { value: 'alan', label: 'Alan Turing' },
        { value: 'katherine', label: 'Katherine Johnson' },
      ]);
      setLoading(false);
    }, 1400);
  };

  return (
    <DocPage
      eyebrow="Forms"
      title="Combobox"
      lede="A searchable select for long lists. Implements the WAI-ARIA editable combobox pattern: the input keeps focus while the highlighted option is tracked with aria-activedescendant."
    >
      <Section title="Basic">
        <Showcase code={BASIC} defaultOpen width="md">
          <div className="stack">
            <Combobox
              label="Country"
              placeholder="Search countries…"
              options={COUNTRIES}
              value={country}
              onValueChange={setCountry}
              clearable
              hint="Type to filter — try searching for 'tokyo'."
            />
            <div>
              <span className="mono-note">value: {country || 'none'}</span>
            </div>
          </div>
        </Showcase>
      </Section>

      <Section title="Async options" description="Loading state and empty message are built in. Debouncing and caching stay in your code, where they belong.">
        <Showcase code={ASYNC} width="md">
          <div className="stack">
            <Combobox
              label="Assign to"
              placeholder="Select a teammate"
              options={options}
              value={assignee}
              onValueChange={setAssignee}
              loading={loading}
              emptyMessage={loading ? 'Loading teammates…' : 'No teammates found'}
              clearable
            />
            <Button onClick={simulateFetch} variant="secondary" size="sm">
              Simulate fetch
            </Button>
          </div>
        </Showcase>
      </Section>

      <Section title="Non-searchable" description="Set searchable={false} and it behaves like a select — click to open, type the first letters to jump.">
        <Showcase
          code={`<Combobox label="Plan" searchable={false} options={plans} />`}
          width="md"
        >
          <Combobox
            label="Plan"
            searchable={false}
            defaultValue="growth"
            options={[
              { value: 'starter', label: 'Starter' },
              { value: 'growth', label: 'Growth' },
              { value: 'scale', label: 'Scale' },
            ]}
          />
        </Showcase>
      </Section>

      <Section title="Keyboard">
        <Showcase>
          <div className="key-grid">
            {[
              { keys: ['↓'], text: 'Open the list / move to the next option' },
              { keys: ['↑'], text: 'Move to the previous option' },
              { keys: ['Enter'], text: 'Select the highlighted option' },
              { keys: ['Esc'], text: 'Close the list and revert the query' },
              { keys: ['Home', 'End'], text: 'Jump to the first or last option' },
              { keys: ['Tab'], text: 'Close the list and move on' },
            ].map((row) => (
              <div key={row.text} className="key-row">
                <span className="key-row__keys">
                  {row.keys.map((key) => (
                    <kbd key={key} className="pui-kbd">
                      {key}
                    </kbd>
                  ))}
                </span>
                <span>{row.text}</span>
              </div>
            ))}
          </div>
        </Showcase>
        <Callout tone="info" title="Disabled options are skipped">
          Arrow navigation and Home/End skip disabled rows, so the highlighted
          option is always one the user can actually pick.
        </Callout>
      </Section>

      <Separator style={{ marginBlock: '2rem' }} />

      <Section title="When to use what">
        <div className="compare-grid">
          <div className="compare">
            <Badge tone="neutral">Select</Badge>
            <p className="prose">
              Short lists, native behaviour wanted, mobile users benefit from the
              platform picker.
            </p>
          </div>
          <div className="compare">
            <Badge tone="primary">Combobox</Badge>
            <p className="prose">
              More than roughly ten options, or options that need filtering,
              grouping or async loading.
            </p>
          </div>
          <div className="compare">
            <Badge tone="neutral">Radio group</Badge>
            <p className="prose">
              Fewer than six options where seeing every choice at once helps the
              decision.
            </p>
          </div>
        </div>
      </Section>

      <Section title="API">
        <PropsTable
          rows={[
            { name: 'options', type: 'ComboboxOption[]', required: true, description: '{ value, label, keywords?, disabled?, icon? }.' },
            { name: 'value / defaultValue', type: 'string', description: 'Controlled and uncontrolled selection.' },
            { name: 'onValueChange', type: '(value: string) => void', description: 'Fires with the chosen value.' },
            { name: 'searchable', type: 'boolean', default: 'true', description: 'Allow typing to filter the list.' },
            { name: 'clearable', type: 'boolean', default: 'false', description: 'Show an inline clear button.' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Show a spinner in the leading position.' },
            { name: 'emptyMessage', type: 'string', default: "'No results found'", description: 'Shown when filtering matches nothing.' },
            { name: 'keywords', type: 'string[]', description: 'Option-level extra terms matched by the filter.' },
          ]}
        />
      </Section>
    </DocPage>
  );
}

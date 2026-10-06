/**
 * Behavioural tests for the accessibility claims made in the documentation.
 *
 * These assert on ARIA state rather than on class names, so they keep passing
 * through refactors that only change styling.
 */
export const INTERACTIONS = [
  {
    route: 'overlays',
    name: 'dialog traps focus, labels itself, and closes on Escape',
    run: async ({ document, findByText, click, press, wait, assert }) => {
      const trigger = findByText(document, 'button', 'Invite teammate');
      assert(trigger, 'found the "Invite teammate" trigger');
      await click(trigger);
      await wait();

      const dialog = document.querySelector('[role="dialog"]');
      assert(dialog, 'dialog opened');
      assert(dialog?.getAttribute('aria-modal') === 'true', 'dialog is modal');

      const title = dialog?.querySelector('.pui-dialog__title');
      assert(
        dialog?.getAttribute('aria-labelledby') === title?.id,
        'aria-labelledby points at the visible title'
      );

      assert(
        document.activeElement !== document.body,
        'focus moved off <body> when the dialog opened'
      );

      await press(document.activeElement ?? document.body, 'Escape');
      await wait();
      assert(!document.querySelector('[role="dialog"]'), 'Escape closed the dialog');
    },
  },

  {
    route: 'menu',
    name: 'menu reports expanded state and highlights the first row',
    run: async ({ document, findByText, click, press, wait, assert }) => {
      const trigger = findByText(document, 'button', 'Actions');
      assert(trigger, 'found the menu trigger');
      assert(trigger?.getAttribute('aria-haspopup') === 'menu', 'trigger declares aria-haspopup');

      await click(trigger);
      await wait();

      const menu = document.querySelector('[role="menu"]');
      assert(menu, 'menu opened');
      assert(trigger?.getAttribute('aria-expanded') === 'true', 'trigger reports expanded');

      assert(
        menu?.style.visibility !== 'hidden',
        'menu is measured and visible (not stuck in the pre-measure hidden state)'
      );

      const active = menu?.querySelector('[data-active="true"]');
      assert(active, 'a row is highlighted on open');
      assert(
        menu?.getAttribute('aria-activedescendant') === active?.id,
        'aria-activedescendant tracks the highlighted row'
      );

      await press(menu, 'Escape');
      await wait();
      assert(!document.querySelector('[role="menu"]'), 'Escape closed the menu');
    },
  },

  {
    route: 'tabs',
    name: 'tabs use roving tabindex and arrow keys move selection',
    run: async ({ document, wait, press, assert }) => {
      const list = document.querySelector('.pui-tabs [role="tablist"]') ?? document.querySelector('[role="tablist"]');
      assert(list, 'tablist rendered');

      const tabs = [...list.querySelectorAll('[role="tab"]')];
      assert(tabs.length >= 3, 'at least three tabs');

      const selected = tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true');
      assert(selected.length === 1, 'exactly one tab is selected');

      const tabbable = tabs.filter((tab) => tab.getAttribute('tabindex') === '0');
      assert(tabbable.length === 1, 'exactly one tab is in the tab sequence (roving tabindex)');

      const firstId = selected[0].id;
      await press(selected[0], 'ArrowRight');
      await wait();

      const nextSelected = [...list.querySelectorAll('[role="tab"]')].find(
        (tab) => tab.getAttribute('aria-selected') === 'true'
      );
      assert(nextSelected && nextSelected.id !== firstId, 'ArrowRight moved the selection');
      assert(nextSelected?.getAttribute('tabindex') === '0', 'focus follows selection');

      const panel = document.querySelector(`[aria-labelledby="${nextSelected.id}"]`);
      assert(panel && !panel.hasAttribute('hidden'), 'the matching panel is visible');
    },
  },

  {
    route: 'table',
    name: 'sortable headers expose aria-sort and toggle direction',
    run: async ({ document, findByText, click, wait, assert }) => {
      const header = findByText(document, 'button', 'MRR');
      assert(header, 'found the MRR sort button');

      const th = header.closest('th');
      assert(th?.getAttribute('aria-sort') === 'descending', 'starts sorted descending');

      await click(header);
      await wait();
      assert(
        header.closest('th')?.getAttribute('aria-sort') === 'none',
        'clicking a descending column clears the sort'
      );

      await click(header);
      await wait();
      assert(
        header.closest('th')?.getAttribute('aria-sort') === 'ascending',
        'clicking again sorts ascending'
      );

      await click(header);
      await wait();
      assert(
        header.closest('th')?.getAttribute('aria-sort') === 'descending',
        'a third click sorts descending — the documented asc → desc → none cycle'
      );
    },
  },

  {
    route: 'selection',
    name: 'select-all checkbox reports the mixed state',
    run: async ({ document, findByText, click, wait, assert }) => {
      const all = findByText(document, 'input[type="checkbox"]', '', (el) =>
        (el.closest('label')?.textContent ?? '').includes('Select all permissions')
      );
      assert(all, 'found the select-all checkbox');
      assert(all.getAttribute('aria-checked') === 'mixed', 'starts mixed, not just drawn as a dash');

      await click(all);
      await wait();
      assert(all.checked, 'clicking selects every child');
      assert(all.getAttribute('aria-checked') === null, 'aria-checked is only set for the mixed state');
    },
  },

  {
    route: 'combobox',
    name: 'combobox wires aria-expanded, aria-controls and activedescendant',
    run: async ({ document, click, press, wait, assert }) => {
      const input = document.querySelector('[role="combobox"]');
      assert(input, 'combobox input rendered');
      assert(input.getAttribute('aria-expanded') === 'false', 'starts collapsed');

      await click(input);
      await wait();

      assert(input.getAttribute('aria-expanded') === 'true', 'opens on click');

      const listboxId = input.getAttribute('aria-controls');
      assert(listboxId && document.getElementById(listboxId), 'aria-controls resolves to the listbox');

      await press(input, 'ArrowDown');
      await wait();

      const listbox = document.getElementById(listboxId);
      assert(
        listbox?.style.visibility !== 'hidden',
        'listbox is measured and visible'
      );

      const activeId = input.getAttribute('aria-activedescendant');
      assert(activeId && document.getElementById(activeId), 'aria-activedescendant resolves to an option');

      await press(input, 'Escape');
      await wait();
      assert(input.getAttribute('aria-expanded') === 'false', 'Escape closes the listbox');
    },
  },

  {
    route: 'inputs',
    name: 'error state sets aria-invalid and links the message',
    run: async ({ document, assert }) => {
      const invalid = document.querySelector('[aria-invalid="true"]');
      assert(invalid, 'the invalid input sets aria-invalid');

      const describedBy = invalid.getAttribute('aria-describedby');
      assert(describedBy, 'aria-describedby is present');

      const message = document.getElementById(describedBy.split(' ')[0]);
      assert(message?.getAttribute('role') === 'alert', 'the message is a live alert');

      const label = document.querySelector(`label[for="${invalid.id}"]`);
      assert(label, 'the input has an associated <label>');
    },
  },

  {
    route: 'advanced',
    name: 'accordion reports expanded state and toggles',
    run: async ({ document, findByText, click, wait, assert }) => {
      const trigger = findByText(document, 'button', 'Billing');
      assert(trigger, 'found the Billing trigger');
      assert(trigger?.getAttribute('aria-expanded') === 'true', 'starts expanded');

      const panelId = trigger?.getAttribute('aria-controls');
      assert(panelId && document.getElementById(panelId), 'aria-controls resolves to the panel');
      assert(
        document.getElementById(panelId)?.getAttribute('role') === 'region',
        'the panel is a labelled region'
      );

      await click(trigger);
      await wait();
      assert(trigger?.getAttribute('aria-expanded') === 'false', 'collapses on click');
      assert(!document.getElementById(panelId), 'the panel unmounts when collapsed');

      await click(trigger);
      await wait();
      assert(trigger?.getAttribute('aria-expanded') === 'true', 'expands again');
    },
  },

  {
    route: 'advanced',
    name: 'slider is a native range input with correct value semantics',
    run: async ({ document, assert }) => {
      const input = document.querySelector('input[type="range"]');
      assert(input, 'slider renders a native range input');
      assert(input?.getAttribute('aria-label') === 'Volume', 'the slider has an accessible name');
      assert(input?.value === '64', 'reflects the controlled value');
      assert(input?.min === '0' && input?.max === '100', 'exposes min and max');

      const disabled = [...document.querySelectorAll('input[type="range"]')].find(
        (el) => el.disabled
      );
      assert(disabled, 'the disabled slider is actually disabled');
    },
  },

  {
    route: 'advanced',
    name: 'command palette opens on the shortcut and tracks the active row',
    run: async ({ document, press, wait, assert }) => {
      await press(document.body, 'k', { metaKey: true });
      await wait(80);

      const palette = document.querySelector('.pui-command');
      assert(palette, 'palette opened on ⌘K');
      assert(
        palette?.closest('[role="dialog"]')?.getAttribute('aria-modal') === 'true',
        'the palette is a modal dialog'
      );

      const input = palette?.querySelector('[role="combobox"]');
      assert(input?.getAttribute('aria-expanded') === 'true', 'search input reports expanded');

      const activeId = input?.getAttribute('aria-activedescendant');
      assert(activeId && document.getElementById(activeId), 'aria-activedescendant resolves');

      await press(palette.querySelector('[role="combobox"]'), 'ArrowDown');
      await wait();
      const nextId = palette.querySelector('[role="combobox"]').getAttribute('aria-activedescendant');
      assert(nextId && nextId !== activeId, 'ArrowDown moves the active row');

      await press(palette.querySelector('[role="combobox"]'), 'Escape');
      await wait(80);
      assert(!document.querySelector('.pui-command'), 'Escape closes the palette');
    },
  },

  {
    route: 'advanced',
    name: 'calendar exposes a grid with selected and today states',
    run: async ({ document, assert }) => {
      const grid = document.querySelector('[role="grid"]');
      assert(grid, 'calendar renders a grid');

      const cells = [...grid.querySelectorAll('[role="gridcell"]')];
      assert(cells.length >= 28, 'a month of days is rendered');
      assert(
        cells.some((cell) => cell.getAttribute('aria-selected') === 'true'),
        'the selected date is marked with aria-selected'
      );
      assert(
        cells.some((cell) => cell.getAttribute('aria-current') === 'date'),
        "today is marked with aria-current='date'"
      );
      // Roving tabindex: exactly one cell is in the tab sequence.
      assert(
        cells.filter((cell) => cell.getAttribute('tabindex') === '0').length === 1,
        'exactly one day is tabbable (roving tabindex)'
      );
    },
  },

  {
    route: 'advanced',
    name: 'charts expose a text alternative',
    run: async ({ document, assert }) => {
      const charts = [...document.querySelectorAll('[role="img"]')];
      assert(charts.length >= 3, 'charts rendered');
      const labelled = charts.filter((c) => (c.getAttribute('aria-label') ?? '').length > 10);
      assert(labelled.length === charts.length, 'every chart has a descriptive aria-label');
    },
  },

  {
    route: 'surfaces',
    name: 'progress bars expose or omit aria-valuenow correctly',
    run: async ({ document, assert }) => {
      const bars = [...document.querySelectorAll('[role="progressbar"]')];
      assert(bars.length > 0, 'progress bars rendered');

      const determinate = bars.find((bar) => bar.hasAttribute('aria-valuenow'));
      const indeterminate = bars.find((bar) => !bar.hasAttribute('aria-valuenow'));
      assert(determinate, 'a determinate bar reports aria-valuenow');
      assert(indeterminate, 'an indeterminate bar omits aria-valuenow');
    },
  },
];

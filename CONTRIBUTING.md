# Contributing

Thanks for helping out. This project optimises for **finished components over a
large catalogue**, so the bar for adding something new is deliberately high and
the bar for improving something existing is deliberately low.

## Getting set up

```bash
npm install
npm run dev        # docs site on localhost:5173
npm test           # render + accessibility suite
npm run typecheck
```

You need Node 18+ and npm 10+.

## Before you open a pull request

Run all three. CI runs the same commands.

```bash
npm run typecheck
npm test
npm run build
```

If you touched a component, add or extend a behavioural assertion in
`scripts/interactions.mjs`. If it is a purely visual change, note it in the PR
description and include screenshots in both themes.

## Adding a component

1. **Open an issue first.** Describe the problem, not the component. Often an
   existing component covers it with a prop, and that is the better outcome.
2. **One file per family.** `Checkbox`, `Radio` and `Switch` live together in
   `Choice.tsx` because they share the control wrapper. Unrelated components do
   not share a file.
3. **Follow the class contract.** `.pui-<block>`, `__element`, `--modifier`.
   Class names are public API — renaming one is a breaking change.
4. **Read only from the semantic token layer.** If you need a colour, there
   should already be a token for it. If there is not, add one to Layer 2 and
   map it for both themes.
5. **Document it.** Add a page to `docs/pages/`, register it in
   `docs/App.tsx`, and cover: what it is for, variants, customisation, keyboard
   behaviour, and limitations.
6. **Add a behavioural test.** Assert on ARIA state, not class names — see below.

## Component checklist

Before calling a component ready:

- [ ] Public API is understandable without reading the source
- [ ] Works controlled and uncontrolled
- [ ] Every interactive state is styled: rest, hover, active, focus-visible, disabled, loading
- [ ] Keyboard behaviour matches the relevant WAI-ARIA pattern
- [ ] Focus is visible and never lost or trapped incorrectly
- [ ] Looks correct at 360 px, 768 px and 1440 px
- [ ] Correct in both themes, and at all three densities
- [ ] Customisable through tokens, not by forking the component
- [ ] No new runtime dependency
- [ ] Documentation matches the implementation

## Testing philosophy

The suite mounts real pages and drives real events. Two rules:

**Assert on ARIA, not on styling.** Class names and inline styles change during
refactors; accessible names and states should not.

```js
// Good
assert(dialog?.getAttribute('aria-modal') === 'true', 'dialog is modal');

// Fragile
assert(dialog?.className.includes('pui-dialog--md'));
```

**Test the behaviour the documentation promises.** If the docs say "Escape
closes the dialog", there must be an assertion for it. Undocumented behaviour
that is not tested is a bug waiting to happen.

### jsdom limitations

jsdom performs no layout. `getBoundingClientRect()` returns zeros and
`offsetWidth` is `0` unless shimmed — `scripts/smoke.mjs` shims the measurement
APIs so focus-trap logic is exercised rather than skipped. If a test needs real
geometry, it does not belong in jsdom; verify it manually and say so in the PR.

## Design language

- **Brand ramp.** 11 steps, monotonically increasing in lightness, with 500 as
  the primary action colour and 700 readable as text on 50.
- **Elevation.** Shadows on light surfaces, borders on dark ones. A shadow is
  invisible on near-black.
- **Radii.** `--pui-radius-md` for controls, `lg`/`xl` for containers.
- **Motion.** 120–280 ms, `cubic-bezier(0.16, 1, 0.3, 1)`. Everything respects
  `prefers-reduced-motion` via the base layer.
- **Density.** Express sizes as multipliers on `--pui-density`, never as fixed
  pixel heights.

## Commit messages

Conventional commits, past tense, under 72 characters:

```
feat: add DatePicker with keyboard navigation
fix: restore focus to trigger when Drawer closes
docs: document Combobox async loading
perf: memoise DataTable sort comparator
```

## Reporting a bug

Include a minimal reproduction, the browser and version, and whether it happens
in both themes. Accessibility bugs are treated as functional bugs — report them
even if the visual result looks fine.

## License

By contributing you agree that your contributions are licensed under the MIT
License.

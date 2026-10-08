# Changelog

All notable changes are documented here. The project follows semantic versioning.

## 0.1.1

### Fixed

- **Package name references** — updated all import statements and documentation from `hesh` to `hesh-ui`.
- **Component code blocks** — fixed missing code preview and copy sections on Calendar, DatePicker, OtpInput, Slider, TagInput, and Textarea component documentation pages.
- **Stylesheet exports** — added `./hesh.css`, `./dist/hesh.css`, and `./dist/styles.css` subpath aliases to `package.json` exports.
- **Stylesheet visibility** — added persistent global stylesheet reminder and 1-click copy badge on every component doc page.
- **Development warning** — added dev-mode warning in `ThemeProvider` if global design tokens (`--pui-brand-500`) are not loaded.
- **Tailwind CSS guide** — added explicit integration instructions and code snippets for Next.js App Router and Tailwind CSS setups in Getting Started documentation.
- **Vercel deployment** — added `vercel.json` configuring `npm run build:docs` and `dist-docs` output directory to ensure documentation deploys seamlessly on Vercel.

## 0.1.0

### Added

- **Component library** — 33 components across forms, display, overlays,
  navigation, data and system concerns.
- **Theming** — three-layer token system (primitives → semantic → component) with
  light and dark themes, density presets, and subtree scoping via
  `data-pui-theme` and `data-pui-density`.
- **Documentation site** — live examples rendered from real components, copyable
  source, props tables, accessibility notes, an interactive theme studio and a
  complete dashboard screen.
- **Test suite** — every documentation route is mounted in jsdom, plus behavioural
  assertions for the ARIA patterns the docs claim to implement.

### Design decisions

- Zero runtime dependencies beyond React. Positioning, focus management,
  dismiss handling and controlled/uncontrolled state are implemented in-repo.
- Semantic class names (`.pui-btn`, `.pui-card`) rather than utility classes or
  CSS-in-JS, so the stylesheet needs no build plugin and stays inspectable.
- The stylesheet is not imported by the JS entry, letting consumers control load
  order and keeping `sideEffects` accurate.

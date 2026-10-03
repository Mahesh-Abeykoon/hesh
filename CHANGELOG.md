# Changelog

All notable changes are documented here. The project follows semantic versioning.

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

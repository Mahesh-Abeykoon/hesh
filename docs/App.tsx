import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { ThemeProvider, useTheme } from '../src/index';
import { PresetSwitch, ThemeSwitch } from '../src/index';
import {
  Badge,
  Button,
  Command,
  IconButton,
  ToastProvider,
  Tooltip,
  useCommandShortcut,
  type CommandItem,
} from '../src/index';
import { MenuIcon, SparklesIcon, XIcon } from '../src/index';

import { HomePage } from './pages/Home';
import { AdvancedPage } from './pages/Advanced';
import { PremiumPage } from './pages/Premium';
import { GettingStartedPage } from './pages/GettingStarted';
import { ThemingPage } from './pages/Theming';
import { ThemeStudioPage } from './pages/ThemeStudio';
import { ButtonPage } from './pages/ButtonPage';
import { InputsPage } from './pages/Inputs';
import { SelectionPage } from './pages/Selection';
import { SurfacesPage } from './pages/Surfaces';
import { TabsPage } from './pages/TabsPage';
import { OverlaysPage } from './pages/Overlays';
import { MenuPage } from './pages/MenuPage';
import { ComboboxPage } from './pages/ComboboxPage';
import { TablePage } from './pages/TablePage';
import { FeedbackPage } from './pages/FeedbackPage';
import { NavigationPage } from './pages/NavigationPage';
import { DashboardPage } from './pages/Dashboard';
import { DocNavigationContext } from './components/DocPage';

interface DocPage {
  id: string;
  title: string;
  Component: ComponentType;
}

interface DocGroup {
  label: string;
  pages: DocPage[];
}

export const DOC_GROUPS: DocGroup[] = [
  {
    label: 'Start here',
    pages: [{ id: 'home', title: 'Overview', Component: HomePage }],
  },
  {
    label: 'Foundations',
    pages: [
      { id: 'getting-started', title: 'Getting started', Component: GettingStartedPage },
      { id: 'theming', title: 'Theming & tokens', Component: ThemingPage },
      { id: 'theme-studio', title: 'Theme studio', Component: ThemeStudioPage },
    ],
  },
  {
    label: 'Forms',
    pages: [
      { id: 'button', title: 'Button', Component: ButtonPage },
      { id: 'inputs', title: 'Input · Textarea · Select', Component: InputsPage },
      { id: 'combobox', title: 'Combobox', Component: ComboboxPage },
      { id: 'selection', title: 'Checkbox · Radio · Switch', Component: SelectionPage },
    ],
  },
  {
    label: 'Layout & display',
    pages: [
      { id: 'surfaces', title: 'Card · Badge · Avatar', Component: SurfacesPage },
      { id: 'tabs', title: 'Tabs', Component: TabsPage },
      { id: 'table', title: 'Data table', Component: TablePage },
      { id: 'navigation', title: 'Page header · Nav', Component: NavigationPage },
    ],
  },
  {
    label: 'Overlays',
    pages: [
      { id: 'overlays', title: 'Dialog · Drawer · Tooltip', Component: OverlaysPage },
      { id: 'menu', title: 'Dropdown menu', Component: MenuPage },
      { id: 'feedback', title: 'Alert · Toast · Progress', Component: FeedbackPage },
    ],
  },
  {
    label: 'Advanced',
    pages: [
      { id: 'advanced', title: 'Command · Charts · Dates', Component: AdvancedPage },
      { id: 'premium', title: 'Dropzone · Kanban · Timeline', Component: PremiumPage },
    ],
  },
  {
    label: 'Examples',
    pages: [{ id: 'dashboard', title: 'Dashboard screen', Component: DashboardPage }],
  },
];

const ALL_PAGES = DOC_GROUPS.flatMap((group) => group.pages);

function currentRoute(): string {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return ALL_PAGES.some((page) => page.id === hash) ? hash : 'home';
}

/** Hash routing keeps the docs a static site with no router dependency. */
function useRoute() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    const onChange = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (id: string) => {
    window.location.hash = `/${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { route, navigate };
}

/* ------------------------------------------------------------------ Density */

type Density = 'compact' | 'default' | 'comfortable';

/** Density is a single token; changing it reflows every control at once. */
function useDensity() {
  const [density, setDensity] = useState<Density>(() => {
    try {
      return (localStorage.getItem('pui-docs-density') as Density) || 'default';
    } catch {
      return 'default';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (density === 'default') root.removeAttribute('data-pui-density');
    else root.setAttribute('data-pui-density', density);
    try {
      localStorage.setItem('pui-docs-density', density);
    } catch {
      /* ignore */
    }
  }, [density]);

  return { density, setDensity };
}

/* ------------------------------------------------------------------ Shell */

export default function App() {
  return (
    <ThemeProvider defaultMode="light">
      <ToastProvider placement="bottom-right">
        <Shell />
      </ToastProvider>
    </ThemeProvider>
  );
}

function Shell() {
  const { route, navigate } = useRoute();
  const { density, setDensity } = useDensity();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { theme } = useTheme();

  const commandItems: CommandItem[] = useMemo(
    () =>
      DOC_GROUPS.flatMap((group) =>
        group.pages.map((page) => ({
          id: page.id,
          label: page.title,
          group: group.label,
          hint: `#/${page.id}`,
          onSelect: () => navigate(page.id),
        }))
      ),
    [navigate]
  );

  useCommandShortcut(() => setCommandOpen((prev) => !prev));

  const activeIndex = useMemo(() => ALL_PAGES.findIndex((page) => page.id === route), [route]);
  const active = activeIndex >= 0 ? ALL_PAGES[activeIndex] : undefined;
  const prevPage = activeIndex > 0 ? ALL_PAGES[activeIndex - 1] : undefined;
  const nextPage = activeIndex >= 0 && activeIndex < ALL_PAGES.length - 1 ? ALL_PAGES[activeIndex + 1] : undefined;

  useEffect(() => {
    document.title = active
      ? `${active.title} — Hesh`
      : 'Hesh — React component library';
  }, [active]);

  // Close the mobile drawer on navigation.
  useEffect(() => setMobileNavOpen(false), [route]);

  return (
    <div className="app" data-theme={theme}>
      <header className="topbar">
        <button
          type="button"
          className="topbar__burger"
          onClick={() => setMobileNavOpen((prev) => !prev)}
          aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileNavOpen}
        >
          {mobileNavOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
        </button>

        <a className="topbar__brand" href="#/home">
          <span className="topbar__logo" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4v16M18 4v16M6 12h12" />
            </svg>
          </span>
          <span className="topbar__name">Hesh</span>
          <Badge tone="primary" pill className="topbar__version">
            v0.1.0
          </Badge>
        </a>

        <div className="topbar__spacer" />

        <div className="topbar__actions">
          <PresetSwitch variant="select" />

          <div className="density-switch" role="group" aria-label="Interface density">
            {(['compact', 'default', 'comfortable'] as Density[]).map((value) => (
              <button
                key={value}
                type="button"
                className="density-switch__opt"
                aria-pressed={density === value}
                onClick={() => setDensity(value)}
                title={`${value} density`}
              >
                {value[0]!.toUpperCase()}
              </button>
            ))}
          </div>

          <Tooltip content="Toggle colour theme">
            <span style={{ display: 'inline-flex' }}>
              <ThemeSwitch showSystem={false} />
            </span>
          </Tooltip>

          <Tooltip content="View source on GitHub">
            <IconButton
              variant="secondary"
              size="sm"
              aria-label="View source on GitHub"
              onClick={() => window.open('https://github.com/premium-ui/react', '_blank', 'noopener')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.84-2.34 4.68-4.57 4.93.36.31.69.92.69 1.85V21c0 .27.16.59.67.5A10 10 0 0 0 22 12 10 10 0 0 0 12 2Z" />
              </svg>
            </IconButton>
          </Tooltip>
        </div>
      </header>

      <div className="layout">
        <aside className={`sidebar${mobileNavOpen ? ' sidebar--open' : ''}`}>
          <nav className="sidebar__scroll" aria-label="Documentation">
            {DOC_GROUPS.map((group) => (
              <div key={group.label} className="sidebar__group">
                <div className="sidebar__label">{group.label}</div>
                {group.pages.map((page) => (
                  <a
                    key={page.id}
                    href={`#/${page.id}`}
                    className={`sidebar__link${route === page.id ? ' sidebar__link--active' : ''}`}
                    aria-current={route === page.id ? 'page' : undefined}
                  >
                    {page.title}
                    {page.id === 'theme-studio' && <SparklesIcon size={13} />}
                  </a>
                ))}
              </div>
            ))}

            <div className="sidebar__foot">
              <div className="sidebar__foot-title">Zero dependencies</div>
              <p className="sidebar__foot-text">
                React is the only peer dependency. No CSS-in-JS runtime, no icon
                package, no positioning library.
              </p>
            </div>
          </nav>
        </aside>

        {mobileNavOpen && (
          <div className="sidebar__scrim" onClick={() => setMobileNavOpen(false)} aria-hidden="true" />
        )}

        <main className={`content${route === 'home' ? ' content--home' : ''}`} id="main">
          <div className="content__inner">
            {active ? (
              <DocNavigationContext.Provider
                value={{
                  currentPageId: route,
                  prevPage: prevPage ? { id: prevPage.id, title: prevPage.title } : undefined,
                  nextPage: nextPage ? { id: nextPage.id, title: nextPage.title } : undefined,
                  navigate,
                }}
              >
                <active.Component />
              </DocNavigationContext.Provider>
            ) : (
              <div className="content__empty">
                <h1>Page not found</h1>
                <Button onClick={() => navigate('home')}>Back to docs</Button>
              </div>
            )}
          </div>
        </main>
      </div>

      <Command
        items={commandItems}
        open={commandOpen}
        onOpenChange={setCommandOpen}
        placeholder="Jump to a page…"
      />
    </div>
  );
}

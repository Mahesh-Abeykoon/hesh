import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { ThemeProvider, useTheme, ThemeSwitch } from '../src/index';
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
import { MenuIcon, PaletteIcon, XIcon } from '../src/index';

import { HomePage } from './pages/Home';
import { GettingStartedPage } from './pages/GettingStarted';
import { ThemingPage } from './pages/Theming';
import { ThemeStudioPage } from './pages/ThemeStudio';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { DashboardPage } from './pages/Dashboard';
import { ButtonPage } from './pages/ButtonPage';
import { ComboboxPage } from './pages/ComboboxPage';
import { TabsPage } from './pages/TabsPage';
import { TablePage as DataTablePage } from './pages/TablePage';
import { MenuPage as DropdownMenuPage } from './pages/MenuPage';
import { OverlaysPage } from './pages/Overlays';
import { AdvancedPage } from './pages/Advanced';
import { SurfacesPage } from './pages/Surfaces';
import { SelectionPage } from './pages/Selection';
import { InputsPage } from './pages/Inputs';
import { FeedbackPage } from './pages/FeedbackPage';

import { AccordionPage } from './pages/components/AccordionPage';
import { AlertPage } from './pages/components/AlertPage';
import { AspectRatioPage } from './pages/components/AspectRatioPage';
import { AvatarPage } from './pages/components/AvatarPage';
import { BadgePage } from './pages/components/BadgePage';
import { BannerPage } from './pages/components/BannerPage';
import { BottomNavPage } from './pages/components/BottomNavPage';
import { BreadcrumbsPage } from './pages/components/BreadcrumbsPage';
import { CalendarPage } from './pages/components/CalendarPage';
import { CardPage } from './pages/components/CardPage';
import { CarouselPage } from './pages/components/CarouselPage';
import { ChartsPage } from './pages/components/ChartsPage';
import { CheckboxPage } from './pages/components/CheckboxPage';
import { CollapsiblePage } from './pages/components/CollapsiblePage';
import { ColorPickerPage } from './pages/components/ColorPickerPage';
import { CommandPage } from './pages/components/CommandPage';
import { ConfettiPage } from './pages/components/ConfettiPage';
import { ContextMenuPage } from './pages/components/ContextMenuPage';
import { CopyButtonPage } from './pages/components/CopyButtonPage';
import { DatePickerPage } from './pages/components/DatePickerPage';
import { DialogPage } from './pages/components/DialogPage';
import { DiffViewerPage } from './pages/components/DiffViewerPage';
import { DockPage } from './pages/components/DockPage';
import { DrawerPage } from './pages/components/DrawerPage';
import { DropzonePage } from './pages/components/DropzonePage';
import { EmptyStatePage } from './pages/components/EmptyStatePage';
import { GaugePage } from './pages/components/GaugePage';
import { HoverCardPage } from './pages/components/HoverCardPage';
import { IconButtonPage } from './pages/components/IconButtonPage';
import { InputPage } from './pages/components/InputPage';
import { KanbanPage } from './pages/components/KanbanPage';
import { KbdPage } from './pages/components/KbdPage';
import { MarqueePage } from './pages/components/MarqueePage';
import { NavigationMenuPage } from './pages/components/NavigationMenuPage';
import { NotificationBadgePage } from './pages/components/NotificationBadgePage';
import { NumberInputPage } from './pages/components/NumberInputPage';
import { OtpInputPage } from './pages/components/OtpInputPage';
import { PageHeaderPage } from './pages/components/PageHeaderPage';
import { PaginationPage } from './pages/components/PaginationPage';
import { PasswordInputPage } from './pages/components/PasswordInputPage';
import { PopoverPage } from './pages/components/PopoverPage';
import { ProgressPage } from './pages/components/ProgressPage';
import { QRCodePage } from './pages/components/QRCodePage';
import { RadioPage } from './pages/components/RadioPage';
import { RatingPage } from './pages/components/RatingPage';
import { ResizablePage } from './pages/components/ResizablePage';
import { ScrollAreaPage } from './pages/components/ScrollAreaPage';
import { SegmentedControlPage } from './pages/components/SegmentedControlPage';
import { SelectPage } from './pages/components/SelectPage';
import { SeparatorPage } from './pages/components/SeparatorPage';
import { SidebarNavPage } from './pages/components/SidebarNavPage';
import { SkeletonPage } from './pages/components/SkeletonPage';
import { SliderPage } from './pages/components/SliderPage';
import { SpeedDialPage } from './pages/components/SpeedDialPage';
import { SpinnerPage } from './pages/components/SpinnerPage';
import { StatPage } from './pages/components/StatPage';
import { StepperPage } from './pages/components/StepperPage';
import { SwitchPage } from './pages/components/SwitchPage';
import { TagInputPage } from './pages/components/TagInputPage';
import { TextareaPage } from './pages/components/TextareaPage';
import { TimelinePage } from './pages/components/TimelinePage';
import { ToastPage } from './pages/components/ToastPage';
import { TogglePage } from './pages/components/TogglePage';
import { ToggleGroupPage } from './pages/components/ToggleGroupPage';
import { TooltipPage } from './pages/components/TooltipPage';
import { TourPage } from './pages/components/TourPage';
import { TreePage } from './pages/components/TreePage';
import { DocNavigationContext } from './components/DocPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeCustomizer, ThemeCustomizerTrigger } from './components/ThemeCustomizer';

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
      { id: 'playground', title: 'Live Playground', Component: PlaygroundPage },
      { id: 'theme-studio', title: 'Theme studio', Component: ThemeStudioPage },
      { id: 'theming', title: 'Theming & tokens', Component: ThemingPage },
    ],
  },
  {
    label: 'Components',
    pages: [
      { id: 'accordion', title: 'Accordion', Component: AccordionPage },
      { id: 'alert', title: 'Alert', Component: AlertPage },
      { id: 'aspect-ratio', title: 'Aspect ratio', Component: AspectRatioPage },
      { id: 'avatar', title: 'Avatar', Component: AvatarPage },
      { id: 'badge', title: 'Badge', Component: BadgePage },
      { id: 'banner', title: 'Banner', Component: BannerPage },
      { id: 'bottom-nav', title: 'Bottom nav', Component: BottomNavPage },
      { id: 'breadcrumbs', title: 'Breadcrumbs', Component: BreadcrumbsPage },
      { id: 'button', title: 'Button', Component: ButtonPage },
      { id: 'calendar', title: 'Calendar', Component: CalendarPage },
      { id: 'card', title: 'Card', Component: CardPage },
      { id: 'carousel', title: 'Carousel', Component: CarouselPage },
      { id: 'charts', title: 'Charts', Component: ChartsPage },
      { id: 'checkbox', title: 'Checkbox', Component: CheckboxPage },
      { id: 'collapsible', title: 'Collapsible', Component: CollapsiblePage },
      { id: 'color-picker', title: 'Color picker', Component: ColorPickerPage },
      { id: 'combobox', title: 'Combobox', Component: ComboboxPage },
      { id: 'command', title: 'Command', Component: CommandPage },
      { id: 'confetti', title: 'Confetti', Component: ConfettiPage },
      { id: 'context-menu', title: 'Context menu', Component: ContextMenuPage },
      { id: 'copy-button', title: 'Copy button', Component: CopyButtonPage },
      { id: 'data-table', title: 'Data table', Component: DataTablePage },
      { id: 'date-picker', title: 'Date picker', Component: DatePickerPage },
      { id: 'dialog', title: 'Dialog', Component: DialogPage },
      { id: 'diff-viewer', title: 'Diff viewer', Component: DiffViewerPage },
      { id: 'dock', title: 'Dock', Component: DockPage },
      { id: 'drawer', title: 'Drawer', Component: DrawerPage },
      { id: 'dropdown-menu', title: 'Dropdown menu', Component: DropdownMenuPage },
      { id: 'dropzone', title: 'Dropzone', Component: DropzonePage },
      { id: 'empty-state', title: 'Empty state', Component: EmptyStatePage },
      { id: 'gauge', title: 'Gauge', Component: GaugePage },
      { id: 'hover-card', title: 'Hover card', Component: HoverCardPage },
      { id: 'icon-button', title: 'Icon button', Component: IconButtonPage },
      { id: 'input', title: 'Input', Component: InputPage },
      { id: 'kanban', title: 'Kanban', Component: KanbanPage },
      { id: 'kbd', title: 'Kbd', Component: KbdPage },
      { id: 'marquee', title: 'Marquee', Component: MarqueePage },
      { id: 'navigation-menu', title: 'Navigation menu', Component: NavigationMenuPage },
      { id: 'notification-badge', title: 'Notification badge', Component: NotificationBadgePage },
      { id: 'number-input', title: 'Number input', Component: NumberInputPage },
      { id: 'otp-input', title: 'Otp input', Component: OtpInputPage },
      { id: 'page-header', title: 'Page header', Component: PageHeaderPage },
      { id: 'pagination', title: 'Pagination', Component: PaginationPage },
      { id: 'password-input', title: 'Password input', Component: PasswordInputPage },
      { id: 'popover', title: 'Popover', Component: PopoverPage },
      { id: 'progress', title: 'Progress', Component: ProgressPage },
      { id: 'qr-code', title: 'QR code', Component: QRCodePage },
      { id: 'radio', title: 'Radio', Component: RadioPage },
      { id: 'rating', title: 'Rating', Component: RatingPage },
      { id: 'resizable', title: 'Resizable', Component: ResizablePage },
      { id: 'scroll-area', title: 'Scroll area', Component: ScrollAreaPage },
      { id: 'segmented-control', title: 'Segmented control', Component: SegmentedControlPage },
      { id: 'select', title: 'Select', Component: SelectPage },
      { id: 'separator', title: 'Separator', Component: SeparatorPage },
      { id: 'sidebar-nav', title: 'Sidebar nav', Component: SidebarNavPage },
      { id: 'skeleton', title: 'Skeleton', Component: SkeletonPage },
      { id: 'slider', title: 'Slider', Component: SliderPage },
      { id: 'speed-dial', title: 'Speed dial', Component: SpeedDialPage },
      { id: 'spinner', title: 'Spinner', Component: SpinnerPage },
      { id: 'stat', title: 'Stat', Component: StatPage },
      { id: 'stepper', title: 'Stepper', Component: StepperPage },
      { id: 'switch', title: 'Switch', Component: SwitchPage },
      { id: 'tabs', title: 'Tabs', Component: TabsPage },
      { id: 'tag-input', title: 'Tag input', Component: TagInputPage },
      { id: 'textarea', title: 'Textarea', Component: TextareaPage },
      { id: 'timeline', title: 'Timeline', Component: TimelinePage },
      { id: 'toast', title: 'Toast', Component: ToastPage },
      { id: 'toggle', title: 'Toggle', Component: TogglePage },
      { id: 'toggle-group', title: 'Toggle group', Component: ToggleGroupPage },
      { id: 'tooltip', title: 'Tooltip', Component: TooltipPage },
      { id: 'tour', title: 'Tour', Component: TourPage },
      { id: 'tree', title: 'Tree', Component: TreePage },
    ],
  },
  {
    label: 'Examples',
    pages: [{ id: 'dashboard', title: 'Dashboard screen', Component: DashboardPage }],
  },
];

const ALL_PAGES = DOC_GROUPS.flatMap((group) => group.pages);

export const LEGACY_PAGES: Record<string, { id: string; title: string; Component: ComponentType }> = {
  overlays: { id: 'overlays', title: 'Overlays', Component: OverlaysPage },
  advanced: { id: 'advanced', title: 'Advanced Components', Component: AdvancedPage },
  surfaces: { id: 'surfaces', title: 'Surfaces', Component: SurfacesPage },
  selection: { id: 'selection', title: 'Selection Controls', Component: SelectionPage },
  inputs: { id: 'inputs', title: 'Inputs', Component: InputsPage },
  feedback: { id: 'feedback', title: 'Feedback', Component: FeedbackPage },
};

export const ROUTE_ALIASES: Record<string, string> = {
  premium: 'dropzone',
  navigation: 'page-header',
  table: 'data-table',
  dates: 'date-picker',
  menu: 'dropdown-menu',
};

function resolveRoute(rawHash: string): string {
  const clean = rawHash.replace(/^#\/?/, '').split('?')[0] || 'home';
  const lower = clean.toLowerCase();
  if (ALL_PAGES.some((page) => page.id === clean)) {
    return clean;
  }
  if (LEGACY_PAGES[lower]) {
    return lower;
  }
  const alias = ROUTE_ALIASES[lower];
  if (alias) {
    return alias;
  }
  return 'home';
}

/** Hash routing for dedicated component pages with automatic top scroll. */
function useRoute() {
  const [route, setRoute] = useState(() => {
    const raw = typeof window !== 'undefined' ? window.location.hash : '';
    return resolveRoute(raw);
  });

  useEffect(() => {
    const onChange = () => {
      const raw = window.location.hash;
      const resolved = resolveRoute(raw);
      setRoute(resolved);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = (id: string) => {
    window.location.hash = `/${id}`;
    document.getElementById('main')?.scrollTo({ top: 0 });
    window.scrollTo({ top: 0 });
  };

  return { route, navigate };
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const { theme } = useTheme();

  const commandItems: CommandItem[] = useMemo(
    () =>
      ALL_PAGES.map((page) => {
        const group = DOC_GROUPS.find((g) => g.pages.some((p) => p.id === page.id));
        const groupName = group?.label ?? 'Components';
        return {
          id: `page-${page.id}`,
          label: page.title,
          group: groupName,
          hint: `#/${page.id}`,
          onSelect: () => navigate(page.id),
        };
      }),
    [navigate]
  );

  useCommandShortcut(() => setCommandOpen((prev) => !prev));

  const activeIndex = useMemo(() => ALL_PAGES.findIndex((page) => page.id === route), [route]);
  const active = activeIndex >= 0 ? ALL_PAGES[activeIndex] : LEGACY_PAGES[route];
  const prevPage = activeIndex > 0 ? ALL_PAGES[activeIndex - 1] : undefined;
  const nextPage = activeIndex >= 0 && activeIndex < ALL_PAGES.length - 1 ? ALL_PAGES[activeIndex + 1] : undefined;

  useEffect(() => {
    if (active) {
      document.title = `${active.title} — Hesh`;
    } else {
      document.title = 'Hesh — React component library';
    }
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
            <svg width="28" height="28" viewBox="0 0 512 512" fill="none">
              <defs>
                <linearGradient id="topbarSquircleBg" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#2a2d35"/>
                  <stop offset="100%" stop-color="#14161a"/>
                </linearGradient>
                <linearGradient id="topbarNeon" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#818cf8"/>
                  <stop offset="100%" stop-color="#4f46e5"/>
                </linearGradient>
                <linearGradient id="topbarSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff"/>
                  <stop offset="100%" stop-color="#94a3b8"/>
                </linearGradient>
              </defs>
              <rect x="24" y="24" width="464" height="464" rx="104" fill="url(#topbarSquircleBg)"/>
              <rect x="25" y="25" width="462" height="462" rx="103" stroke="rgba(255,255,255,0.14)" strokeWidth="2"/>
              <g transform="translate(256, 256) scale(0.68) translate(-512, -511)">
                <g opacity="0.95">
                  <path d="M 483 358 L 260 511 L 483 664 L 483 603 L 336 511 L 483 419 Z" fill="url(#topbarNeon)"/>
                  <path d="M 422 358 H 470 V 485 H 553 V 358 H 601 V 664 H 553 V 537 H 470 V 664 H 422 Z" fill="url(#topbarNeon)"/>
                  <path d="M 540 358 L 763 511 L 540 664 L 540 603 L 687 511 L 540 419 Z" fill="url(#topbarNeon)"/>
                </g>
                <path d="M 422 358 H 470 V 485 H 553 V 358 H 601 V 664 H 553 V 537 H 470 V 664 H 422 Z" fill="#181a20" stroke="#818cf8" strokeWidth="3"/>
                <polygon points="260,511 483,358 483,419 336,511" fill="#ffffff"/>
                <polygon points="260,511 336,511 483,603 483,664" fill="url(#topbarSilver)"/>
                <path d="M 483 358 L 260 511 L 483 664 L 483 603 L 336 511 L 483 419 Z" stroke="#ffffff" strokeWidth="2.5"/>
                <polygon points="763,511 687,511 540,419 540,358" fill="#ffffff"/>
                <polygon points="763,511 540,664 540,603 687,511" fill="url(#topbarSilver)"/>
                <path d="M 540 358 L 763 511 L 540 664 L 540 603 L 687 511 L 540 419 Z" stroke="#ffffff" strokeWidth="2.5"/>
                <path d="M 422 358 H 470 V 485 H 553 V 358 H 601 V 664 H 553 V 537 H 470 V 664 H 422 Z" fill="none" stroke="#ffffff" strokeWidth="2.5"/>
              </g>
            </svg>
          </span>
          <span className="topbar__name">Hesh</span>
          <Badge tone="primary" pill className="topbar__version">
            v0.1.0
          </Badge>
        </a>

        <div className="topbar__spacer" />

        <div className="topbar__actions">
          <ThemeCustomizerTrigger onClick={() => setCustomizerOpen(true)} />

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
            {DOC_GROUPS.map((group) => {
              const isComponentsGroup = group.label === 'Components';
              let lastChar = '';

              return (
                <div key={group.label} className="sidebar__group">
                  <div className="sidebar__label">{group.label}</div>
                  {group.pages.map((page, pageIdx) => {
                    const isPageActive = page.id === route;
                    const initialChar = page.title.trim().charAt(0).toUpperCase();
                    const isFirstOfChar = isComponentsGroup && initialChar !== lastChar;
                    if (isFirstOfChar) {
                      lastChar = initialChar;
                    }

                    return (
                      <a
                        key={page.id}
                        href={`#/${page.id}`}
                        className={`sidebar__link${isPageActive ? ' sidebar__link--active' : ''}${
                          isFirstOfChar && pageIdx > 0 ? ' sidebar__link--letter-gap' : ''
                        }`}
                        aria-current={isPageActive ? 'page' : undefined}
                      >
                        <span className="sidebar__link-text">{page.title}</span>
                        {page.id === 'theme-studio' ? (
                          <PaletteIcon size={13} />
                        ) : isFirstOfChar ? (
                          <span className="sidebar__char" aria-hidden="true">
                            {initialChar}
                          </span>
                        ) : null}
                      </a>
                    );
                  })}
                </div>
              );
            })}

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

        <main
          className={`content${route === 'home' ? ' content--home' : ''}${
            route === 'playground' ? ' content--playground' : ''
          }`}
          id="main"
        >
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
                <ErrorBoundary key={route}>
                  <active.Component />
                </ErrorBoundary>
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

      <ThemeCustomizer open={customizerOpen} onClose={() => setCustomizerOpen(false)} />
    </div>
  );
}

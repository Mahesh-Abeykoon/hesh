/**
 * hesh
 *
 * A React component library for building polished product interfaces.
 * Zero runtime dependencies beyond React itself.
 */

/* ---------------------------------------------------------------- primitives */
export { Slot, composeRefs } from './primitives/Slot';
export type { SlotProps } from './primitives/Slot';

export { Button, IconButton, ButtonGroup } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize, IconButtonProps, ButtonGroupProps } from './components/Button';

export { Input, Textarea, Select, FieldShell } from './components/Field';
export type { InputProps, TextareaProps, SelectProps, SelectOption, FieldBaseProps } from './components/Field';

export { Checkbox, Radio, RadioGroup, Switch } from './components/Choice';
export type { CheckboxProps, RadioProps, RadioGroupProps, SwitchProps } from './components/Choice';

export { Combobox } from './components/Combobox';
export type { ComboboxProps, ComboboxOption } from './components/Combobox';

/* ---------------------------------------------------------------- display */
export { Card, CardHeader, CardBody, CardFooter } from './components/Card';
export type { CardProps, CardHeaderProps } from './components/Card';

export { Badge } from './components/Badge';
export type { BadgeProps, BadgeTone } from './components/Badge';

export { Avatar, AvatarGroup, initialsOf } from './components/Avatar';
export type { AvatarProps, AvatarGroupProps, AvatarSize, AvatarStatus } from './components/Avatar';

export { Separator } from './components/Separator';
export type { SeparatorProps } from './components/Separator';

export { Skeleton } from './components/Skeleton';
export type { SkeletonProps } from './components/Skeleton';

/* ---------------------------------------------------------------- overlays */
export { Dialog, Drawer, ConfirmDialog, DialogBody } from './components/Dialog';
export type { DialogProps, DrawerProps, ConfirmDialogProps } from './components/Dialog';

export { DropdownMenu } from './components/Menu';
export type { DropdownMenuProps, MenuEntry, MenuItemSpec, MenuCheckboxSpec, TriggerRenderProps } from './components/Menu';

export { Tooltip } from './components/Tooltip';
export type { TooltipProps } from './components/Tooltip';

export { Popover } from './components/Popover';
export type { PopoverProps } from './components/Popover';

export { Portal } from './components/Portal';

/* ---------------------------------------------------------------- navigation */
export { Tabs, useTabsContext } from './components/Tabs';
export type { TabsProps, TabItem } from './components/Tabs';

export { SidebarNav, PageHeader, Breadcrumbs } from './components/Navigation';
export type { SidebarNavProps, NavItem, NavGroup, PageHeaderProps, BreadcrumbsProps, BreadcrumbItem } from './components/Navigation';

export { DataTable, Pagination } from './components/DataTable';
export type { DataTableProps, Column, SortState, SortDirection, PaginationProps } from './components/DataTable';

/* ---------------------------------------------------------------- feedback */
export { Spinner, LoadingRow, Alert, EmptyState, Progress, Stat, Kbd } from './components/Feedback';
export type { SpinnerProps, AlertProps, AlertTone, EmptyStateProps, ProgressProps, StatProps } from './components/Feedback';

export { ToastProvider, useToast } from './components/Toast';
export type { ToastOptions, ToastTone, ToastProviderProps, ToastPlacement } from './components/Toast';

/* ---------------------------------------------------------------- theming */
export { ThemeProvider, useTheme, themeInitScript, THEME_STORAGE_KEY, PRESET_STORAGE_KEY, THEME_PRESETS } from './hooks/useTheme';
export type { ThemeProviderProps, ThemeMode, ResolvedTheme, ThemePreset } from './hooks/useTheme';
export { ThemeSwitch } from './components/ThemeSwitch';
export type { ThemeSwitchProps } from './components/ThemeSwitch';
export { PresetSwitch } from './components/PresetSwitch';
export type { PresetSwitchProps } from './components/PresetSwitch';

/* ---------------------------------------------------------------- hooks */
export { useControllableState } from './hooks/useControllableState';
export { useFocusTrap } from './hooks/useFocusTrap';
export { useDismiss } from './hooks/useDismiss';
export type { UseDismissOptions } from './hooks/useDismiss';
export { useFloating } from './hooks/useFloating';
export type { Placement, Align, FloatingCoords } from './hooks/useFloating';
export { useScrollLock } from './hooks/useScrollLock';
export { useRovingFocus } from './hooks/useRovingFocus';
export type { UseRovingFocusOptions } from './hooks/useRovingFocus';
export { useClickOutside } from './hooks/useClickOutside';
export type { ClickOutsideTarget } from './hooks/useClickOutside';

/* ---------------------------------------------------------------- advanced */
export { Command, useCommandShortcut } from './components/Command';
export type { CommandProps, CommandItem } from './components/Command';

export { Accordion } from './components/Accordion';
export type { AccordionProps, AccordionItem } from './components/Accordion';

export { Slider } from './components/Slider';
export type { SliderProps } from './components/Slider';

export { Calendar } from './components/Calendar';
export type { CalendarProps } from './components/Calendar';

export { DatePicker } from './components/DatePicker';
export type { DatePickerProps } from './components/DatePicker';

export { AreaChart, BarChart, DonutChart, ChartLegend, Sparkline } from './components/Charts';
export type { AreaChartProps, BarChartProps, DonutChartProps, DonutSlice, SparklineProps, SeriesPoint } from './components/Charts';

export { Dropzone } from './components/Dropzone';
export type { DropzoneProps, DropzoneFile } from './components/Dropzone';

export { Kanban } from './components/Kanban';
export type { KanbanProps, KanbanColumn, KanbanCard } from './components/Kanban';

export { Timeline, TimelineItem } from './components/Timeline';
export type { TimelineProps, TimelineItemProps } from './components/Timeline';

/* ---------------------------------------------------------------- utilities */
export { cn } from './utils/cn';

/* ---------------------------------------------------------------- icons */
export * from './components/icons';

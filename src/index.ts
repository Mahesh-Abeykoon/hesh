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
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonShape, IconButtonProps, ButtonGroupProps } from './components/Button';

export { Input, Textarea, Select, FieldShell } from './components/Field';
export type { InputProps, TextareaProps, SelectProps, SelectOption, FieldBaseProps } from './components/Field';

export { Checkbox, Radio, RadioGroup, Switch, ChoiceCard } from './components/Choice';
export type { CheckboxProps, RadioProps, RadioGroupProps, SwitchProps, ChoiceCardProps } from './components/Choice';

export { Combobox } from './components/Combobox';
export type { ComboboxProps, ComboboxOption } from './components/Combobox';

/* ---------------------------------------------------------------- display */
export { Card, CardHeader, CardBody, CardFooter, CardMedia } from './components/Card';
export type { CardProps, CardHeaderProps, CardMediaProps } from './components/Card';

export { Carousel } from './components/Carousel';
export type { CarouselProps } from './components/Carousel';

export { Badge } from './components/Badge';
export type { BadgeProps, BadgeTone, BadgeVariant, BadgeSize } from './components/Badge';

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
export type { SpinnerProps, AlertProps, AlertTone, AlertVariant, EmptyStateProps, ProgressProps, ProgressSegment, StatProps } from './components/Feedback';

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

export { Slider, RangeSlider } from './components/Slider';
export type { SliderProps, RangeSliderProps, SliderMark } from './components/Slider';

export { Calendar } from './components/Calendar';
export type { CalendarProps } from './components/Calendar';

export { DatePicker } from './components/DatePicker';
export type { DatePickerProps, DatePickerPreset } from './components/DatePicker';

export { AreaChart, BarChart, DonutChart, ChartLegend, Sparkline } from './components/Charts';
export type { AreaChartProps, BarChartProps, DonutChartProps, DonutSlice, SparklineProps, SeriesPoint } from './components/Charts';

export { Dropzone } from './components/Dropzone';
export type { DropzoneProps, DropzoneFile } from './components/Dropzone';

export { Kanban } from './components/Kanban';
export type { KanbanProps, KanbanColumn, KanbanCard } from './components/Kanban';

export { Timeline, TimelineItem } from './components/Timeline';
export type { TimelineProps, TimelineItemProps } from './components/Timeline';

export { AspectRatio } from './components/AspectRatio';
export type { AspectRatioProps } from './components/AspectRatio';

export { Banner } from './components/Banner';
export type { BannerProps, BannerTone } from './components/Banner';

export { ContextMenu } from './components/ContextMenu';
export type { ContextMenuProps } from './components/ContextMenu';

export { HoverCard } from './components/HoverCard';
export type { HoverCardProps } from './components/HoverCard';

export { OtpInput } from './components/OtpInput';
export type { OtpInputProps } from './components/OtpInput';

export { Rating } from './components/Rating';
export type { RatingProps } from './components/Rating';

export { SegmentedControl } from './components/SegmentedControl';
export type { SegmentedControlProps, SegmentedControlOption } from './components/SegmentedControl';

export { TagInput } from './components/TagInput';
export type { TagInputProps } from './components/TagInput';

export { Stepper } from './components/Stepper';
export type { StepperProps, StepItem } from './components/Stepper';

export { Tree } from './components/Tree';
export type { TreeProps, TreeNode } from './components/Tree';

export { Toggle } from './components/Toggle';
export type { ToggleProps } from './components/Toggle';

export { ToggleGroup, ToggleGroupItem } from './components/ToggleGroup';
export type { ToggleGroupProps, ToggleGroupItemProps } from './components/ToggleGroup';

export { ScrollArea } from './components/ScrollArea';
export type { ScrollAreaProps } from './components/ScrollArea';

export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/Resizable';
export type { ResizablePanelGroupProps, ResizablePanelProps, ResizableHandleProps } from './components/Resizable';

export { ColorPicker } from './components/ColorPicker';
export type { ColorPickerProps } from './components/ColorPicker';

export { CopyButton } from './components/CopyButton';
export type { CopyButtonProps } from './components/CopyButton';

export { CodeSnippet } from './components/CodeSnippet';
export type { CodeSnippetProps } from './components/CodeSnippet';

export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './components/Collapsible';
export type { CollapsibleProps, CollapsibleTriggerProps, CollapsibleContentProps } from './components/Collapsible';

export { Dock, DockIcon } from './components/Dock';
export type { DockProps, DockIconProps } from './components/Dock';

export { BottomNav, BottomNavItem } from './components/BottomNav';
export type { BottomNavProps, BottomNavItemProps, BottomNavItemSpec } from './components/BottomNav';

export { SpeedDial } from './components/SpeedDial';
export type { SpeedDialProps, SpeedDialActionSpec } from './components/SpeedDial';

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from './components/NavigationMenu';
export type {
  NavigationMenuProps,
  NavigationMenuListProps,
  NavigationMenuItemProps,
  NavigationMenuTriggerProps,
  NavigationMenuContentProps,
  NavigationMenuLinkProps,
} from './components/NavigationMenu';

export { NumberInput } from './components/NumberInput';
export type { NumberInputProps } from './components/NumberInput';

export { PasswordInput, DEFAULT_PASSWORD_REQUIREMENTS } from './components/PasswordInput';
export type { PasswordInputProps, PasswordRequirement } from './components/PasswordInput';

export { Marquee } from './components/Marquee';
export type { MarqueeProps } from './components/Marquee';

export { Gauge } from './components/Gauge';
export type { GaugeProps } from './components/Gauge';

/* ---------------------------------------------------------------- utilities */
export { cn } from './utils/cn';

/* ---------------------------------------------------------------- icons */
export * from './components/icons';




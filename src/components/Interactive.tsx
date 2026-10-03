/**
 * Backward compatibility barrel for interactive components.
 * Components have been moved to their own dedicated files in accordance with the
 * library's "one component family per file" architecture:
 * - Popover.tsx
 * - Command.tsx
 * - Accordion.tsx
 * - Slider.tsx
 * - Calendar.tsx
 * - DatePicker.tsx
 */

export { Popover } from './Popover';
export type { PopoverProps } from './Popover';

export { Command, useCommandShortcut } from './Command';
export type { CommandProps, CommandItem } from './Command';

export { Accordion } from './Accordion';
export type { AccordionProps, AccordionItem } from './Accordion';

export { Slider } from './Slider';
export type { SliderProps } from './Slider';

export { Calendar } from './Calendar';
export type { CalendarProps } from './Calendar';

export { DatePicker } from './DatePicker';
export type { DatePickerProps } from './DatePicker';

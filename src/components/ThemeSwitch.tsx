import { cn } from '../utils/cn';
import { useTheme, type ThemeMode } from '../hooks/useTheme';
import { MonitorIcon, MoonIcon, SunIcon } from './icons';

export interface ThemeSwitchProps {
  className?: string;
  /** Show a "system" option that follows the OS preference. */
  showSystem?: boolean;
  size?: number;
}

/**
 * Three-way theme control. Each option is a toggle button with
 * `aria-pressed`, so the current state is announced without a live region.
 */
export function ThemeSwitch({ className, showSystem = true, size = 15 }: ThemeSwitchProps) {
  const { mode, setMode } = useTheme();

  const options: { value: ThemeMode; icon: typeof SunIcon; label: string }[] = [
    { value: 'light', icon: SunIcon, label: 'Light theme' },
    { value: 'dark', icon: MoonIcon, label: 'Dark theme' },
    ...(showSystem
      ? [{ value: 'system' as ThemeMode, icon: MonitorIcon, label: 'Follow system theme' }]
      : []),
  ];

  return (
    <div className={cn('pui-theme-switch', className)} role="group" aria-label="Theme">
      {options.map(({ value, icon: IconComponent, label }) => (
        <button
          key={value}
          type="button"
          className="pui-theme-switch__opt"
          aria-pressed={mode === value}
          aria-label={label}
          title={label}
          onClick={() => setMode(value)}
        >
          <IconComponent size={size} />
        </button>
      ))}
    </div>
  );
}

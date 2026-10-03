import { useTheme, THEME_PRESETS, type ThemePreset } from '../hooks/useTheme';
import { cn } from '../utils/cn';

export interface PresetSwitchProps {
  className?: string;
  /** Size variant: compact pill group or dropdown */
  variant?: 'pills' | 'select';
  /** Optional custom presets list */
  presets?: { id: ThemePreset; name: string; accentColor: string }[];
}

/**
 * Interactive Theme Preset switcher allowing users to toggle between
 * predefined color palettes (Indigo, Forest, Sunset, Mono, Midnight).
 */
export function PresetSwitch({
  className,
  variant = 'pills',
  presets = THEME_PRESETS,
}: PresetSwitchProps) {
  const { preset: activePreset, setPreset } = useTheme();

  if (variant === 'select') {
    return (
      <select
        className={cn('pui-select pui-preset-select', className)}
        value={activePreset}
        onChange={(e) => setPreset(e.target.value as ThemePreset)}
        aria-label="Select theme preset"
      >
        {presets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div
      className={cn('pui-preset-switch', className)}
      role="group"
      aria-label="Theme color preset"
    >
      {presets.map((p) => {
        const isActive = activePreset === p.id;
        return (
          <button
            key={p.id}
            type="button"
            className={cn('pui-preset-switch__opt', isActive && 'pui-preset-switch__opt--active')}
            aria-pressed={isActive}
            aria-label={`${p.name} palette`}
            title={`${p.name} palette`}
            onClick={() => setPreset(p.id)}
          >
            <span
              className={cn('pui-preset-switch__dot', `pui-preset-switch__dot--${p.id}`)}
              style={
                p.id === 'mono'
                  ? { background: 'linear-gradient(135deg, #ffffff 50%, #18181b 50%)' }
                  : { backgroundColor: p.accentColor }
              }
              aria-hidden="true"
            />
            <span className="pui-preset-switch__name">{p.name}</span>
          </button>
        );
      })}
    </div>
  );
}

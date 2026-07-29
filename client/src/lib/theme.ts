import { useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'pindrop-theme';
const ACCENT_STORAGE_KEY = 'pindrop-accent';

export type ThemePreference = 'light' | 'dark' | 'system';

function prefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function getStoredTheme(): ThemePreference {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'dark' || stored === 'light' || stored === 'system') return stored;
  return 'system';
}

export function applyTheme(theme: ThemePreference) {
  const isDark = theme === 'system' ? prefersDark() : theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setIsDark(root.classList.contains('dark')));
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

type ColorScale = Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>;

export interface AccentPreset {
  key: string;
  label: string;
  swatch: string;
  scale: ColorScale;
}

// Brand color is driven entirely by the --color-brand-* custom properties consumed
// by Tailwind's bg-brand-*/text-brand-* utilities (see index.css), so overriding
// them at the root recolors every existing use of the brand palette at once instead
// of needing per-component theming.
export const ACCENT_PRESETS: AccentPreset[] = [
  {
    key: 'violet',
    label: 'Violet',
    swatch: '#6449ff',
    scale: {
      '50': '#f1f0ff',
      '100': '#e3e1ff',
      '200': '#c9c5ff',
      '300': '#a59dff',
      '400': '#8172ff',
      '500': '#6449ff',
      '600': '#5330f0',
      '700': '#4523c9',
      '800': '#391da3',
      '900': '#301a83',
    },
  },
  {
    key: 'blue',
    label: 'Blue',
    swatch: '#3b82f6',
    scale: {
      '50': '#eff6ff',
      '100': '#dbeafe',
      '200': '#bfdbfe',
      '300': '#93c5fd',
      '400': '#60a5fa',
      '500': '#3b82f6',
      '600': '#2563eb',
      '700': '#1d4ed8',
      '800': '#1e40af',
      '900': '#1e3a8a',
    },
  },
  {
    key: 'emerald',
    label: 'Emerald',
    swatch: '#10b981',
    scale: {
      '50': '#ecfdf5',
      '100': '#d1fae5',
      '200': '#a7f3d0',
      '300': '#6ee7b7',
      '400': '#34d399',
      '500': '#10b981',
      '600': '#059669',
      '700': '#047857',
      '800': '#065f46',
      '900': '#064e3b',
    },
  },
  {
    key: 'rose',
    label: 'Rose',
    swatch: '#f43f5e',
    scale: {
      '50': '#fff1f2',
      '100': '#ffe4e6',
      '200': '#fecdd3',
      '300': '#fda4af',
      '400': '#fb7185',
      '500': '#f43f5e',
      '600': '#e11d48',
      '700': '#be123c',
      '800': '#9f1239',
      '900': '#881337',
    },
  },
  {
    key: 'amber',
    label: 'Amber',
    swatch: '#f59e0b',
    scale: {
      '50': '#fffbeb',
      '100': '#fef3c7',
      '200': '#fde68a',
      '300': '#fcd34d',
      '400': '#fbbf24',
      '500': '#f59e0b',
      '600': '#d97706',
      '700': '#b45309',
      '800': '#92400e',
      '900': '#78350f',
    },
  },
  {
    key: 'teal',
    label: 'Teal',
    swatch: '#14b8a6',
    scale: {
      '50': '#f0fdfa',
      '100': '#ccfbf1',
      '200': '#99f6e4',
      '300': '#5eead4',
      '400': '#2dd4bf',
      '500': '#14b8a6',
      '600': '#0d9488',
      '700': '#0f766e',
      '800': '#115e59',
      '900': '#134e4a',
    },
  },
];

const DEFAULT_PRESET = ACCENT_PRESETS[0] as AccentPreset;

export function getStoredAccent(): string {
  const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
  return ACCENT_PRESETS.some((preset) => preset.key === stored)
    ? (stored as string)
    : DEFAULT_PRESET.key;
}

export function applyAccent(key: string) {
  const preset = ACCENT_PRESETS.find((p) => p.key === key) ?? DEFAULT_PRESET;
  const root = document.documentElement.style;
  for (const [shade, hex] of Object.entries(preset.scale)) {
    root.setProperty(`--color-brand-${shade}`, hex);
  }
  localStorage.setItem(ACCENT_STORAGE_KEY, preset.key);
}

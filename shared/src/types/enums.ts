export const THEME_VALUES = ['LIGHT', 'DARK', 'SYSTEM'] as const;
export type Theme = (typeof THEME_VALUES)[number];

export const PERMISSION_STATUS_VALUES = ['GRANTED', 'DENIED'] as const;
export type PermissionStatus = (typeof PERMISSION_STATUS_VALUES)[number];

export const DEVICE_TYPE_VALUES = ['DESKTOP', 'MOBILE', 'TABLET', 'UNKNOWN'] as const;
export type DeviceType = (typeof DEVICE_TYPE_VALUES)[number];

// Icon + color for each key are defined client-side (client/src/lib/avatarPresets.tsx) —
// this list is the single source of truth both client and server validate against.
export const AVATAR_PRESET_VALUES = [
  'cat',
  'dog',
  'bird',
  'fish',
  'rabbit',
  'squirrel',
  'turtle',
  'bug',
  'ghost',
  'rocket',
  'star',
  'heart',
  'zap',
  'sun',
  'moon',
  'cloud',
  'flame',
  'droplet',
  'leaf',
  'snowflake',
] as const;
export type AvatarPreset = (typeof AVATAR_PRESET_VALUES)[number];

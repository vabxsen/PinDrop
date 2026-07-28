export const THEME_VALUES = ['LIGHT', 'DARK', 'SYSTEM'] as const;
export type Theme = (typeof THEME_VALUES)[number];

export const PERMISSION_STATUS_VALUES = ['GRANTED', 'DENIED'] as const;
export type PermissionStatus = (typeof PERMISSION_STATUS_VALUES)[number];

export const DEVICE_TYPE_VALUES = ['DESKTOP', 'MOBILE', 'TABLET', 'UNKNOWN'] as const;
export type DeviceType = (typeof DEVICE_TYPE_VALUES)[number];

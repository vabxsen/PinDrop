import { useState } from 'react';
import type { AvatarPreset } from '@pindrop/shared';
import { cn } from '@/lib/cn';
import { AVATAR_PRESET_COLORS, AVATAR_PRESET_ICONS } from '@/lib/avatarPresets';

const AVATAR_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-pink-500',
];

// Deterministic so the same account always gets the same color, the way Google's
// account avatars pick one consistent color per user instead of a random one.
function colorForSeed(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length] ?? AVATAR_COLORS[0]!;
}

const sizeClasses = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-11 w-11 text-base',
  lg: 'h-14 w-14 text-xl',
};

// Pixel equivalents of the size classes above, for the <img>'s width/height
// attributes (avoids layout shift while the image loads).
const sizePx = {
  sm: 36,
  md: 44,
  lg: 56,
};

const presetIconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
};

interface AvatarProps {
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
  avatarPreset?: AvatarPreset | null;
  size?: keyof typeof sizeClasses;
  className?: string;
}

export function Avatar({ name, email, avatarUrl, avatarPreset, size = 'sm', className }: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  // A user's explicit preset choice wins over an auto-synced Google photo.
  if (avatarPreset) {
    const Icon = AVATAR_PRESET_ICONS[avatarPreset];
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full text-white',
          sizeClasses[size],
          AVATAR_PRESET_COLORS[avatarPreset],
          className,
        )}
        aria-hidden="true"
      >
        <Icon className={presetIconSizeClasses[size]} />
      </div>
    );
  }

  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt={name ? `${name}'s avatar` : 'User avatar'}
        width={sizePx[size]}
        height={sizePx[size]}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className={cn('shrink-0 rounded-full object-cover', sizeClasses[size], className)}
      />
    );
  }

  const initial = (name?.trim()?.[0] ?? email[0] ?? '?').toUpperCase();

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold text-white',
        sizeClasses[size],
        colorForSeed(email),
        className,
      )}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}

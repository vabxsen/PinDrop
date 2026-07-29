import { useState } from 'react';
import { cn } from '@/lib/cn';

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

interface AvatarProps {
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
  size?: keyof typeof sizeClasses;
  className?: string;
}

export function Avatar({ name, email, avatarUrl, size = 'sm', className }: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const initial = (name?.trim()?.[0] ?? email[0] ?? '?').toUpperCase();

  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className={cn('shrink-0 rounded-full object-cover', sizeClasses[size], className)}
      />
    );
  }

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

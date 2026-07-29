import { useState } from 'react';
import toast from 'react-hot-toast';
import { AVATAR_PRESET_VALUES, type AvatarPreset } from '@pindrop/shared';
import { Dialog } from '@/components/ui/Dialog';
import { cn } from '@/lib/cn';
import { settingsApi, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { AVATAR_PRESET_COLORS, AVATAR_PRESET_ICONS } from '@/lib/avatarPresets';

interface AvatarPickerDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AvatarPickerDialog({ open, onClose }: AvatarPickerDialogProps) {
  const { user, setUser } = useAuth();
  const [savingKey, setSavingKey] = useState<AvatarPreset | null>(null);
  const [clearing, setClearing] = useState(false);
  const busy = savingKey !== null || clearing;

  async function choose(preset: AvatarPreset) {
    setSavingKey(preset);
    try {
      const result = await settingsApi.setAvatarPreset(preset);
      setUser(result.user);
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to update avatar');
    } finally {
      setSavingKey(null);
    }
  }

  async function clearPreset() {
    setClearing(true);
    try {
      const result = await settingsApi.clearAvatarPreset();
      setUser(result.user);
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to reset avatar');
    } finally {
      setClearing(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Choose an avatar"
      description="Pick a look for your profile."
    >
      <div className="grid grid-cols-5 gap-3">
        {AVATAR_PRESET_VALUES.map((preset) => {
          const Icon = AVATAR_PRESET_ICONS[preset];
          const active = user?.avatarPreset === preset;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => choose(preset)}
              disabled={busy}
              aria-label={preset}
              aria-pressed={active}
              className={cn(
                'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white ring-2 ring-offset-2 ring-offset-white transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-60 dark:ring-offset-slate-900',
                AVATAR_PRESET_COLORS[preset],
                active
                  ? 'ring-slate-900 dark:ring-white'
                  : 'ring-transparent hover:ring-slate-300 dark:hover:ring-slate-600',
              )}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>

      {user?.avatarPreset && (
        <button
          type="button"
          onClick={clearPreset}
          disabled={busy}
          className="mt-5 cursor-pointer text-sm font-medium text-slate-500 underline-offset-2 transition-colors duration-150 hover:text-slate-700 hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-400 dark:hover:text-slate-200"
        >
          Use initials instead
        </button>
      )}
    </Dialog>
  );
}

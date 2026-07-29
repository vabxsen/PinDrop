import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
  type Theme,
} from '@pindrop/shared';
import { z } from 'zod';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { settingsApi, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/cn';
import { CreditsSection } from '@/components/credits/CreditsSection';
import {
  ACCENT_PRESETS,
  applyAccent,
  applyTheme,
  getStoredAccent,
  getStoredTheme,
  type ThemePreference,
} from '@/lib/theme';

function ProfileSection() {
  const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  async function onSubmit(data: UpdateProfileInput) {
    try {
      const result = await settingsApi.updateProfile(data);
      setUser(result.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your name and email address.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4 sm:max-w-sm"
        >
          <Input label="Name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Button type="submit" loading={isSubmitting} className="self-start">
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordSection() {
  const { user } = useAuth();
  const hasPassword = user?.hasPassword ?? true;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof changePasswordSchema>, unknown, ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  async function onSubmit(data: ChangePasswordInput) {
    try {
      await settingsApi.changePassword(data);
      toast.success(
        hasPassword
          ? 'Password updated. Please log in again.'
          : 'Password set. Please log in again.',
      );
      reset();
      window.location.assign('/login');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        toast.error('Current password is incorrect');
      } else {
        toast.error(err instanceof Error ? err.message : 'Failed to update password');
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          {hasPassword
            ? 'Changing your password will log you out everywhere.'
            : "You signed up with Google and don't have a password yet. Set one to also log in with email."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-4 sm:max-w-sm"
        >
          {hasPassword && (
            <Input
              label="Current password"
              type="password"
              autoComplete="current-password"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
          )}
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            hint="At least 8 characters, with an uppercase letter, a lowercase letter, and a number."
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <Button type="submit" loading={isSubmitting} className="self-start">
            {hasPassword ? 'Update password' : 'Set password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const deleteFormSchema = z.object({ password: z.string().optional().default('') });

function DangerZoneSection() {
  const { user, logout } = useAuth();
  const hasPassword = user?.hasPassword ?? true;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof deleteFormSchema>, unknown, z.infer<typeof deleteFormSchema>>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: { password: '' },
  });

  async function onDelete(data: { password: string }) {
    await settingsApi.deleteAccount(data.password);
    // The account (and its refresh tokens) are already gone server-side; this just
    // clears the client's in-memory session so the header stops showing as logged in.
    await logout();
    toast.success('Account deleted');
    navigate('/', { replace: true });
  }

  return (
    <Card className="border-red-200 dark:border-red-900/50">
      <CardHeader>
        <CardTitle className="text-red-600 dark:text-red-400">Danger zone</CardTitle>
        <CardDescription>
          Permanently delete your account and all of its links and data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          Delete account
        </Button>
      </CardContent>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete your account"
        description={
          hasPassword
            ? 'This cannot be undone. Enter your password to confirm.'
            : 'This cannot be undone.'
        }
      >
        <form onSubmit={handleSubmit(onDelete)} noValidate className="flex flex-col gap-4">
          {hasPassword && (
            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register('password')}
            />
          )}
          <Button type="submit" variant="danger" className="w-full">
            Delete account
          </Button>
        </form>
      </Dialog>
    </Card>
  );
}

const THEME_OPTIONS: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

function AppearanceSection() {
  const { setUser } = useAuth();
  const [theme, setTheme] = useState<ThemePreference>(getStoredTheme);
  const [accent, setAccent] = useState(getStoredAccent);

  function chooseTheme(next: ThemePreference) {
    applyTheme(next);
    setTheme(next);
    settingsApi
      .updateTheme(next.toUpperCase() as Theme)
      .then((result) => setUser(result.user))
      .catch(() => {
        // Best-effort account sync; the local preference above already took effect.
      });
  }

  function chooseAccent(key: string) {
    applyAccent(key);
    setAccent(key);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how PinDrop looks on this device.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">Theme</p>
          <div className="flex flex-wrap gap-2">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => chooseTheme(value)}
                aria-pressed={theme === value}
                className={cn(
                  'flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors duration-150',
                  theme === value
                    ? 'border-brand-600 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/15 dark:text-brand-300'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            Accent color
          </p>
          <div className="flex flex-wrap gap-3">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => chooseAccent(preset.key)}
                aria-label={preset.label}
                aria-pressed={accent === preset.key}
                title={preset.label}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-white transition-shadow duration-150 dark:ring-offset-slate-900',
                  accent === preset.key ? 'ring-slate-900 dark:ring-white' : 'ring-transparent',
                )}
                style={{ backgroundColor: preset.swatch }}
              >
                {accent === preset.key && (
                  <Check className="h-4 w-4 text-white" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'account', label: 'Account' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'credits', label: 'Credits' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const activeTab: TabKey = TABS.some((t) => t.key === requestedTab)
    ? (requestedTab as TabKey)
    : 'profile';

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your account.</p>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSearchParams({ tab: tab.key })}
            aria-current={activeTab === tab.key}
            className={cn(
              'whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors duration-150',
              activeTab === tab.key
                ? 'border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-300'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && <ProfileSection />}
      {activeTab === 'account' && (
        <>
          <PasswordSection />
          <DangerZoneSection />
        </>
      )}
      {activeTab === 'appearance' && <AppearanceSection />}
      {activeTab === 'credits' && <CreditsSection />}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  updateProfileSchema,
  changePasswordSchema,
  setUsernameSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
  type SetUsernameInput,
  type Theme,
} from '@pindrop/shared';
import { z } from 'zod';
import {
  Award,
  AtSign,
  Check,
  Lock,
  Mail,
  Monitor,
  Moon,
  Palette,
  Pencil,
  ShieldCheck,
  Sun,
  User,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Avatar } from '@/components/ui/Avatar';
import { AvatarPickerDialog } from '@/components/settings/AvatarPickerDialog';
import { settingsApi, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/cn';
import { CreditsSection } from '@/components/credits/CreditsSection';
import { loadGoogleScript } from '@/lib/google';
import {
  ACCENT_PRESETS,
  applyAccent,
  applyTheme,
  getStoredAccent,
  getStoredTheme,
  useIsDark,
  type ThemePreference,
} from '@/lib/theme';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

function GoogleLinkButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setUser } = useAuth();
  const isDark = useIsDark();

  useEffect(() => {
    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        const container = containerRef.current;
        if (cancelled || !container || !window.google) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            settingsApi
              .linkGoogle(response.credential)
              .then((result) => {
                setUser(result.user);
                toast.success('Google account connected');
              })
              .catch((err: unknown) => {
                toast.error(
                  err instanceof ApiError ? err.message : 'Failed to connect Google account',
                );
              });
          },
        });

        window.google.accounts.id.renderButton(container, {
          type: 'standard',
          theme: isDark ? 'filled_black' : 'outline',
          size: 'medium',
          text: 'signin_with',
          shape: 'rectangular',
          width: 170,
        });
      })
      .catch(() => {
        toast.error('Could not load Google Sign-In');
      });

    return () => {
      cancelled = true;
    };
  }, [setUser, isDark]);

  return <div ref={containerRef} />;
}

function ConnectedAccountsSection() {
  const { user, setUser } = useAuth();
  const [disconnectOpen, setDisconnectOpen] = useState(false);

  if (!user) return null;

  async function confirmDisconnect() {
    try {
      const result = await settingsApi.unlinkGoogle();
      setUser(result.user);
      toast.success('Google account disconnected');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to disconnect Google account');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected accounts</CardTitle>
        <CardDescription>Sign-in methods linked to your account.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700">
              <GoogleGIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Google</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.hasGoogleAccount ? 'Connected' : 'Not connected'}
              </p>
            </div>
          </div>
          {user.hasGoogleAccount ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDisconnectOpen(true)}
              disabled={!user.hasPassword}
              title={
                user.hasPassword ? undefined : 'Set a password before disconnecting Google'
              }
            >
              Disconnect
            </Button>
          ) : (
            <GoogleLinkButton />
          )}
        </div>

        <div className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <Lock className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Password</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.hasPassword ? 'Password set' : 'No password set'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <ConfirmDialog
        open={disconnectOpen}
        onClose={() => setDisconnectOpen(false)}
        onConfirm={confirmDisconnect}
        title="Disconnect Google?"
        description="You can reconnect anytime. You'll still be able to sign in with your password."
        confirmLabel="Disconnect"
      />
    </Card>
  );
}

function ProfileSection() {
  const { user, setUser } = useAuth();
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
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

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your public identity on PinDrop.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
          <div className="relative shrink-0">
            <Avatar
              name={user.name}
              email={user.email}
              avatarUrl={user.avatarUrl}
              avatarPreset={user.avatarPreset}
              size="lg"
            />
            <button
              type="button"
              onClick={() => setAvatarPickerOpen(true)}
              aria-label="Change avatar"
              className="absolute -bottom-1 -right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow-sm transition-colors duration-150 hover:bg-slate-700 dark:border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              <Pencil className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
              {user.name || 'Unnamed'}
            </p>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-6 flex flex-col gap-4 sm:max-w-sm"
        >
          <Input
            label="Name"
            icon={<User className="h-4 w-4" aria-hidden="true" />}
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            icon={<Mail className="h-4 w-4" aria-hidden="true" />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" loading={isSubmitting} className="self-start">
            Save changes
          </Button>
        </form>
      </CardContent>

      <AvatarPickerDialog open={avatarPickerOpen} onClose={() => setAvatarPickerOpen(false)} />
    </Card>
  );
}

function UsernameSection() {
  const { user, setUser } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingUsername, setPendingUsername] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetUsernameInput>({
    resolver: zodResolver(setUsernameSchema),
    defaultValues: { username: '' },
  });

  if (!user) return null;

  function onValidated(data: SetUsernameInput) {
    setPendingUsername(data.username);
    setConfirmOpen(true);
  }

  async function confirmClaim() {
    try {
      const result = await settingsApi.setUsername(pendingUsername);
      setUser(result.user);
      toast.success(`Username set to @${result.user.username}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to set username');
    }
  }

  if (user.username) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Username</CardTitle>
          <CardDescription>Your permanent, unique handle on PinDrop.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
            <Lock className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            <span className="font-mono text-sm font-medium text-slate-900 dark:text-white">
              @{user.username}
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Usernames are permanent and can&apos;t be changed once set.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Username</CardTitle>
        <CardDescription>
          Claim a unique handle for your profile. This is permanent and can&apos;t be changed
          once set.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onValidated)}
          noValidate
          className="flex flex-col gap-4 sm:max-w-sm"
        >
          <Input
            label="Username"
            icon={<AtSign className="h-4 w-4" aria-hidden="true" />}
            placeholder="yourname"
            error={errors.username?.message}
            hint="3-20 characters: lowercase letters, numbers, and underscores."
            {...register('username')}
          />
          <Button type="submit" className="self-start">
            Claim username
          </Button>
        </form>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmClaim}
        title="Set your username?"
        description={`Your username will be set to "@${pendingUsername}". This is permanent — it can't be changed later.`}
        confirmLabel="Yes, set it permanently"
      />
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

function ThemeSwatchHalf({ variant }: { variant: 'light' | 'dark' }) {
  const dark = variant === 'dark';
  return (
    <div className={cn('flex h-full w-full flex-col', dark ? 'bg-slate-900' : 'bg-white')}>
      <div className={cn('h-2.5 w-full', dark ? 'bg-slate-800' : 'bg-slate-100')} />
      <div className="flex flex-1 flex-col justify-center gap-1 px-2">
        <div className={cn('h-1 w-3/4 rounded-full', dark ? 'bg-slate-700' : 'bg-slate-200')} />
        <div className={cn('h-1 w-1/2 rounded-full', dark ? 'bg-slate-700' : 'bg-slate-200')} />
      </div>
    </div>
  );
}

function ThemeSwatchPreview({ mode }: { mode: ThemePreference }) {
  return (
    <div className="flex h-14 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      <ThemeSwatchHalf variant="light" />
      {mode === 'system' && <ThemeSwatchHalf variant="dark" />}
      {mode === 'dark' && <ThemeSwatchHalf variant="dark" />}
    </div>
  );
}

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
      <CardContent className="flex flex-col gap-8">
        <div>
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">Theme</p>
          <div className="grid max-w-sm grid-cols-3 gap-3">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
              const active = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => chooseTheme(value)}
                  aria-pressed={active}
                  className={cn(
                    'group relative flex flex-col items-center gap-2 rounded-xl border-2 p-2 transition-colors duration-150',
                    active
                      ? 'border-brand-600'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  )}
                >
                  <ThemeSwatchPreview mode={value} />
                  <span
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-medium',
                      active
                        ? 'text-brand-700 dark:text-brand-300'
                        : 'text-slate-600 dark:text-slate-400',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {label}
                  </span>
                  {active && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white ring-2 ring-white dark:ring-slate-900">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            Accent color
          </p>
          <div className="flex flex-wrap gap-4">
            {ACCENT_PRESETS.map((preset) => {
              const active = accent === preset.key;
              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => chooseAccent(preset.key)}
                  aria-pressed={active}
                  className="flex cursor-pointer flex-col items-center gap-1.5"
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-white transition-all duration-150 dark:ring-offset-slate-900',
                      active
                        ? 'ring-slate-900 dark:ring-white'
                        : 'ring-transparent hover:ring-slate-300 dark:hover:ring-slate-600',
                    )}
                    style={{ backgroundColor: preset.swatch }}
                  >
                    {active && <Check className="h-4 w-4 text-white" aria-hidden="true" />}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">Preview</p>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <Button size="sm">Primary button</Button>
            <Badge tone="brand">Badge</Badge>
            <span className="h-8 w-8 rounded-full bg-brand-600" aria-hidden="true" />
            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
              Link text
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const TABS = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'account', label: 'Account', icon: ShieldCheck },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'credits', label: 'Credits', icon: Award },
] as const;
type TabKey = (typeof TABS)[number]['key'];

export function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const reduceMotion = useReducedMotion() ?? false;
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

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <nav
          aria-label="Settings sections"
          className="flex gap-1 overflow-x-auto pb-1 sm:w-52 sm:shrink-0 sm:flex-col sm:overflow-visible sm:border-r sm:border-slate-200 sm:pb-0 sm:pr-4 dark:sm:border-slate-800"
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSearchParams({ tab: tab.key })}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150 sm:w-full',
                  active
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col gap-6"
            >
              {activeTab === 'profile' && (
                <>
                  <ProfileSection />
                  <UsernameSection />
                </>
              )}
              {activeTab === 'account' && (
                <>
                  <ConnectedAccountsSection />
                  <PasswordSection />
                  <DangerZoneSection />
                </>
              )}
              {activeTab === 'appearance' && <AppearanceSection />}
              {activeTab === 'credits' && <CreditsSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from '@pindrop/shared';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { settingsApi, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

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
  const { user } = useAuth();
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

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your account.</p>
      </div>
      <ProfileSection />
      <PasswordSection />
      <DangerZoneSection />
    </div>
  );
}

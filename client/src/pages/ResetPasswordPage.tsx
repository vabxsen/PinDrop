import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { passwordSchema } from '@pindrop/shared';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { useSeo } from '@/lib/useSeo';

const formSchema = z.object({ password: passwordSchema });
type FormInput = z.infer<typeof formSchema>;

export function ResetPasswordPage() {
  // Never indexable: the URL carries a live, single-use password-reset token.
  useSeo({ title: 'Set a new password — PinDrop', path: '/reset-password', robots: 'noindex, nofollow' });

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '' },
  });

  async function onSubmit(data: FormInput) {
    try {
      await authApi.resetPassword({ token, password: data.password });
      toast.success('Password updated. You can now log in.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to reset password. The link may have expired.',
      );
    }
  }

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Invalid reset link</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          This password reset link is missing its token.
        </p>
        <Link
          to="/forgot-password"
          className="mt-4 text-sm font-medium text-brand-600 dark:text-brand-400"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Set a new password</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-4">
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters, with an uppercase letter, a lowercase letter, and a number."
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" size="lg" loading={isSubmitting} className="mt-2 w-full">
          Update password
        </Button>
      </form>
    </div>
  );
}

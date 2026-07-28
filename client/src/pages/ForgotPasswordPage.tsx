import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@pindrop/shared';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: ForgotPasswordInput) {
    await authApi.forgotPassword(data);
    setSent(true);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reset your password</h1>

      {sent ? (
        <p className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          If an account exists for that email, we've sent a link to reset your password.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter your email and we'll send you a reset link.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Button type="submit" size="lg" loading={isSubmitting} className="mt-2 w-full">
              Send reset link
            </Button>
          </form>
        </>
      )}

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <Link to="/login" className="font-medium text-brand-600 dark:text-brand-400">
          Back to log in
        </Link>
      </p>
    </div>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerSchema, type RegisterInput } from '@pindrop/shared';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';

export function SignupPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', name: '' },
  });

  async function onSubmit(data: RegisterInput) {
    try {
      await registerUser(data);
      navigate('/app', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        toast.error('An account with this email already exists');
      } else {
        toast.error(err instanceof Error ? err.message : 'Failed to create account');
      }
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Free forever for personal use.
      </p>

      <div className="mt-8">
        <GoogleSignInButton />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs font-medium uppercase text-slate-400 dark:text-slate-500">or</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="Name"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters, with an uppercase letter, a lowercase letter, and a number."
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" size="lg" loading={isSubmitting} className="mt-2 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 dark:text-brand-400">
          Log in
        </Link>
      </p>
    </div>
  );
}

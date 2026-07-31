import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/Button';
import { useSeo } from '@/lib/useSeo';

export function NotFoundPage() {
  useSeo({ title: 'Page not found — PinDrop', path: '/404', robots: 'noindex, nofollow' });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center dark:bg-black">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className={buttonVariants('primary', 'md', 'mt-2')}>
        Back to home
      </Link>
    </div>
  );
}

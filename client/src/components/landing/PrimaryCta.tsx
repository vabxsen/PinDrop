import { NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/cn';
import { useOpenCreateLinkTransition } from './CreateLinkTransitionContext';

const ctaHover = 'transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]';

// Shows "Create link" for a signed-in visitor (e.g. someone who clicked Home from
// the dashboard) instead of "Get started free", which makes no sense once they
// already have an account.
export function PrimaryCta({ className }: { className?: string }) {
  const { status } = useAuth();
  const openCreateLink = useOpenCreateLinkTransition();

  if (status === 'authenticated') {
    return (
      <button
        type="button"
        onClick={openCreateLink}
        className={cn(buttonVariants('primary', 'md', ctaHover), 'gap-2', className)}
      >
        <Plus className="h-4.5 w-4.5" aria-hidden="true" />
        Create link
      </button>
    );
  }

  return (
    <NavLink to="/signup" className={cn(buttonVariants('primary', 'md', ctaHover), className)}>
      Get started free
    </NavLink>
  );
}

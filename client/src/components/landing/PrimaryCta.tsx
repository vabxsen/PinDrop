import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import type { LinkDTO } from '@pindrop/shared';
import { buttonVariants } from '@/components/ui/Button';
import { LinkFormDialog } from '@/components/links/LinkFormDialog';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/cn';

const ctaHover = 'transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]';

// Shows "Create link" for a signed-in visitor (e.g. someone who clicked Home from
// the dashboard) instead of "Get started free", which makes no sense once they
// already have an account.
export function PrimaryCta({ className }: { className?: string }) {
  const { status } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  function handleSaved(link: LinkDTO) {
    queryClient.invalidateQueries({ queryKey: ['links'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    navigate(`/app/links/${link.id}`);
  }

  if (status === 'authenticated') {
    return (
      <>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className={cn(buttonVariants('primary', 'md', ctaHover), 'gap-2', className)}
        >
          <Plus className="h-4.5 w-4.5" aria-hidden="true" />
          Create link
        </button>
        <LinkFormDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSaved={handleSaved}
        />
      </>
    );
  }

  return (
    <NavLink to="/signup" className={cn(buttonVariants('primary', 'md', ctaHover), className)}>
      Get started free
    </NavLink>
  );
}

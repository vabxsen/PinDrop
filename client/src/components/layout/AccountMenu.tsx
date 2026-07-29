import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Award, ChevronDown, LogOut, Palette, Settings, User } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/cn';

const MENU_ITEMS = [
  { tab: 'profile', label: 'Profile', icon: User },
  { tab: 'account', label: 'Account settings', icon: Settings },
  { tab: 'appearance', label: 'Appearance', icon: Palette },
  { tab: 'credits', label: 'Credits', icon: Award },
] as const;

export function AccountMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!user) return null;

  function goToTab(tab: string) {
    setOpen(false);
    navigate(`/app/settings?tab=${tab}`);
  }

  async function handleLogout() {
    setOpen(false);
    try {
      await logout();
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex cursor-pointer items-center gap-1 rounded-full p-0.5 transition-colors duration-150 hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Avatar name={user.name} email={user.email} avatarUrl={user.avatarUrl} />
        <ChevronDown
          className={cn(
            'h-4 w-4 text-slate-400 transition-transform duration-150',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <Avatar name={user.name} email={user.email} avatarUrl={user.avatarUrl} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {user.name || 'PinDrop user'}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

          <div className="px-1.5 py-1">
            {MENU_ITEMS.map(({ tab, label, icon: Icon }) => (
              <button
                key={tab}
                type="button"
                role="menuitem"
                onClick={() => goToTab(tab)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

          <div className="px-1.5 py-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

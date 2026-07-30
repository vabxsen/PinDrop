import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { buttonVariants } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth-context';
import { smoothScrollToId } from '@/lib/smoothScroll';

const navLinks = [
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#features', label: 'Features' },
];

export function PublicLayout() {
  const { status } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNavLinkClick(event: React.MouseEvent<HTMLAnchorElement>, to: string) {
    setMobileOpen(false);
    const [path, hash] = to.split('#');
    if (!hash || location.pathname !== (path || '/')) return;
    event.preventDefault();
    smoothScrollToId(hash);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg dark:border-slate-800/80 dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-brand-600 sm:px-6">
          <Link to="/" className="text-slate-900 dark:text-white">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                onClick={(event) => handleNavLinkClick(event, link.to)}
                className="text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {status === 'authenticated' ? (
              <NavLink to="/app" className={buttonVariants('primary', 'sm', 'ml-1')}>
                Go to dashboard
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100 sm:inline-flex dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Log in
                </NavLink>
                <NavLink to="/signup" className={buttonVariants('primary', 'sm')}>
                  Get started
                </NavLink>
              </>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-slate-600 md:hidden dark:text-slate-300"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={(event) => handleNavLinkClick(event, link.to)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  {link.label}
                </a>
              ))}
              {status !== 'authenticated' && (
                <NavLink
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-150 hover:bg-slate-100 sm:hidden dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Log in
                </NavLink>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-10 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:flex-row sm:px-6 dark:text-slate-400">
          <Link to="/" className="text-slate-700 dark:text-slate-300">
            <Logo />
          </Link>
          <p>&copy; {new Date().getFullYear()} PinDrop. Consent-based location sharing.</p>
        </div>
      </footer>
    </div>
  );
}

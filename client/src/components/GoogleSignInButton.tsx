import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';
import { useIsDark } from '@/lib/theme';
import { loadGoogleScript } from '@/lib/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export function GoogleSignInButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
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
            loginWithGoogle(response.credential)
              .then(() => navigate('/app', { replace: true }))
              .catch((err: unknown) => {
                toast.error(err instanceof Error ? err.message : 'Google sign-in failed');
              });
          },
        });

        window.google.accounts.id.renderButton(container, {
          type: 'standard',
          theme: isDark ? 'filled_black' : 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: container.offsetWidth || 360,
        });
      })
      .catch(() => {
        toast.error('Could not load Google Sign-In');
      });

    return () => {
      cancelled = true;
    };
  }, [loginWithGoogle, navigate, isDark]);

  return <div ref={containerRef} className="flex w-full justify-center" />;
}

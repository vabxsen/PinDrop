import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';
import { useIsDark } from '@/lib/theme';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type: 'standard';
      theme: 'outline' | 'filled_black';
      size: 'large';
      text: 'continue_with';
      shape: 'rectangular';
      width: number;
    },
  ) => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

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

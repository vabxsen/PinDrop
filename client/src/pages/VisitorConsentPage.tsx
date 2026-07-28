import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import type { LinkPublicMetaDTO } from '@pindrop/shared';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ApiError, visitorApi } from '@/lib/api';
import { requestLocation, type DeclineReason } from '@/lib/geolocation';

type Stage =
  'loading' | 'not-found' | 'inactive' | 'consent' | 'requesting' | 'granted' | 'declined';

const inactiveCopy: Record<
  Exclude<LinkPublicMetaDTO['status'], 'ACTIVE'>,
  { title: string; body: string }
> = {
  EXPIRED: {
    title: 'This link has expired',
    body: 'The person who shared it will need to create a new one.',
  },
  DISABLED: {
    title: 'This link is no longer active',
    body: 'The person who shared it has disabled it.',
  },
  MAX_USES_REACHED: {
    title: 'This link has reached its limit',
    body: 'It has already been used the maximum number of times.',
  },
};

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12 dark:bg-slate-950">
      <div className="mb-8 text-brand-600">
        <Logo />
      </div>
      <div className="w-full max-w-md text-center">{children}</div>
    </div>
  );
}

export function VisitorConsentPage() {
  const { shortId } = useParams<{ shortId: string }>();
  const [stage, setStage] = useState<Stage>('loading');
  const [meta, setMeta] = useState<LinkPublicMetaDTO | null>(null);

  useEffect(() => {
    if (!shortId) return;
    visitorApi
      .getMeta(shortId)
      .then((data) => {
        setMeta(data);
        setStage(data.status === 'ACTIVE' ? 'consent' : 'inactive');
      })
      .catch(() => setStage('not-found'));
  }, [shortId]);

  async function submitDecline(reason: DeclineReason) {
    if (!shortId) return;
    try {
      await visitorApi.decline(shortId, { reason });
    } catch {
      // Best-effort: still show the visitor a calm confirmation even if the beacon failed.
    }
    setStage('declined');
  }

  async function handleShare() {
    if (!shortId) return;
    setStage('requesting');
    try {
      const location = await requestLocation();
      await visitorApi.submitLocation(shortId, location);
      setStage('granted');
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setStage('inactive');
        return;
      }
      const reason = err instanceof Error && isDeclineReason(err.message) ? err.message : 'error';
      await submitDecline(reason);
    }
  }

  if (stage === 'loading') {
    return (
      <Shell>
        <Spinner className="mx-auto h-8 w-8" />
      </Shell>
    );
  }

  if (stage === 'not-found') {
    return (
      <Shell>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Link not found</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          This link doesn't exist or may have been removed.
        </p>
      </Shell>
    );
  }

  if (stage === 'inactive' && meta && meta.status !== 'ACTIVE') {
    const copy = inactiveCopy[meta.status];
    return (
      <Shell>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{copy.title}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{copy.body}</p>
      </Shell>
    );
  }

  if (stage === 'granted') {
    return (
      <Shell>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          Thanks — you're all set
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Your location was shared. You can safely close this page.
        </p>
      </Shell>
    );
  }

  if (stage === 'declined') {
    return (
      <Shell>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">No problem</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Nothing was shared. You can safely close this page.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">{meta?.title}</h1>
      {meta?.description && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{meta.description}</p>
      )}

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <p className="font-medium text-slate-900 dark:text-slate-100">
          If you continue, we'll ask your browser for:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Your current location (only if you approve the browser's permission prompt)</li>
          <li>Basic device info (browser, timezone) to give context</li>
        </ul>
        <p className="mt-2">Nothing is shared unless you explicitly approve it.</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button size="lg" loading={stage === 'requesting'} onClick={handleShare} className="w-full">
          Share my location
        </Button>
        <Button
          variant="outline"
          size="lg"
          disabled={stage === 'requesting'}
          onClick={() => submitDecline('user_denied')}
          className="w-full"
        >
          No thanks
        </Button>
      </div>
    </Shell>
  );
}

function isDeclineReason(value: string): value is DeclineReason {
  return (
    value === 'user_denied' || value === 'timeout' || value === 'unsupported' || value === 'error'
  );
}

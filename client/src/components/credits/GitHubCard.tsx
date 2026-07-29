import { ArrowUpRight } from 'lucide-react';
import { GitHubLogo } from './logos';

const REPO_URL = 'https://github.com/vabxsen/PinDrop';

export function GitHubCard() {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open the PinDrop repository on GitHub (opens in a new tab)"
      className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-150 hover:border-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-900 dark:border-slate-700 dark:text-white">
        <GitHubLogo className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-slate-900 dark:text-white">PinDrop</span>
        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
          Explore the source code, contribute, or report issues.
        </span>
      </span>

      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-400 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-brand-600 dark:text-slate-500 dark:group-hover:text-brand-400">
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
      </span>
    </a>
  );
}

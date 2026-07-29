interface LogoProps {
  className?: string;
}

export function ReactLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.2">
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </g>
    </svg>
  );
}

export function TypeScriptLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 9.5h5M9.5 9.5V16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M14.2 15.1c.32.55.95.95 1.75.95 1.02 0 1.65-.52 1.65-1.22 0-.82-.63-1.13-1.65-1.42-1.1-.32-1.9-.72-1.9-1.8 0-1 .82-1.72 2.02-1.72.92 0 1.55.33 1.95.85"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TailwindLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 6.5c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35-.98-1-2.12-2.15-4.59-2.15Z" />
      <path d="M7 12.5c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35-.98-1-2.12-2.15-4.59-2.15Z" />
    </svg>
  );
}

export function PrismaLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M11.3 2.7 3.4 16.6a1 1 0 0 0 .1 1.15l3.3 3.9a1 1 0 0 0 1.2.25l12.4-5.9a1 1 0 0 0 .3-1.6L12.9 2.85a1 1 0 0 0-1.6-.15Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SupabaseLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.6 2.3 4.8 13.2a1 1 0 0 0 .78 1.63h5.1l-.9 6.9a.7.7 0 0 0 1.24.55l9-11.1a1 1 0 0 0-.78-1.63h-5.1l.9-6.7a.7.7 0 0 0-1.24-.55Z" />
    </svg>
  );
}

export function FirebaseLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        d="M6.5 20.5 9 3.2a.5.5 0 0 1 .96-.14l2 4.3 1.6-1.9a.5.5 0 0 1 .85.13l4.1 14.9-6.03 3.4a2 2 0 0 1-1.96 0l-4.02-3.4Z"
        opacity=".5"
      />
      <path d="M6.5 20.5 14.4 5.6a.5.5 0 0 1 .9.06l2.2 4.5-11 10.34Z" opacity=".8" />
      <path d="M12.5 10.1 6.5 20.5l5.53 3.13a2 2 0 0 0 1.94 0l1.9-1.06-3.37-12.47Z" />
    </svg>
  );
}

export function SocketIOLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" />
      <path
        d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LeafletLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M19 5c-7.5 0-13 5-13 12.5 0 .5.02 1 .06 1.44C13 18.5 19 12.9 19 5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M6.3 18.6 17 8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function GitHubLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

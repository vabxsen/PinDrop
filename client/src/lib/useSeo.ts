import { useEffect } from 'react';

const SITE_URL = 'https://pindrop-locationtracker.firebaseapp.com';

interface SeoOptions {
  title: string;
  description?: string;
  /** Path relative to the site root, e.g. '/' or '/login'. */
  path: string;
  robots?: 'index, follow' | 'noindex, nofollow';
}

function upsertMetaByName(name: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let tag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

/**
 * Sets the document title plus the singleton description/robots/canonical
 * tags for the current route. index.html carries the defaults for the root
 * page and for bots that never execute this bundle; this keeps the same tags
 * accurate for real (JS-executing) crawlers and browser tabs as the user
 * navigates client-side between routes.
 */
export function useSeo({ title, description, path, robots = 'index, follow' }: SeoOptions) {
  useEffect(() => {
    document.title = title;
    if (description) upsertMetaByName('description', description);
    upsertMetaByName('robots', robots);
    upsertCanonical(`${SITE_URL}${path}`);
  }, [title, description, path, robots]);
}

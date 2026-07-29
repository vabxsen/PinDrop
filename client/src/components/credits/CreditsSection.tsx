import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { BuiltByCard } from './BuiltByCard';
import { TechStackGrid } from './TechStackGrid';
import { OpenSourceCard } from './OpenSourceCard';
import { GitHubCard } from './GitHubCard';

export function CreditsSection() {
  return (
    <>
      <BuiltByCard />

      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>The open-source projects PinDrop is built with.</CardDescription>
        </CardHeader>
        <CardContent>
          <TechStackGrid />
        </CardContent>
      </Card>

      <OpenSourceCard />
      <GitHubCard />

      <p className="text-center text-xs text-slate-400 dark:text-slate-500">
        Made in India <span aria-hidden="true">🇮🇳</span> &middot; &copy;{' '}
        {new Date().getFullYear()} PinDrop
      </p>
    </>
  );
}

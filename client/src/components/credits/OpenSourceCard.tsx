import { PackageOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function OpenSourceCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PackageOpen
            className="h-4 w-4 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
          <CardTitle>Open Source</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Great software is never built alone. PinDrop is powered by the creativity and dedication
          of the global open-source community. Their work makes independent projects like this
          possible.
        </p>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Crafted by
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
            Vaibhav Sen
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Independent Developer</p>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          From the first sketch to the final deployment, every detail of PinDrop was designed and
          developed with precision, performance, and privacy in mind.
        </p>
      </CardContent>
    </Card>
  );
}

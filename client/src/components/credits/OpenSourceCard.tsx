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
      <CardContent>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          PinDrop is built on the incredible work of the open-source community. Special thanks to
          the developers and maintainers whose tools make projects like this possible.
        </p>
      </CardContent>
    </Card>
  );
}

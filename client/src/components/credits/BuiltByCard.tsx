import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export function BuiltByCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Built &amp; Designed by</CardTitle>
        <CardDescription>Crafted with precision and privacy in mind.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">Vaibhav Sen</p>
      </CardContent>
    </Card>
  );
}

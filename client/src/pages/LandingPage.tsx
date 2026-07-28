import { LandingHero } from '@/components/landing/LandingHero';
import { ConsentEditorial } from '@/components/landing/ConsentEditorial';
import { ConsentTimeline } from '@/components/landing/ConsentTimeline';
import { DashboardShowcase } from '@/components/landing/DashboardShowcase';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { StatsBand } from '@/components/landing/StatsBand';
import { FaqSection } from '@/components/landing/FaqSection';
import { FinalCta } from '@/components/landing/FinalCta';

export function LandingPage() {
  return (
    <div className="overflow-x-clip">
      <LandingHero />
      <ConsentEditorial />
      <ConsentTimeline />
      <DashboardShowcase />
      <FeatureShowcase />
      <StatsBand />
      <FaqSection />
      <FinalCta />
    </div>
  );
}

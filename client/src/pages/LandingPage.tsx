import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import type { LinkDTO } from '@pindrop/shared';
import { LandingHero } from '@/components/landing/LandingHero';
import { ConsentEditorial } from '@/components/landing/ConsentEditorial';
import { ConsentTimeline } from '@/components/landing/ConsentTimeline';
import { DashboardShowcase } from '@/components/landing/DashboardShowcase';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { StatsBand } from '@/components/landing/StatsBand';
import { FaqSection } from '@/components/landing/FaqSection';
import { FinalCta } from '@/components/landing/FinalCta';
import { CreateLinkTransitionContext } from '@/components/landing/CreateLinkTransitionContext';
import { CreateLinkPanel } from '@/components/landing/CreateLinkPanel';
import { sectionEase } from '@/components/landing/motion';

export function LandingPage() {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleSaved(link: LinkDTO) {
    queryClient.invalidateQueries({ queryKey: ['links'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    setCreateOpen(false);
    navigate(`/app/links/${link.id}`);
  }

  return (
    <CreateLinkTransitionContext.Provider value={() => setCreateOpen(true)}>
      <motion.div
        aria-hidden={isCreateOpen}
        className="overflow-x-clip"
        initial={false}
        animate={
          reduceMotion
            ? undefined
            : isCreateOpen
              ? { x: ['0%', '-8%', '-100%'], filter: ['blur(0px)', 'blur(10px)', 'blur(0px)'] }
              : { x: ['-100%', '-8%', '0%'], filter: ['blur(0px)', 'blur(10px)', 'blur(0px)'] }
        }
        transition={{ duration: 0.6, ease: sectionEase }}
      >
        <LandingHero />
        <ConsentEditorial />
        <ConsentTimeline />
        <DashboardShowcase />
        <FeatureShowcase />
        <StatsBand />
        <FaqSection />
        <FinalCta />
      </motion.div>

      <CreateLinkPanel
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={handleSaved}
      />
    </CreateLinkTransitionContext.Provider>
  );
}

import { motion, useReducedMotion } from 'framer-motion';
import { fadeUpVariants, staggerContainer } from './motion';
import { TechCard } from './TechCard';
import {
  FirebaseLogo,
  LeafletLogo,
  PrismaLogo,
  ReactLogo,
  SocketIOLogo,
  SupabaseLogo,
  TailwindLogo,
  TypeScriptLogo,
} from './logos';

// Reflects the project's actual stack only — nothing here is aspirational.
const TECHNOLOGIES = [
  { name: 'React', description: 'UI Framework', Logo: ReactLogo, motionStyle: 'float' as const },
  {
    name: 'TypeScript',
    description: 'Type-Safe JavaScript',
    Logo: TypeScriptLogo,
    motionStyle: 'rotate' as const,
  },
  {
    name: 'Tailwind CSS',
    description: 'Utility-First Styling',
    Logo: TailwindLogo,
    motionStyle: 'float' as const,
  },
  { name: 'Prisma', description: 'Database ORM', Logo: PrismaLogo, motionStyle: 'rotate' as const },
  {
    name: 'Supabase',
    description: 'PostgreSQL Database',
    Logo: SupabaseLogo,
    motionStyle: 'float' as const,
  },
  {
    name: 'Firebase',
    description: 'Hosting & Delivery',
    Logo: FirebaseLogo,
    motionStyle: 'rotate' as const,
  },
  {
    name: 'Socket.IO',
    description: 'Realtime Updates',
    Logo: SocketIOLogo,
    motionStyle: 'float' as const,
  },
  {
    name: 'Leaflet',
    description: 'Interactive Maps',
    Logo: LeafletLogo,
    motionStyle: 'rotate' as const,
  },
];

export function TechStackGrid() {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full max-w-3xl"
    >
      <motion.p
        variants={fadeUpVariants(reduceMotion, 12)}
        className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-neutral-500"
      >
        Technology Stack
      </motion.p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TECHNOLOGIES.map((tech, index) => (
          <TechCard
            key={tech.name}
            name={tech.name}
            description={tech.description}
            Logo={tech.Logo}
            motionStyle={tech.motionStyle}
            motionDelay={reduceMotion ? 0 : (index % 4) * 0.4}
          />
        ))}
      </div>
    </motion.div>
  );
}

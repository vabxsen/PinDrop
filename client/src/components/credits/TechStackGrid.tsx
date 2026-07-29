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
  { name: 'React', description: 'UI Framework', Logo: ReactLogo },
  { name: 'TypeScript', description: 'Type-Safe JavaScript', Logo: TypeScriptLogo },
  { name: 'Tailwind CSS', description: 'Utility-First Styling', Logo: TailwindLogo },
  { name: 'Prisma', description: 'Database ORM', Logo: PrismaLogo },
  { name: 'Supabase', description: 'PostgreSQL Database', Logo: SupabaseLogo },
  { name: 'Firebase', description: 'Hosting & Delivery', Logo: FirebaseLogo },
  { name: 'Socket.IO', description: 'Realtime Updates', Logo: SocketIOLogo },
  { name: 'Leaflet', description: 'Interactive Maps', Logo: LeafletLogo },
];

export function TechStackGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TECHNOLOGIES.map((tech) => (
        <TechCard
          key={tech.name}
          name={tech.name}
          description={tech.description}
          Logo={tech.Logo}
        />
      ))}
    </div>
  );
}

import type { Link, LocationRecord } from '@prisma/client';
import type { LinkDTO } from '@pindrop/shared';

type LinkWithCounts = Link & {
  _count: { locations: number };
  grantedCount: number;
  deniedCount: number;
  latestVisitor?: Pick<LocationRecord, 'createdAt'> | null;
};

export function computeLinkStatus(link: Link): LinkDTO['status'] {
  if (link.disabled) return 'DISABLED';
  if (link.expiresAt && link.expiresAt.getTime() < Date.now()) return 'EXPIRED';
  if (link.maxUses !== null && link.useCount >= link.maxUses) return 'MAX_USES_REACHED';
  return 'ACTIVE';
}

export function toLinkDTO(link: LinkWithCounts): LinkDTO {
  return {
    id: link.id,
    shortId: link.shortId,
    title: link.title,
    description: link.description,
    notes: link.notes,
    expiresAt: link.expiresAt ? link.expiresAt.toISOString() : null,
    maxUses: link.maxUses,
    useCount: link.useCount,
    disabled: link.disabled,
    createdAt: link.createdAt.toISOString(),
    updatedAt: link.updatedAt.toISOString(),
    permissionGrantedCount: link.grantedCount,
    permissionDeniedCount: link.deniedCount,
    latestVisitorAt: link.latestVisitor ? link.latestVisitor.createdAt.toISOString() : null,
    status: computeLinkStatus(link),
  };
}

import type { Link } from '@prisma/client';
import type { LinkPublicMetaDTO } from '@pindrop/shared';
import { computeLinkStatus } from '../links/links.mapper.js';

export function toLinkPublicMetaDTO(link: Link): LinkPublicMetaDTO {
  return {
    title: link.title,
    description: link.description,
    status: computeLinkStatus(link),
  };
}

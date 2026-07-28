import { customAlphabet } from 'nanoid';
import type { Link } from '@prisma/client';
import type { CreateLinkInput, UpdateLinkInput } from '@pindrop/shared';
import { prisma } from '../../lib/prisma.js';
import { forbidden, notFound } from '../../lib/httpError.js';
import {
  SHORT_ID_ALPHABET,
  SHORT_ID_LENGTH,
  SHORT_ID_MAX_COLLISION_RETRIES,
} from '../../config/constants.js';
import { toLinkDTO } from './links.mapper.js';

const generateShortId = customAlphabet(SHORT_ID_ALPHABET, SHORT_ID_LENGTH);

async function attachStats(links: Link[]) {
  if (links.length === 0) return [];

  const linkIds = links.map((l) => l.id);

  const [statusCounts, latestVisitors] = await Promise.all([
    prisma.locationRecord.groupBy({
      by: ['linkId', 'permissionStatus'],
      where: { linkId: { in: linkIds } },
      _count: { _all: true },
    }),
    prisma.locationRecord.findMany({
      where: { linkId: { in: linkIds } },
      orderBy: { createdAt: 'desc' },
      distinct: ['linkId'],
      select: { linkId: true, createdAt: true },
    }),
  ]);

  const grantedByLink = new Map<string, number>();
  const deniedByLink = new Map<string, number>();
  for (const row of statusCounts) {
    const target = row.permissionStatus === 'GRANTED' ? grantedByLink : deniedByLink;
    target.set(row.linkId, row._count._all);
  }
  const latestByLink = new Map(latestVisitors.map((v) => [v.linkId, v]));

  return links.map((link) =>
    toLinkDTO({
      ...link,
      _count: { locations: (grantedByLink.get(link.id) ?? 0) + (deniedByLink.get(link.id) ?? 0) },
      grantedCount: grantedByLink.get(link.id) ?? 0,
      deniedCount: deniedByLink.get(link.id) ?? 0,
      latestVisitor: latestByLink.get(link.id) ?? null,
    }),
  );
}

async function generateUniqueShortId(): Promise<string> {
  for (let attempt = 0; attempt < SHORT_ID_MAX_COLLISION_RETRIES; attempt++) {
    const shortId = generateShortId();
    const existing = await prisma.link.findUnique({ where: { shortId } });
    if (!existing) return shortId;
  }
  throw new Error('Failed to generate a unique short link id after multiple attempts');
}

async function getOwnedLink(userId: string, id: string) {
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) throw notFound('Link not found');
  if (link.userId !== userId) throw forbidden('You do not have access to this link');
  return link;
}

export async function listLinks(userId: string) {
  const links = await prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  return attachStats(links);
}

export async function getLink(userId: string, id: string) {
  const link = await getOwnedLink(userId, id);
  const [dto] = await attachStats([link]);
  return dto;
}

export async function createLink(userId: string, input: CreateLinkInput) {
  const shortId = await generateUniqueShortId();
  const link = await prisma.link.create({
    data: {
      userId,
      shortId,
      title: input.title,
      description: input.description,
      notes: input.notes,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      maxUses: input.maxUses,
    },
  });
  const [dto] = await attachStats([link]);
  return dto;
}

export async function updateLink(userId: string, id: string, input: UpdateLinkInput) {
  await getOwnedLink(userId, id);
  const link = await prisma.link.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined ? { description: input.description } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(input.expiresAt !== undefined
        ? { expiresAt: input.expiresAt ? new Date(input.expiresAt) : null }
        : {}),
      ...(input.maxUses !== undefined ? { maxUses: input.maxUses } : {}),
    },
  });
  const [dto] = await attachStats([link]);
  return dto;
}

export async function setLinkDisabled(userId: string, id: string, disabled: boolean) {
  await getOwnedLink(userId, id);
  const link = await prisma.link.update({ where: { id }, data: { disabled } });
  const [dto] = await attachStats([link]);
  return dto;
}

export async function duplicateLink(userId: string, id: string) {
  const source = await getOwnedLink(userId, id);
  const shortId = await generateUniqueShortId();
  const link = await prisma.link.create({
    data: {
      userId,
      shortId,
      title: `${source.title} (copy)`,
      description: source.description,
      notes: source.notes,
      expiresAt: source.expiresAt,
      maxUses: source.maxUses,
    },
  });
  const [dto] = await attachStats([link]);
  return dto;
}

export async function deleteLink(userId: string, id: string) {
  await getOwnedLink(userId, id);
  await prisma.link.delete({ where: { id } });
}

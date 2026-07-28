import 'dotenv/config';
import { PrismaClient, PermissionStatus } from '@prisma/client';
import type { DeviceType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const COUNTRIES = [
  { country: 'United States', state: 'California', city: 'San Francisco', ipCountry: 'US' },
  { country: 'United States', state: 'New York', city: 'New York', ipCountry: 'US' },
  { country: 'United Kingdom', state: 'England', city: 'London', ipCountry: 'GB' },
  { country: 'Germany', state: 'Berlin', city: 'Berlin', ipCountry: 'DE' },
  { country: 'Japan', state: 'Tokyo', city: 'Tokyo', ipCountry: 'JP' },
  { country: 'Australia', state: 'New South Wales', city: 'Sydney', ipCountry: 'AU' },
];

const BROWSERS = [
  { browser: 'Chrome', browserVersion: '131.0', os: 'Windows', osVersion: '10' },
  { browser: 'Safari', browserVersion: '18.1', os: 'macOS', osVersion: '15.1' },
  { browser: 'Firefox', browserVersion: '133.0', os: 'Linux', osVersion: '' },
  { browser: 'Chrome', browserVersion: '131.0', os: 'Android', osVersion: '14' },
  { browser: 'Safari', browserVersion: '18.1', os: 'iOS', osVersion: '18.1' },
];

const DEVICE_TYPES: DeviceType[] = ['DESKTOP', 'DESKTOP', 'MOBILE', 'MOBILE', 'TABLET'];

function randomFrom<T>(arr: T[]): T {
  const item = arr[Math.floor(Math.random() * arr.length)];
  if (item === undefined) throw new Error('empty array');
  return item;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return d;
}

async function main() {
  const email = 'demo@pindrop.app';
  const passwordHash = await bcrypt.hash('DemoPass123', 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: 'Demo User',
      theme: 'SYSTEM',
    },
  });

  console.log(`Seeded user: ${email} / DemoPass123`);

  const linkDefs = [
    {
      title: 'Meetup location share',
      description: 'Send this to a friend before you meet up.',
      notes: 'Used for the Saturday hike meetup.',
      maxUses: null,
    },
    {
      title: 'Delivery drop-off',
      description: 'Confirm the exact delivery address.',
      notes: 'Package #4482 - fragile.',
      maxUses: 1,
    },
    {
      title: 'Event check-in (expired)',
      description: 'One-time link for the conference booth.',
      notes: null,
      maxUses: null,
    },
  ];

  const links = [];
  for (let i = 0; i < linkDefs.length; i++) {
    const def = linkDefs[i]!;
    const seedShortId = `seedlink${i}`;
    const link = await prisma.link.upsert({
      where: { shortId: seedShortId },
      update: {},
      create: {
        shortId: seedShortId,
        userId: user.id,
        title: def.title,
        description: def.description,
        notes: def.notes,
        maxUses: def.maxUses,
        expiresAt: def.title.includes('expired')
          ? new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
          : null,
      },
    });
    links.push(link);
  }

  console.log(`Seeded ${links.length} links`);

  let created = 0;
  for (let i = 0; i < 24; i++) {
    const link = randomFrom(links);
    const granted = Math.random() > 0.25;
    const geo = randomFrom(COUNTRIES);
    const ua = randomFrom(BROWSERS);
    const createdAt = daysAgo(Math.floor(Math.random() * 30));

    await prisma.locationRecord.create({
      data: {
        linkId: link.id,
        permissionStatus: granted ? PermissionStatus.GRANTED : PermissionStatus.DENIED,
        lat: granted ? 30 + Math.random() * 30 : null,
        lng: granted ? -120 + Math.random() * 240 : null,
        accuracy: granted ? Math.round(5 + Math.random() * 50) : null,
        capturedAt: granted ? createdAt : null,
        country: granted ? geo.country : null,
        state: granted ? geo.state : null,
        city: granted ? geo.city : null,
        postalCode: granted ? '94103' : null,
        displayAddress: granted ? `${geo.city}, ${geo.state}, ${geo.country}` : null,
        ipCountry: geo.ipCountry,
        timezone: 'America/Los_Angeles',
        language: 'en-US',
        userAgent: `${ua.browser}/${ua.browserVersion}`,
        browser: ua.browser,
        browserVersion: ua.browserVersion,
        os: ua.os,
        osVersion: ua.osVersion || null,
        deviceType: randomFrom(DEVICE_TYPES),
        screenResolution: '1920x1080',
        viewportSize: '1512x864',
        createdAt,
      },
    });

    await prisma.link.update({
      where: { id: link.id },
      data: { useCount: { increment: 1 } },
    });

    created++;
  }

  console.log(`Seeded ${created} location records`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

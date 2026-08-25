import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

if (!global.__prisma) {
  global.__prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
}

export const prisma = global.__prisma;

export const PRISMA_MODULES = ['school', 'infra', 'rera', 'hospital', 'pds', 'grievance', 'contractor'] as const;

export type PrismaModule = (typeof PRISMA_MODULES)[number];

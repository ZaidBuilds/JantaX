export const PRISMA_MODULES = [
  'school',
  'infra',
  'rera',
  'hospital',
  'pds',
  'grievance',
  'contractor',
  'andhbhakt',
  'nagar',
  'budget',
  'pollution',
  'land',
  'utility',
  'election',
  'booth',
] as const;

export type PrismaModule = (typeof PRISMA_MODULES)[number];


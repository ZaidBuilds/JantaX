/**
 * Infrastructure Module — Module registration.
 * Re-exports existing components from the original Bharat Vikas Tracker.
 * These components stay in their original location and are referenced from here.
 */
export { Dashboard as InfraDashboard } from './components/Dashboard';
export { ProjectDetail as InfraDetail } from './components/ProjectDetail';
export { ProjectCard as InfraCard } from './components/ProjectCard';

export const INFRA_MODULE = {
  id: 'infra' as const,
  nameHindi: 'सड़क-पुल हिसाब',
  nameEnglish: 'Infrastructure Tracker',
  icon: '🏗️',
};

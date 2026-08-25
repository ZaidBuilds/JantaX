export { states, claims } from './data/rawSeedData';
export type { ClaimData } from './data/rawSeedData';
export { AndhbhaktDash } from './components/AndhbhaktDash';
export type { StateInfo, ClaimCard, PinCodeInfo, GroundPhoto, ClaimCategory, SourceType } from './types';

export const ANDHBHAKT_MODULE = {
  id: 'andhbhakt' as const,
  nameHindi: 'अंधभक्त स्टेट',
  nameEnglish: 'State CM Accountability',
  icon: '🏛️',
};

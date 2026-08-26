export interface BoothFacilities {
  wheelchairRamp: boolean;
  drinkingWater: boolean;
  separateToilets: boolean;
  groundFloor: boolean;
  brailleSignage: boolean;
  shadedWaitingArea: boolean;
}

export interface BoothLevelOfficer {
  name: string;
  nameHi: string;
  designation: string;
  designationHi: string;
  contactPhone: string;
  parentDepartment: string;
  officeLocation: string;
  appointedDate: string;
}

export interface PollingBooth {
  id: string; // e.g. "BOOTH-DL-AC40-PS042"
  stationNumber: number;
  buildingName: string;
  buildingNameHi: string;
  roomNumber: string;
  address: string;
  addressHi: string;
  pinCode: string;
  assemblyConstituency: string;
  assemblyConstituencyHi: string;
  parliamentaryConstituency: string;
  parliamentaryConstituencyHi: string;
  district: string;
  state: string;
  totalElectors: number;
  maleElectors: number;
  femaleElectors: number;
  thirdGenderElectors: number;
  facilities: BoothFacilities;
  blo: BoothLevelOfficer;
  electoralRollRevisionDate: string;
  latitude?: number;
  longitude?: number;
  gazetteOrderNumber: string;
  sourceUrl: string;
}

export interface VoterFormGuideItem {
  formType: string;
  title: string;
  titleHi: string;
  purpose: string;
  purposeHi: string;
  eligibility: string;
  requiredDocuments: string[];
  submissionUrl: string;
}

export interface BoothFilter {
  query?: string;
  pinCode?: string;
  assemblyConstituency?: string;
  hasWheelchairRamp?: boolean;
  sortBy?: 'number_asc' | 'electors_desc';
}

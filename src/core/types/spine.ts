export interface Representative {
  id: string;
  name: string;
  nameHi: string;
  level: 'village' | 'block' | 'district' | 'state' | 'union';
  party: string;
  constituencyName: string;
  constituencyNameHi: string;
  pinCodes: string[];
}

export interface Fund {
  id: string;
  representativeId: string;
  schemeName: string;
  schemeNameHi: string;
  amountSanctionedCr: number;
  financialYear: string;
}

export interface ProjectNode {
  id: string;
  fundId: string;
  workName: string;
  workNameHi: string;
  sanctionedCostLakhs: number;
  gpsLat?: number;
  gpsLng?: number;
  status: 'planned' | 'in-progress' | 'completed' | 'stalled';
  statusHi: string;
  photoUrl?: string;
  realityTextHi?: string;
  realityTextEn?: string;
}

export interface ContractorNode {
  id: string;
  projectId: string;
  name: string;
  nameHi: string;
  registrationNumber?: string;
  paymentStatus: 'paid' | 'pending';
  pastProjectsCount: number;
}

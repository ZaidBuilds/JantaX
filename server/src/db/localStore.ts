// LocalStore — intentionally EMPTY.
//
// This used to serve hand-written records for ~10 PINs and clone them onto
// every other PIN with renamed titles. That is fabricated data, so it is gone.
// Real data now comes from the live layer (server/src/live/*, /api/live/:pin).
// Callers keep the same API but receive null / [] / zero counts.

import type {
  RealPincode,
  RealSchool,
  RealInfraProject,
  RealReraProject,
  RealHospital,
  RealPdsShop,
  RealCpgramsRecord,
  RealRepresentative,
  RealBudgetHead,
  RealTehsilOffice,
  RealLandParcel,
} from '../data/real';

class LocalStore {
  getPincode(_code: string): RealPincode | null {
    return null;
  }
  getSchools(_pin: string): RealSchool[] {
    return [];
  }
  getInfra(_pin: string): RealInfraProject[] {
    return [];
  }
  getRera(_pin: string): RealReraProject[] {
    return [];
  }
  getHospitals(_pin: string): RealHospital[] {
    return [];
  }
  getPds(_pin: string): RealPdsShop[] {
    return [];
  }
  getGrievances(_pin: string): RealCpgramsRecord[] {
    return [];
  }
  getRepresentatives(_pin: string): RealRepresentative[] {
    return [];
  }
  getBudget(_pin: string): RealBudgetHead[] {
    return [];
  }
  getTehsils(_pin: string): RealTehsilOffice[] {
    return [];
  }
  getParcels(_pin: string): RealLandParcel[] {
    return [];
  }
  getAllPincodes(): RealPincode[] {
    return [];
  }
  getCountsForPin(_code: string) {
    return { schools: 0, infraProjects: 0, reraProjects: 0, hospitals: 0, pdsShops: 0, grievances: 0, citizenReports: 0 };
  }
}

export const localStore = new LocalStore();

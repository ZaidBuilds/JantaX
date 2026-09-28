export interface FoodEstablishment {
  id: string; // e.g. "FSSAI-DL-110001-0042"
  licenseNumber: string; // 14-digit FoSCoS license
  businessName: string;
  businessNameHi: string;
  businessType: 'Restaurant & Dine-in' | 'Cloud Kitchen & Delivery' | 'Dairy & Milk Products' | 'Sweet Shop & Bakery' | 'Street Food Hub';
  pinCode: string;
  district: string;
  state: string;
  address: string;
  licenseStatus: 'ACTIVE_VALID' | 'EXPIRED' | 'UNDER_RENEWAL' | 'SUSPENDED';
  validUpto: string;
  hygieneRating: 1 | 2 | 3 | 4 | 5 | 0; // 0 for unrated
  hygieneRatingLabel: 'Excellent' | 'Very Good' | 'Good' | 'Needs Improvement' | 'Poor' | 'Not Yet Rated';
  lastInspectionDate: string;
  samplesCollected: number;
  adulterationViolations: number;
  designatedOfficer: string;
  inspectionFindings: string;
  sourceAuthority: string;
  sourceUrl: string;
}

export interface RapidHomeTest {
  foodItem: string;
  foodItemHi: string;
  suspectedAdulterant: string;
  suspectedAdulterantHi: string;
  testProcedure: string;
  testProcedureHi: string;
  positiveResultMeaning: string;
  healthRisk: string;
}

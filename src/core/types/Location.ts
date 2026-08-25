/**
 * Location — The universal anchor for every record in JanCheck.
 * PIN code is the primary key for citizen lookup.
 */
export interface Location {
  pinCode: string;           // 6-digit Indian PIN code — PRIMARY KEY
  state: string;             // e.g., "Maharashtra"
  district: string;          // e.g., "Mumbai"
  block?: string;            // For rural modules (school, PHC, road)
  ward?: string;             // For urban modules (nagar, RERA)
  gpsLat?: number;
  gpsLng?: number;
}

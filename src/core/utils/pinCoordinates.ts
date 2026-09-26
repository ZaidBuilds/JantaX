// Approximate coordinates for known PIN-code prefixes.
// A fallback map centre for a PIN prefix when the India Post directory has no location for it.
export interface PinCoordinate {
  prefix: string;
  lat: number;
  lng: number;
  state: string;
  district: string;
}

export const PIN_COORDINATES: PinCoordinate[] = [
  { prefix: '110', lat: 28.6139, lng: 77.2090, state: 'Delhi', district: 'New Delhi' },
  { prefix: '400', lat: 19.0760, lng: 72.8777, state: 'Maharashtra', district: 'Mumbai' },
  { prefix: '411', lat: 18.5204, lng: 73.8567, state: 'Maharashtra', district: 'Pune' },
  { prefix: '440', lat: 21.1458, lng: 79.0882, state: 'Maharashtra', district: 'Nagpur' },
  { prefix: '246', lat: 30.4100, lng: 79.3300, state: 'Uttarakhand', district: 'Chamoli' },
  { prefix: '248', lat: 30.3165, lng: 78.0322, state: 'Uttarakhand', district: 'Dehradun' },
  { prefix: '226', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', district: 'Lucknow' },
  { prefix: '250', lat: 28.9845, lng: 77.7064, state: 'Uttar Pradesh', district: 'Meerut' },
  { prefix: '560', lat: 12.9716, lng: 77.5946, state: 'Karnataka', district: 'Bengaluru' },
  { prefix: '600', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', district: 'Chennai' },
  { prefix: '700', lat: 22.5726, lng: 88.3639, state: 'West Bengal', district: 'Kolkata' },
  { prefix: '380', lat: 23.0225, lng: 72.5714, state: 'Gujarat', district: 'Ahmedabad' },
  { prefix: '302', lat: 26.9124, lng: 75.7873, state: 'Rajasthan', district: 'Jaipur' },
  { prefix: '160', lat: 30.7333, lng: 76.7794, state: 'Chandigarh', district: 'Chandigarh' },
  { prefix: '500', lat: 17.3850, lng: 78.4867, state: 'Telangana', district: 'Hyderabad' },
  { prefix: '682', lat: 9.9816, lng: 76.2999, state: 'Kerala', district: 'Ernakulam' },
  { prefix: '452', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh', district: 'Indore' },
  { prefix: '800', lat: 25.5941, lng: 85.1376, state: 'Bihar', district: 'Patna' },
  { prefix: '781', lat: 26.1445, lng: 91.7362, state: 'Assam', district: 'Guwahati' },
  { prefix: '403', lat: 15.4909, lng: 73.8278, state: 'Goa', district: 'North Goa' },
  { prefix: '180', lat: 32.7266, lng: 74.8570, state: 'Jammu & Kashmir', district: 'Jammu' },
  { prefix: '737', lat: 27.3389, lng: 88.6065, state: 'Sikkim', district: 'Gangtok' },
  { prefix: '795', lat: 24.8170, lng: 93.9368, state: 'Manipur', district: 'Imphal' },
];


export function getCoordinateForPin(pinCode: string): PinCoordinate | undefined {
  const prefix = pinCode.trim().substring(0, 3);
  return PIN_COORDINATES.find((coord) => coord.prefix === prefix);
}

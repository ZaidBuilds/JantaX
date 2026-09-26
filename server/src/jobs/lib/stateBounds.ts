/**
 * Approximate extent of each state and union territory: [minLat, minLng, maxLat, maxLng].
 * Used to reject coordinates that cannot belong to the state an office is listed under (India Post
 * publishes some offices at another state's coordinates, e.g. Vadodara offices at latitude 15.59).
 * Deliberately generous; checks add a further margin.
 */
export const STATE_BOUNDS: Record<string, [number, number, number, number]> = {
  'Andaman and Nicobar Islands': [6.5, 92.2, 13.7, 94.3],
  'Andhra Pradesh': [12.6, 76.7, 19.2, 84.8],
  'Arunachal Pradesh': [26.6, 91.5, 29.5, 97.4],
  Assam: [24.1, 89.7, 28.0, 96.1],
  Bihar: [24.3, 83.3, 27.6, 88.3],
  Chandigarh: [30.6, 76.6, 30.8, 76.9],
  Chhattisgarh: [17.8, 80.2, 24.1, 84.4],
  Delhi: [28.4, 76.8, 28.9, 77.4],
  Goa: [14.9, 73.6, 15.8, 74.4],
  Gujarat: [20.1, 68.1, 24.7, 74.5],
  Haryana: [27.6, 74.4, 31.0, 77.6],
  'Himachal Pradesh': [30.4, 75.5, 33.3, 79.0],
  'Jammu and Kashmir': [32.2, 73.3, 35.2, 76.9],
  Jharkhand: [21.9, 83.3, 25.4, 87.9],
  Karnataka: [11.5, 74.0, 18.5, 78.6],
  Kerala: [8.2, 74.8, 12.8, 77.4],
  Ladakh: [32.3, 75.3, 36.0, 80.3],
  Lakshadweep: [8.0, 71.6, 12.4, 74.0],
  'Madhya Pradesh': [21.0, 74.0, 26.9, 82.8],
  Maharashtra: [15.6, 72.6, 22.1, 80.9],
  Manipur: [23.8, 92.9, 25.7, 94.8],
  Meghalaya: [25.0, 89.8, 26.2, 92.8],
  Mizoram: [21.9, 92.2, 24.6, 93.5],
  Nagaland: [25.2, 93.3, 27.1, 95.3],
  Odisha: [17.8, 81.4, 22.6, 87.5],
  Puducherry: [10.8, 75.4, 16.8, 82.3], // Puducherry, Karaikal, Mahe and Yanam
  Punjab: [29.5, 73.8, 32.6, 77.0],
  Rajasthan: [23.0, 69.5, 30.2, 78.3],
  Sikkim: [27.0, 88.0, 28.2, 88.95],
  'Tamil Nadu': [8.0, 76.2, 13.6, 80.4],
  Telangana: [15.8, 77.2, 19.95, 81.4],
  'The Dadra and Nagar Haveli and Daman and Diu': [20.0, 70.8, 20.8, 73.3],
  Tripura: [22.9, 91.1, 24.6, 92.4],
  'Uttar Pradesh': [23.8, 77.0, 30.5, 84.7],
  Uttarakhand: [28.7, 77.5, 31.5, 81.1],
  'West Bengal': [21.5, 85.8, 27.3, 89.9],
};

/** True when a point lies within the state's extent plus `marginDeg`, or the state is not in the table. */
export function inState(state: string, lat: number, lng: number, marginDeg = 0.3): boolean {
  const b = STATE_BOUNDS[state];
  if (!b) return true;
  return lat >= b[0] - marginDeg && lat <= b[2] + marginDeg && lng >= b[1] - marginDeg && lng <= b[3] + marginDeg;
}

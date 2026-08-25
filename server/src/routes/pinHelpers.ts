import { Region } from '@prisma/client';

export const PincodeRegion = Region;

export function regionForState(state: string): Region {
  const northern = ['jammu and kashmir', 'ladakh', 'ladakh (ut)', 'himachal pradesh', 'punjab', 'haryana', 'delhi', 'chandigarh', 'dadra and nagar haveli and daman and diu', 'uttarakhand', 'uttar pradesh'];
  const southern = ['andhra pradesh', 'karnataka', 'kerala', 'tamil nadu', 'telangana', 'puducherry', 'lakshadweep', 'andaman and nicobar islands'];
  const eastern = ['bihar', 'west bengal', 'jharkhand', 'odisha', 'assam', 'arunachal pradesh', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'tripura', 'sikkim'];
  const western = ['gujarat', 'rajasthan', 'madhya pradesh', 'chhattisgarh', 'maharashtra', 'goa'];

  const normalized = state.toLowerCase();
  const includes = (list: string[]) => list.some(x => x === normalized);

  if (includes(northern)) return Region.NORTH;
  if (includes(southern)) return Region.SOUTH;
  if (includes(eastern)) return Region.EAST;
  if (includes(western)) return Region.WEST;
  return Region.CENTRAL;
}

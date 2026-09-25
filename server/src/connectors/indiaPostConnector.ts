// India Post Live Pin Code Resolver Connector under GODL-India
// Source: Department of Posts (India Post), Ministry of Communications
// Endpoint: https://api.postalpincode.in/pincode/${pincode}

export interface IndiaPostBranch {
  Name: string;
  Description?: string;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  Block: string;
  State: string;
  Country: string;
  Pincode: string;
}

export interface IndiaPostResult {
  pincode: string;
  district: string;
  state: string;
  region: string;
  block: string;
  branches: string[];
  headPostOffice?: string;
  isVerified: boolean;
  fetchedAt: string;
  source: string;
}

export async function fetchIndiaPostData(pinCode: string): Promise<IndiaPostResult | null> {
  const cleanPin = pinCode.replace(/\D/g, '');
  if (!/^\d{6}$/.test(cleanPin)) return null;

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000), // 4s timeout
    });

    if (!res.ok) return null;
    const data = (await res.json()) as any[];

    if (!Array.isArray(data) || data.length === 0 || data[0].Status !== 'Success') {
      return null;
    }

    const postOffices: IndiaPostBranch[] = data[0].PostOffice || [];
    if (postOffices.length === 0) return null;

    const first = postOffices[0];
    const hpo = postOffices.find(
      (p) =>
        p.BranchType.includes('Head') ||
        p.Name.includes('H.O') ||
        p.Name.includes('G.P.O')
    );

    return {
      pincode: cleanPin,
      district: first.District,
      state: first.State,
      region: first.Region,
      block: first.Block && first.Block !== 'NA' ? first.Block : first.District,
      branches: postOffices.map((p) => p.Name),
      headPostOffice: hpo ? hpo.Name : first.Name,
      isVerified: true,
      fetchedAt: new Date().toISOString(),
      source: 'Department of Posts (India Post Portal)',
    };
  } catch (err: any) {
    // Network or timeout failure — graceful return null to fallback to local store
    return null;
  }
}

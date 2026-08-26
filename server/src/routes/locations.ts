import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../prisma';
import { requireRole } from '../middleware/auth';

// Location response types
export interface LocationInfo {
  code: string;
  state: string;
  district: string;
  region: string;
  lat: number | null;
  lng: number | null;
  areaType: string | null;
  population: number | null;
  // Additional metadata
  metadata: Record<string, any>;
  source: {
    name: string;
    freshness: string; // ISO timestamp
    reliability: 'high' | 'medium' | 'low';
  };
}

// Pincode validation response
export interface PincodeValidation {
  valid: boolean;
  code: string | null;
  error: string | null;
}

const router = Router();

/**
 * GET /api/locations/:code
 * Get detailed location information for a PIN code
 */
router.get('/:code', async (req: Request, res: Response) => {
  try {
    const code = String(req.params.code).replace(/\D/g, '');
    
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ 
        valid: false, 
        code: null, 
        error: 'Invalid PIN code format' 
      } as PincodeValidation);
    }
    
    const pincode = await prisma.pincode.findUnique({
      where: { code },
      include: {
        schools: {
          select: { id: true },
          take: 1
        },
        infraProjects: {
          select: { id: true },
          take: 1
        },
        hospitals: {
          select: { id: true },
          take: 1
        }
      }
    });
    
    if (!pincode) {
      return res.status(404).json({ 
        valid: false, 
        code: null, 
        error: 'PIN code not found in database' 
      } as PincodeValidation);
    }
    
    // Determine area type based on available data or default logic
    const areaType = pincode.areaType || 
      (pincode.population && pincode.population > 50000 ? 'Urban' : 'Rural');
    
    res.json({
      valid: true,
      code: pincode.code,
      state: pincode.state,
      district: pincode.district,
      region: pincode.region,
      lat: pincode.lat,
      lng: pincode.lng,
      areaType: areaType,
      population: pincode.population,
      metadata: {
        hasSchools: pincode.schools?.length > 0,
        hasInfrastructure: pincode.infraProjects?.length > 0,
        hasHospitals: pincode.hospitals?.length > 0,
        lastUpdated: pincode.updatedAt.toISOString()
      },
      source: {
        name: 'JantaX PIN Registry',
        freshness: pincode.updatedAt.toISOString(),
        reliability: 'high'
      }
    });
  } catch (error) {
    console.error('[locations] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/locations/validate
 * Validate a PIN code format
 */
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { code } = req.body as { code?: string };
    
    if (!code) {
      return res.status(400).json({ 
        valid: false, 
        code: null, 
        error: 'PIN code is required' 
      } as PincodeValidation);
    }
    
    const cleanCode = String(code).replace(/\D/g, '');
    const isValid = /^\d{6}$/.test(cleanCode);
    
    res.json({
      valid: isValid,
      code: isValid ? cleanCode : null,
      error: isValid ? null : 'Invalid PIN code format - must be 6 digits'
    } as PincodeValidation);
  } catch (error) {
    console.error('[locations/validate] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/locations/:code/neighbors
 * Get neighboring PIN codes (geographically close)
 */
router.get('/:code/neighbors', async (req: Request, res: Response) => {
  try {
    const code = String(req.params.code).replace(/\D/g, '');
    
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: 'Invalid PIN code format' });
    }
    
    const pincode = await prisma.pincode.findUnique({
      where: { code }
    });
    
    if (!pincode || pincode.lat === null || pincode.lng === null) {
      return res.status(404).json({ 
        error: 'PIN code not found or location data unavailable',
        neighbors: []
      });
    }
    
    // Find neighboring PIN codes within approximately 20km radius
    // This is a simplified calculation - in production you'd use proper geospatial queries
    const lat = parseFloat(pincode.lat.toString());
    const lng = parseFloat(pincode.lng.toString());
    
    // Approximate 20km in degrees (roughly 0.18 degrees latitude, variable longitude)
    const latRange = 0.18;
    const lngRange = 0.18 / Math.cos(lat * Math.PI / 180); // Adjust for latitude
    
    const neighbors = await prisma.pincode.findMany({
      where: {
        AND: [
          { lat: { gt: lat - latRange, lt: lat + latRange } },
          { lng: { gt: lng - lngRange, lt: lng + lngRange } },
          { code: { not: code } } // Exclude the original PIN
        ]
      },
      select: {
        code: true,
        state: true,
        district: true,
        lat: true,
        lng: true
      },
      orderBy: [
        { lat: { sort: 'asc' } },
        { lng: { sort: 'asc' } }
      ],
      take: 10
    });
    
    res.json({
      pincode: code,
      neighbors: neighbors.map(n => ({
        code: n.code,
        state: n.state,
        district: n.district,
        lat: n.lat,
        lng: n.lng,
        distance: calculateDistance(lat, lng, n.lat!, n.lng!) // Simplified distance
      }))
    });
  } catch (error) {
    console.error('[locations/neighbors] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Calculate distance between two points using Haversine formula (simplified)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

export default router;


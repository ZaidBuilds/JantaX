import { Router } from 'express';
import type { Request, Response } from 'express';

// Methodology response types
export interface MethodologyInfo {
  section: string;
  title: string;
  description: string;
  details: Record<string, any>[];
  lastUpdated: string; // ISO date
  version: string;
}

// Methodology response
export interface MethodologyResponse {
  methodology: MethodologyInfo[];
  sourceInfo: {
    name: string;
    freshness: string; // ISO timestamp
    reliability: 'high' | 'medium' | 'low';
  };
}

const router = Router();

/**
 * GET /api/methodology
 * Get information about data sources, collection methods, and scoring methodologies
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would come from a database or configuration files
    // For now, we'll return static methodology information
    
    const methodology: MethodologyInfo[] = [
      {
        section: 'Data Sources',
        title: 'Official Government Data Sources',
        description: 'JantaX aggregates data from various official government sources to provide transparency and accountability.',
        details: [
          {
            source: 'UDISE+',
            description: 'Unified District Information System for Education Plus - Comprehensive database of schools in India',
            updateFrequency: 'Annual',
            reliability: 'High',
            access: 'Publicly available through government portals'
          },
          {
            source: 'MoSPI',
            description: 'Ministry of Statistics and Programme Implementation - Infrastructure project data',
            updateFrequency: 'Quarterly',
            reliability: 'High',
            access: 'Available through government APIs and portals'
          },
          {
            source: 'RERA',
            description: 'Real Estate Regulatory Authority - Real estate project registration and compliance data',
            updateFrequency: 'Monthly',
            reliability: 'High',
            access: 'State-specific portals with varying access levels'
          },
          {
            source: 'HMIS/NHM',
            description: 'Health Management Information System/National Health Mission - Healthcare facility data',
            updateFrequency: 'Monthly',
            reliability: 'Medium',
            access: 'Government health department portals'
          },
          {
            source: 'NFSA/ePOS',
            description: 'National Food Security Act/electronic Point of Sale - Public distribution system data',
            updateFrequency: 'Monthly',
            reliability: 'Medium',
            access: 'Food and public distribution department portals'
          },
          {
            source: 'GeM/CPPP',
            description: 'Government e-Marketplace/Central Public Procurement Portal - Government contractor and vendor data',
            updateFrequency: 'Real-time',
            reliability: 'High',
            access: 'Government procurement portals'
          }
        ],
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      },
      {
        section: 'Collection Methods',
        title: 'Data Collection and Verification Process',
        description: 'JantaX employs a multi-step process to collect, verify, and present government data.',
        details: [
          {
            step: 'Automated Collection',
            description: 'Data is automatically collected from government APIs and portals using secure connectors',
            frequency: 'As per source update schedule',
            tools: 'Custom connectors, API integrations, web scraping where necessary'
          },
          {
            step: 'Data Validation',
            description: 'Collected data undergoes validation for consistency, completeness, and accuracy',
            frequency: 'After each collection cycle',
            tools: 'Schema validation, cross-reference checks, anomaly detection'
          },
          {
            step: 'Geocoding',
            description: 'Data is geocoded to PIN codes for location-based analysis and mapping',
            frequency: 'After validation',
            tools: 'PIN code database, geocoding APIs, manual verification for edge cases'
          },
          {
            step: 'Publication',
            description: 'Processed data is made available through the JantaX API and frontend applications',
            frequency: 'After processing completes',
            tools: 'REST API, frontend applications, data exports'
          }
        ],
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      },
      {
        section: 'Scoring Methodologies',
        title: 'Ground Truth Scoring and Verification Levels',
        description: 'JantaX uses standardized scoring methodologies to assess the accuracy of government claims.',
        details: [
          {
            scoreType: 'Ground Truth Score (0-100)',
            description: 'Percentage score comparing ground truth evidence to official claims',
            calculation: '(Ground Truth Value / Claim Value) * 100',
            interpretation: '90-100: Excellent, 75-89: Good, 50-74: Fair, 25-49: Poor, 0-24: Very Poor'
          },
          {
            scoreType: 'Evidence Confidence (0-100)',
            description: 'Confidence level in the authenticity and reliability of evidence',
            factors: ['Source reliability', 'Corroboration', 'Timeliness', 'Completeness'],
            interpretation: '90-100: High confidence, 70-89: Medium confidence, 0-69: Low confidence'
          },
          {
            scoreType: 'Verification Levels (1-5)',
            description: 'Five-level system for classifying evidence reliability',
            details: [
              'Level 1: Official source (government documents, official statements)',
              'Level 2: Single community report (unverified citizen submission)',
              'Level 3: Multiple independent reports (3+ independent citizen reports)',
              'Level 4: Evidence-backed observation (photo/video/document evidence)',
              'Level 5: Official confirmation (government verification or acknowledgment)'
            ]
          }
        ],
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      },
      {
        section: 'Limitations and Caveats',
        title: 'Known Limitations and Data Quality Notes',
        description: 'Important considerations when using JantaX data.',
        details: [
          {
            limitation: 'Data Freshness',
            description: 'Data may not reflect the most recent updates due to source update frequencies',
            mitigation: 'Check lastUpdated timestamps and source refresh intervals'
          },
          {
            limitation: 'Coverage Gaps',
            description: 'Not all government programs or departments may be fully covered',
            mitigation: 'Check source coverage notes and contact us for specific data requests'
          },
          {
            limitation: 'Language Barriers',
            description: 'Some source data may be in regional languages with varying translation quality',
            mitigation: 'Hindi and English translations are provided where available'
          },
          {
            limitation: 'Temporal Comparisons',
            description: 'Direct comparisons across different time periods may not account for policy changes',
            mitigation: 'Consider contextual factors when analyzing trends over time'
          }
        ],
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      }
    ];
    
    res.json({
      methodology: methodology,
      sourceInfo: {
        name: 'JantaX Methodology Registry',
        freshness: new Date().toISOString(),
        reliability: 'high'
      }
    });
  } catch (error) {
    console.error('[methodology] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/methodology/:section
 * Get methodology information for a specific section
 */
router.get('/:section', async (req: Request, res: Response) => {
  try {
    const section = String(req.params.section);
    
    // In a real implementation, this would filter the methodology data
    // For now, we'll return the same data as the main endpoint
    const methodology: MethodologyInfo[] = [
      {
        section: section,
        title: Methodology Section: ,
        description: Detailed information about ,
        details: [
          {
            info: 'This section provides detailed information about ' + section,
            lastUpdated: new Date().toISOString()
          }
        ],
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      }
    ];
    
    res.json({
      methodology: methodology,
      sourceInfo: {
        name: 'JantaX Methodology Registry',
        freshness: new Date().toISOString(),
        reliability: 'high'
      }
    });
  } catch (error) {
    console.error('[methodology/:section] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;


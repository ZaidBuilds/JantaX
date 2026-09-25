import { describe, it, expect } from 'vitest';
import { searchProjects } from '../../modules/infra/services/projectService';
import { searchContractors } from '../../modules/contractor/services/contractorService';
import { searchReraProjects } from '../../modules/rera/services/reraService';
import { getStoredAlerts, quarantineAlert } from '../../modules/monitoring/services/monitoringService';
import { submitCorrectionRequest } from '../../modules/transparency/services/transparencyService';

describe('Integration Tests: Search, Monitoring & Transparency Services', () => {
  it('should search infrastructure projects by keyword', () => {
    const results = searchProjects({ query: 'Barapullah' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].nameEnglish).toContain('Barapullah');
  });

  it('should search contractors by category and minimum score', () => {
    const contractors = searchContractors({ category: 'Class 1 Heavy Infrastructure', minScore: 80 });
    expect(contractors.length).toBeGreaterThan(0);
    expect(contractors[0].performanceIndicators.overallScore).toBeGreaterThanOrEqual(80);
  });

  it('should search RERA projects by state portal', () => {
    const reraProjects = searchReraProjects({ statePortal: 'MahaRERA' });
    expect(reraProjects.length).toBeGreaterThan(0);
    expect(reraProjects[0].statePortal).toContain('MahaRERA');
  });

  it('should quarantine suspicious update and transition status to Quarantined', () => {
    const alerts = getStoredAlerts();
    expect(alerts.length).toBeGreaterThan(0);

    const updatedAlerts = quarantineAlert(alerts[0].id, 'Test Quarantine Reason');
    const target = updatedAlerts.find(a => a.id === alerts[0].id);
    expect(target?.status).toBe('Quarantined');
    expect(target?.validation.requiresHumanReview).toBe(true);
  });

  it('should process official data challenge submission', () => {
    const req = submitCorrectionRequest({
      requestType: 'Official Data Challenge',
      submitterName: 'Shri Legal Counsel',
      organization: 'M/s Sample Contractor A Infra',
      email: 'legal@example.com',
      entityId: 'cont-sample-a',
      claimDetails: 'Challenging penalty order date with High Court stay order.',
      supportingGazetteUrl: 'https://cag.gov.in/stay.pdf'
    });

    expect(req.id).toContain('corr-');
    expect(req.status).toBe('Under Review');
  });
});

import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { SchoolModulePage } from './SchoolModulePage';
import { InfraApp } from '../modules/infra/InfraApp';
import { HospitalDashboard } from '../modules/hospital/components/HospitalDashboard';
import { ReraDashboard } from '../modules/rera/components/ReraDashboard';
import ContractorApp from '../modules/contractor/ContractorApp';
import { RationDashboard } from '../modules/ration/components/RationDashboard';
import { CpgramsDashboard } from '../modules/grievance/components/CpgramsDashboard';
import { CourtsDirectoryPage } from '../modules/courts/pages/CourtsDirectoryPage';
import { RtiDirectoryPage } from '../modules/rti/pages/RtiDirectoryPage';
import { MpladsDirectoryPage } from '../modules/mplads/pages/MpladsDirectoryPage';
import { NagarDirectoryPage } from '../modules/nagar/pages/NagarDirectoryPage';
import { PollutionDirectoryPage } from '../modules/pollution/pages/PollutionDirectoryPage';
import { MonitoringDashboardPage } from '../modules/monitoring/pages/MonitoringDashboardPage';
import { UtilityDashboard } from '../modules/utility/components/UtilityDashboard';
import { LandDashboard } from '../modules/land/components/LandDashboard';
import { ArrowLeft } from 'lucide-react';
import { DataStatusBanner } from '../components/data/DataStatusBanner';

/**
 * Route aliases → canonical registry id. The router accepts several spellings
 * per module (`/module/schools`, `/module/roads`), but the data-status banner
 * must resolve to the one id used in MODULE_REGISTRY.
 */
const CANONICAL_MODULE_ID: Record<string, string> = {
  school: 'school', schools: 'school',
  infra: 'infra', projects: 'infra', roads: 'infra',
  hospital: 'hospital', healthcare: 'hospital', health: 'hospital',
  rera: 'rera', housing: 'rera',
  contractor: 'contractor', contractors: 'contractor',
  ration: 'ration', pds: 'ration',
  grievance: 'grievance', cpgrams: 'grievance',
  courts: 'courts', court: 'courts',
  rti: 'rti',
  mplads: 'mplads', mp: 'mplads',
  nagar: 'nagar', ward: 'nagar', municipality: 'nagar',
  pollution: 'pollution', air: 'pollution', aqi: 'pollution',
  utility: 'utility', power: 'utility', water: 'utility',
  land: 'land',
};

export function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const id = (moduleId || '').toLowerCase();
  const canonicalId = CANONICAL_MODULE_ID[id];

  return (
    <>
      {canonicalId && (
        <div className="container" style={{ paddingTop: 'var(--space-4)' }}>
          <DataStatusBanner moduleId={canonicalId} />
        </div>
      )}
      {renderModule(id, navigate)}
    </>
  );
}

function renderModule(id: string, navigate: ReturnType<typeof useNavigate>) {
  switch (id) {
    case 'school':
    case 'schools':
      return <SchoolModulePage />;

    case 'infra':
    case 'projects':
    case 'roads':
      return <InfraApp />;

    case 'hospital':
    case 'healthcare':
    case 'health':
      return <HospitalDashboard />;

    case 'rera':
    case 'housing':
      return <ReraDashboard />;

    case 'contractor':
    case 'contractors':
      return <ContractorApp />;

    case 'ration':
    case 'pds':
      return <RationDashboard />;

    case 'grievance':
    case 'cpgrams':
      return <CpgramsDashboard />;

    case 'courts':
    case 'court':
      return <CourtsDirectoryPage />;

    case 'rti':
      return <RtiDirectoryPage />;

    case 'mplads':
    case 'mp':
      return <MpladsDirectoryPage />;

    case 'nagar':
    case 'ward':
    case 'municipality':
      return <NagarDirectoryPage />;

    case 'pollution':
    case 'air':
    case 'aqi':
      return <PollutionDirectoryPage />;

    case 'monitoring':
      return <MonitoringDashboardPage />;

    case 'utility':
    case 'power':
    case 'water':
      return <UtilityDashboard />;

    case 'land':
      return <LandDashboard />;

    default:
      return (
        <div className="container" style={{ padding: '3rem 1.25rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
            Module "{id}"
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            This observatory is being connected to live central and state databases.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>
        </div>
      );
  }
}

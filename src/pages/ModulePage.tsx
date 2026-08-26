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
import { AndhbhaktDash } from '../modules/andhbhakt/components/AndhbhaktDash';
import { UtilityDashboard } from '../modules/utility/components/UtilityDashboard';
import { LandDashboard } from '../modules/land/components/LandDashboard';
import { ArrowLeft } from 'lucide-react';

export function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = (moduleId || '').toLowerCase();

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

    case 'andhbhakt':
    case 'claims':
      return <AndhbhaktDash />;

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
            Module "{moduleId}"
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

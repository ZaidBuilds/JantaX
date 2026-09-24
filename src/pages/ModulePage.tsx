import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { lazy, Suspense, type ComponentType } from 'react';
import { ModuleFrame } from './ModuleFrame';
import { NotFoundPage } from './NotFoundPage';
import { Breadcrumbs, canonicalModuleId } from '../ui';

function screen<T extends Record<string, unknown>>(loader: () => Promise<T>, name: keyof T) {
  return lazy(() => loader().then((m) => ({ default: m[name] as unknown as ComponentType })));
}

/** Each module is its own chunk so opening one module does not download all eighteen. */
const SCREENS: Record<string, ComponentType> = {
  infra: screen(() => import('../modules/infra/InfraApp'), 'InfraApp'),
  hospital: screen(() => import('../modules/hospital/components/HospitalDashboard'), 'HospitalDashboard'),
  rera: screen(() => import('../modules/rera/components/ReraDashboard'), 'ReraDashboard'),
  contractor: screen(() => import('../modules/contractor/ContractorApp'), 'default'),
  ration: screen(() => import('../modules/ration/components/RationDashboard'), 'RationDashboard'),
  grievance: screen(() => import('../modules/grievance/components/CpgramsDashboard'), 'CpgramsDashboard'),
  courts: screen(() => import('../modules/courts/pages/CourtsDirectoryPage'), 'CourtsDirectoryPage'),
  rti: screen(() => import('../modules/rti/pages/RtiDirectoryPage'), 'RtiDirectoryPage'),
  mplads: screen(() => import('../modules/mplads/pages/MpladsDirectoryPage'), 'MpladsDirectoryPage'),
  nagar: screen(() => import('../modules/nagar/pages/NagarDirectoryPage'), 'NagarDirectoryPage'),
  pollution: screen(() => import('../modules/pollution/pages/PollutionDirectoryPage'), 'PollutionDirectoryPage'),
  monitoring: screen(() => import('../modules/monitoring/pages/MonitoringDashboardPage'), 'MonitoringDashboardPage'),
  andhbhakt: screen(() => import('../modules/andhbhakt/components/AndhbhaktDash'), 'AndhbhaktDash'),
  utility: screen(() => import('../modules/utility/components/UtilityDashboard'), 'UtilityDashboard'),
  land: screen(() => import('../modules/land/components/LandDashboard'), 'LandDashboard'),
  budget: screen(() => import('../modules/budget/components/BudgetDashboard'), 'BudgetDashboard'),
  election: screen(() => import('../modules/election/components/ElectionDashboard'), 'ElectionDashboard'),
  booth: screen(() => import('../modules/booth/pages/BoothDirectoryPage'), 'BoothDirectoryPage'),
};

const SchoolModulePage = screen(() => import('./SchoolModulePage'), 'SchoolModulePage');

function ScreenLoading() {
  return (
    <div className="stack" aria-busy="true">
      <span className="skeleton" style={{ height: 72 }} />
      <span className="skeleton" style={{ height: 96 }} />
      <span className="skeleton" style={{ height: 240 }} />
    </div>
  );
}

export function ModulePage() {
  const { moduleId = '' } = useParams<{ moduleId: string }>();
  const [params] = useSearchParams();
  const id = canonicalModuleId(moduleId);

  if (id === 'school') {
    const schoolId = params.get('id') || params.get('schoolId');
    if (!schoolId) {
      const pin = params.get('pin');
      return <Navigate to={pin ? `/schools?pin=${pin}` : '/schools'} replace />;
    }
    return (
      <div className="page page-wide">
        <Suspense fallback={<ScreenLoading />}>
          <SchoolModulePage />
        </Suspense>
      </div>
    );
  }

  const Screen = SCREENS[id];
  if (!Screen) return <NotFoundPage />;
  if (id !== moduleId) {
    const qs = params.toString();
    return <Navigate to={`/module/${id}${qs ? `?${qs}` : ''}`} replace />;
  }

  return (
    <ModuleFrame moduleId={id}>
      <Suspense fallback={<ScreenLoading />}>
        <Screen />
      </Suspense>
    </ModuleFrame>
  );
}

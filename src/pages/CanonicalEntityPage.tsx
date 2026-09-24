import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { SchoolProfilePage } from './schools/SchoolProfilePage';
import { ProjectDetailPage } from '../modules/infra/pages/ProjectDetailPage';
import { ReraProjectDetailPage } from '../modules/rera/pages/ReraProjectDetailPage';
import { RepresentativeProfilePage } from '../modules/mplads/pages/RepresentativeProfilePage';
import { StationDetailPage } from '../modules/pollution/pages/StationDetailPage';
import { WardDetailPage } from '../modules/nagar/pages/WardDetailPage';

export function CanonicalEntityPage() {
  const { type, id } = useParams<{ type: string; id: string }>();

  if (!type || !id) {
    return <Navigate to="/" replace />;
  }

  const normalizedType = type.toLowerCase().trim();

  switch (normalizedType) {
    case 'school':
      return <SchoolProfilePage />;
    case 'project':
    case 'infra':
    case 'work':
      return <ProjectDetailPage />;
    case 'rera':
      return <ReraProjectDetailPage />;
    case 'person':
    case 'representative':
    case 'mp':
    case 'mla':
      return <RepresentativeProfilePage />;
    case 'pollution':
    case 'station':
      return <StationDetailPage />;
    case 'ward':
    case 'nagar':
      return <WardDetailPage />;
    default:
      return <Navigate to={`/search?q=${encodeURIComponent(id)}`} replace />;
  }
}

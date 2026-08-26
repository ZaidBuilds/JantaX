import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { SchoolProfile } from '../../components/school/SchoolProfile';

export function SchoolProfilePage() {
  const params = useParams();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const schoolId = params.id || segments[segments.length - 1];
  return <SchoolProfile schoolId={schoolId} />;
}

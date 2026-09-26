import { useParams } from 'react-router-dom';
import { SchoolProfile } from '../../components/school/SchoolProfile';
import { Breadcrumbs } from '../../ui';

export function SchoolProfilePage() {
  const { id = '' } = useParams<{ id: string; tab?: string }>();
  return (
    <div className="page page-wide">
      <SchoolProfile schoolId={id} />
    </div>
  );
}

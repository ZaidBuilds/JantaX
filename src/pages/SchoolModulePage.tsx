import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SchoolDashboard, SchoolDetail } from '../modules/school';

export function SchoolModulePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const schoolIdFromUrl = searchParams.get('id') || searchParams.get('schoolId');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(schoolIdFromUrl);

  useEffect(() => {
    setSelectedSchoolId(schoolIdFromUrl);
  }, [schoolIdFromUrl]);

  const handleSelectSchool = (id: string | null) => {
    setSelectedSchoolId(id);
    if (id) {
      setSearchParams({ id });
    } else {
      searchParams.delete('id');
      searchParams.delete('schoolId');
      setSearchParams(searchParams);
    }
  };

  if (selectedSchoolId) {
    return (
      <SchoolDetail
        schoolId={selectedSchoolId}
        onBack={() => handleSelectSchool(null)}
      />
    );
  }

  return (
    <SchoolDashboard
      onSelectSchool={(id) => handleSelectSchool(id)}
    />
  );
}

import { ShieldCheck, EyeOff, Clock } from 'lucide-react';
import { ReportForm } from '../components/ReportForm';
import { PageHeader } from '../../../ui';

export function CitizenReportingPage() {
  return (
    <div className="page page-narrow">
      <PageHeader
        crumbs={[{ label: 'Citizen reports', to: '/reports' }, { label: 'Report an issue' }]}
        title="Report an issue"
        lede="Tell us what you found on the ground, add a photo, and we will route it to the responsible office once it is reviewed."
      />
      <div className="grid-3" style={{ marginBottom: 'var(--s-6)' }}>
        <div className="callout">
          <EyeOff size={16} aria-hidden="true" />
          <span>Anonymous by default. Photo location data is stripped before storage.</span>
        </div>
        <div className="callout">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>A moderator checks every report before it goes public.</span>
        </div>
        <div className="callout">
          <Clock size={16} aria-hidden="true" />
          <span>You get a tracking link and a ready grievance draft.</span>
        </div>
      </div>
      <ReportForm />
    </div>
  );
}

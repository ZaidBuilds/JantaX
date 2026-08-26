import type { CitizenReport } from '../types/citizenReport';
import type { OfficialTrackingRecord } from '../types/officialAction';

export const MOCK_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'rep-001',
    title: 'Severe Asphalt Cavity & Pothole Cluster on Barapullah Link Road',
    category: 'Road',
    description: 'Deep road cave-in and asphalt erosion observed 50 meters before Mayur Vihar phase 1 exit ramp. Poses high risk to two-wheeler riders during rain.',
    location: {
      pinCode: '110001',
      landmark: 'Mayur Vihar Phase 1 Flyover Exit Ramp',
      district: 'New Delhi',
      state: 'Delhi',
      lat: 28.5895,
      lng: 77.2518
    },
    isAnonymous: true,
    evidence: [
      {
        id: 'ev-001-1',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        fileName: 'pothole_mayur_vihar.jpg',
        fileSize: '2.1 MB',
        uploadedAt: '2026-08-22T09:30:00Z',
        moderationStatus: 'Approved'
      }
    ],
    moderationState: 'Approved & Published',
    spamScore: 2,
    abuseCount: 0,
    createdAt: '2026-08-22T09:32:00Z',
    upvotes: 24
  },
  {
    id: 'rep-002',
    title: 'Primary Health Centre (PHC) Closed During Official OPD Hours',
    category: 'Healthcare',
    description: 'PHC facility found locked at 11:15 AM on a Monday. Patients waiting outside without medical officer or paramedic present.',
    location: {
      pinCode: '250401',
      landmark: 'Niloha Primary Health Centre, Mawana Tehsil',
      district: 'Meerut',
      state: 'Uttar Pradesh',
      lat: 29.1024,
      lng: 77.9231
    },
    isAnonymous: false,
    reporterName: 'Suresh Kumar',
    reporterContact: 'suresh.k@example.com',
    evidence: [
      {
        id: 'ev-002-1',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
        fileName: 'phc_locked_gate.jpg',
        fileSize: '1.8 MB',
        uploadedAt: '2026-08-20T11:20:00Z',
        moderationStatus: 'Approved'
      }
    ],
    moderationState: 'Approved & Published',
    spamScore: 0,
    abuseCount: 0,
    createdAt: '2026-08-20T11:25:00Z',
    upvotes: 38
  },
  {
    id: 'rep-003',
    title: 'Drinking Water Feeder Pipeline Leakage in School Premises',
    category: 'Water',
    description: 'Submersible water pump line burst leaking continuously into Primary School playground near toilet block.',
    location: {
      pinCode: '560087',
      landmark: 'Govt Higher Primary School Varthur Road',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      lat: 12.9984,
      lng: 77.6953
    },
    isAnonymous: true,
    evidence: [
      {
        id: 'ev-003-1',
        mediaType: 'image',
        url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
        fileName: 'water_pipe_leak.jpg',
        fileSize: '3.0 MB',
        uploadedAt: '2026-08-18T14:10:00Z',
        moderationStatus: 'Approved'
      }
    ],
    moderationState: 'Approved & Published',
    spamScore: 1,
    abuseCount: 0,
    createdAt: '2026-08-18T14:15:00Z',
    upvotes: 15
  }
];

export const MOCK_OFFICIAL_TRACKING: Record<string, OfficialTrackingRecord> = {
  'rep-001': {
    reportId: 'rep-001',
    official_system: 'CPGRAMS (Central PG Portal)',
    reference_number: 'DARPG/E/2024/001928',
    submission_time: '2026-08-22 10:15 IST',
    status: 'Under Process',
    isDirectApiSubmission: false,
    responses: [
      {
        id: 'resp-001-1',
        responseDate: '2026-08-23 11:00 IST',
        officerName: 'Shri R.K. Sharma',
        officerDesignation: 'Executive Engineer, PWD Zone 2 Delhi',
        department: 'Public Works Department, GNCTD',
        responseText: 'Grievance assigned to Maintenance Division 4. Site inspection team dispatched to inspect asphalt cavity at Mayur Vihar ramp.',
        statusChangeTo: 'Under Process'
      }
    ],
    appeals: [],
    resolutionVerification: {
      verificationStatus: 'Verification Pending',
      groundCheckScore: 50,
      citizenFeedbackNote: 'Inspection team marked location with safety cones. Permanent bitumen patch work scheduled for night hours.'
    }
  },
  'rep-002': {
    reportId: 'rep-002',
    official_system: 'UP Jan Sunwai (IPGRS)',
    reference_number: 'UP-JANSUNWAI-2024-88412',
    submission_time: '2026-08-20 12:00 IST',
    status: 'Disposed / Resolved',
    isDirectApiSubmission: true,
    responses: [
      {
        id: 'resp-002-1',
        responseDate: '2026-08-21 16:30 IST',
        officerName: 'Dr. Akhilesh Mohan',
        officerDesignation: 'Chief Medical Officer (CMO) Meerut',
        department: 'Department of Health & Family Welfare UP',
        responseText: 'Show-cause notice issued to Medical Officer in-charge. PHC OPD timings strictly enforced with biometric attendance.',
        statusChangeTo: 'Disposed / Resolved',
        sourcePdfUrl: 'https://jansunwai.up.nic.in/disposal/UP-88412.pdf'
      }
    ],
    appeals: [],
    resolutionVerification: {
      verificationStatus: 'True Resolution Verified',
      groundCheckScore: 92,
      lastVerifiedDate: '2026-08-23',
      citizenFeedbackNote: 'Verified by local Gram Panchayat. PHC open on time with doctor present.'
    }
  }
};

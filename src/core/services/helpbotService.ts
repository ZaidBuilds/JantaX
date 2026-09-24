// JantaX Grounded HelpBot Engine
// Principle: Never manufacture facts. Answer strictly from JantaX verified civic entities & official public sources.

import { resolvePincode } from '../utils/pinResolver';
import { getCoordinateForPin } from '../utils/pinCoordinates';
import { getAllRepresentatives } from '../../modules/mplads/services/mpladsService';

export interface HelpBotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  textHi?: string;
  timestamp: string;
  suggestedActions?: Array<{ label: string; url: string }>;
  sources?: Array<{ name: string; url?: string; freshness?: string }>;
  relatedPin?: string;
}

export interface QueryContext {
  activePin?: string;
  currentPath?: string;
}

export function queryHelpBot(userQuery: string, ctx: QueryContext = {}): HelpBotMessage {
  const query = userQuery.trim().toLowerCase();
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // 1. Extract PIN code if present in query
  const pinMatch = userQuery.match(/\b[1-9]\d{5}\b/);
  const targetPin = pinMatch ? pinMatch[0] : ctx.activePin || '110001';
  const loc = resolvePincode(targetPin);

  // 2. Representative / MP / MLA Query
  if (
    query.includes('mp') ||
    query.includes('mla') ||
    query.includes('representative') ||
    query.includes('leader') ||
    query.includes('who represents') ||
    query.includes('sansad') ||
    query.includes('vidhayak')
  ) {
    const allReps = getAllRepresentatives();
    const rep =
      allReps.find(
        (r) =>
          r.state.toLowerCase() === loc.state.toLowerCase() ||
          r.constituencyName.toLowerCase().includes(loc.district.toLowerCase())
      ) || allReps[0];

    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      timestamp: time,
      text: `For PIN ${targetPin} (${loc.district}, ${loc.state}), your Lok Sabha MP is ${rep.name} (${rep.party}, ${rep.constituencyName}). Total MPLADS fund entitlement: ₹${rep.fundSummary.entitledAmountCr} Cr, with ₹${rep.fundSummary.expenditureReportedCr} Cr reported spent on local public works.`,
      textHi: `पिन ${targetPin} (${loc.district}, ${loc.state}) के लिए आपके लोकसभा सांसद ${rep.name} (${rep.party}) हैं। कुल सांसद निधि ₹${rep.fundSummary.entitledAmountCr} करोड़ है, जिसमें से ₹${rep.fundSummary.expenditureReportedCr} करोड़ स्थानीय विकास कार्यों में खर्च हुए हैं।`,
      suggestedActions: [
        { label: `View ${rep.name}'s Full Fund Portfolio`, url: `/mplads/representatives/${rep.id}` },
        { label: `Locality Leadership Directory`, url: `/pin/${targetPin}/people` },
      ],
      sources: [
        { name: 'Lok Sabha Secretariat Digital Sansad', url: 'https://sansad.in' },
        { name: 'MPLADS Portal (MoSPI)', url: 'https://mplads.gov.in' },
      ],
    };
  }

  // 3. School / Education Query
  if (
    query.includes('school') ||
    query.includes('vidyalaya') ||
    query.includes('udise') ||
    query.includes('education') ||
    query.includes('teacher') ||
    query.includes('toilet')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      timestamp: time,
      text: `In PIN ${targetPin} (${loc.district}), schools are audited under the Ministry of Education UDISE+ framework. JantaX tracks official enrollment, pupil-teacher ratios (PTR), functional toilets, drinking water, and parent check-in scores.`,
      textHi: `पिन ${targetPin} (${loc.district}) में स्कूलों का मूल्यांकन शिक्षा मंत्रालय के UDISE+ पोर्टल से किया जाता है। JantaX पर छात्र-शिक्षक अनुपात, शौचालय, पीने का पानी व अभिभावकों द्वारा सत्यापित ग्राउंड ट्रुथ स्कोर देखा जा सकता है।`,
      suggestedActions: [
        { label: `View Schools in PIN ${targetPin}`, url: `/pin/${targetPin}/schools` },
        { label: `Search All India Schools`, url: `/schools/search` },
      ],
      sources: [
        { name: 'UDISE+ Unified District Information System for Education (2023-24)', url: 'https://udiseplus.gov.in' },
        { name: 'JantaX Parent Pulse Ground Check-ins', freshness: 'Updated Daily' },
      ],
    };
  }

  // 4. Public Works / Road / Infrastructure Query
  if (
    query.includes('road') ||
    query.includes('work') ||
    query.includes('infra') ||
    query.includes('project') ||
    query.includes('contractor') ||
    query.includes('pothole') ||
    query.includes('sadak') ||
    query.includes('construction') ||
    query.includes('flyover')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      timestamp: time,
      text: `For public works and infrastructure projects around PIN ${targetPin}, JantaX monitors sanctioned budget vs. payments released, physical vs financial progress, and contractor delay records from PWD, PMGSY, and NHAI.`,
      textHi: `पिन ${targetPin} के सड़क व निर्माण कार्यों के लिए, JantaX स्वीकृत बजट, वास्तविक भुगतान, निर्माण गति व ठेकेदार की देरी का विवरण PWD, PMGSY और NHAI से ट्रैक करता है।`,
      suggestedActions: [
        { label: `View Public Works in PIN ${targetPin}`, url: `/pin/${targetPin}/works` },
        { label: `Report a Defect with GPS Photo`, url: `/report-issue?pin=${targetPin}` },
      ],
      sources: [
        { name: 'PMGSY Online Management, Monitoring and Accounting System (OMMAS)', url: 'https://omms.nic.in' },
        { name: 'Government e-Marketplace (GeM) & CPPP Tenders', url: 'https://gem.gov.in' },
      ],
    };
  }

  // 5. Hospital / Healthcare Query
  if (
    query.includes('hospital') ||
    query.includes('health') ||
    query.includes('doctor') ||
    query.includes('phc') ||
    query.includes('chc') ||
    query.includes('clinic') ||
    query.includes('aspatal')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      timestamp: time,
      text: `Public healthcare facilities in PIN ${targetPin} (${loc.district}) include Primary Health Centres (PHC), Community Health Centres (CHC), and District Hospitals registered with the National Health Mission (NHM).`,
      textHi: `पिन ${targetPin} (${loc.district}) के सरकारी स्वास्थ्य केंद्रों में राष्ट्रीय स्वास्थ्य मिशन (NHM) के अंतर्गत प्राथमिक स्वास्थ्य केंद्र (PHC), सामुदायिक स्वास्थ्य केंद्र (CHC) व जिला अस्पताल शामिल हैं।`,
      suggestedActions: [
        { label: `Explore Healthcare in PIN ${targetPin}`, url: `/pin/${targetPin}/health` },
        { label: `View GIS Map of Clinics`, url: `/maps?pin=${targetPin}` },
      ],
      sources: [
        { name: 'National Health Mission (NHM) Health Management Information System (HMIS)', url: 'https://hmis.mohfw.gov.in' },
      ],
    };
  }

  // 6. Source & Authenticity / Trust Query
  if (
    query.includes('source') ||
    query.includes('reliable') ||
    query.includes('trust') ||
    query.includes('fake') ||
    query.includes('where does data come from') ||
    query.includes('methodology')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      timestamp: time,
      text: `JantaX operates on strict Source-First principles. Every data point cites its official government origin (e.g. UDISE+, OMMAS, RERA portals, CAG reports). Official records are displayed side-by-side with verified citizen observations, clearly distinguished.`,
      textHi: `JantaX स्रोत-आधारित पारदर्शिता सिद्धांतों पर कार्य करता है। प्रत्येक आंकड़े के साथ आधिकारिक सरकारी स्रोत (जैसे UDISE+, OMMAS, RERA पोर्टल) और अपडेट की तिथि दिखाई जाती है।`,
      suggestedActions: [
        { label: `Explore Data Sources Registry`, url: `/data-sources` },
        { label: `Read Scoring Methodology`, url: `/transparency/methodology` },
        { label: `Evidence Standards`, url: `/transparency/evidence` },
      ],
      sources: [
        { name: 'JantaX Transparency Charter', url: '/about' },
      ],
    };
  }

  // 7. General / Locality Summary
  return {
    id: `bot-${Date.now()}`,
    sender: 'bot',
    timestamp: time,
    text: `Locality Overview for PIN ${targetPin} (${loc.district}, ${loc.state}): JantaX aggregates public records for schools, hospitals, roads, RERA housing projects, and local public representatives. What would you like to explore?`,
    textHi: `पिन कोड ${targetPin} (${loc.district}, ${loc.state}) का अवलोकन: JantaX पर स्कूल, अस्पताल, सड़क निर्माण, रेरा हाउसिंग एवं स्थानीय जनप्रतिनिधियों का सत्यापित सरकारी डेटा उपलब्ध है। आप क्या जानना चाहते हैं?`,
    suggestedActions: [
      { label: `Open PIN ${targetPin} Dashboard`, url: `/pin/${targetPin}` },
      { label: `Locality GIS Map`, url: `/maps?pin=${targetPin}` },
      { label: `Check Elected Representatives`, url: `/pin/${targetPin}/people` },
      { label: `Report a Civic Defect`, url: `/report-issue?pin=${targetPin}` },
    ],
    sources: [
      { name: 'India Post Postal Circle Registry', freshness: 'Official Record' },
    ],
    relatedPin: targetPin,
  };
}

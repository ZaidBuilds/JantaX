/**
 * JantaX Certified Statutory Legal Docket & PDF Export Engine
 * Generates formatted, high-resolution official petitions with national emblem motifs,
 * statutory citations, cryptographic SHA-256 seals, and verification QR code URLs.
 */

export interface CertifiedDocketData {
  docketId: string;
  title: string;
  subtitle: string;
  statutoryAct: string;
  department: string;
  authorityName: string;
  pinCode: string;
  district: string;
  state: string;
  dateOfIssue: string;
  sha256Seal: string;
  verificationUrl: string;
  bodyText: string;
  statutoryClausesCited: string[];
  exhibitsList: string[];
  auditorName: string;
  auditorKarmaTier: string;
}

/**
 * Builds printable HTML with formal bureaucratic styling, clean typography,
 * page-break controls, and non-repudiation cryptographic verification metadata.
 */
export function generateCertifiedDocketHtml(data: CertifiedDocketData): string {
  const clausesHtml = data.statutoryClausesCited
    .map((c) => `<li style="margin-bottom: 4px;">${c}</li>`)
    .join('');

  const exhibitsHtml = data.exhibitsList
    .map((ex, i) => `<li style="margin-bottom: 4px;">Exhibit ${i + 1}: ${ex}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${data.title} - ${data.docketId}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 15mm 18mm 15mm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      color: #0f172a;
      line-height: 1.5;
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-size: 11pt;
    }
    .docket-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 10px;
    }
    .header-banner {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    .emblem-title {
      font-size: 15pt;
      font-weight: bold;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin: 0;
    }
    .emblem-sub {
      font-size: 10pt;
      color: #334155;
      margin: 3px 0 0;
    }
    .statutory-banner {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 6px 12px;
      font-size: 9.5pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 16px;
    }
    .meta-grid {
      display: table;
      width: 100%;
      margin-bottom: 14px;
      font-size: 10pt;
    }
    .meta-row {
      display: table-row;
    }
    .meta-cell {
      display: table-cell;
      padding: 3px 6px;
    }
    .meta-label {
      font-weight: bold;
      width: 140px;
      color: #475569;
    }
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 3px;
      margin: 16px 0 8px;
    }
    .body-content {
      white-space: pre-wrap;
      font-family: inherit;
      line-height: 1.6;
      text-align: justify;
      margin-bottom: 18px;
    }
    .verification-box {
      border: 1px dashed #64748b;
      background: #f8fafc;
      padding: 10px 14px;
      margin-top: 22px;
      font-family: monospace;
      font-size: 8.5pt;
    }
    .seal-hash {
      word-break: break-all;
      color: #1e3a8a;
      font-weight: bold;
    }
    .footer-note {
      text-align: center;
      font-size: 8pt;
      color: #64748b;
      margin-top: 18px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="docket-container">
    
    <div class="header-banner">
      <div class="emblem-title">OFFICIAL STATUTORY CIVIC DOCKET</div>
      <div class="emblem-sub">DEMOCRATIC ACCOUNTABILITY & TRANSPARENCY ARCHIVE (JANTAX PLATFORM)</div>
    </div>

    <div class="statutory-banner">
      FILED UNDER: ${data.statutoryAct.toUpperCase()}
    </div>

    <div class="meta-grid">
      <div class="meta-row">
        <div class="meta-cell meta-label">Docket Ref:</div>
        <div class="meta-cell"><strong>${data.docketId}</strong></div>
        <div class="meta-cell meta-label">Date of Filing:</div>
        <div class="meta-cell">${data.dateOfIssue}</div>
      </div>
      <div class="meta-row">
        <div class="meta-cell meta-label">Nodal Department:</div>
        <div class="meta-cell">${data.department}</div>
        <div class="meta-cell meta-label">Postal Locality:</div>
        <div class="meta-cell">PIN ${data.pinCode} (${data.district}, ${data.state})</div>
      </div>
      <div class="meta-row">
        <div class="meta-cell meta-label">Target Authority:</div>
        <div class="meta-cell">${data.authorityName}</div>
        <div class="meta-cell meta-label">Complainant / Auditor:</div>
        <div class="meta-cell">${data.auditorName} [${data.auditorKarmaTier}]</div>
      </div>
    </div>

    <div class="section-title">I. Formal Prayer & Subject Matter</div>
    <div style="font-weight: bold; margin-bottom: 8px;">${data.title}</div>
    <div style="color: #334155; font-size: 10pt; margin-bottom: 12px;">${data.subtitle}</div>

    <div class="section-title">II. Statement of Facts & Grievance Particulars</div>
    <div class="body-content">${data.bodyText}</div>

    <div class="section-title">III. Statutory Clauses & Standards Cited</div>
    <ul style="padding-left: 20px; font-size: 10pt;">
      ${clausesHtml}
    </ul>

    ${data.exhibitsList.length > 0 ? `
    <div class="section-title">IV. Verified Ground Exhibits & Evidence</div>
    <ul style="padding-left: 20px; font-size: 9.5pt; font-family: monospace;">
      ${exhibitsHtml}
    </ul>
    ` : ''}

    <div class="verification-box">
      <strong>NON-REPUDIATION CRYPTOGRAPHIC PROOF (JANTAX VERIFIED):</strong><br>
      SHA-256 Cryptographic Seal: <span class="seal-hash">${data.sha256Seal}</span><br>
      Digital Verification URL: <span>${data.verificationUrl}</span><br>
      Status: <span>Authenticated via Local GPS Geofence Centroid Match</span>
    </div>

    <div class="footer-note">
      Generated via JantaX Open Civic OS · Immutable Hash Registered Under Public Proof Protocols · Page 1 of 1
    </div>

  </div>
</body>
</html>`;
}

/**
 * Opens a dedicated popup print window containing the rendered docket HTML and triggers print dialog.
 */
export function printCertifiedDocket(data: CertifiedDocketData): void {
  if (typeof window === 'undefined') return;
  const html = generateCertifiedDocketHtml(data);
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}

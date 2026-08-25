# Module Spec: M13 — Pollution Notice Overlay

## 1. Backend & Database Schema
Validates real-time CPCB AQI parameters and maps SPCB closure orders.
```prisma
model RegionalAqiStation {
  id              String   @id @default(uuid())
  pincode         String   @db.VarChar(6)
  stationName     String
  aqiValue        Int
  dominantPollutant String
  lastUpdated     DateTime @updatedAt
  
  pcbNotices      SpcbNotice[]
}

model SpcbNotice {
  id              String   @id @default(uuid())
  stationId       String
  industryName    String
  noticeType      String   // closure-order, show-cause, penalty
  violationReason String   @db.Text
  issueDate       String   // YYYY-MM-DD

  station         RegionalAqiStation @relation(fields: [stationId], references: [id])
}
```

## 2. Security & Privacy Schema
- **Legal Compliance:** Strict citations to SPCB public circular/notice PDF files. No speculative accusations against industries.
- **Anonymity:** Users viewing notices are anonymous. No cookies or tracker scripts are loaded.

## 3. App Flow
1. **Notice search:** Enter PIN to load local regional AQI and active SPCB notices.
2. **AQI Indicator:** Renders AQI status bar colored according to CPCB guidelines (Green/Yellow/Red/Purple).
3. **Active notices:** Lists show-cause or closure orders served to polluters in the area.
4. **WhatsApp forward:** Share a SPCB closure notice card.

## 4. UI/UX Design & Components
- **Color Palette:** Slate gray and neon alerts (`#ef4444` for hazardous AQI/closure).
- **Icons:** Lucide `Wind`, `AlertCircle`, `FileMinus`.
- **Components:** `AqiBanner`, `NoticeCard`, `ShareNoticeWidget`.

## 5. SEO Specifications
- **Title Tag:** Local SPCB Pollution Notice & AQI Overlay Map | प्रदूषण नक्शा
- **Meta Description:** Check real-time air quality index and active pollution control board industry closure notices for your area.

# Module Spec: M12 — Land Mutation Tracker

## 1. Backend & Database Schema
Audits mutation delays and survey-number progress reports across tehsils.
```prisma
model TehsilOffice {
  id                String   @id @default(uuid())
  pincode           String   @db.VarChar(6)
  tehsilName        String
  district          String
  promisedSlaDays   Int      @default(45)
  
  mutationRecords   LandMutationRecord[]
}

model LandMutationRecord {
  id              String   @id @default(uuid())
  tehsilId        String
  surveyNumber    String   // Masked for privacy
  daysTaken       Int
  status          String   // completed, pending, rejected
  appliedDate     String   // YYYY-MM-DD

  tehsil          TehsilOffice @relation(fields: [tehsilId], references: [id])
}
```

## 2. Security & Privacy Schema
- **Land Owner Privacy:** Owners names, transaction values, and specific parcel details are stripped. Survey numbers are partially masked (e.g. `124/**`).
- **Scraping Safeguards:** Uses proxy rotations and parses public tehsil e-District statistics without direct scraping of CAPTCHA-protected land record registries.

## 3. App Flow
1. **Tehsil Lookup:** Citizen inputs PIN to load tehsil processing stats.
2. **Delay Index:** Renders average mutation processing time (e.g., 145 days actual vs 45 days SLA limit).
3. **Caseload Backlog:** Displays the count of mutation applications currently pending over 30 days.
4. **WhatsApp forward:** Share a Tehsil Delay Alert card.

## 4. UI/UX Design & Components
- **Color Palette:** Lime Green (`#a3e635`) and Dark Charcoal.
- **Icons:** Lucide `Map`, `Calendar`, `AlertTriangle`.
- **Components:** `TehsilStatsSummary`, `BacklogCountWidget`, `MutationTimelineChart`.

## 5. SEO Specifications
- **Title Tag:** Tehsil Land Mutation delay watch | ज़मीन म्यूटेशन
- **Meta Description:** Check mutation delay averages and application backlogs across revenue tehsil offices.

# Module Spec: M8 — RERA Reality Check

## 1. Backend & Database Schema
Aggregates and tracks real estate developer timelines across state portals.
```prisma
model ReraProject {
  id              String   @id @default(uuid())
  pincode         String   @db.VarChar(6)
  projectName     String
  builderName     String
  registrationNo  String   @unique
  promisedDate    DateTime
  revisedDate     DateTime?
  actualProgress  Float    // percentage complete
  delayedMonths   Int      @default(0)
  status          String   // delayed, ongoing, completed
  lastUpdated     DateTime @updatedAt
}
```

## 2. Security & Privacy Schema
- **No Buyer Profiling:** No buyer names, unit numbers, or financing details are recorded. Only project-level deadlines are stored.
- **RERA Certified:** All fields correspond directly to public filing numbers in UP-RERA, MahaRERA, etc.

## 3. App Flow
1. **Developer Lookup:** User searches by project name or registration number.
2. **Project Timeline:** Renders project milestone progression (sanctioned date vs current status).
3. **Delay Index:** Renders total months delayed and average delays across that builder's other projects.
4. **WhatsApp Shame Card:** Generate a card stating: "[Builder Name] delayed [Project] by 26 months. e-filing reference: [ID]."

## 4. UI/UX Design & Components
- **Color Palette:** Deep Cyan (`#06b6d4`) and Warning Yellow.
- **Icons:** Lucide `Home`, `Clock`, `Link`.
- **Components:** `ProjectTimelineVisual`, `BuilderOutlayScore`, `ShareShameCard`.

## 5. SEO Specifications
- **Title Tag:** RERA Project Delay Tracker & Builder Scorecard
- **Meta Description:** Check RERA-registered construction delay statistics and builder delivery metrics for your area.

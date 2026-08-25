# Module Spec: M2 — State-level Andhbhakt (28 CMs)

## 1. Backend & Database Schema
Tracks CM claims from PR machines against State CAG auditor findings.
```prisma
model StateCmClaim {
  id              String   @id @default(uuid())
  stateCode       String   @db.VarChar(2) // e.g. UP, BR, MH
  category        String   // school, hospital, road, ration, water, police
  claimTitleHindi String
  claimTitleEn    String
  claimSource     String   // Press Release, Twitter, PIB
  claimDetails    String   @db.Text
  
  // Ground truth side-by-side
  realityTitleHindi String
  realityTitleEn    String
  realityDetails    String   @db.Text
  cagReportRef      String   // e.g. CAG Report No. 4 of 2024
  realitySeverity   String   // critical, warning, clean
  lastUpdated       DateTime @updatedAt
}
```

## 2. Security & Privacy Schema
- **Legal Compliance:** Strict citations for every single counter-claim. The app never makes standalone allegations; it simply lists CAG-published audit finding paragraphs.
- **Data Protection:** No user data collection required for this read-only module.

## 3. App Flow
1. **Selection Page:** User selects one of the 28 State CMs from a dropdown or map.
2. **Category Filter:** User selects a category (e.g., 🏥 Health or 🏫 School).
3. **Double-Card Layout:** Renders CM publicity claims on the left side vs CAG findings/reality checks on the right side.
4. **WhatsApp Forward:** User clicks the share button to copy a high-contrast card comparison formatted for messaging.

## 4. UI/UX Design & Components
- **Color Palette:** Saffron/Crimson for state claims alerts (`#ef4444` for gaps, `#f59e0b` for warnings).
- **Icons:** Lucide icons for each category.
- **Components:** `StateSelector`, `ClaimRealityCard`, `WhatsAppShareButton`.

## 5. SEO Specifications
- **Title Tag:** State CM Accountability Tracker — claims vs audits
- **Meta Description:** Compare Chief Minister publicity statements with official CAG audit findings.

# Module Spec: M10 — City Municipal Scorecard & Compliance

## 1. Backend & Database Schema
Validates municipal services delivery (garbage, water, drainage) and tracks small business regulatory rules.
```prisma
model MunicipalWard {
  id                String   @id @default(uuid())
  pincode           String   @db.VarChar(6)
  wardNo            String
  garbageClaimedSla String
  waterClaimedSla   String
  drainageClaimedSla String
  
  citizenReviews    WardReview[]
}

model WardReview {
  id            String   @id @default(uuid())
  wardId        String
  serviceCategory String // water, garbage, drainage
  actualRating  Int      // 1 to 5 stars
  feedbackText  String?
  reportedAt    DateTime @default(now())

  ward          MunicipalWard @relation(fields: [wardId], references: [id])
}

model BusinessComplianceRule {
  id            String   @id @default(uuid())
  businessType  String   // eatery, grocery, pharmacy
  licenseNameEn String
  licenseNameHi String
  requiredFrom  String   // e.g. Municipal Corp, FSSAI, Labour Dept
  penaltyAmount Float
}
```

## 2. Security & Privacy Schema
- **No Shop Profiling:** Compliance checker is a reference checklist; it does not store specific merchant names or audit logs to prevent regulatory harassment.
- **Aggregated Reviews:** Ward ratings are averaged weekly. User IP addresses are ignored for analytics tracking.

## 3. App Flow
1. **Ward Finder:** Citizen enters PIN to load municipal scorecard.
2. **Review Rating:** Citizens rate municipal garbage and drainage services.
3. **MSME Compliance Guide:** Kirana/restaurant owners select business type and see a checklist of required local licenses in Hindi.
4. **WhatsApp forward:** Export the compliance list or ward scoreboard to share with neighbors.

## 4. UI/UX Design & Components
- **Color Palette:** Purple (`#8b5cf6`) and Emerald Green.
- **Icons:** Lucide `Building`, `CheckCircle2`, `Trash2`.
- **Components:** `WardScoreboardPanel`, `MSMEChecklistWidget`, `RatingForm`.

## 5. SEO Specifications
- **Title Tag:** City Municipal Scoreboard & MSME Compliance Checker
- **Meta Description:** Check municipal garbage, water, and drain performance alongside required local licenses for businesses.

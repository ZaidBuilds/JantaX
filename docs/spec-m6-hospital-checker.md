# Module Spec: M6 — Hospital/PHC Checker

## 1. Backend & Database Schema
Compares PHC (Primary Health Center) official parameters against ground-truth feedback.
```prisma
model HealthCenter {
  id              String   @id @default(uuid())
  pincode         String   @db.VarChar(6)
  facilityName    String
  facilityNameHi  String
  facilityType    String   // PHC, CHC, District Hospital
  bedsSanctioned  Int
  doctorsAllotted Int
  
  groundTruthLogs HealthGroundTruthLog[]
}

model HealthGroundTruthLog {
  id              String   @id @default(uuid())
  healthCenterId  String
  reportedStatus  String   // operational, locked, doctor-absent, no-medicines
  imagePath       String?  // Anonymous ground truth photo drops
  reportedAt      DateTime @default(now())

  healthCenter    HealthCenter @relation(fields: [healthCenterId], references: [id])
}
```

## 2. Security & Privacy Schema
- **Photo Privacy:** Uploaded photos are stripped of EXIF metadata (GPS, device info, timestamps) upon upload to protect anonymous whistleblowers.
- **Abuse Prevention:** Rate limiting restricts uploads to 1 photo per user IP/device per hour.

## 3. App Flow
1. **Facility Directory:** User enters PIN to see local health centers.
2. **Comparison Widget:** Renders official NHM registry data alongside current crowdsourced status indicators.
3. **Anonymous Photo Drop:** Citizens can upload a photo of locked gates or empty pharmacies to substantiate ground reality.
4. **WhatsApp Share:** Formats a shareable card comparing official hospital resources with ground truth status.

## 4. UI/UX Design & Components
- **Color Palette:** Neon pink (`#ec4899`) and Dark Navy.
- **Icons:** Lucide `Activity`, `Camera`, `AlertTriangle`.
- **Components:** `FacilityScoreCard`, `PhotoUploadExpander`, `AnonymousFlagWidget`.

## 5. SEO Specifications
- **Title Tag:** Local Hospital & PHC Status Checker | अस्पताल जांच
- **Meta Description:** Check official bed capacities, doctor counts, and citizen-reported operational status of local health clinics.

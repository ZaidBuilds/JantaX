# Module Spec: M7 — School Scorecard

## 1. Backend & Database Schema
Validates UDISE+ school claims against parent-submitted reviews.
```prisma
model SchoolRecord {
  id              String   @id @default(uuid())
  pincode         String   @db.VarChar(6)
  schoolName      String
  schoolNameHi    String
  diseCode        String   @unique
  toiletFunctionalClaimed Boolean
  pupilTeacherRatioClaimed Float
  electricityClaimed      Boolean
  
  parentLogs      SchoolParentLog[]
}

model SchoolParentLog {
  id              String   @id @default(uuid())
  schoolId        String
  toiletStatus    String   // functional, locked, dirty, no-water
  electricityOk   Boolean
  teacherAbsent   Boolean
  reportedAt      DateTime @default(now())

  school          SchoolRecord @relation(fields: [schoolId], references: [id])
}
```

## 2. Security & Privacy Schema
- **No Student Data:** The module holds no student-identifiable profiles or grades.
- **Anonymity:** Parent review logs are aggregated. Single logs are never shown with user handles.

## 3. App Flow
1. **School Lookup:** User inputs PIN or DISE code.
2. **Double Ledger:** Left panel shows UDISE+ official claims (e.g. 100% separate functional girls toilets) vs right panel parent check-in scores.
3. **Submit Report:** Parents submit checkbox logs on basic school amenities.
4. **Export Card:** Create a shareable school scorecard graphic.

## 4. UI/UX Design & Components
- **Color Palette:** Warm Blue (`#3b82f6`) and Warning Red.
- **Icons:** Lucide `GraduationCap`, `Flame`, `CheckSquare`.
- **Components:** `UdiseStatsCard`, `AmenityScoreboard`, `ParentLogForm`.

## 5. SEO Specifications
- **Title Tag:** Government School Scorecard — UDISE+ vs Parents
- **Meta Description:** Check official school toilet, electricity, and teacher metrics side-by-side with local parent audits.

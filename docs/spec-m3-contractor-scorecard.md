# Module Spec: M3 — Municipal Contractor Scorecard

## 1. Backend & Database Schema
Aggregates municipal contractor data, contract values, and citizen delay complaints.
```prisma
model MunicipalContractor {
  id              String   @id @default(uuid())
  contractorName  String
  contractorNameHi String
  registrationNo  String   @unique
  gradeClass      String   // Class A, Class B, Class C
  winCount        Int      @default(0)
  totalValueLakhs Float    @default(0.0)
  
  projects        ContractorProject[]
}

model ContractorProject {
  id              String   @id @default(uuid())
  contractorId    String
  workOrderNo     String   @unique
  workName        String
  workNameHi      String
  sanctionedLakhs Float
  paymentReleased Float
  status          String   // completed, in-progress, stalled, delayed
  delayMonths     Int      @default(0)
  defectReports   Int      @default(0)

  contractor      MunicipalContractor @relation(fields: [contractorId], references: [id])
}
```

## 2. Security & Privacy Schema
- **Defamation Safeguard:** Citizen defect reports count is aggregated numerically. No individual usernames are visible.
- **Official Records:** Links work order numbers to public e-tendering portals.

## 3. App Flow
1. **Search Contractor:** Citizen searches by contractor company name or registers.
2. **Scorecard view:** Renders total contracts won, average project delay, and complaints count.
3. **Ledger Breakdown:** Lists each individual project, contract value, and execution status.
4. **Cross-Reference check:** System checks if the same contractor is registered with delayed works in neighboring wards/districts.

## 4. UI/UX Design & Components
- **Color Palette:** Slate gray and warning amber (`#f59e0b`).
- **Icons:** Lucide `Briefcase`, `ShieldAlert`, `FileText`.
- **Components:** `ContractorSearch`, `ScorecardSummary`, `ProjectLedgerList`.

## 5. SEO Specifications
- **Title Tag:** Municipal Contractor Scorecard — Public Procurement Registry
- **Meta Description:** Check contract records, win history, and delay logs of municipal contractors in your ward.

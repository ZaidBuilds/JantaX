# Module Spec: M9 — 5-Level Governance Spine

## 1. Backend & Database Schema
Coordinates the core relational chain from nationwide PIN down to localized projects and contractors.
```prisma
model SpineRepresentative {
  id           String   @id @default(uuid())
  level        String   // union, state, district, block, village
  name         String
  nameHi       String
  party        String
  constituency String
  pinCodes     String[] // Associated geographic PIN coverages
  
  funds        SpineFund[]
}

model SpineFund {
  id               String   @id @default(uuid())
  representativeId String
  schemeName       String   // e.g. MPLADS, MLALADS, 15th FC
  schemeNameHi     String
  allocatedLakhs   Float
  spentLakhs       Float
  unspentLakhs     Float

  representative   SpineRepresentative @relation(fields: [representativeId], references: [id])
  projects         SpineProject[]
}

model SpineProject {
  id              String   @id @default(uuid())
  fundId          String
  workName        String
  workNameHi      String
  sanctionedCost  Float
  status          String   // completed, ongoing, stalled
  statusHi        String
  contractorName  String
  
  fund            SpineFund @relation(fields: [fundId], references: [id])
}
```

## 2. Security & Privacy Schema
- **Data Integrity:** Only verified eGramSwaraj and PFMS expenditure entries are synced.
- **Access Limits:** API responses are cached to optimize load times and prevent database starvation.

## 3. App Flow
1. **Constituency Select:** Enter a PIN to load resolved location and active representatives.
2. **Chain Traversal:** Click Representative → See Fund Source → Click Fund Source → See Sanctioned Projects → Click Project → Inspect Lead Contractor.
3. **Cross-Referencing alerts:** Checks if the same contractor holds contracts under different PINs and flags stalled works.
4. **Social Sharing:** Citizen shares the localized project claim vs reality dashboard on WhatsApp.

## 4. UI/UX Design & Components
- **Color Palette:** Saffron (`#f59e0b`) and Dark Navy.
- **Icons:** Lucide `Users`, `Layers`, `Hammer`, `AlertCircle`.
- **Components:** `RepresentativeDetailCard`, `SpineCascadeList`, `ContractorCrossrefPanel`.

## 5. SEO Specifications
- **Title Tag:** 5-Level Governance Spine Tracker — MLA, MP & Gram Panchayat
- **Meta Description:** Trace public funds from your representatives down to the physical projects and builders in your village/block.

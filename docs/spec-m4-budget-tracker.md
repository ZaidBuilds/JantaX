# Module Spec: M4 — PIN Budget Tracker

## 1. Backend & Database Schema
Slices state expenditure data down to local administrative levels.
```prisma
model PincodeBudget {
  id              String   @id @default(uuid())
  pincode         String   @unique @db.VarChar(6)
  financialYear   String   // e.g. 2024-2025
  totalRevenueCr  Float    // Estimated tax collected from PIN
  totalAllocatedCr Float   // Total sanctioned funds back to PIN
  
  allocations     BudgetSectorAllocation[]
}

model BudgetSectorAllocation {
  id              String   @id @default(uuid())
  budgetId        String
  sectorNameEn    String   // Infrastructure, Education, Health
  sectorNameHi    String
  allocatedCr     Float
  utilizedCr      Float
  stalledProjects Int      @default(0)

  budget          PincodeBudget @relation(fields: [budgetId], references: [id])
}
```

## 2. Security & Privacy Schema
- **Data Protection:** Financial statistics are public domain aggregate reports. No private company accounts are exposed.

## 3. App Flow
1. **Pincode Entry:** User inputs PIN code.
2. **Tax vs Spend Chart:** Renders a bar comparison showing tax generated from this pin vs money returned to this pin in projects.
3. **Sectoral Breakdown:** Displays progress bars representing funding utilization per sector.
4. **Export Card:** Share a card summary of local tax utilization on WhatsApp.

## 4. UI/UX Design & Components
- **Color Palette:** Emerald green (`#10b981`) and Indigo (`#6366f1`).
- **Icons:** Lucide `TrendingUp`, `PieChart`, `Coins`.
- **Components:** `SectorAllocationBar`, `TaxComparisonChart`, `ShareReportButton`.

## 5. SEO Specifications
- **Title Tag:** Local PIN Budget Tracker — Where does my tax go?
- **Meta Description:** Check estimated local tax contributions and sector-wise budget allocations for your PIN code.

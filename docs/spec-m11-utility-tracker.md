# Module Spec: M11 — Power Cut Tracker (DISCOM Feeder Scorecard)

## 1. Backend & Database Schema
Audits feeder-level power outages and voltage reliability records.
```prisma
model DiscomFeeder {
  id                  String   @id @default(uuid())
  pincode             String   @db.VarChar(6)
  feederName          String
  substationName      String
  promisedSupplyHours Int      @default(24)
  
  outageLogs          FeederOutageLog[]
}

model FeederOutageLog {
  id              String   @id @default(uuid())
  feederId        String
  outageMinutes   Int
  faultType       String   // load-shedding, line-fault, transformer-blast
  faultTypeHi     String
  logDate         String   // YYYY-MM-DD

  feeder          DiscomFeeder @relation(fields: [feederId], references: [id])
}
```

## 2. Security & Privacy Schema
- **No Smart Meter Snooping:** The app only monitors utility feeder substation metrics, never individual residential consumer accounts or meter numbers.
- **Source Integrity:** Daily power logs are scraped/parsed from State Load Despatch Center (SLDC) public dashboards.

## 3. App Flow
1. **Feeder Search:** Enter PIN to load local substation feeder records.
2. **Outage Audit:** Displays daily outage totals (load shedding vs promised hours).
3. **Fluctuation Map:** Displays voltage spike hours reported by area users.
4. **WhatsApp Report:** Export feeder performance as a graphic checklist.

## 4. UI/UX Design & Components
- **Color Palette:** Amber/Yellow (`#fbbf24`) and Charcoal.
- **Icons:** Lucide `Zap`, `Clock`, `Power`.
- **Components:** `OutageSlaWidget`, `FeederTimelineChart`, `ShareFeederCard`.

## 5. SEO Specifications
- **Title Tag:** DISCOM Feeder Power Cut & Reliability Scorecard | बिजली कटौती स्कोरकार्ड
- **Meta Description:** Check power outage hours, substation load shedding logs, and DISCOM performance for your feeder.

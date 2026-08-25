# Module Spec: M1 — Pin-code Accountability OS (Entry Point)

## 1. Backend & Database Schema
The entry point acts as an aggregator of stats from the core modules.
```prisma
model PincodeAggregator {
  pincode      String   @id @db.VarChar(6)
  state        String
  district     String
  region       String   // North, South, East, West, Central
  lastUpdated  DateTime @updatedAt

  // Aggregated Stats Cache (read-only snapshot)
  schoolScore    Float    // UDISE vs Ground check ratio
  healthBeds     Int      // PHC bed counts
  activeWorks    Int      // Pending PFMS projects count
  totalBudget    Float    // Sanctioned lakhs total
}
```

## 2. Security & Privacy Schema
- **Client Anonymity:** PIN code queries are resolved client-side where possible or proxied through a cached API layer. No user IP or search history is logged.
- **RTI Compliance Protection:** All figures displayed are sourced from official publications. No personal citizen info is cached.
- **Rate Limiting:** Requests are throttled using IP bucket token rings to prevent scraping DDoS.

## 3. App Flow
1. **Landing Page:** Citizen lands on `Home.tsx` and sees the search input.
2. **Search Action:** Input validates to 6-digits, triggering `resolvePincode` logic.
3. **OS Expand Dashboard:** Instantly slides open the M1 Governance summary report showing localized representatives and 3 live metrics.
4. **Deep Dive Navigation:** Citizen clicks on any of the live metrics or representatives to jump directly to the target module (Infra, School, Budget) pre-loaded with the active query parameters.

## 4. UI/UX Design & Components
- **Color Palette:** High contrast neon accents (Slate `#0f172a` bg, Emerald `#10b981` primary buttons, Cyan `#06b6d4` indicators).
- **Interactive Element:** Pulse animations (`live-dot`) for live status flags.
- **Components:** `pin-input-wrapper`, `glass-card`, `representatives-panel`, `3-stats-widget`.

## 5. SEO Specifications
- **Title Tag:** JanCheck — Pin code dalo, hisaab lo | जनचेक
- **Meta Description:** government claims vs ground reality next to your PIN code.
- **Semantic Structure:** Proper header hierarchy (`<h1>` for title, `<h2>` for live modules, `<h3>` for active card report).

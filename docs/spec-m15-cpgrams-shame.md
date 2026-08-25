# Module Spec: M15 — CPGRAMS Shame Index

## 1. Backend & Database Schema
Aggregates public DARPG monthly CPGRAMS progress reports into worst-performing rankings.
```prisma
model CpgramsMonthlyRecord {
  id                String   @id @default(uuid())
  recordType        String   // ministry, state
  rank              Int
  name              String
  nameHi            String
  totalGrievances   Int
  resolvedCount     Int
  pendingCount      Int
  avgDisposalDays   Int
  backlogOver30Days Int
  worstCategoryEn   String
  worstCategoryHi   String
  reportMonth       String   // YYYY-MM
  lastUpdated       DateTime @updatedAt
}
```

## 2. Security & Privacy Schema
- **No Personal Grievance Details:** The module holds no individual citizen names, phone numbers, or application descriptions to maintain privacy and security.
- **Aggregate Rankings:** All records represent monthly aggregates released by DARPG.

## 3. App Flow
1. **Landing Page:** User clicks on the CPGRAMS Shame Index card.
2. **Ministry vs State tab:** User switches between worst-performing central ministries and state-level logs.
3. **Rankings list:** Renders worst-performing ministries or states sorted by caseload backlog or resolution speed.
4. **WhatsApp forward:** citizen shares a monthly card detailing the backlog and delay statistics of a ministry/state.

## 4. UI/UX Design & Components
- **Color Palette:** High contrast red (`#ef4444`) and Dark Navy.
- **Icons:** Lucide `TrendingDown`, `Users`, `AlertOctagon`.
- **Components:** `CpgramsRankingList`, `WorstCategoryAlert`, `ShareShameReportButton`.

## 5. SEO Specifications
- **Title Tag:** CPGRAMS Shame Index — Government Grievance Backlog Tracker
- **Meta Description:** Check DARPG CPGRAMS performance reports ranking the worst-performing central ministries and state-level complaint resolution times.

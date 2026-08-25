# Module Spec: M14 — Election Spend Audit & Exam Delay Tracker

## 1. Backend & Database Schema
Validates ECI candidate declared spending against ADR field estimates and tracks exam timeline checkpoints.
```prisma
model CandidateSpendRecord {
  id                String   @id @default(uuid())
  pincode           String   @db.VarChar(6)
  candidateName     String
  party             String
  constituency      String
  declaredSpend     Float    // ECI affidavit lakhs
  estimatedSpend    Float    // ADR study lakhs
  sourceAffidavit   String   // ECI portal reference link
  
  exams             RecruitmentExam[]
}

model RecruitmentExam {
  id                String   @id @default(uuid())
  candidateId       String
  examName          String
  notificationDate  String   // YYYY-MM-DD
  plannedExamDate   String
  actualExamDate    String
  resultDate        String
  joiningDate       String

  candidate         CandidateSpendRecord @relation(fields: [candidateId], references: [id])
}
```

## 2. Security & Privacy Schema
- **Official Affidavits:** Spending metrics are verbatim reflections of ECI candidate affidavits and ADR reports. No personal candidate banking details are stored.
- **Exam Timelines:** All data points map to official notifications issued by SSC/UPSC/State PSCs.

## 3. App Flow
1. **Constituency search:** Enter PIN to load local candidate records and exam trackers.
2. **Affidavit comparison:** Display ECI declared spend limit vs ADR field research metrics.
3. **Exam timeline progress:** Render step-by-step progress nodes showing delay calculations (notification to planned vs actual joining).
4. **WhatsApp forward:** Share a Spend Audit card or an Exam delay card.

## 4. UI/UX Design & Components
- **Color Palette:** Crimson/Pink (`#f43f5e`) and Slate.
- **Icons:** Lucide `Vote`, `CalendarClock`, `Award`.
- **Components:** `DeclaredSpendCard`, `ExamTimelineMilestones`, `ShareExamReportButton`.

## 5. SEO Specifications
- **Title Tag:** Election Candidate Spend Audit & Recruitment Exam Delay Watch
- **Meta Description:** Check declared vs estimated candidate election campaign budgets and SSC/PSC recruitment exam delay timelines.

# Product Requirements Document (PRD)
## Module: State-Level Andhbhakt (अंधभक्त स्टेट)

**Author:** Civic Accountability OS Architect  
**Status:** Approved for Implementation  
**Version:** 1.0.0  

---

## 1. Executive Summary & Problem Statement

While union-level political trackers get substantial attention, it is **state governments** that run the day-to-day services closest to the citizen: police, education (schools), health (hospitals), water supply, electricity, and the Public Distribution System (Ration).

Every Indian state features:
1. A massive **Chief Minister Publicity Machine** (social media, billboards, local press releases, WhatsApp groups) stating grand accomplishments.
2. A formal but under-publicized **Comptroller & Auditor General (CAG)** State Report, RTI records, and local journalism presenting concrete audits and reality check statistics.

**State-Level Andhbhakt** is a module built to expose these claims. It puts the Chief Minister's publicity claim side-by-side with ground-truth facts verified by official audit reports, RTIs, and citizen photo drops.

---

## 2. Core Features & User Stories

### 2.1 The Signature Layout: Side-by-Side Comparison
The key view is a split card:
- **दावा (The CM's Claim):** The public announcement with quotation, date, speaker name, and direct source link (e.g. twitter, video timestamp).
- **हकीकत (The Reality):** The CAG/RTI audit figure or a citizen-submitted photo showing a contrasting reality.

### 2.2 PIN Code Resolution
- Entering a 6-digit PIN code maps the citizen directly to their state, district, and relevant CM claims.
- Allows citizens to filter by categories: School (स्कूल), Hospital (अस्पताल), Road (सड़क), Ration (राशन), Water (पानी), Police (पुलिस).

### 2.3 Named Accountability Nouns
Cards explicitly name:
- The **Chief Minister** who made the claim.
- The **Responsible Contractor / Firm** that took the money.
- The **Officer / Engineer** in charge of delivery.
- The **Budget Allocated vs Spent** in Crores.

### 2.4 WhatsApp Forward Card
Clicking "Share on WhatsApp" formats a shareable text card optimized for messaging groups:
- Highlight of PIN code and location.
- Contrasted "Claim vs Reality".
- Name of contractor and officer.
- Link back to verification source.

---

## 3. Data Structure & State Mapping

The initial release maps 28 states, pre-seeded with realistic data for key focus states:
- **Uttar Pradesh (CM Yogi Adityanath):** Health, roads, school upgrades, ration shops.
- **Bihar (CM Nitish Kumar):** Saat Nishchay health projects, Har Ghar Jal water taps, road construction.
- **Maharashtra (CM Devendra Fadnavis):** Infrastructure projects, Samruddhi highways, metro clinics.
- **Karnataka (CM Siddaramaiah):** Guarantee schemes, public bus network expansion.
- **West Bengal (CM Mamata Banerjee):** Lakshmir Bhandar payments, Kanyashree school retention.
- **Madhya Pradesh (CM Mohan Yadav):** Nal Jal yojanas.
- **Rajasthan (CM Bhajan Lal Sharma):** Smart classrooms.
- **Punjab (CM Bhagwant Mann):** Mohalla clinics.

---

## 4. UI/UX Design Goals
- **Dark-themed Interface:** Premium, high-contrast, serious tone.
- **Hindi-First Language Design:** Immediate accessibility to local populations, with switches for English and regional languages.
- **Seamless Responsive Grid:** Mobile-first layout optimized for quick screenshots.
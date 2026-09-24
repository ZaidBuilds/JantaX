# JantaX — SIH 2026 Pitch Script (Apex Builders)

**PS: SIH26014 — Integrated GIS-based Digital Public Infrastructure for Land Governance** (Ministry of Rural Development, DoLR).
**Anchor honestly:** JantaX's core is a GIS/PIN location engine over fragmented public data. For this PS you present it applied to **land + the public infrastructure and services tied to that location**, and show schools/health/welfare as *reusable expansion modules* — not as the main claim.

**Format:** ~3 minutes spoken. Speak plainly. Pause after the hook. Don't read the slides.

---

## 0. Hook (15s)
"Raise your hand if you know the name of your Gram Pradhan or your MLA — and what projects they've sanctioned in your area this year. Almost nobody does. Not because the information is secret — it's public — but because it's scattered across forty different government portals. We built JantaX to fix that."

## 1. The problem (20s)
India doesn't lack public data. UDISE+ has every school, PMGSY has every road, RERA has every project, CPGRAMS has every grievance. But it lives in silos, in PDFs, in portals a normal citizen will never open. So people can't answer one simple question: **what is actually happening around me?**

## 2. What JantaX is (30s) — the demo line
"You type your PIN code. That's it." One screen then shows your locality: who represents you (Gram Pradhan, Sarpanch, MLA, MP), which central and state schemes are active here, which infrastructure projects are running and at what status — schools, health centres, roads, housing, ration shops. And next to every single number, we show **where it came from and when it was last updated.**

## 3. What makes it different (25s)
Three things. **One — source-first:** nothing appears without its government source. **Two — we show the official record next to the ground reality, and we never merge them** — the citizen decides. **Three — we're neutral.** JantaX is pro-transparency, not pro or anti any party. This is not another government portal; it's the citizen's lens on the ones that already exist.

## 4. Why it's real, not a slide (20s)
This is running today. React and TypeScript front end, an Express and PostgreSQL back end, a data pipeline that fetches, validates, and location-maps open government data, and 89 automated tests passing. Everything is built on GODL-India licensed open data — so it's legal to reuse, and it's already ours.

## 5. Impact (20s)
For a parent, it's the truth about the local school. For a homebuyer, the builder's real RERA record. For a journalist or NGO, sourced data in seconds instead of weeks. For governance, accountability that **strengthens** the system instead of attacking it.

## 6. The future & how we scale (25s)
We go deep in one district first, prove the loop, then expand district by district, state by state — the same architecture, every new sector just plugs into the same pipeline. The long-term vision: a PIN-code-level civic intelligence layer for all of India — Discover, Understand, Verify, Act, Follow up.

## 7. The ask — what we want from SIH (25s)
"We're not asking you to imagine this — it works. What we're asking SIH for is three things:
1. **Official data access** — sanctioned API/dataset access from the ministries whose data we already surface, so records go from daily-fresh to real-time.
2. **A pilot** — one district, with a nodal department, to run JantaX as a live civic-transparency pilot.
3. **Mentorship and incubation** to take it from a working prototype to a public platform.
Give us the access and the pilot, and JantaX becomes the simplest way for any Indian to see what's happening where they live."

## 8. Close (10s)
"JantaX — India, explained by where you live. Thank you."

---

### Q&A quick-fire (prep)
- *"How is this not just another portal?"* → We don't hold the data; we make the existing portals legible and locality-first, with sources shown.
- *"Data accuracy?"* → We never invent numbers. We show the official record with its date, flag anything older than 90 days, and keep official vs ground reality separate.
- *"Privacy?"* → We use only public, openly-licensed data. No personal citizen data, no beneficiary details.
- *"Business model?"* → Free citizen layer forever; paid API/exports for journalists, NGOs, researchers, and professionals.
- *"This PS is about land — why are you showing schools/health?"* → Our solution to the land PS is the GIS location engine that unifies fragmented land records. The same engine reuses across other public data — that's the scalability the PS asks for, shown as roadmap, not as today's claim.
- *"How is land data unified when states differ?"* → Geospatial standards + interoperable APIs + per-state connectors; we normalise to a common parcel/PIN model and keep each source tagged.

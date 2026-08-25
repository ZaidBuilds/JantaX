# Module Spec: M5 — PDS/Ration & Welfare Audit

## 1. Backend & Database Schema
Tracks Fair Price Shops (FPS) inventory allocations and welfare bottlenecks.
```prisma
model FairPriceShop {
  id              String   @id @default(uuid())
  pincode         String   @db.VarChar(6)
  shopLicenseNo   String   @unique
  dealerName      String
  dealerNameHi    String
  contactNo       String?
  
  allocations     RationAllocation[]
  groundTruthLogs RationGroundTruthLog[]
}

model RationAllocation {
  id              String   @id @default(uuid())
  shopId          String
  commodity       String   // Wheat, Rice, Sugar, Kerosene
  commodityHi     String
  allottedQtyKg   Float
  pricePerKg      Float
  monthYear       String   // MM-YYYY

  shop            FairPriceShop @relation(fields: [shopId], references: [id])
}

model RationGroundTruthLog {
  id              String   @id @default(uuid())
  shopId          String
  status          String   // open, closed, out-of-stock
  reporterIpHash  String
  reportedAt      DateTime @default(now())

  shop            FairPriceShop @relation(fields: [shopId], references: [id])
}
```

## 2. Security & Privacy Schema
- **Reporter Privacy:** IP addresses are hashed using SHA-256 with a salt before saving. No personal info of citizens reporting closed shops is ever stored.
- **Fair Play:** Retailers can request re-verification of status logs.

## 3. App Flow
1. **Locate shop:** Enter PIN to see PDS shops in the area.
2. **Details panel:** Shows official monthly grain allocations.
3. **Citizen check-in:** User can tap "Open" or "Closed" to record real-time operational status.
4. **Audit History:** Compares official stock data vs crowdsourced reports.

## 4. UI/UX Design & Components
- **Color Palette:** Saffron (`#d97706`) and Indigo.
- **Icons:** Lucide `Package`, `Clock`, `MapPin`.
- **Components:** `ShopAllocationWidget`, `CitizenCheckinButton`, `AuditTimeline`.

## 5. SEO Specifications
- **Title Tag:** Local PDS Ration Shop Audit Tracker | राशन दुकान जांच
- **Meta Description:** Check official PDS monthly quotas and live operational status of local fair price shops.

# BeautyGlow - Month 3 Implementation Plan

This plan outlines the steps to implement the medium-priority features for Month 3: Staff Management, Analytics Dashboard, and Email Campaigns.

## Proposed Changes

---

### Dashboard Navigation Updates
#### [MODIFY] [DashboardLayoutClient.tsx](file:///c:/Users/USER/beautyglow/src/app/dashboard/DashboardLayoutClient.tsx)
- Add navigation links for "Staff" (Équipe), "Analytics" (Analytique), and "Marketing" to the sidebar.
- Implement feature gating for these new links (Staff is Pro/Elite, Analytics is Pro/Elite, Marketing is Pro/Elite).
- Ensure the sidebar updates correctly reflect the new active paths.

---

### Staff Management (Pro + Elite)
#### [NEW] [dashboard/staff/page.tsx](file:///c:/Users/USER/beautyglow/src/app/dashboard/staff/page.tsx)
- Server component to fetch staff data for the logged-in business.
- Enforce plan check (redirect to upgrade if Basic).
- Fetch associated `staff` table records.

#### [NEW] [dashboard/staff/StaffClient.tsx](file:///c:/Users/USER/beautyglow/src/app/dashboard/staff/StaffClient.tsx)
- Client component for CRUD operations on staff profiles.
- Display staff list with photos, names, specialties, and active status.
- Add/Edit form for staff details (name, email, phone, specialties, photo upload).
- Enforce staff limits (Pro: 5, Elite: 20) before allowing creation.

---

### Analytics Dashboard (Pro + Elite)
#### [NEW] [dashboard/analytics/page.tsx](file:///c:/Users/USER/beautyglow/src/app/dashboard/analytics/page.tsx)
- Server component to fetch analytical data for the business.
- Enforce plan check (redirect to upgrade if Basic).
- Fetch data from `bookings`, `customers`, and `services` to aggregate metrics.

#### [NEW] [dashboard/analytics/AnalyticsClient.tsx](file:///c:/Users/USER/beautyglow/src/app/dashboard/analytics/AnalyticsClient.tsx)
- Client component to display charts and metrics.
- Show key metrics: Total revenue, Total bookings, New customers (this month vs last month).
- Implement a chart for bookings/revenue over time (using a simple charting library like Recharts or Chart.js, or building custom CSS bars if minimizing dependencies).
- Display top performing services based on booking count.

---

### Email Campaigns (Pro + Elite)
#### [NEW] [dashboard/marketing/page.tsx](file:///c:/Users/USER/beautyglow/src/app/dashboard/marketing/page.tsx)
- Server component to fetch past campaigns and customer count for the business.
- Enforce plan check (redirect to upgrade if Basic).

#### [NEW] [dashboard/marketing/MarketingClient.tsx](file:///c:/Users/USER/beautyglow/src/app/dashboard/marketing/MarketingClient.tsx)
- Client component to compose and send email campaigns.
- List past campaigns with stats (recipient count).
- Form to create a new campaign: Subject, Body (rich text or simple textarea for now).
- Elite users get an additional segmentation dropdown (All, VIP, New, Inactive).

#### [NEW] [actions/sendCampaign.ts](file:///c:/Users/USER/beautyglow/src/app/actions/sendCampaign.ts)
- Server action to handle the actual sending via Resend.
- Fetches the target customer list based on business ID and segment (if applicable).
- Sends emails using `resend.emails.send()`.
- Records the campaign in the `email_campaigns` table.

## Verification Plan

### Manual Verification
1.  **Dashboard Navigation:** Verify the new links appear for Pro/Elite accounts and are hidden for Basic accounts.
2.  **Staff Management:** Test adding, editing, and deleting a staff member. Attempt to exceed the staff limit for a Pro account to ensure the restriction works.
3.  **Analytics:** Create some test bookings and verify the numbers (revenue, counts) update correctly on the analytics page.
4.  **Email Campaigns:** Create a test campaign and send it. Check the Supabase `email_campaigns` table to verify it was recorded, and verify the email is received (or check Resend logs if sending real emails is blocked).

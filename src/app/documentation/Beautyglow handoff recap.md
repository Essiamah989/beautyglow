# BeautyGlow — Full Project Handoff & Continuation Guide
**Version:** 2.0  
**Date:** March 12, 2026  
**Status:** ~92% complete — Beta launch imminent  
**Live URL:** beautyglow.tn  
**Tech Stack:** Next.js 14 + Supabase + Vercel + TypeScript + Tailwind CSS

---

## 🎯 What BeautyGlow Is

Multi-tenant SaaS platform giving Tunisian beauty salons a professional website + online booking system in 5 minutes.

- **Pricing:** Basic 89 TND/month | Pro 149 TND/month | Elite 229 TND/month
- **Free trial:** 14 days on ALL plans
- **Target:** 50,000+ beauty salons in Tunisia (Tunis, Sfax, Sousse)
- **Architecture:** Subdomain routing — each salon gets `salonname.beautyglow.tn`
- **Backend:** Supabase (PostgreSQL + RLS + Auth + Storage)
- **Deploy:** Vercel with wildcard DNS `*.beautyglow.tn`

---

## 📦 3-Tier Plan Summary

### 🥉 Basic — 89 TND/month
- 1 salon website (Lumière theme only)
- Online booking form
- Up to 10 services, 10 photos
- Owner email notifications only
- 1 staff account (owner only)
- WhatsApp support

### 🥈 Pro — 149 TND/month
- All 4 themes + custom domain
- Up to 30 services, 50 photos
- Customer confirmation + reminder emails
- Staff management (up to 5)
- Analytics dashboard
- Customer database + loyalty tracking
- Email campaigns
- Testimonials + before/after photos
- Priority support + onboarding call

### 👑 Elite — 229 TND/month
- Up to 3 locations, each with own subdomain
- Unlimited services + photos
- Up to 20 staff accounts with individual scheduling
- SMS notifications (confirmation + reminders)
- Waitlist system
- Recurring appointments
- Advanced analytics + exportable reports
- Promotional codes / discount system
- Advanced email campaigns with segmentation
- Dedicated account manager + monthly strategy call

All plans include 14-day free trial.

---

## ✅ What Has Been Fully Built & Deployed

### 1. Landing Page (`/`) — v6, FINAL
- Pink + navy palette (`#041B2D`, `#EA4492`, `#FF9CDA`, `#428CD4`)
- Hero carousel (5 slides), problem section, features, pricing, testimonials
- Fully responsive — File: `landing-page-v6.tsx` → `src/app/page.tsx`
- ⚠️ Pricing section still shows old prices (69/129) — needs update to 89/149/229 + Elite card

### 2. Auth Pages — Fixed & Working
- **Login:** Suspense-wrapped, reads `?signup=success/confirm`, shows green banner
- **Signup:** Clears old session before signup, auto-login, redirects to `/onboarding`
- **Logout:** Uses `createBrowserClient` from `@supabase/ssr` — critical for cookie clearing
- Files: `login-page-v2.tsx`, `signup-page-v2.tsx`, `auth.css`

### 3. Onboarding Flow (3-step wizard)
- Step 1: Business info | Step 2: Subdomain | Step 3: Services + logo upload

### 4. Full Dashboard — Pink/Navy/Cream Theme
| Page | Features |
|------|----------|
| Overview | Stats, today's bookings, revenue, quick actions |
| Bookings | Full CRUD, status management, date filter |
| Services | Add/edit/delete, categories, price/duration, active toggle |
| Photos | Upload to Supabase Storage, before/after pairs, gallery |
| Testimonials | Add/edit/delete, star ratings |
| Settings | Business info, hours, social links, theme picker (4 themes) |

### 5. Salon Public Website — 4 Themes
- Hero, About, Services, Booking form, Gallery, Testimonials, Contact, Footer
- Booking email notification to owner via Resend
- 4 themes: Lumière, Blanc, Éclat, Azur

### 6. Admin Dashboard (`/admin`)
- 4 tabs: Metrics, All salons, Expenses, Analytics

### 7. Database
- All tables with RLS + triggers for auto-customer creation
- `businesses`, `services`, `bookings`, `photos`, `testimonials`, `customers`, `staff`, `email_campaigns`
- ⚠️ `promo_codes` and `waitlist` tables needed for Elite (SQL in `08-Database-Schema.md`)

---

## 🔴 Immediate Fixes Needed (Do These First)

### Fix 1: Theme constraint — missing 'azur'
```sql
ALTER TABLE businesses DROP CONSTRAINT businesses_theme_check;
ALTER TABLE businesses
ADD CONSTRAINT businesses_theme_check
CHECK (theme = ANY (ARRAY['lumiere'::text, 'blanc'::text, 'eclat'::text, 'azur'::text]));
```

### Fix 2: Plan type constraint — add 'elite'
```sql
ALTER TABLE businesses DROP CONSTRAINT businesses_plan_type_check;
ALTER TABLE businesses
ADD CONSTRAINT businesses_plan_type_check
CHECK (plan_type = ANY (ARRAY['trial'::text, 'basic'::text, 'pro'::text, 'elite'::text]));
```

### Fix 3: SalonClient.tsx — all 4 CSS imports + data-theme wrapper
```tsx
// Top of src/app/sites/[subdomain]/SalonClient.tsx:
import "./lumiere.css";
import "./blanc.css";
import "./eclat.css";
import "./azur.css";

// Add to Business interface:
theme: string | null;

// Before return:
const themeClass = business.theme ?? "lumiere";

// Wrap return:
return (
  <div data-theme={themeClass}>
    {/* existing JSX unchanged */}
  </div>
);
```

### Fix 4: page.tsx — add 'theme' to select
```typescript
.select('id, business_name, subdomain, phone, address, description, logo_url, opening_hours, social_links, plan_type, theme')
```

---

## 📋 Full TODO List (Priority Order)

### 🔴 CRITICAL
1. Run Fix 1 + Fix 2 SQL in Supabase
2. Apply Fix 3 + Fix 4 in repo
3. Test theme end-to-end

### 🟡 HIGH — Before Beta Launch
4. Logo upload in settings
5. Customer booking confirmation email
6. Trial expiry enforcement
7. Plan feature gating (theme restriction, service/photo limits)

### 🟠 MEDIUM — Month 3
8. Update landing page pricing (89/149/229 + Elite card)
9. Staff management pages
10. Analytics dashboard
11. Email campaigns

### 🟢 LOW — Month 4+
12. Multi-location (Elite)
13. SMS notifications (Elite)
14. Waitlist + promo codes (Elite)
15. Recurring appointments (Elite)
16. SMTP via Resend (VPN issue — postponed)

---

## 📁 Output Files → Repo Paths

| Output File | → Repo Path |
|-------------|-------------|
| `landing-page-v6.tsx` | `src/app/page.tsx` |
| `login-page-v2.tsx` | `src/app/auth/login/page.tsx` |
| `signup-page-v2.tsx` | `src/app/auth/signup/page.tsx` |
| `auth.css` | `src/styles/auth.css` |
| `DashboardLayoutClient.tsx` | `src/components/DashboardLayoutClient.tsx` |
| `BookingsClient.tsx` | `src/components/BookingsClient.tsx` |
| `ServicesClient.tsx` | `src/components/ServicesClient.tsx` |
| `PhotosClient.tsx` | `src/components/PhotosClient.tsx` |
| `SettingsClient.tsx` | `src/components/SettingsClient.tsx` |
| `dashboard.css` | `src/styles/dashboard.css` |
| `SalonClient.tsx` | `src/app/sites/[subdomain]/SalonClient.tsx` |
| `lumiere.css` | `src/app/sites/[subdomain]/lumiere.css` |
| `blanc.css` | `src/app/sites/[subdomain]/blanc.css` |
| `eclat.css` | `src/app/sites/[subdomain]/eclat.css` |
| `azur.css` | `src/app/sites/[subdomain]/azur.css` |

---

## 🔧 Key Technical Decisions

1. **Auth:** `createBrowserClient` from `@supabase/ssr` — not `@supabase/supabase-js`
2. **Themes:** Static imports of all 4 CSS files, `data-theme` attribute on root div
3. **Multi-tenancy:** `business_id` FK on every table, RLS enforces isolation
4. **Email:** Resend — disable email confirmation in Supabase for dev (2/hour limit)
5. **Routing:** Middleware extracts subdomain → rewrites to `/sites/[businessId]`

---

## 💬 How to Continue in New Conversation

Upload this file + the project docs folder, then say:

> "Continuing BeautyGlow development. Platform is ~92% complete and live at beautyglow.tn. We added a 3rd plan (Elite at 229 TND). Pricing: Basic 89 / Pro 149 / Elite 229 TND. All plans have 14-day trial. See handoff doc for full context and TODO list."

---

*Generated March 12, 2026 — BeautyGlow v2.0 by Essia*
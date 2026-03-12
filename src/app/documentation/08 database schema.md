# 08 - Database Schema

## Overview

BeautyGlow uses PostgreSQL (via Supabase) with Row-Level Security for multi-tenant data isolation.

**Database:** PostgreSQL 15.x  
**Host:** Supabase  
**Charset:** UTF-8  
**Timezone:** UTC (convert to local in application)

**Last Updated:** March 12, 2026 — Added 'elite' plan type, updated pricing

---

## Plan Types Reference

| plan_type | Price | Trial |
|-----------|-------|-------|
| `trial` | Free | 14 days |
| `basic` | 89 TND/month | ✅ |
| `pro` | 149 TND/month | ✅ |
| `elite` | 229 TND/month | ✅ |

---

## Businesses Table (Core — Most Important)

```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Business information
  business_name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL CHECK (subdomain ~ '^[a-z0-9-]+$'),
  phone TEXT,
  address TEXT,
  description TEXT,
  logo_url TEXT,

  -- Subscription — UPDATED: now includes 'elite'
  plan_type TEXT NOT NULL DEFAULT 'trial'
    CHECK (plan_type IN ('trial', 'basic', 'pro', 'elite')),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),

  -- Custom domain (Pro + Elite feature)
  custom_domain TEXT UNIQUE,
  custom_domain_verified BOOLEAN DEFAULT false,
  custom_domain_added_at TIMESTAMPTZ,

  -- Theme — Basic gets 'lumiere' only, Pro/Elite get all 4
  theme TEXT DEFAULT 'lumiere'
    CHECK (theme IN ('lumiere', 'blanc', 'eclat', 'azur')),

  -- Settings
  opening_hours JSONB DEFAULT '{
    "monday":    {"open": "09:00", "close": "18:00", "closed": false},
    "tuesday":   {"open": "09:00", "close": "18:00", "closed": false},
    "wednesday": {"open": "09:00", "close": "18:00", "closed": false},
    "thursday":  {"open": "09:00", "close": "18:00", "closed": false},
    "friday":    {"open": "09:00", "close": "18:00", "closed": false},
    "saturday":  {"open": "09:00", "close": "18:00", "closed": false},
    "sunday":    {"open": "09:00", "close": "18:00", "closed": true}
  }'::jsonb,

  social_links JSONB DEFAULT '{
    "instagram": "",
    "facebook":  "",
    "whatsapp":  ""
  }'::jsonb,

  -- Multi-location parent (Elite feature)
  -- NULL = this is a standalone or parent location
  -- UUID = this is a child location under a parent account
  parent_business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### SQL: Update existing constraint to include 'elite'
```sql
-- Run this in Supabase SQL Editor if table already exists:
ALTER TABLE businesses DROP CONSTRAINT businesses_plan_type_check;
ALTER TABLE businesses
ADD CONSTRAINT businesses_plan_type_check
CHECK (plan_type = ANY (ARRAY['trial'::text, 'basic'::text, 'pro'::text, 'elite'::text]));

-- Also fix theme constraint if 'azur' is missing:
ALTER TABLE businesses DROP CONSTRAINT businesses_theme_check;
ALTER TABLE businesses
ADD CONSTRAINT businesses_theme_check
CHECK (theme = ANY (ARRAY['lumiere'::text, 'blanc'::text, 'eclat'::text, 'azur'::text]));
```

---

## Plan Feature Gates Reference

Use these checks in application code to gate features:

```typescript
// Theme picker — Basic only gets lumiere
const allowedThemes = (plan: string) => {
  if (plan === 'basic' || plan === 'trial') return ['lumiere'];
  return ['lumiere', 'blanc', 'eclat', 'azur']; // pro + elite
};

// Service limit
const serviceLimit = (plan: string) => {
  if (plan === 'basic' || plan === 'trial') return 10;
  if (plan === 'pro') return 30;
  return Infinity; // elite
};

// Photo limit
const photoLimit = (plan: string) => {
  if (plan === 'basic' || plan === 'trial') return 10;
  if (plan === 'pro') return 50;
  return Infinity; // elite
};

// Staff accounts
const staffLimit = (plan: string) => {
  if (plan === 'basic' || plan === 'trial') return 1;
  if (plan === 'pro') return 5;
  return 20; // elite
};

// Location limit (Elite only)
const locationLimit = (plan: string) => {
  if (plan === 'elite') return 3;
  return 1;
};

// Feature flags
const canUseCustomDomain    = (plan: string) => ['pro', 'elite'].includes(plan);
const canUseAnalytics       = (plan: string) => ['pro', 'elite'].includes(plan);
const canUseEmailCampaigns  = (plan: string) => ['pro', 'elite'].includes(plan);
const canUseSMS             = (plan: string) => plan === 'elite';
const canUseMultiLocation   = (plan: string) => plan === 'elite';
const canUseWaitlist        = (plan: string) => plan === 'elite';
const canUsePromoCode       = (plan: string) => plan === 'elite';
const canUseStaffScheduling = (plan: string) => plan === 'elite';
```

---

## Services Table

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category TEXT CHECK (category IN (
    'haircut', 'coloring', 'treatment', 'styling',
    'nails', 'makeup', 'facial', 'massage', 'other'
  )),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Limit enforcement:** Check count before INSERT — Basic max 10, Pro max 30, Elite unlimited.

---

## Bookings Table

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,

  -- Customer info
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,

  -- Booking details
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  notes TEXT,

  -- Recurring (Elite feature)
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT CHECK (recurrence_pattern IN ('weekly', 'monthly', NULL)),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent double-booking
CREATE UNIQUE INDEX idx_bookings_no_double_booking
ON bookings(business_id, booking_date, booking_time)
WHERE status NOT IN ('cancelled', 'no_show');
```

---

## Photos Table

```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  category TEXT CHECK (category IN ('salon', 'work_examples', 'team')),
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  -- Before/after pairing (Pro + Elite)
  before_url TEXT,
  is_before_after BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Limit enforcement:** Basic max 10, Pro max 50, Elite unlimited.

---

## Testimonials Table

```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Customers Table

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  first_booking_date DATE,
  last_booking_date DATE,
  total_bookings INTEGER DEFAULT 1,
  email_opt_in BOOLEAN DEFAULT false,
  sms_opt_in BOOLEAN DEFAULT false,
  -- Loyalty (Pro + Elite)
  is_vip BOOLEAN DEFAULT false,
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, phone)
);
```

---

## Staff Table (Pro + Elite)

```sql
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  specialties TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  -- Staff scheduling (Elite)
  working_hours JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Email Campaigns Table (Pro + Elite)

```sql
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  -- Segmentation (Elite: can filter by VIP, inactive, new)
  recipient_filter JSONB DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ,
  recipient_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Promo Codes Table (Elite only)

```sql
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percent', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, code)
);
```

---

## Waitlist Table (Elite only)

```sql
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  preferred_date DATE,
  notified_at TIMESTAMPTZ,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'booked', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Row-Level Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE businesses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE services       ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings       ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials   ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff          ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist       ENABLE ROW LEVEL SECURITY;

-- Owners manage their own data
CREATE POLICY "Owners manage own business"
  ON businesses FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Public can view business info"
  ON businesses FOR SELECT USING (true);

CREATE POLICY "Owners manage own services"
  ON services FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Public can view active services"
  ON services FOR SELECT USING (is_active = true);

CREATE POLICY "Owners manage own bookings"
  ON bookings FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners manage own photos"
  ON photos FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

CREATE POLICY "Public can view photos"
  ON photos FOR SELECT USING (true);

-- Pro + Elite: email campaigns
CREATE POLICY "Pro and Elite owners manage campaigns"
  ON email_campaigns FOR ALL
  USING (business_id IN (
    SELECT id FROM businesses
    WHERE owner_id = auth.uid()
    AND plan_type IN ('pro', 'elite')
  ));

-- Elite only: promo codes
CREATE POLICY "Elite owners manage promo codes"
  ON promo_codes FOR ALL
  USING (business_id IN (
    SELECT id FROM businesses
    WHERE owner_id = auth.uid()
    AND plan_type = 'elite'
  ));
```

---

## Helper Functions

### Trial expiry check
```sql
CREATE OR REPLACE FUNCTION is_trial_expired(business_row businesses)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN business_row.plan_type = 'trial'
    AND business_row.trial_ends_at < NOW();
END;
$$ LANGUAGE plpgsql;
```

### Auto-create/update customer on booking
```sql
CREATE OR REPLACE FUNCTION handle_booking_customer()
RETURNS TRIGGER AS $$
DECLARE
  existing_customer_id UUID;
BEGIN
  SELECT id INTO existing_customer_id
  FROM customers
  WHERE business_id = NEW.business_id
  AND phone = NEW.customer_phone;

  IF existing_customer_id IS NULL THEN
    INSERT INTO customers (
      business_id, name, phone, email,
      first_booking_date, last_booking_date, total_bookings
    ) VALUES (
      NEW.business_id, NEW.customer_name, NEW.customer_phone, NEW.customer_email,
      NEW.booking_date, NEW.booking_date, 1
    );
  ELSE
    UPDATE customers
    SET last_booking_date = NEW.booking_date,
        total_bookings = total_bookings + 1,
        updated_at = NOW()
    WHERE id = existing_customer_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_creates_or_updates_customer
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION handle_booking_customer();
```

---

## Indexes

```sql
CREATE INDEX idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX idx_businesses_subdomain ON businesses(subdomain);
CREATE INDEX idx_businesses_plan_type ON businesses(plan_type);
CREATE INDEX idx_services_business_id ON services(business_id);
CREATE INDEX idx_bookings_business_id ON bookings(business_id);
CREATE INDEX idx_bookings_business_date ON bookings(business_id, booking_date);
CREATE INDEX idx_customers_business_id ON customers(business_id);
CREATE INDEX idx_photos_business_id ON photos(business_id);
CREATE INDEX idx_staff_business_id ON staff(business_id);
```

---

*Last updated: March 12, 2026 — v2.0 (added Elite plan, promo_codes table, waitlist table, updated constraints)*
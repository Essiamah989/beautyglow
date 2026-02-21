// src/app/api/bookings/route.ts
// Public API — receives booking requests from salon public websites
// Saves to database and will trigger email notification (later)

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Service role to bypass RLS for public bookings
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.business_id ||
      !body.customer_name ||
      !body.customer_phone ||
      !body.booking_date ||
      !body.booking_time
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Save booking to database
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        business_id: body.business_id,
        service_id: body.service_id || null,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_email: body.customer_email || null,
        booking_date: body.booking_date,
        booking_time: body.booking_time,
        status: "pending",
        notes: body.notes || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Booking creation failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

// src/app/sites/[subdomain]/SalonClient.tsx
// Client component — handles all interactivity
// Service popup with before/after carousel, testimonials, and booking form

"use client";

import { useState } from "react";
import Image from "next/image";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category: string;
}

interface Photo {
  id: string;
  url: string;
  category: string;
  is_featured: boolean;
}

interface Testimonial {
  id: string;
  service_id: string;
  customer_name: string;
  rating: number;
  comment: string;
}

interface BeforeAfter {
  id: string;
  service_id: string;
  before_url: string;
  after_url: string;
  caption: string;
}

interface Business {
  id: string;
  business_name: string;
  address: string;
  phone: string;
  description: string;
  logo_url: string;
  social_links: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

interface Props {
  business: Business;
  services: Service[];
  photos: Photo[];
  testimonials: Testimonial[];
  beforeAfters: BeforeAfter[];
}

export default function SalonClient({
  business,
  services,
  photos,
  testimonials,
  beforeAfters,
}: Props) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [bookingStep, setBookingStep] = useState<"info" | "form" | "success">(
    "info",
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const featuredPhoto = photos?.find((p) => p.is_featured);

  // Get data for selected service
  const serviceBeforeAfters = selectedService
    ? beforeAfters?.filter((b) => b.service_id === selectedService.id)
    : [];

  const serviceTestimonials = selectedService
    ? testimonials?.filter((t) => t.service_id === selectedService.id)
    : [];

  const openService = (service: Service) => {
    setSelectedService(service);
    setCarouselIndex(0);
    setBookingStep("info");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setBookingDate("");
    setBookingTime("");
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setSelectedService(null);
    document.body.style.overflow = "";
  };

  const handleBooking = async () => {
    setSubmitting(true);
    try {
      // Use Supabase directly instead of API route
      // Avoids CORS issues with subdomain requests
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );

      const { error } = await supabase.from("bookings").insert({
        business_id: business.id,
        service_id: selectedService?.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        booking_date: bookingDate,
        booking_time: bookingTime,
        status: "pending",
      });

      if (error) throw error;

      setBookingStep("success");
    } catch (error: any) {
      console.error("Booking failed:", JSON.stringify(error, null, 2));
      console.error("Error message:", error?.message);
      console.error("Error details:", error?.details);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  // Available time slots
  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', sans-serif;
          color: #e8e0d5;
          background: #0d0d0d;
        }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }

        /* NAV */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 24px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to bottom, rgba(13,13,13,0.95), transparent);
        }

        .nav-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 500;
          color: #e8e0d5;
          text-decoration: none;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .nav-book {
          background: transparent;
          color: #c9a96e;
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          padding: 10px 24px;
          border: 1px solid #c9a96e;
          transition: all 0.3s;
        }

        .nav-book:hover {
          background: #c9a96e;
          color: #0d0d0d;
        }

        /* HERO */
        .hero {
          height: 100vh;
          position: relative;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(13,13,13,0.95) 0%,
            rgba(13,13,13,0.4) 40%,
            rgba(13,13,13,0.2) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 80px 64px;
          max-width: 750px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 24px;
        }

        .hero-badge::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: #c9a96e;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 300;
          line-height: 1.05;
          color: #f5f0e8;
          margin-bottom: 24px;
          letter-spacing: -1px;
        }

        .hero-title em {
          font-style: italic;
          color: #c9a96e;
        }

        .hero-info {
          display: flex;
          gap: 32px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .hero-info-item {
          font-size: 0.85rem;
          color: rgba(232,224,213,0.6);
          font-weight: 300;
          letter-spacing: 0.3px;
        }

        .hero-info-item a {
          color: #c9a96e;
          text-decoration: none;
        }

        .hero-description {
          font-size: 0.95rem;
          color: rgba(232,224,213,0.55);
          line-height: 1.8;
          margin-bottom: 40px;
          max-width: 500px;
          font-weight: 300;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #c9a96e;
          color: #0d0d0d;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          text-decoration: none;
          padding: 18px 44px;
          transition: all 0.3s;
        }

        .hero-btn:hover {
          background: #e8c98a;
          transform: translateY(-2px);
        }

        .hero-scroll {
          position: absolute;
          bottom: 40px;
          right: 48px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(232,224,213,0.3);
          font-size: 0.6rem;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .hero-scroll::after {
          content: '';
          display: block;
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, rgba(232,224,213,0.3), transparent);
        }

        /* STATS */
        .stats-bar {
          background: #111;
          border-top: 1px solid #1e1e1e;
          border-bottom: 1px solid #1e1e1e;
          padding: 32px 48px;
          display: flex;
          justify-content: center;
          gap: 80px;
          flex-wrap: wrap;
        }

        .stat { text-align: center; }

        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 500;
          color: #c9a96e;
          display: block;
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 0.65rem;
          color: #444;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* SERVICES */
        .services-section {
          padding: 100px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          margin-bottom: 64px;
        }

        .section-tag {
          font-size: 0.65rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c9a96e;
          font-weight: 500;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-tag::after {
          content: '';
          flex: 1;
          max-width: 60px;
          height: 1px;
          background: #c9a96e;
          opacity: 0.4;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 300;
          color: #f5f0e8;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1px;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
        }

        .service-card {
          background: #0d0d0d;
          padding: 36px 32px;
          cursor: pointer;
          transition: background 0.2s;
          position: relative;
          overflow: hidden;
        }

        .service-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0;
          height: 1px;
          background: #c9a96e;
          transition: width 0.4s ease;
        }

        .service-card:hover { background: #111; }
        .service-card:hover::after { width: 100%; }

        .service-category {
          font-size: 0.6rem;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #c9a96e;
          opacity: 0.7;
          margin-bottom: 12px;
        }

        .service-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 500;
          color: #f5f0e8;
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .service-desc {
          font-size: 0.82rem;
          color: #555;
          line-height: 1.7;
          margin-bottom: 28px;
          font-weight: 300;
        }

        .service-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .service-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 400;
          color: #c9a96e;
          line-height: 1;
        }

        .service-price-unit {
          font-size: 0.75rem;
          color: #444;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          margin-left: 4px;
        }

        .service-cta {
          font-size: 0.65rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #444;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }

        .service-card:hover .service-cta { color: #c9a96e; }

        .service-duration {
          font-size: 0.72rem;
          color: #333;
          margin-top: 4px;
        }

        /* GALLERY */
        .gallery-section {
          padding: 0 0 100px;
        }

        .gallery-header {
          padding: 80px 48px 48px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: 280px 280px;
          gap: 4px;
          padding: 0 4px;
        }

        .gallery-item {
          overflow: hidden;
          position: relative;
          cursor: pointer;
        }

        .gallery-item:first-child {
          grid-column: span 2;
          grid-row: span 2;
        }

        .gallery-item:nth-child(4) {
          grid-column: span 2;
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
          filter: brightness(0.85);
        }

        .gallery-item:hover .gallery-img {
          transform: scale(1.06);
          filter: brightness(1);
        }

        /* TESTIMONIALS */
        .testimonials-section {
          background: #080808;
          padding: 100px 48px;
          border-top: 1px solid #1a1a1a;
        }

        .testimonials-grid {
          max-width: 1100px;
          margin: 64px auto 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .testimonial-card {
          background: #0d0d0d;
          border: 1px solid #1a1a1a;
          padding: 32px;
        }

        .testimonial-stars {
          color: #c9a96e;
          font-size: 0.75rem;
          letter-spacing: 3px;
          margin-bottom: 16px;
        }

        .testimonial-comment {
          font-size: 0.9rem;
          color: #666;
          line-height: 1.8;
          font-weight: 300;
          font-style: italic;
          margin-bottom: 20px;
        }

        .testimonial-name {
          font-size: 0.75rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #c9a96e;
          opacity: 0.7;
        }

        /* CONTACT */
        .contact-section {
          background: #0d0d0d;
          border-top: 1px solid #1a1a1a;
          padding: 100px 48px;
          text-align: center;
        }

        .contact-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 300;
          color: #f5f0e8;
          margin-bottom: 12px;
        }

        .contact-sub {
          color: #444;
          font-size: 0.85rem;
          font-weight: 300;
          margin-bottom: 56px;
          letter-spacing: 0.5px;
        }

        .contact-grid {
          display: flex;
          justify-content: center;
          gap: 64px;
          flex-wrap: wrap;
          margin-bottom: 56px;
        }

        .contact-item-label {
          font-size: 0.6rem;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #333;
          margin-bottom: 10px;
          display: block;
        }

        .contact-item-value {
          font-size: 0.95rem;
          color: #888;
          font-weight: 300;
        }

        .contact-item-value a { color: #c9a96e; text-decoration: none; }

        .social-row {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-bottom: 56px;
        }

        .social-btn {
          font-size: 0.65rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #333;
          text-decoration: none;
          transition: color 0.2s;
          padding-bottom: 4px;
          border-bottom: 1px solid #1e1e1e;
        }

        .social-btn:hover { color: #c9a96e; border-color: #c9a96e; }

        .contact-btn {
          display: inline-block;
          border: 1px solid #2a2a2a;
          color: #888;
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          padding: 16px 48px;
          transition: all 0.3s;
        }

        .contact-btn:hover {
          border-color: #c9a96e;
          color: #c9a96e;
        }

        /* FOOTER */
        .footer {
          background: #080808;
          border-top: 1px solid #111;
          padding: 28px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          color: #333;
          letter-spacing: 1px;
        }

        .footer-powered {
          font-size: 0.7rem;
          color: #222;
          letter-spacing: 0.5px;
        }

        .footer-powered a { color: #c9a96e; text-decoration: none; }

        /* POPUP OVERLAY */
        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          backdrop-filter: blur(8px);
        }

        .popup {
          background: #0f0f0f;
          border: 1px solid #1e1e1e;
          width: 100%;
          max-width: 820px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .popup-close {
          position: absolute;
          top: 20px;
          right: 24px;
          background: none;
          border: none;
          color: #444;
          font-size: 1.2rem;
          cursor: pointer;
          z-index: 10;
          transition: color 0.2s;
          line-height: 1;
          padding: 4px 8px;
        }

        .popup-close:hover { color: #c9a96e; }

        .popup-header {
          padding: 40px 40px 32px;
          border-bottom: 1px solid #1a1a1a;
        }

        .popup-category {
          font-size: 0.6rem;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 10px;
          opacity: 0.7;
        }

        .popup-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 400;
          color: #f5f0e8;
          margin-bottom: 8px;
        }

        .popup-meta {
          display: flex;
          gap: 24px;
        }

        .popup-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          color: #c9a96e;
        }

        .popup-duration {
          font-size: 0.8rem;
          color: #444;
          display: flex;
          align-items: center;
        }

        /* TABS */
        .popup-tabs {
          display: flex;
          border-bottom: 1px solid #1a1a1a;
        }

        .popup-tab {
          flex: 1;
          padding: 16px;
          background: none;
          border: none;
          color: #444;
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }

        .popup-tab.active {
          color: #c9a96e;
          border-bottom-color: #c9a96e;
        }

        /* BEFORE AFTER */
        .before-after-container {
          padding: 32px 40px;
        }

        .before-after-card {
          margin-bottom: 32px;
        }

        .ba-images {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
          border-radius: 2px;
          overflow: hidden;
        }

        .ba-image-wrap {
          position: relative;
          aspect-ratio: 4/3;
        }

        .ba-label {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0,0,0,0.7);
          color: #c9a96e;
          font-size: 0.6rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 4px 10px;
          z-index: 1;
        }

        .ba-caption {
          font-size: 0.78rem;
          color: #444;
          text-align: center;
          font-style: italic;
          font-weight: 300;
        }

        /* TESTIMONIALS IN POPUP */
        .popup-testimonials {
          padding: 32px 40px;
        }

        .popup-testimonial {
          padding: 24px 0;
          border-bottom: 1px solid #1a1a1a;
        }

        .popup-testimonial:last-child { border-bottom: none; }

        /* BOOKING FORM */
        .booking-form {
          padding: 32px 40px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          color: #e8e0d5;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          padding: 12px 16px;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-input:focus { border-color: #c9a96e; }

        .time-slots {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .time-slot {
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          color: #555;
          font-size: 0.78rem;
          padding: 10px 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }

        .time-slot:hover { border-color: #c9a96e; color: #c9a96e; }
        .time-slot.selected { background: #c9a96e; color: #0d0d0d; border-color: #c9a96e; font-weight: 600; }

        .submit-btn {
          width: 100%;
          background: #c9a96e;
          color: #0d0d0d;
          border: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 18px;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 24px;
        }

        .submit-btn:hover { background: #e8c98a; }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* SUCCESS */
        .success-state {
          padding: 64px 40px;
          text-align: center;
        }

        .success-icon {
          font-size: 3rem;
          margin-bottom: 24px;
          display: block;
        }

        .success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 400;
          color: #f5f0e8;
          margin-bottom: 12px;
        }

        .success-sub {
          font-size: 0.85rem;
          color: #555;
          font-weight: 300;
          line-height: 1.7;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .nav { padding: 16px 20px; }
          .hero-content { padding: 40px 24px; }
          .stats-bar { gap: 32px; padding: 24px; }
          .services-section { padding: 60px 20px; }
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto;
          }
          .gallery-item:first-child { grid-column: span 2; }
          .gallery-item:nth-child(4) { grid-column: span 1; }
          .testimonials-section { padding: 60px 20px; }
          .contact-section { padding: 60px 20px; }
          .contact-grid { gap: 32px; }
          .footer { flex-direction: column; text-align: center; }
          .popup { max-height: 95vh; }
          .popup-header { padding: 32px 24px 24px; }
          .before-after-container { padding: 24px; }
          .popup-testimonials { padding: 24px; }
          .booking-form { padding: 24px; }
          .time-slots { grid-template-columns: repeat(3, 1fr); }
          .ba-images { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <span className="nav-name">{business.business_name}</span>
        <a href="#booking" className="nav-book">
          Réserver
        </a>
      </nav>

      {/* HERO */}
      <div className="hero">
        {featuredPhoto && (
          <Image
            src={featuredPhoto.url}
            alt={business.business_name}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">Salon Professionnel — Tunis</div>
          <h1 className="hero-title">
            {business.business_name.split(" ")[0]}{" "}
            <em>{business.business_name.split(" ").slice(1).join(" ")}</em>
          </h1>
          <div className="hero-info">
            <span className="hero-info-item">📍 {business.address}</span>
            <span className="hero-info-item">
              <a href={`tel:${business.phone}`}>📞 {business.phone}</a>
            </span>
          </div>
          {business.description && (
            <p className="hero-description">{business.description}</p>
          )}
          <a href="#services" className="hero-btn">
            Découvrir nos services →
          </a>
        </div>
        <div className="hero-scroll">Scroll</div>
      </div>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-number">500+</span>
          <span className="stat-label">Clientes satisfaites</span>
        </div>
        <div className="stat">
          <span className="stat-number">{services?.length || 8}</span>
          <span className="stat-label">Services disponibles</span>
        </div>
        <div className="stat">
          <span className="stat-number">5★</span>
          <span className="stat-label">Note moyenne</span>
        </div>
        <div className="stat">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Réservation en ligne</span>
        </div>
      </div>

      {/* SERVICES */}
      <div id="services" className="services-section">
        <div className="section-header">
          <div className="section-tag">Ce que nous offrons</div>
          <h2 className="section-title">Nos Services</h2>
        </div>
        <div className="services-grid">
          {services?.map((service) => (
            <div
              key={service.id}
              className="service-card"
              onClick={() => openService(service)}
            >
              <div className="service-category">{service.category}</div>
              <h3 className="service-name">{service.name}</h3>
              {service.description && (
                <p className="service-desc">{service.description}</p>
              )}
              <div className="service-footer">
                <div>
                  <div className="service-price">
                    {service.price}
                    <span className="service-price-unit">TND</span>
                  </div>
                  <div className="service-duration">
                    ⏱ {service.duration_minutes} min
                  </div>
                </div>
                <div className="service-cta">Voir détails →</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GALLERY */}
      {photos && photos.length > 0 && (
        <div className="gallery-section">
          <div className="gallery-header">
            <div className="section-tag">Notre univers</div>
            <h2 className="section-title">Galerie</h2>
          </div>
          <div className="gallery-grid">
            {photos.slice(0, 6).map((photo, index) => (
              <div key={photo.id} className="gallery-item">
                <Image
                  src={photo.url}
                  alt={`${business.business_name} — ${index + 1}`}
                  fill
                  className="gallery-img"
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <div className="testimonials-section">
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div className="section-tag">Ce qu&apos;elles disent</div>
            <h2 className="section-title">Témoignages</h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.slice(0, 6).map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-comment">&ldquo;{t.comment}&ldquo;</p>
                <div className="testimonial-name">— {t.customer_name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTACT */}
      <div id="booking" className="contact-section">
        <span className="section-tag" style={{ justifyContent: "center" }}>
          Nous rendre visite
        </span>
        <h2 className="contact-title">Venez nous voir</h2>
        <p className="contact-sub">Nous serions ravies de vous accueillir</p>

        <div className="contact-grid">
          <div>
            <span className="contact-item-label">Adresse</span>
            <span className="contact-item-value">{business.address}</span>
          </div>
          <div>
            <span className="contact-item-label">Téléphone</span>
            <span className="contact-item-value">
              <a href={`tel:${business.phone}`}>{business.phone}</a>
            </span>
          </div>
          <div>
            <span className="contact-item-label">Réservation</span>
            <span className="contact-item-value">
              <a href="#services">En ligne 24/7</a>
            </span>
          </div>
        </div>

        {business.social_links && (
          <div className="social-row">
            {business.social_links.instagram && (
              <a
                href={`https://instagram.com/${business.social_links.instagram}`}
                target="_blank"
                className="social-btn"
              >
                Instagram
              </a>
            )}
            {business.social_links.facebook && (
              <a
                href={business.social_links.facebook}
                target="_blank"
                className="social-btn"
              >
                Facebook
              </a>
            )}
            {business.social_links.whatsapp && (
              <a
                href={`https://wa.me/${business.social_links.whatsapp}`}
                target="_blank"
                className="social-btn"
              >
                WhatsApp
              </a>
            )}
          </div>
        )}

        <a href="#services" className="contact-btn">
          Choisir un service
        </a>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <span className="footer-name">{business.business_name}</span>
        <span className="footer-powered">
          Propulsé par <a href="https://beautyglow.tn">BeautyGlow</a>
        </span>
      </div>

      {/* SERVICE POPUP */}
      {selectedService && (
        <div
          className="popup-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePopup();
          }}
        >
          <div className="popup">
            <button className="popup-close" onClick={closePopup}>
              ✕
            </button>

            {/* Popup Header */}
            <div className="popup-header">
              <div className="popup-category">{selectedService.category}</div>
              <h2 className="popup-title">{selectedService.name}</h2>
              <div className="popup-meta">
                <span className="popup-price">{selectedService.price} TND</span>
                <span className="popup-duration">
                  ⏱ {selectedService.duration_minutes} min
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="popup-tabs">
              <button
                className={`popup-tab ${bookingStep === "info" ? "active" : ""}`}
                onClick={() => setBookingStep("info")}
              >
                Avant / Après
              </button>
              <button
                className={`popup-tab ${bookingStep === "form" ? "active" : ""}`}
                onClick={() => setBookingStep("form")}
              >
                Réserver
              </button>
            </div>

            {/* Tab: Before/After + Testimonials */}
            {bookingStep === "info" && (
              <>
                <div className="before-after-container">
                  {serviceBeforeAfters.length > 0 ? (
                    serviceBeforeAfters.map((ba) => (
                      <div key={ba.id} className="before-after-card">
                        <div className="ba-images">
                          <div className="ba-image-wrap">
                            <span className="ba-label">Avant</span>
                            <Image
                              src={ba.before_url}
                              alt="Avant"
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                          <div className="ba-image-wrap">
                            <span className="ba-label">Après</span>
                            <Image
                              src={ba.after_url}
                              alt="Après"
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        </div>
                        {ba.caption && (
                          <p className="ba-caption">{ba.caption}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p
                      style={{
                        color: "#333",
                        fontSize: "0.85rem",
                        textAlign: "center",
                        padding: "24px 0",
                      }}
                    >
                      Photos avant/après bientôt disponibles
                    </p>
                  )}
                </div>

                {/* Testimonials */}
                {serviceTestimonials.length > 0 && (
                  <div className="popup-testimonials">
                    <div
                      className="section-tag"
                      style={{ marginBottom: "16px" }}
                    >
                      Avis clientes
                    </div>
                    {serviceTestimonials.map((t) => (
                      <div key={t.id} className="popup-testimonial">
                        <div
                          className="testimonial-stars"
                          style={{ marginBottom: "8px" }}
                        >
                          ★★★★★
                        </div>
                        <p className="testimonial-comment">
                          &ldquo;{t.comment}&ldquo;
                        </p>
                        <div
                          className="testimonial-name"
                          style={{ marginTop: "10px" }}
                        >
                          — {t.customer_name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA to booking tab */}
                <div style={{ padding: "0 40px 40px" }}>
                  <button
                    className="submit-btn"
                    onClick={() => setBookingStep("form")}
                  >
                    Réserver ce service →
                  </button>
                </div>
              </>
            )}

            {/* Tab: Booking Form */}
            {bookingStep === "form" && (
              <div className="booking-form">
                <div className="form-group">
                  <label className="form-label">Votre nom *</label>
                  <input
                    className="form-input"
                    placeholder="Nom et prénom"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Téléphone *</label>
                  <input
                    className="form-input"
                    placeholder="+216 XX XXX XXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email (optionnel)</label>
                  <input
                    className="form-input"
                    placeholder="votre@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date souhaitée *</label>
                  <input
                    className="form-input"
                    type="date"
                    value={bookingDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Heure souhaitée *</label>
                  <div className="time-slots">
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className={`time-slot ${bookingTime === time ? "selected" : ""}`}
                        onClick={() => setBookingTime(time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="submit-btn"
                  disabled={
                    !customerName ||
                    !customerPhone ||
                    !bookingDate ||
                    !bookingTime ||
                    submitting
                  }
                  onClick={handleBooking}
                >
                  {submitting
                    ? "Envoi en cours..."
                    : "Confirmer la réservation →"}
                </button>
              </div>
            )}

            {/* Success State */}
            {bookingStep === "success" && (
              <div className="success-state">
                <span className="success-icon">✦</span>
                <h3 className="success-title">Réservation confirmée!</h3>
                <p className="success-sub">
                  Merci {customerName}! Votre demande de réservation pour
                  <br />
                  <strong style={{ color: "#c9a96e" }}>
                    {selectedService.name}
                  </strong>
                  <br />
                  le {bookingDate} à {bookingTime} a été envoyée.
                  <br />
                  <br />
                  Le salon vous contactera sous peu pour confirmer.
                </p>
                <button
                  className="submit-btn"
                  style={{ marginTop: "32px" }}
                  onClick={closePopup}
                >
                  Fermer
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

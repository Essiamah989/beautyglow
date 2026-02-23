// src/app/sites/[subdomain]/SalonClient.tsx
// Client component — handles all interactivity
// Service popup with before/after carousel, testimonials, and booking form

"use client";
import "./lumiere.css";
import { useState } from "react";
import Image from "next/image";
import { sendBookingEmail } from '@/app/actions/sendBookingEmail'

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

      // After successful booking insert, call notification API

      // Then in handleBooking replace the entire fetch block with:
      sendBookingEmail({
        business_id: business.id,
        service_id: selectedService?.id || "",
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || null,
        booking_date: bookingDate,
        booking_time: bookingTime,
      }).catch((err) => console.error("Email failed:", err));

      if (error) throw error;

      setBookingStep("success");
    } catch (error: any) {
      console.error("Booking failed:", error?.message);
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
      {/* OPENING HOURS */}
      {business.opening_hours && (
        <div className="hours-section">
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <div className="section-tag" style={{ justifyContent: "center" }}>
              Horaires
            </div>
            <h2 className="section-title">Nos Horaires d'Ouverture</h2>
          </div>
          <div className="hours-grid">
            {[
              { key: "monday", label: "Lundi" },
              { key: "tuesday", label: "Mardi" },
              { key: "wednesday", label: "Mercredi" },
              { key: "thursday", label: "Jeudi" },
              { key: "friday", label: "Vendredi" },
              { key: "saturday", label: "Samedi" },
              { key: "sunday", label: "Dimanche" },
            ].map(({ key, label }) => {
              const hours = business.opening_hours[key];
              if (!hours) return null;
              const todayKey = new Date()
                .toLocaleDateString("en-US", { weekday: "long" })
                .toLowerCase();
              const isToday = key === todayKey;
              return (
                <div key={key} className="hours-row">
                  <span className={`hours-day ${isToday ? "today" : ""}`}>
                    {isToday ? `▸ ${label}` : label}
                  </span>
                  {hours.closed ? (
                    <span className="hours-closed">Fermé</span>
                  ) : (
                    <span className="hours-time">
                      {hours.open} — {hours.close}
                    </span>
                  )}
                </div>
              );
            })}
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

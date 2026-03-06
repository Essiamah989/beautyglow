"use client";

import { useState } from "react";
import { createBrowserClient } from '@supabase/ssr'
import "@/styles/dashboard.css"

interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  service_id: string;
  services: { name: string } | null;
}

interface Service {
  id: string;
  name: string;
}

interface Props {
  testimonials: Testimonial[];
  services: Service[];
  businessId: string;
}



const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const emptyForm = { customer_name: "", rating: 5, comment: "", service_id: "" };

export default function TestimonialsClient({
  testimonials: initial,
  services,
  businessId,
}: Props) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (t: Testimonial) => {
    setForm({
      customer_name: t.customer_name,
      rating: t.rating,
      comment: t.comment,
      service_id: t.service_id || "",
    });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.customer_name || !form.comment) return;
    setLoading(true);
    try {
      if (editingId) {
        const { data, error } = await supabase
          .from("testimonials")
          .update({ ...form })
          .eq("id", editingId)
          .select("*, services(name)")
          .single();
        if (error) throw error;
        setTestimonials((prev) =>
          prev.map((t) => (t.id === editingId ? data : t)),
        );
      } else {
        const { data, error } = await supabase
          .from("testimonials")
          .insert({ ...form, business_id: businessId })
          .select("*, services(name)")
          .single();
        if (error) throw error;
        setTestimonials((prev) => [data, ...prev]);
      }
      setShowForm(false);
    } catch (err: any) {
      console.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce témoignage?")) return;
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error(err?.message);
    } finally {
      setDeletingId(null);
    }
  };

  const stars = (rating: number) => "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <>
      <div className="page-header">
        <p style={{ fontSize: "0.82rem", color: "#444", fontWeight: 300 }}>
          {testimonials.length} témoignage{testimonials.length !== 1 ? "s" : ""}
        </p>
        <button className="add-btn" onClick={openAdd}>
          + Ajouter un témoignage
        </button>
      </div>

      {testimonials.length > 0 ? (
        <div className="list">
          {testimonials.map((t) => (
            <div key={t.id} className="row">
              <div>
                <div className="row-name">{t.customer_name}</div>
                {t.services?.name && (
                  <div className="row-service">✦ {t.services.name}</div>
                )}
                <div className="row-comment">"{t.comment}"</div>
              </div>
              <div className="row-stars">{stars(t.rating)}</div>
              <div className="row-actions">
                <button className="icon-btn" onClick={() => openEdit(t)}>
                  Modifier
                </button>
                <button
                  className="icon-btn danger"
                  onClick={() => handleDelete(t.id)}
                  disabled={deletingId === t.id}
                >
                  {deletingId === t.id ? "..." : "Supprimer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p style={{ fontSize: "2rem", marginBottom: "12px", opacity: 0.2 }}>
            ★
          </p>
          <p style={{ fontSize: "0.85rem", color: "#333", fontWeight: 300 }}>
            Aucun témoignage — ajoutez vos premiers avis clients
          </p>
        </div>
      )}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
        >
          <div className="modal">
            <h2 className="modal-title">
              {editingId ? "Modifier" : "Nouveau témoignage"}
            </h2>

            <div className="form-group">
              <label className="form-label">Nom du client *</label>
              <input
                className="form-input"
                placeholder="Ex: Amira Ben Ali"
                value={form.customer_name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, customer_name: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Note *</label>
              <div className="star-selector">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={`star-btn ${n <= form.rating ? "active" : ""}`}
                    onClick={() => setForm((p) => ({ ...p, rating: n }))}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Commentaire *</label>
              <textarea
                className="form-textarea"
                placeholder="Ce que le client a dit..."
                value={form.comment}
                onChange={(e) =>
                  setForm((p) => ({ ...p, comment: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Service (optionnel)</label>
              <select
                className="form-select"
                value={form.service_id}
                onChange={(e) =>
                  setForm((p) => ({ ...p, service_id: e.target.value }))
                }
              >
                <option value="">-- Aucun service --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowForm(false)}>
                Annuler
              </button>
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={loading || !form.customer_name || !form.comment}
              >
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

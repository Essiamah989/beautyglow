"use client";

import { useState } from "react";
import { createBrowserClient } from '@supabase/ssr'

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
      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .add-btn { background: #c9a96e; color: #0d0d0d; border: none; font-family: 'Inter', sans-serif; font-size: 0.72rem; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; padding: 12px 28px; cursor: pointer; transition: background 0.2s; }
        .add-btn:hover { background: #e8c98a; }
        .list { display: flex; flex-direction: column; gap: 1px; background: #1a1a1a; border: 1px solid #1a1a1a; }
        .row { background: #0d0d0d; padding: 24px; display: grid; grid-template-columns: 2fr 1fr auto; gap: 16px; align-items: start; transition: background 0.15s; }
        .row:hover { background: #111; }
        .row-name { font-size: 0.92rem; color: #e8e0d5; font-weight: 400; margin-bottom: 4px; }
        .row-service { font-size: 0.72rem; color: #444; margin-bottom: 8px; }
        .row-comment { font-size: 0.82rem; color: #666; font-weight: 300; font-style: italic; line-height: 1.5; }
        .row-stars { color: #c9a96e; font-size: 0.85rem; letter-spacing: 2px; }
        .row-actions { display: flex; gap: 8px; justify-content: flex-end; }
        .icon-btn { background: none; border: 1px solid #1e1e1e; color: #444; font-size: 0.65rem; letter-spacing: 1px; text-transform: uppercase; padding: 7px 14px; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.2s; }
        .icon-btn:hover { border-color: #c9a96e; color: #c9a96e; }
        .icon-btn.danger:hover { border-color: #ef4444; color: #ef4444; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; backdrop-filter: blur(4px); }
        .modal { background: #0f0f0f; border: 1px solid #1e1e1e; width: 100%; max-width: 520px; padding: 40px; }
        .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 400; color: #f5f0e8; margin-bottom: 32px; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase; color: #444; margin-bottom: 8px; }
        .form-input, .form-select, .form-textarea { width: 100%; background: #0d0d0d; border: 1px solid #1e1e1e; color: #e8e0d5; font-family: 'Inter', sans-serif; font-size: 0.88rem; padding: 12px 16px; outline: none; transition: border-color 0.2s; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #c9a96e; }
        .form-textarea { resize: vertical; min-height: 100px; }
        .star-selector { display: flex; gap: 8px; }
        .star-btn { background: none; border: none; font-size: 1.4rem; cursor: pointer; transition: transform 0.1s; color: #333; }
        .star-btn.active { color: #c9a96e; }
        .star-btn:hover { transform: scale(1.2); }
        .modal-actions { display: flex; gap: 12px; margin-top: 32px; }
        .save-btn { flex: 1; background: #c9a96e; color: #0d0d0d; border: none; font-family: 'Inter', sans-serif; font-size: 0.75rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; padding: 14px; cursor: pointer; }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .cancel-btn { background: none; border: 1px solid #1e1e1e; color: #555; font-family: 'Inter', sans-serif; font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; padding: 14px 28px; cursor: pointer; }
        .empty-state { text-align: center; padding: 64px 24px; border: 1px solid #1a1a1a; }
        @media (max-width: 768px) { .row { grid-template-columns: 1fr; } }
      `}</style>

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

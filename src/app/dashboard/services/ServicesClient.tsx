// src/app/dashboard/services/ServicesClient.tsx
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category: string;
  is_active: boolean;
  display_order: number;
}

interface Props {
  services: Service[];
  businessId: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const categories = [
  "haircut",
  "coloring",
  "treatment",
  "styling",
  "nails",
  "makeup",
  "facial",
  "massage",
  "other",
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  duration_minutes: "",
  category: "haircut",
};

export default function ServicesClient({
  services: initial,
  businessId,
}: Props) {
  const [services, setServices] = useState<Service[]>(initial);
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

  const openEdit = (service: Service) => {
    setForm({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration_minutes: service.duration_minutes.toString(),
      category: service.category || "haircut",
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration_minutes) return;
    setLoading(true);

    try {
      if (editingId) {
        // Update existing
        const { data, error } = await supabase
          .from("services")
          .update({
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            duration_minutes: parseInt(form.duration_minutes),
            category: form.category,
          })
          .eq("id", editingId)
          .select()
          .single();

        if (error) throw error;
        setServices((prev) => prev.map((s) => (s.id === editingId ? data : s)));
      } else {
        // Create new
        const { data, error } = await supabase
          .from("services")
          .insert({
            business_id: businessId,
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            duration_minutes: parseInt(form.duration_minutes),
            category: form.category,
            display_order: services.length,
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;
        setServices((prev) => [...prev, data]);
      }

      closeForm();
    } catch (error: any) {
      console.error("Save failed:", error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce service?")) return;
    setDeletingId(id);

    try {
      const { error } = await supabase.from("services").delete().eq("id", id);

      if (error) throw error;
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (error: any) {
      console.error("Delete failed:", error?.message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from("services")
        .update({ is_active: !service.is_active })
        .eq("id", service.id);

      if (error) throw error;
      setServices((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, is_active: !s.is_active } : s,
        ),
      );
    } catch (error: any) {
      console.error("Toggle failed:", error?.message);
    }
  };

  return (
    <>
      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .page-header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          color: #888;
          font-weight: 300;
        }

        .add-btn {
          background: #c9a96e;
          color: #0d0d0d;
          border: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 12px 28px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .add-btn:hover { background: #e8c98a; }

        .services-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
        }

        .service-row {
          background: #0d0d0d;
          padding: 20px 24px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr auto;
          gap: 16px;
          align-items: center;
          transition: background 0.15s;
        }

        .service-row:hover { background: #111; }
        .service-row.inactive { opacity: 0.4; }

        .service-row-name {
          font-size: 0.95rem;
          color: #e8e0d5;
          font-weight: 400;
          margin-bottom: 4px;
        }

        .service-row-desc {
          font-size: 0.75rem;
          color: #444;
          font-weight: 300;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 280px;
        }

        .service-row-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          color: #c9a96e;
        }

        .service-row-duration {
          font-size: 0.82rem;
          color: #555;
          font-weight: 300;
        }

        .service-row-category {
          font-size: 0.62rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #444;
          background: #111;
          padding: 4px 10px;
          border-radius: 2px;
        }

        .row-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .icon-btn {
          background: none;
          border: 1px solid #1e1e1e;
          color: #444;
          font-size: 0.72rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 7px 14px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }

        .icon-btn:hover { border-color: #c9a96e; color: #c9a96e; }
        .icon-btn.danger:hover { border-color: #ef4444; color: #ef4444; }

        .toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          opacity: 0.5;
          transition: opacity 0.2s;
          padding: 4px;
        }

        .toggle-btn:hover { opacity: 1; }

        /* FORM MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          backdrop-filter: blur(4px);
        }

        .modal {
          background: #0f0f0f;
          border: 1px solid #1e1e1e;
          width: 100%;
          max-width: 560px;
          padding: 40px;
        }

        .modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 400;
          color: #f5f0e8;
          margin-bottom: 32px;
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

        .form-input, .form-select, .form-textarea {
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

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus { border-color: #c9a96e; }

        .form-select {
          appearance: none;
          cursor: pointer;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .save-btn {
          flex: 1;
          background: #c9a96e;
          color: #0d0d0d;
          border: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .save-btn:hover { background: #e8c98a; }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .cancel-btn {
          background: none;
          border: 1px solid #1e1e1e;
          color: #555;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 14px 28px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn:hover { border-color: #444; color: #888; }

        .empty-state {
          text-align: center;
          padding: 64px 24px;
          border: 1px solid #1a1a1a;
        }

        @media (max-width: 768px) {
          .service-row {
            grid-template-columns: 1fr;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
          .modal { padding: 24px; }
        }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <p className="page-header-title">
          {services.length} service{services.length !== 1 ? "s" : ""} au total
        </p>
        <button className="add-btn" onClick={openAdd}>
          + Ajouter un service
        </button>
      </div>

      {/* Services List */}
      {services.length > 0 ? (
        <div className="services-list">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-row ${!service.is_active ? "inactive" : ""}`}
            >
              <div>
                <div className="service-row-name">{service.name}</div>
                {service.description && (
                  <div className="service-row-desc">{service.description}</div>
                )}
              </div>

              <div className="service-row-price">
                {service.price}{" "}
                <span style={{ fontSize: "0.75rem", color: "#555" }}>TND</span>
              </div>

              <div className="service-row-duration">
                ⏱ {service.duration_minutes} min
              </div>

              <div className="service-row-category">{service.category}</div>

              <div className="row-actions">
                <button
                  className="toggle-btn"
                  onClick={() => toggleActive(service)}
                  title={service.is_active ? "Désactiver" : "Activer"}
                >
                  {service.is_active ? "✅" : "⭕"}
                </button>
                <button className="icon-btn" onClick={() => openEdit(service)}>
                  Modifier
                </button>
                <button
                  className="icon-btn danger"
                  onClick={() => handleDelete(service.id)}
                  disabled={deletingId === service.id}
                >
                  {deletingId === service.id ? "..." : "Supprimer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p style={{ fontSize: "2rem", marginBottom: "12px", opacity: 0.2 }}>
            ✦
          </p>
          <p style={{ fontSize: "0.85rem", color: "#333", fontWeight: 300 }}>
            Aucun service — ajoutez votre premier service
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
        >
          <div className="modal">
            <h2 className="modal-title">
              {editingId ? "Modifier le service" : "Nouveau service"}
            </h2>

            <div className="form-group">
              <label className="form-label">Nom du service *</label>
              <input
                className="form-input"
                placeholder="Ex: Coupe & Brushing"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Décrivez le service..."
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prix (TND) *</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="45"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Durée (minutes) *</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="60"
                  value={form.duration_minutes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, duration_minutes: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Catégorie</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeForm}>
                Annuler
              </button>
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={
                  loading || !form.name || !form.price || !form.duration_minutes
                }
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

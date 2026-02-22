"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const DAY_LABELS: Record<string, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

export default function SettingsClient({ business }: { business: any }) {
  const [form, setForm] = useState({
    business_name: business.business_name || "",
    phone: business.phone || "",
    address: business.address || "",
    description: business.description || "",
  });

  const [social, setSocial] = useState({
    instagram: business.social_links?.instagram || "",
    facebook: business.social_links?.facebook || "",
    whatsapp: business.social_links?.whatsapp || "",
  });

  const [hours, setHours] = useState(
    business.opening_hours || {
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: false },
      saturday: { open: "09:00", close: "18:00", closed: false },
      sunday: { open: "09:00", close: "18:00", closed: true },
    },
  );

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("businesses")
        .update({
          business_name: form.business_name,
          phone: form.phone,
          address: form.address,
          description: form.description,
          social_links: social,
          opening_hours: hours,
        })
        .eq("id", business.id);

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error(err?.message);
    } finally {
      setSaving(false);
    }
  };

  const updateHours = (day: string, field: string, value: any) => {
    setHours((prev: any) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  return (
    <>
      <style>{`
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 32px;
        }

        .settings-section {
          background: #0d0d0d;
          border: 1px solid #1a1a1a;
          padding: 32px;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: #f5f0e8;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid #1a1a1a;
        }

        .form-group { margin-bottom: 20px; }

        .form-label {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 8px;
        }

        .form-input, .form-textarea {
          width: 100%;
          background: #080808;
          border: 1px solid #1e1e1e;
          color: #e8e0d5;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          padding: 12px 16px;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .form-input:focus, .form-textarea:focus { border-color: #c9a96e; }
        .form-textarea { resize: vertical; min-height: 100px; }

        .hours-row {
          display: grid;
          grid-template-columns: 80px 1fr 1fr auto;
          gap: 8px;
          align-items: center;
          margin-bottom: 10px;
        }

        .day-label {
          font-size: 0.75rem;
          color: #666;
          font-weight: 300;
        }

        .time-input {
          background: #080808;
          border: 1px solid #1e1e1e;
          color: #e8e0d5;
          font-family: 'Inter', sans-serif;
          font-size: 0.82rem;
          padding: 8px 12px;
          outline: none;
          width: 100%;
          transition: border-color 0.2s;
        }

        .time-input:focus { border-color: #c9a96e; }
        .time-input:disabled { opacity: 0.3; }

        .closed-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 0.65rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #444;
          white-space: nowrap;
        }

        .closed-toggle input { accent-color: #c9a96e; }

        .save-bar {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid #1a1a1a;
        }

        .save-btn {
          background: #c9a96e;
          color: #0d0d0d;
          border: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 14px 40px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .save-btn:hover { background: #e8c98a; }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .saved-msg {
          font-size: 0.75rem;
          color: #4ade80;
          letter-spacing: 1px;
        }

        .subdomain-display {
          font-size: 0.82rem;
          color: #c9a96e;
          background: #080808;
          border: 1px solid #1e1e1e;
          padding: 12px 16px;
          opacity: 0.7;
        }

        @media (max-width: 900px) {
          .settings-grid { grid-template-columns: 1fr; }
          .hours-row { grid-template-columns: 70px 1fr 1fr auto; }
        }
      `}</style>

      <div className="settings-grid">
        {/* Business Info */}
        <div className="settings-section">
          <h2 className="section-title">Informations</h2>

          <div className="form-group">
            <label className="form-label">Nom du salon</label>
            <input
              className="form-input"
              value={form.business_name}
              onChange={(e) =>
                setForm((p) => ({ ...p, business_name: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <input
              className="form-input"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Adresse</label>
            <input
              className="form-input"
              value={form.address}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Sous-domaine (non modifiable)</label>
            <div className="subdomain-display">
              {business.subdomain}.beautyglow.tn
            </div>
          </div>
        </div>

        {/* Social + Hours */}
        <div>
          <div className="settings-section" style={{ marginBottom: "32px" }}>
            <h2 className="section-title">Réseaux sociaux</h2>

            <div className="form-group">
              <label className="form-label">Instagram</label>
              <input
                className="form-input"
                placeholder="@votresalon"
                value={social.instagram}
                onChange={(e) =>
                  setSocial((p) => ({ ...p, instagram: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facebook</label>
              <input
                className="form-input"
                placeholder="facebook.com/votresalon"
                value={social.facebook}
                onChange={(e) =>
                  setSocial((p) => ({ ...p, facebook: e.target.value }))
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp</label>
              <input
                className="form-input"
                placeholder="+216 XX XXX XXX"
                value={social.whatsapp}
                onChange={(e) =>
                  setSocial((p) => ({ ...p, whatsapp: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="settings-section">
            <h2 className="section-title">Horaires d&apos;ouverture</h2>
            {DAYS.map((day) => (
              <div key={day} className="hours-row">
                <span className="day-label">{DAY_LABELS[day]}</span>
                <input
                  type="time"
                  className="time-input"
                  value={hours[day]?.open || "09:00"}
                  disabled={hours[day]?.closed}
                  onChange={(e) => updateHours(day, "open", e.target.value)}
                />
                <input
                  type="time"
                  className="time-input"
                  value={hours[day]?.close || "18:00"}
                  disabled={hours[day]?.closed}
                  onChange={(e) => updateHours(day, "close", e.target.value)}
                />
                <label className="closed-toggle">
                  <input
                    type="checkbox"
                    checked={hours[day]?.closed || false}
                    onChange={(e) =>
                      updateHours(day, "closed", e.target.checked)
                    }
                  />
                  Fermé
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Bar */}
      <div className="save-bar">
        {saved && (
          <span className="saved-msg">✓ Modifications enregistrées</span>
        )}
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </>
  );
}

// src/app/dashboard/photos/PhotosClient.tsx
"use client";

import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

interface Photo {
  id: string;
  url: string;
  category: string;
  display_order: number;
  is_featured: boolean;
}

interface Service {
  id: string;
  name: string;
}

interface BeforeAfter {
  id: string;
  service_id: string;
  before_url: string;
  after_url: string;
  caption: string;
}

interface Props {
  photos: Photo[]
  businessId: string
  services: Service[]
  beforeAfters: BeforeAfter[]  // ← make sure this exists
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const categories = ["salon", "work_examples", "team"];
const categoryLabels: Record<string, string> = {
  salon: "Salon",
  work_examples: "Réalisations",
  team: "Équipe",
};

export default function PhotosClient({
  photos: initial,
  businessId,
  services,
  beforeAfters: initialBA,
}: Props) {
  const [activeTab, setActiveTab] = useState<"gallery" | "before_after">(
    "gallery",
  );
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [beforeAfters, setBeforeAfters] = useState<BeforeAfter[]>(initialBA ?? [])
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("salon");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  // Before/after form state
  const [showBAForm, setShowBAForm] = useState(false);
  const [baServiceId, setBaServiceId] = useState<string>('')
  const [baCaption, setBaCaption] = useState("");
  const [baBeforeFile, setBaBeforeFile] = useState<File | null>(null);
  const [baAfterFile, setBaAfterFile] = useState<File | null>(null);
  const [baUploading, setBaUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload gallery photo
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const fileName = `photos/${businessId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("business-asset")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("business-asset").getPublicUrl(fileName);

        const { data, error: dbError } = await supabase
          .from("photos")
          .insert({
            business_id: businessId,
            url: publicUrl,
            category: selectedCategory,
            display_order: photos.length,
            is_featured: photos.length === 0,
          })
          .select()
          .single();

        if (dbError) throw dbError;
        setPhotos((prev) => [...prev, data]);
      }
    } catch (error: any) {
      console.error("Upload failed:", error?.message);
      alert("Erreur lors du téléchargement.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Upload file helper
  const uploadFile = async (file: File, prefix: string) => {
    const ext = file.name.split(".").pop();
    const fileName = `before-after/${businessId}/${prefix}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("business-asset")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("business-asset").getPublicUrl(fileName);

    return publicUrl;
  };

  // Save before/after
  const handleSaveBA = async () => {
    if (!baBeforeFile || !baAfterFile || !baServiceId) return;
    setBaUploading(true);

    try {
      const beforeUrl = await uploadFile(baBeforeFile, "before");
      const afterUrl = await uploadFile(baAfterFile, "after");

      const { data, error } = await supabase
        .from("before_after_photos")
        .insert({
          business_id: businessId,
          service_id: baServiceId,
          before_url: beforeUrl,
          after_url: afterUrl,
          caption: baCaption,
        })
        .select()
        .single();

      if (error) throw error;

      setBeforeAfters((prev) => [data, ...prev]);
      setShowBAForm(false);
      setBaBeforeFile(null);
      setBaAfterFile(null);
      setBaCaption("");
    } catch (error: any) {
      console.error("Before/after save failed:", error?.message);
      alert("Erreur lors du téléchargement.");
    } finally {
      setBaUploading(false);
    }
  };

  const handleDeleteBA = async (id: string) => {
    if (!confirm("Supprimer cette photo avant/après?")) return;
    setDeletingId(id);

    try {
      const { error } = await supabase
        .from("before_after_photos")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setBeforeAfters((prev) => prev.filter((b) => b.id !== id));
    } catch (error: any) {
      console.error("Delete failed:", error?.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeletePhoto = async (photo: Photo) => {
    if (!confirm("Supprimer cette photo?")) return;
    setDeletingId(photo.id);

    try {
      const urlParts = photo.url.split("/business-asset/");
      if (urlParts[1]) {
        await supabase.storage.from("business-asset").remove([urlParts[1]]);
      }
      const { error } = await supabase
        .from("photos")
        .delete()
        .eq("id", photo.id);
      if (error) throw error;
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    } catch (error: any) {
      console.error("Delete failed:", error?.message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleFeatured = async (photo: Photo) => {
    try {
      await supabase
        .from("photos")
        .update({ is_featured: false })
        .eq("business_id", businessId);
      const { error } = await supabase
        .from("photos")
        .update({ is_featured: true })
        .eq("id", photo.id);
      if (error) throw error;
      setPhotos((prev) =>
        prev.map((p) => ({ ...p, is_featured: p.id === photo.id })),
      );
    } catch (error: any) {
      console.error("Featured update failed:", error?.message);
    }
  };

  const filtered =
    filter === "all" ? photos : photos.filter((p) => p.category === filter);

  const getServiceName = (id: string) =>
    services.find((s) => s.id === id)?.name || "Service inconnu";

  // Guard: no services available
  if (activeTab === "before_after" && services.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "64px 24px",
          border: "1px solid #1a1a1a",
          color: "#444",
        }}
      >
        <p style={{ fontSize: "2rem", marginBottom: "12px", opacity: 0.2 }}>
          ✦
        </p>
        <p style={{ fontSize: "0.85rem", fontWeight: 300 }}>
          Vous devez d'abord ajouter des services avant d&apos;ajouter des photos
          avant/après.
        </p>
      </div>
    );
  }
  return (
    <>
      <style>{`
        .page-tabs {
          display: flex;
          gap: 1px;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
          margin-bottom: 32px;
        }

        .page-tab {
          flex: 1;
          padding: 14px;
          background: #0d0d0d;
          border: none;
          color: #444;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }

        .page-tab:hover { background: #111; color: #888; }
        .page-tab.active { background: #111; color: #c9a96e; }

        .upload-zone {
          border: 1px dashed #2a2a2a;
          padding: 48px 24px;
          text-align: center;
          margin-bottom: 32px;
          transition: border-color 0.2s;
          cursor: pointer;
          background: #0a0a0a;
        }

        .upload-zone:hover { border-color: #c9a96e; }

        .upload-icon {
          font-size: 2rem;
          opacity: 0.2;
          margin-bottom: 12px;
          display: block;
        }

        .upload-text {
          font-size: 0.85rem;
          color: #444;
          font-weight: 300;
          margin-bottom: 20px;
        }

        .upload-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .category-select, .service-select {
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          color: #888;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          padding: 10px 16px;
          outline: none;
          cursor: pointer;
        }

        .upload-btn {
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

        .upload-btn:hover { background: #e8c98a; }
        .upload-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .filter-tabs {
          display: flex;
          gap: 1px;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
          margin-bottom: 24px;
        }

        .filter-tab {
          flex: 1;
          padding: 12px;
          background: #0d0d0d;
          border: none;
          color: #444;
          font-family: 'Inter', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-tab:hover { background: #111; color: #888; }
        .filter-tab.active { background: #111; color: #c9a96e; }

        .photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 4px;
        }

        .photo-item {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: #111;
        }

        .photo-item:hover .photo-overlay { opacity: 1; }

        .photo-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.7);
          opacity: 0;
          transition: opacity 0.2s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 12px;
          z-index: 1;
        }

        .photo-badges { display: flex; gap: 6px; flex-wrap: wrap; }

        .photo-badge {
          font-size: 0.58rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 3px 8px;
          background: rgba(0,0,0,0.6);
          color: #888;
        }

        .photo-badge.featured {
          background: rgba(201,169,110,0.2);
          color: #c9a96e;
        }

        .photo-actions { display: flex; gap: 8px; justify-content: flex-end; }

        .photo-action-btn {
          background: rgba(0,0,0,0.6);
          border: 1px solid #333;
          color: #888;
          font-family: 'Inter', sans-serif;
          font-size: 0.62rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 6px 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .photo-action-btn:hover { border-color: #c9a96e; color: #c9a96e; }
        .photo-action-btn.danger:hover { border-color: #ef4444; color: #ef4444; }

        /* BEFORE/AFTER */
        .ba-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
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

        .ba-grid {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
        }

        .ba-row {
          background: #0d0d0d;
          padding: 20px 24px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 20px;
          align-items: center;
          transition: background 0.15s;
        }

        .ba-row:hover { background: #111; }

        .ba-images-mini {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          width: 160px;
        }

        .ba-img-mini {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: #111;
        }

        .ba-mini-label {
          position: absolute;
          bottom: 4px;
          left: 4px;
          font-size: 0.55rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #c9a96e;
          background: rgba(0,0,0,0.7);
          padding: 2px 6px;
          z-index: 1;
        }

        .ba-info-service {
          font-size: 0.92rem;
          color: #e8e0d5;
          font-weight: 400;
          margin-bottom: 4px;
        }

        .ba-info-caption {
          font-size: 0.78rem;
          color: #444;
          font-weight: 300;
          font-style: italic;
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

        .icon-btn.danger:hover { border-color: #ef4444; color: #ef4444; }

        /* MODAL */
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
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 400;
          color: #f5f0e8;
          margin-bottom: 32px;
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

        .file-input-label {
          display: block;
          border: 1px dashed #2a2a2a;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s;
          color: #444;
          font-size: 0.82rem;
          font-weight: 300;
        }

        .file-input-label:hover { border-color: #c9a96e; color: #c9a96e; }
        .file-input-label.has-file { border-color: #4ade80; color: #4ade80; }

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

        .photos-count {
          font-size: 0.72rem;
          color: #333;
          letter-spacing: 1px;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .photos-grid { grid-template-columns: repeat(2, 1fr); }
          .ba-row { grid-template-columns: 1fr; }
          .ba-images-mini { width: 100%; }
          .form-row { grid-template-columns: 1fr; }
          .modal { padding: 24px; }
        }
      `}</style>

      {/* Page Tabs */}
      <div className="page-tabs">
        <button
          className={`page-tab ${activeTab === "gallery" ? "active" : ""}`}
          onClick={() => setActiveTab("gallery")}
        >
          Galerie ({photos.length})
        </button>
        <button
          className={`page-tab ${activeTab === "before_after" ? "active" : ""}`}
          onClick={() => setActiveTab("before_after")}
        >
          Avant / Après ({beforeAfters.length})
        </button>
      </div>

      {/* GALLERY TAB */}
      {activeTab === "gallery" && (
        <>
          <div
            className="upload-zone"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="upload-icon">◻</span>
            <p className="upload-text">
              Cliquez pour télécharger des photos
              <br />
              <span style={{ fontSize: "0.75rem", color: "#333" }}>
                JPG, PNG — plusieurs fichiers acceptés
              </span>
            </p>
            <div
              className="upload-controls"
              onClick={(e) => e.stopPropagation()}
            >
              <select
                className="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </option>
                ))}
              </select>
              <button
                className="upload-btn"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? "Téléchargement..." : "+ Ajouter des photos"}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleUpload}
            />
          </div>

          <div className="filter-tabs">
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                className={`filter-tab ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat === "all" ? "Toutes" : categoryLabels[cat]} (
                {cat === "all"
                  ? photos.length
                  : photos.filter((p) => p.category === cat).length}
                )
              </button>
            ))}
          </div>

          <div className="photos-count">
            {filtered.length} photo{filtered.length !== 1 ? "s" : ""}
          </div>

          {filtered.length > 0 ? (
            <div className="photos-grid">
              {filtered.map((photo) => (
                <div key={photo.id} className="photo-item">
                  <Image
                    src={photo.url}
                    alt="Photo"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="photo-overlay">
                    <div className="photo-badges">
                      <span className="photo-badge">
                        {categoryLabels[photo.category]}
                      </span>
                      {photo.is_featured && (
                        <span className="photo-badge featured">
                          ★ Principale
                        </span>
                      )}
                    </div>
                    <div className="photo-actions">
                      {!photo.is_featured && (
                        <button
                          className="photo-action-btn"
                          onClick={() => toggleFeatured(photo)}
                        >
                          ★ Principale
                        </button>
                      )}
                      <button
                        className="photo-action-btn danger"
                        onClick={() => handleDeletePhoto(photo)}
                        disabled={deletingId === photo.id}
                      >
                        {deletingId === photo.id ? "..." : "Supprimer"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p
                style={{ fontSize: "2rem", marginBottom: "12px", opacity: 0.2 }}
              >
                ◻
              </p>
              <p
                style={{ fontSize: "0.85rem", color: "#333", fontWeight: 300 }}
              >
                Aucune photo — ajoutez vos premières photos
              </p>
            </div>
          )}
        </>
      )}

      {/* BEFORE/AFTER TAB */}
      {activeTab === "before_after" && (
        <>
          <div className="ba-header">
            <p style={{ fontSize: "0.82rem", color: "#444", fontWeight: 300 }}>
              {beforeAfters.length} transformation
              {beforeAfters.length !== 1 ? "s" : ""}
            </p>
            <button className="add-btn" onClick={() => setShowBAForm(true)}>
              + Ajouter avant/après
            </button>
          </div>

          {beforeAfters.length > 0 ? (
            <div className="ba-grid">
              {beforeAfters.map((ba) => (
                <div key={ba.id} className="ba-row">
                  <div className="ba-images-mini">
                    <div className="ba-img-mini">
                      <span className="ba-mini-label">Avant</span>
                      <Image
                        src={ba.before_url}
                        alt="Avant"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="ba-img-mini">
                      <span className="ba-mini-label">Après</span>
                      <Image
                        src={ba.after_url}
                        alt="Après"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="ba-info-service">
                      {getServiceName(ba.service_id)}
                    </div>
                    {ba.caption && (
                      <div className="ba-info-caption">"{ba.caption}"</div>
                    )}
                  </div>

                  <button
                    className="icon-btn danger"
                    onClick={() => handleDeleteBA(ba.id)}
                    disabled={deletingId === ba.id}
                  >
                    {deletingId === ba.id ? "..." : "Supprimer"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p
                style={{ fontSize: "2rem", marginBottom: "12px", opacity: 0.2 }}
              >
                ◈
              </p>
              <p
                style={{ fontSize: "0.85rem", color: "#333", fontWeight: 300 }}
              >
                Aucune transformation — ajoutez vos avant/après
              </p>
            </div>
          )}
        </>
      )}

      {/* BEFORE/AFTER UPLOAD MODAL */}
      {showBAForm && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowBAForm(false);
          }}
        >
          <div className="modal">
            <h2 className="modal-title">Nouvelle transformation</h2>

            <div className="form-group">
              <label className="form-label">Service concerné *</label>
              <select
                className="form-input service-select"
                value={baServiceId}
                onChange={(e) => setBaServiceId(e.target.value)}
              >
                <option value="">-- Choisir un service --</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Photo Avant *</label>
                <label
                  className={`file-input-label ${baBeforeFile ? "has-file" : ""}`}
                >
                  {baBeforeFile
                    ? `✓ ${baBeforeFile.name}`
                    : "Choisir une photo"}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      setBaBeforeFile(e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Photo Après *</label>
                <label
                  className={`file-input-label ${baAfterFile ? "has-file" : ""}`}
                >
                  {baAfterFile ? `✓ ${baAfterFile.name}` : "Choisir une photo"}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      setBaAfterFile(e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Légende (optionnel)</label>
              <input
                className="form-input"
                placeholder="Ex: Transformation complète — coloration naturelle"
                value={baCaption}
                onChange={(e) => setBaCaption(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowBAForm(false)}
              >
                Annuler
              </button>
              <button
                className="save-btn"
                onClick={handleSaveBA}
                disabled={
                  baUploading || !baBeforeFile || !baAfterFile || !baServiceId
                }
              >
                {baUploading ? "Téléchargement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"

interface StaffMember {
  id: string
  business_id: string
  name: string
  email: string | null
  phone: string | null
  photo_url: string | null
  specialties: string[]
  is_active: boolean
  created_at: string
}

interface Props {
  initialStaff: StaffMember[]
  businessId: string
  planType: string
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const PRESET_SPECIALTIES = [
  "Coiffure",
  "Coloration",
  "Maquillage",
  "Onglerie",
  "Soins du visage",
  "Massage",
  "Épilation",
  "Esthétique"
]

export default function StaffClient({ initialStaff, businessId, planType }: Props) {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [showForm, setShowForm] = useState(false)
  
  // Selected staff for edit (null = create new)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [specialties, setSpecialties] = useState<string[]>([])
  const [isActive, setIsActive] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const staffLimit = planType === "pro" ? 5 : 20 // elite is 20
  const canAddMore = staff.length < staffLimit

  const handleOpenForm = (member?: StaffMember) => {
    if (member) {
      setEditingId(member.id)
      setName(member.name)
      setEmail(member.email || "")
      setPhone(member.phone || "")
      setPhotoUrl(member.photo_url || "")
      setSpecialties(member.specialties || [])
      setIsActive(member.is_active)
    } else {
      setEditingId(null)
      setName("")
      setEmail("")
      setPhone("")
      setPhotoUrl("")
      setSpecialties([])
      setIsActive(true)
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingId(null)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split(".").pop()
      const fileName = `staff/${businessId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("business-asset")
        .upload(fileName, file, { cacheControl: "3600", upsert: false })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("business-asset")
        .getPublicUrl(fileName)

      setPhotoUrl(publicUrl)
    } catch (err: any) {
      console.error("Upload failed", err)
      alert("Erreur lors du téléchargement de la photo.")
    } finally {
      setUploading(false)
    }
  }

  const toggleSpecialty = (spec: string) => {
    setSpecialties(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    )
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    try {
      const payload = {
        business_id: businessId,
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        photo_url: photoUrl || null,
        specialties,
        is_active: isActive
      }

      if (editingId) {
        const { data, error } = await supabase
          .from("staff")
          .update(payload)
          .eq("id", editingId)
          .select()
          .single()
        
        if (error) throw error
        setStaff(prev => prev.map(s => s.id === editingId ? data : s))
      } else {
        const { data, error } = await supabase
          .from("staff")
          .insert(payload)
          .select()
          .single()

        if (error) throw error
        setStaff(prev => [data, ...prev])
      }
      handleCloseForm()
    } catch (err: any) {
      console.error("Save failed", err)
      alert("Erreur lors de l'enregistrement du membre de l'équipe.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce membre de l'équipe ?")) return
    setDeletingId(id)
    try {
      const { error } = await supabase.from("staff").delete().eq("id", id)
      if (error) throw error
      setStaff(prev => prev.filter(s => s.id !== id))
    } catch (err: any) {
      console.error("Delete failed", err)
      alert("Erreur lors de la suppression.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="fade-in">
      <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h2 className="section-title" style={{ marginBottom: "8px" }}>Équipe</h2>
          <p className="section-desc">Gérez les membres de votre équipe et leurs spécialités.</p>
        </div>
        <button
          className="add-btn"
          onClick={() => handleOpenForm()}
          disabled={!canAddMore}
          style={{ cursor: canAddMore ? 'pointer' : 'not-allowed', opacity: canAddMore ? 1 : 0.6 }}
        >
          {canAddMore ? "+ Ajouter un membre" : "Limite atteinte"}
        </button>
      </div>

      <div style={{ marginBottom: "24px", fontSize: "0.9rem", color: "var(--text-light)" }}>
        {staff.length} membre{staff.length !== 1 ? "s" : ""} / {staffLimit} (limite selon votre plan)
      </div>

      <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
        {staff.map(member => (
          <div key={member.id} className="card" style={{ padding: "24px", position: "relative", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div 
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#f0f0f0",
                  backgroundImage: member.photo_url ? `url(${member.photo_url})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#aaa",
                  fontSize: "1.5rem"
                }}
              >
                {!member.photo_url && member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "8px" }}>
                  {member.name}
                  {!member.is_active && <span style={{ fontSize: "0.7rem", backgroundColor: "#fee2e2", color: "#ef4444", padding: "2px 6px", borderRadius: "10px" }}>Inactif</span>}
                </h3>
                <p style={{ margin: "0", fontSize: "0.85rem", color: "var(--text-light)" }}>
                  {member.specialties.join(", ") || "Aucune spécialité"}
                </p>
              </div>
            </div>

            <div style={{ fontSize: "0.85rem", color: "var(--text-light)", display: "flex", flexDirection: "column", gap: "4px" }}>
              {member.phone && <div>📞 {member.phone}</div>}
              {member.email && <div>✉️ {member.email}</div>}
            </div>

            <div style={{ marginTop: "auto", display: "flex", gap: "8px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              <button 
                onClick={() => handleOpenForm(member)}
                style={{ flex: 1, padding: "8px", backgroundColor: "#f8f9fa", border: "1px solid var(--border)", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}
              >
                Modifier
              </button>
              <button 
                onClick={() => handleDelete(member.id)}
                disabled={deletingId === member.id}
                style={{ padding: "8px 16px", backgroundColor: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}
              >
                {deletingId === member.id ? "..." : "Supprimer"}
              </button>
            </div>
          </div>
        ))}

        {staff.length === 0 && (
          <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
            <div className="empty-state-icon">👥</div>
            <p className="empty-state-text">Aucun membre dans l'équipe. Commencez par en ajouter un.</p>
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseForm() }}>
          <div className="modal" style={{ maxWidth: "500px" }}>
            <h2 className="modal-title">{editingId ? "Modifier le membre" : "Ajouter un membre"}</h2>

            <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
              <div 
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#f0f0f0",
                  backgroundImage: photoUrl ? `url(${photoUrl})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  flexShrink: 0
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <label className="upload-btn" style={{ display: "inline-block", cursor: "pointer", padding: "8px 16px", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "0.85rem", marginBottom: "8px" }}>
                  {uploading ? "Téléchargement..." : "Changer la photo"}
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} disabled={uploading} />
                </label>
                <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>JPG ou PNG (max 2MB)</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Nom complet *</label>
              <input 
                className="form-input" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Ex: Sarah Martin"
              />
            </div>

            <div className="form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email"
                  className="form-input" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input 
                  className="form-input" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Spécialités</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
                {PRESET_SPECIALTIES.map(spec => (
                  <button
                    key={spec}
                    onClick={() => toggleSpecialty(spec)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      border: specialties.includes(spec) ? "1px solid var(--primary)" : "1px solid var(--border)",
                      backgroundColor: specialties.includes(spec) ? "#fdf2f8" : "transparent",
                      color: specialties.includes(spec) ? "var(--primary)" : "var(--text-dark)",
                      transition: "all 0.2s"
                    }}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "24px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={isActive} 
                  onChange={e => setIsActive(e.target.checked)} 
                  style={{ width: "16px", height: "16px" }}
                />
                <span style={{ fontSize: "0.9rem", color: "var(--text-dark)" }}>Ce membre est actif (peut recevoir des réservations)</span>
              </label>
            </div>

            <div className="modal-actions" style={{ marginTop: "32px" }}>
              <button className="cancel-btn" onClick={handleCloseForm}>Annuler</button>
              <button className="save-btn" onClick={handleSave} disabled={saving || !name.trim()}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

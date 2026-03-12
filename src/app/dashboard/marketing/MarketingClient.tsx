"use client"

import { useState } from "react"
import { sendCampaign } from "@/app/actions/sendCampaign"

interface Props {
  totalCustomers: number
  planType: string
}

export default function MarketingClient({ totalCustomers, planType }: Props) {
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [segment, setSegment] = useState<"all" | "recent" | "inactive" | "test">("test")
  const [testEmail, setTestEmail] = useState("")
  
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; count?: number; error?: string } | null>(null)

  const isElite = planType === "elite"

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) {
      alert("Veuillez remplir l'objet et le contenu de l'e-mail.")
      return
    }

    if (segment === "test" && !testEmail.trim()) {
      alert("Veuillez indiquer une adresse e-mail de test.")
      return
    }

    if (segment !== "test" && totalCustomers === 0) {
      alert("Vous n'avez aucun client enregistré.")
      return
    }

    const confirmMsg = segment === "test" 
      ? `Envoyer un e-mail de test à ${testEmail} ?`
      : `Êtes-vous sûr de vouloir envoyer cette campagne à ce segment ? Cette action est irréversible.`
      
    if (!confirm(confirmMsg)) return

    setSending(true)
    setResult(null)

    try {
      // Basic HTML formatting for the email
      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="padding: 20px; background-color: #fce7f3; text-align: center;">
            <h1 style="color: #be185d; margin: 0;">BeautyGlow.tn</h1>
          </div>
          <div style="padding: 30px 20px; background-color: #ffffff; border: 1px solid #fbcfe8;">
            ${content.replace(/\n/g, "<br>")}
          </div>
          <div style="padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>Cet e-mail a été envoyé via BeautyGlow.tn</p>
          </div>
        </div>
      `

      const res = await sendCampaign(subject, htmlContent, { segment, testEmail })
      setResult(res)
      if (res.success) {
        setSubject("")
        setContent("")
      }
    } catch (err: any) {
      setResult({ success: false, error: err.message || "Erreur lors de l'envoi." })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fade-in">
      <div className="section-header" style={{ marginBottom: "32px" }}>
        <h2 className="section-title" style={{ marginBottom: "8px" }}>Campagnes d'E-mails</h2>
        <p className="section-desc">Communiquez avec vos clients, annoncez des promotions et fidélisez votre audience.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "32px" }}>
        
        {/* Editor */}
        <div className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div className="form-group">
            <label className="form-label">Segment cible</label>
            <select 
              className="form-select" 
              value={segment} 
              onChange={e => setSegment(e.target.value as any)}
            >
              <option value="test">Envoi de test (1 e-mail)</option>
              <option value="all" disabled={!isElite}>Tous les clients ({totalCustomers}) {isElite ? "" : "- Plan Elite Requis"}</option>
              <option value="recent" disabled={!isElite}>Clients récents (30 derniers jours) {isElite ? "" : "- Plan Elite Requis"}</option>
              <option value="inactive" disabled={!isElite}>Clients inactifs (+90 jours) {isElite ? "" : "- Plan Elite Requis"}</option>
            </select>
          </div>

          {segment === "test" && (
            <div className="form-group">
              <label className="form-label">E-mail de test</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="votre-email@exemple.com"
                value={testEmail}
                onChange={e => setTestEmail(e.target.value)}
              />
              <span style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "4px", display: "block" }}>
                *Avec un compte Resend gratuit, vous ne pouvez envoyer des e-mails qu'aux adresses vérifiées.
              </span>
            </div>
          )}

          <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "8px 0" }} />

          <div className="form-group">
            <label className="form-label">Objet de la campagne</label>
            <input 
              className="form-input" 
              placeholder="Ex: -20% sur les soins du visage cette semaine !" 
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label className="form-label">Corps du message</label>
            <textarea 
              className="form-textarea" 
              style={{ flex: 1, minHeight: "300px", fontFamily: "sans-serif" }}
              placeholder="Rédigez le contenu de votre e-mail ici. Vous pouvez utiliser des sauts de ligne réguliers."
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" }}>
            <div style={{ flex: 1 }}>
              {result && (
                <div style={{ 
                  padding: "12px", 
                  borderRadius: "6px", 
                  backgroundColor: result.success ? "#dcfce7" : "#fee2e2",
                  color: result.success ? "#166534" : "#991b1b",
                  fontSize: "0.9rem",
                  fontWeight: 500
                }}>
                  {result.success 
                    ? `✅ Campagne envoyée avec succès à ${result.count} destinataire(s) !` 
                    : `❌ Erreur : ${result.error}`}
                </div>
              )}
            </div>
            
            <button 
              className="save-btn" 
              style={{ padding: "12px 32px", fontSize: "1rem" }}
              disabled={sending || !subject.trim() || !content.trim() || (segment === "test" && !testEmail.trim())}
              onClick={handleSend}
            >
              {sending ? "Envoi en cours..." : "Envoyer la campagne"}
            </button>
          </div>
        </div>

        {/* Info/Tips Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              💡 Conseils
            </h3>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--text-light)", fontSize: "0.9rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><strong>Soyez direct :</strong> Un objet clair garantit un meilleur taux d'ouverture.</li>
              <li><strong>Personnalisation :</strong> Même un e-mail simple est mieux reçu qu'un e-mail surchargé.</li>
              <li><strong>Appel à l'action :</strong> N'oubliez pas de dire à vos clients ce que vous attendez d'eux (ex: "Réservez dès maintenant !").</li>
            </ul>
          </div>

          <div className="card" style={{ padding: "24px", backgroundColor: "var(--primary)", color: "white" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "1.1rem" }}>La segmentation Elite</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.9rem", opacity: 0.9, lineHeight: 1.5 }}>
              Le plan Elite vous permet de cibler spécifiquement les clients qui ne sont pas venus depuis plus de 90 jours pour les reconquérir, ou les clients récents pour les fidéliser.
            </p>
            {!isElite && (
              <button style={{ backgroundColor: "white", color: "var(--primary)", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", width: "100%" }}>
                Mettre à niveau
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

interface OnboardingClientProps {
  userId: string;
}

export default function OnboardingClient({ userId }: OnboardingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(
    null,
  );
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("lumiere");

  const [form, setForm] = useState({
    business_name: "",
    subdomain: "",
    phone: "",
    address: "",
    description: "",
  });

  const [services, setServices] = useState([
    { name: "", price: "", duration_minutes: "30", category: "haircut" },
  ]);

  const handleSubdomainCheck = async (value: string) => {
    const clean = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setForm((f) => ({ ...f, subdomain: clean }));
    if (clean.length < 3) {
      setSubdomainAvailable(null);
      return;
    }
    setCheckingSubdomain(true);
    const { data } = await supabase
      .from("businesses")
      .select("id")
      .eq("subdomain", clean)
      .single();
    setSubdomainAvailable(!data);
    setCheckingSubdomain(false);
  };

  const handleStep1 = () => {
    if (!form.business_name || !form.subdomain || !form.phone) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (!subdomainAvailable) {
      setError("Ce sous-domaine n'est pas disponible.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleStep2 = () => {
    const valid = services.every((s) => s.name && s.price);
    if (!valid) {
      setError("Veuillez remplir le nom et le prix de chaque service.");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleStep3 = () => {
    setError("");
    setStep(4);
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: business, error: bizError } = await supabase
        .from("businesses")
        .insert({
          owner_id: userId,
          business_name: form.business_name,
          subdomain: form.subdomain,
          phone: form.phone,
          address: form.address || null,
          description: form.description || null,
          plan_type: "trial",
          theme: selectedTheme,
        })
        .select()
        .single();

      if (bizError) throw bizError;

      const validServices = services.filter((s) => s.name && s.price);
      if (validServices.length > 0) {
        await supabase.from("services").insert(
          validServices.map((s, i) => ({
            business_id: business.id,
            name: s.name,
            price: parseFloat(s.price),
            duration_minutes: parseInt(s.duration_minutes),
            category: s.category,
            display_order: i,
            is_active: true,
          })),
        );
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const addService = () => {
    if (services.length < 8) {
      setServices([
        ...services,
        { name: "", price: "", duration_minutes: "30", category: "haircut" },
      ]);
    }
  };

  const removeService = (index: number) => {
    if (services.length > 1)
      setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: string, value: string) => {
    setServices(
      services.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const themes = [
    {
      id: "lumiere",
      name: "Lumière",
      desc: "Élégant · Sombre · Doré",
      colors: ["#0d0d0d", "#c9a96e", "#1a1a1a"],
      soon: false,
    },
    {
      id: "blanc",
      name: "Blanc",
      desc: "Minimaliste · Blanc · Rose",
      colors: ["#ffffff", "#f2a8c4", "#f5f0eb"],
      soon: true,
    },
    {
      id: "eclat",
      name: "Éclat",
      desc: "Audacieux · Noir · Rose vif",
      colors: ["#111111", "#ff2d78", "#1a1a1a"],
      soon: true,
    },
    {
      id: "azur",
      name: "Azur",
      desc: "Frais · Blanc · Bleu ciel",
      colors: ["#f0f7fc", "#4a90b8", "#ffffff"],
      soon: true,
    },
  ];

  const steps = [
    { num: 1, label: "Votre salon" },
    { num: 2, label: "Services" },
    { num: 3, label: "Thème" },
    { num: 4, label: "Confirmation" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: linear-gradient(135deg, #fff5f9 0%, #fdf8f5 50%, #f0f7fc 100%);
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          color: #2a1a12;
        }

        .ob-wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .ob-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          color: #b8934a;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 40px;
        }

        .ob-card {
          background: white;
          border: 1px solid #edd8cc;
          border-radius: 4px;
          padding: 48px;
          width: 100%;
          max-width: 580px;
          box-shadow: 0 8px 40px rgba(224,122,160,0.08);
        }

        /* PROGRESS */
        .progress {
          display: flex;
          align-items: flex-start;
          margin-bottom: 40px;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .progress-row {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .progress-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 600;
          flex-shrink: 0;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }

        .dot-done { background: #b8934a; color: white; }
        .dot-active { background: #e07aa0; color: white; }
        .dot-pending { background: #f5e6de; color: #c4a898; border: 1px solid #edd8cc; }

        .progress-line {
          flex: 1;
          height: 1px;
          background: #edd8cc;
          margin: 0 4px;
          margin-bottom: 16px;
        }

        .progress-line-done { background: #b8934a; }

        .progress-label {
          font-size: 0.58rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-top: 8px;
          color: #c4a898;
          text-align: center;
        }

        .progress-label-active { color: #2a1a12; }

        /* STEP HEADER */
        .step-tag {
          font-size: 0.6rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #e07aa0;
          margin-bottom: 8px;
          display: block;
          font-weight: 500;
        }

        .step-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.9rem;
          font-weight: 300;
          color: #2a1a12;
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .step-sub {
          font-size: 0.82rem;
          color: #8a6a5a;
          margin-bottom: 32px;
          font-weight: 300;
          line-height: 1.6;
        }

        /* FIELDS */
        .field { margin-bottom: 20px; }

        .field label {
          font-size: 0.62rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #8a6a5a;
          display: block;
          margin-bottom: 8px;
        }

        .field input, .field textarea, .field select {
          width: 100%;
          background: #fdf8f5;
          border: 1px solid #edd8cc;
          color: #2a1a12;
          padding: 12px 16px;
          font-size: 0.88rem;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          outline: none;
          transition: border-color 0.2s;
          border-radius: 2px;
        }

        .field input:focus, .field textarea:focus, .field select:focus {
          border-color: #e07aa0;
        }

        .field textarea { resize: vertical; min-height: 80px; }

        .subdomain-wrap { position: relative; }

        .subdomain-suffix {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.72rem;
          color: #c4a898;
          pointer-events: none;
        }

        .subdomain-status {
          font-size: 0.68rem;
          margin-top: 6px;
          display: block;
        }

        .status-available { color: #4caf8a; }
        .status-taken { color: #e07070; }
        .status-checking { color: #8a6a5a; }

        /* SERVICES */
        .service-row {
          background: #fdf8f5;
          border: 1px solid #edd8cc;
          border-radius: 2px;
          padding: 16px;
          margin-bottom: 12px;
        }

        .service-row-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .service-num {
          font-size: 0.6rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #c4a898;
        }

        .btn-remove-service {
          background: none;
          border: none;
          color: #c4a898;
          cursor: pointer;
          font-size: 0.72rem;
          padding: 2px 6px;
          transition: color 0.15s;
          font-family: 'Inter', sans-serif;
        }

        .btn-remove-service:hover { color: #e07070; }

        .service-grid-3 {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
        }

        .field-sm label {
          font-size: 0.58rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #8a6a5a;
          display: block;
          margin-bottom: 6px;
        }

        .field-sm input, .field-sm select {
          width: 100%;
          background: white;
          border: 1px solid #edd8cc;
          color: #2a1a12;
          padding: 9px 12px;
          font-size: 0.82rem;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          outline: none;
          transition: border-color 0.2s;
          border-radius: 2px;
        }

        .field-sm input:focus, .field-sm select:focus { border-color: #e07aa0; }

        .btn-add-service {
          width: 100%;
          background: none;
          border: 1px dashed #edd8cc;
          color: #8a6a5a;
          padding: 12px;
          font-size: 0.7rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.15s;
          border-radius: 2px;
          margin-top: 4px;
        }

        .btn-add-service:hover { border-color: #e07aa0; color: #e07aa0; }

        /* THEME CARDS */
        .theme-card {
          border-radius: 4px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all 0.15s;
          margin-bottom: 12px;
        }

        .theme-card:last-child { margin-bottom: 0; }

        .theme-swatches {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }

        .theme-swatch {
          width: 20px;
          height: 40px;
          border-radius: 2px;
          border: 1px solid rgba(0,0,0,0.08);
        }

        .theme-info { flex: 1; }

        .theme-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.15rem;
          color: #2a1a12;
          margin-bottom: 2px;
        }

        .theme-desc {
          font-size: 0.7rem;
          color: #8a6a5a;
          letter-spacing: 0.5px;
        }

        .theme-badge {
          font-size: 0.55rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 2px;
          font-weight: 600;
          flex-shrink: 0;
          font-family: 'Inter', sans-serif;
        }

        /* PREVIEW */
        .preview-card {
          background: #fdf8f5;
          border: 1px solid #edd8cc;
          border-radius: 2px;
          padding: 24px;
          margin-bottom: 16px;
        }

        .preview-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 400;
          color: #2a1a12;
          margin-bottom: 4px;
        }

        .preview-url {
          font-size: 0.72rem;
          color: #b8934a;
          margin-bottom: 16px;
          display: block;
          letter-spacing: 0.5px;
        }

        .preview-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #edd8cc;
          font-size: 0.82rem;
        }

        .preview-row:last-child { border-bottom: none; }
        .preview-row-label { color: #8a6a5a; }
        .preview-row-value { color: #2a1a12; font-weight: 400; }

        /* ACTIONS */
        .actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .btn-back {
          flex: 1;
          background: none;
          border: 1px solid #edd8cc;
          color: #8a6a5a;
          padding: 14px;
          font-size: 0.68rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.15s;
          border-radius: 2px;
        }

        .btn-back:hover { border-color: #8a6a5a; color: #2a1a12; }

        .btn-next {
          flex: 2;
          background: #e07aa0;
          border: none;
          color: white;
          padding: 14px;
          font-size: 0.68rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          transition: background 0.15s;
          border-radius: 2px;
        }

        .btn-next:hover { background: #f2a8c4; color: #2a1a12; }
        .btn-next:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ERROR */
        .error-msg {
          background: #fce4ef;
          border: 1px solid #f2a8c4;
          color: #c0365a;
          padding: 12px 16px;
          font-size: 0.78rem;
          border-radius: 2px;
          margin-bottom: 20px;
        }

        .trial-note {
          text-align: center;
          font-size: 0.7rem;
          color: #c4a898;
          margin-top: 20px;
          letter-spacing: 0.5px;
        }
      `}</style>

      <div className="ob-wrap">
        <div className="ob-logo">BeautyGlow</div>

        <div className="ob-card">
          {/* ── PROGRESS BAR ── */}
          <div className="progress">
            {steps.map((s, i) => (
              <div key={s.num} className="progress-step">
                <div className="progress-row">
                  <div
                    className={`progress-dot ${step > s.num ? "dot-done" : step === s.num ? "dot-active" : "dot-pending"}`}
                  >
                    {step > s.num ? "✓" : s.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`progress-line ${step > s.num ? "progress-line-done" : ""}`}
                    />
                  )}
                </div>
                <span
                  className={`progress-label ${step >= s.num ? "progress-label-active" : ""}`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {error && <div className="error-msg">{error}</div>}

          {/* ── STEP 1: Business Info ── */}
          {step === 1 && (
            <>
              <span className="step-tag">Étape 1 sur 4</span>
              <h1 className="step-title">Parlez-nous de votre salon</h1>
              <p className="step-sub">
                Ces informations apparaîtront sur votre site public.
              </p>

              <div className="field">
                <label>Nom du salon *</label>
                <input
                  type="text"
                  placeholder="ex: Salon Belle"
                  value={form.business_name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, business_name: e.target.value }))
                  }
                />
              </div>

              <div className="field">
                <label>Adresse de votre site *</label>
                <div className="subdomain-wrap">
                  <input
                    type="text"
                    placeholder="monsalon"
                    value={form.subdomain}
                    onChange={(e) => handleSubdomainCheck(e.target.value)}
                    style={{ paddingRight: "160px" }}
                  />
                  <span className="subdomain-suffix">.beautyglow.tn</span>
                </div>
                {checkingSubdomain && (
                  <span className="subdomain-status status-checking">
                    Vérification...
                  </span>
                )}
                {!checkingSubdomain && subdomainAvailable === true && (
                  <span className="subdomain-status status-available">
                    ✓ Disponible !
                  </span>
                )}
                {!checkingSubdomain && subdomainAvailable === false && (
                  <span className="subdomain-status status-taken">
                    ✕ Déjà pris, essayez un autre
                  </span>
                )}
              </div>

              <div className="field">
                <label>Téléphone *</label>
                <input
                  type="tel"
                  placeholder="+216 XX XXX XXX"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>

              <div className="field">
                <label>Adresse (optionnel)</label>
                <input
                  type="text"
                  placeholder="ex: 12 Avenue Habib Bourguiba, Tunis"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                />
              </div>

              <div className="field">
                <label>Description (optionnel)</label>
                <textarea
                  placeholder="Décrivez votre salon en quelques mots..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>

              <div className="actions">
                <button
                  className="btn-next"
                  style={{ flex: 1 }}
                  onClick={handleStep1}
                >
                  Continuer →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: Services ── */}
          {step === 2 && (
            <>
              <span className="step-tag">Étape 2 sur 4</span>
              <h1 className="step-title">Vos services</h1>
              <p className="step-sub">
                Ajoutez les services que vous proposez. Vous pourrez en ajouter
                d&apos;autres plus tard.
              </p>

              {services.map((service, index) => (
                <div key={index} className="service-row">
                  <div className="service-row-header">
                    <span className="service-num">Service {index + 1}</span>
                    {services.length > 1 && (
                      <button
                        className="btn-remove-service"
                        onClick={() => removeService(index)}
                      >
                        ✕ Supprimer
                      </button>
                    )}
                  </div>
                  <div className="service-grid-3">
                    <div className="field-sm">
                      <label>Nom *</label>
                      <input
                        type="text"
                        placeholder="ex: Coupe femme"
                        value={service.name}
                        onChange={(e) =>
                          updateService(index, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="field-sm">
                      <label>Prix (TND) *</label>
                      <input
                        type="number"
                        placeholder="30"
                        value={service.price}
                        onChange={(e) =>
                          updateService(index, "price", e.target.value)
                        }
                      />
                    </div>
                    <div className="field-sm">
                      <label>Durée (min)</label>
                      <input
                        type="number"
                        placeholder="30"
                        value={service.duration_minutes}
                        onChange={(e) =>
                          updateService(
                            index,
                            "duration_minutes",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="field-sm">
                    <label>Catégorie</label>
                    <select
                      value={service.category}
                      onChange={(e) =>
                        updateService(index, "category", e.target.value)
                      }
                    >
                      <option value="haircut">Coupe</option>
                      <option value="coloring">Coloration</option>
                      <option value="styling">Coiffage</option>
                      <option value="treatment">Soin</option>
                      <option value="nails">Ongles</option>
                      <option value="makeup">Maquillage</option>
                      <option value="facial">Soin visage</option>
                      <option value="massage">Massage</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>
              ))}

              {services.length < 8 && (
                <button className="btn-add-service" onClick={addService}>
                  + Ajouter un service
                </button>
              )}

              <div className="actions">
                <button className="btn-back" onClick={() => setStep(1)}>
                  ← Retour
                </button>
                <button className="btn-next" onClick={handleStep2}>
                  Continuer →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Theme Selection ── */}
          {step === 3 && (
            <>
              <span className="step-tag">Étape 3 sur 4</span>
              <h1 className="step-title">Choisissez votre thème</h1>
              <p className="step-sub">
                Le design de votre site public. Vous pourrez le changer depuis
                vos paramètres.
              </p>

              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className="theme-card"
                  onClick={() => !theme.soon && setSelectedTheme(theme.id)}
                  style={{
                    border:
                      selectedTheme === theme.id
                        ? "2px solid #e07aa0"
                        : "1px solid #edd8cc",
                    background:
                      selectedTheme === theme.id ? "#fff5f9" : "white",
                    opacity: theme.soon ? 0.5 : 1,
                    cursor: theme.soon ? "not-allowed" : "pointer",
                  }}
                >
                  <div className="theme-swatches">
                    {theme.colors.map((color, i) => (
                      <div
                        key={i}
                        className="theme-swatch"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  <div className="theme-info">
                    <div className="theme-name">{theme.name}</div>
                    <div className="theme-desc">{theme.desc}</div>
                  </div>
                  <span
                    className="theme-badge"
                    style={{
                      background: theme.soon
                        ? "#f5e6de"
                        : selectedTheme === theme.id
                          ? "#fce4ef"
                          : "#f5f0eb",
                      color: theme.soon
                        ? "#c4a898"
                        : selectedTheme === theme.id
                          ? "#e07aa0"
                          : "#8a6a5a",
                      border: `1px solid ${theme.soon ? "#edd8cc" : selectedTheme === theme.id ? "#f2a8c4" : "#edd8cc"}`,
                    }}
                  >
                    {theme.soon
                      ? "Bientôt"
                      : selectedTheme === theme.id
                        ? "✓ Sélectionné"
                        : "Disponible"}
                  </span>
                </div>
              ))}

              <div className="actions">
                <button className="btn-back" onClick={() => setStep(2)}>
                  ← Retour
                </button>
                <button className="btn-next" onClick={handleStep3}>
                  Continuer →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 4: Confirmation ── */}
          {step === 4 && (
            <>
              <span className="step-tag">Étape 4 sur 4</span>
              <h1 className="step-title">Tout est prêt !</h1>
              <p className="step-sub">
                Vérifiez vos informations avant de lancer votre site.
              </p>

              <div className="preview-card">
                <div className="preview-title">{form.business_name}</div>
                <span className="preview-url">
                  ✦ {form.subdomain}.beautyglow.tn
                </span>
                <div className="preview-row">
                  <span className="preview-row-label">Téléphone</span>
                  <span className="preview-row-value">{form.phone}</span>
                </div>
                {form.address && (
                  <div className="preview-row">
                    <span className="preview-row-label">Adresse</span>
                    <span className="preview-row-value">{form.address}</span>
                  </div>
                )}
                <div className="preview-row">
                  <span className="preview-row-label">Thème</span>
                  <span
                    className="preview-row-value"
                    style={{ color: "#e07aa0" }}
                  >
                    {themes.find((t) => t.id === selectedTheme)?.name}
                  </span>
                </div>
                <div className="preview-row">
                  <span className="preview-row-label">Plan</span>
                  <span
                    className="preview-row-value"
                    style={{ color: "#b8934a" }}
                  >
                    Essai gratuit 14 jours
                  </span>
                </div>
              </div>

              <div className="preview-card">
                <div
                  style={{
                    fontSize: "0.62rem",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#8a6a5a",
                    marginBottom: "12px",
                  }}
                >
                  Vos services ({services.filter((s) => s.name).length})
                </div>
                {services
                  .filter((s) => s.name)
                  .map((s, i) => (
                    <div key={i} className="preview-row">
                      <span className="preview-row-label">{s.name}</span>
                      <span
                        style={{
                          color: "#b8934a",
                          fontFamily: "Cormorant Garamond",
                          fontSize: "1rem",
                        }}
                      >
                        {s.price} TND
                      </span>
                    </div>
                  ))}
              </div>

              <div className="actions">
                <button className="btn-back" onClick={() => setStep(3)}>
                  ← Retour
                </button>
                <button
                  className="btn-next"
                  onClick={handleFinish}
                  disabled={loading}
                >
                  {loading ? "Création en cours..." : "Lancer mon salon ✦"}
                </button>
              </div>

              <p className="trial-note">
                ✦ 14 jours gratuits — Aucune carte bancaire requise
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

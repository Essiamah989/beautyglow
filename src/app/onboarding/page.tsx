// src/app/onboarding/page.tsx
// Multi-step onboarding wizard for new salon owners
// Step 1: Business info | Step 2: Subdomain | Step 3: Services | Step 4: Logo

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  // Step 2 fields
  const [subdomain, setSubdomain] = useState("");
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(
    null,
  );
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);

  // Step 3 fields
  const [services, setServices] = useState([
    { name: "", price: "", duration: "" },
  ]);

  // Step 4 fields
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [error, setError] = useState("");

  // Check subdomain availability
  const checkSubdomain = async (value: string) => {
    if (value.length < 3) return;
    setCheckingSubdomain(true);

    const { data } = await supabase
      .from("businesses")
      .select("id")
      .eq("subdomain", value)
      .single();

    setSubdomainAvailable(!data);
    setCheckingSubdomain(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "60px auto", padding: "20px" }}>
      <h1>Set up your salon — Step {step} of 4</h1>

      {/* STEP 1: Business Info */}
      {step === 1 && (
        <div>
          <h2>Business Information</h2>
          <input
            placeholder="Salon name *"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "10px",
              padding: "8px",
            }}
          />
          <input
            placeholder="Phone number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "10px",
              padding: "8px",
            }}
          />
          <input
            placeholder="Address *"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "10px",
              padding: "8px",
            }}
          />
          <textarea
            placeholder="Short description of your salon"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "10px",
              padding: "8px",
              height: "100px",
            }}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            onClick={() => {
              if (!businessName || !phone || !address) {
                setError("Please fill in all required fields");
                return;
              }
              setError("");
              setStep(2);
            }}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Next →
          </button>
        </div>
      )}

      {/* STEP 2: Subdomain */}
      {step === 2 && (
        <div>
          <h2>Choose your website address</h2>
          <p style={{ color: "#666" }}>
            Your salon will be at:{" "}
            <strong>{subdomain || "yourname"}.beautyglow.tn</strong>
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
            }}
          >
            <input
              placeholder="yourname"
              value={subdomain}
              onChange={(e) => {
                const value = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, "");
                setSubdomain(value);
                setSubdomainAvailable(null);
              }}
              style={{ padding: "8px", flex: 1 }}
            />
            <span>.beautyglow.tn</span>
          </div>
          <button
            onClick={() => checkSubdomain(subdomain)}
            disabled={subdomain.length < 3 || checkingSubdomain}
            style={{
              padding: "8px 16px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            {checkingSubdomain ? "Checking..." : "Check availability"}
          </button>
          {subdomainAvailable === true && (
            <p style={{ color: "green" }}>
              ✅ {subdomain}.beautyglow.tn is available!
            </p>
          )}
          {subdomainAvailable === false && (
            <p style={{ color: "red" }}>❌ Already taken, try another name</p>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              onClick={() => setStep(1)}
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              ← Back
            </button>
            <button
              onClick={() => {
                if (!subdomainAvailable) {
                  setError("Please choose an available subdomain");
                  return;
                }
                setError("");
                setStep(3);
              }}
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Services */}
      {step === 3 && (
        <div>
          <h2>Add your services</h2>
          <p style={{ color: "#666" }}>
            Add at least one service. You can add more later.
          </p>
          {services.map((service, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "6px",
              }}
            >
              <input
                placeholder="Service name (e.g. Coupe Femme) *"
                value={service.name}
                onChange={(e) => {
                  const updated = [...services];
                  updated[index].name = e.target.value;
                  setServices(updated);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "8px",
                  padding: "8px",
                }}
              />
              <input
                placeholder="Price in TND (e.g. 30) *"
                value={service.price}
                onChange={(e) => {
                  const updated = [...services];
                  updated[index].price = e.target.value;
                  setServices(updated);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  marginBottom: "8px",
                  padding: "8px",
                }}
              />
              <input
                placeholder="Duration in minutes (e.g. 30) *"
                value={service.duration}
                onChange={(e) => {
                  const updated = [...services];
                  updated[index].duration = e.target.value;
                  setServices(updated);
                }}
                style={{ display: "block", width: "100%", padding: "8px" }}
              />
            </div>
          ))}
          {services.length < 5 && (
            <button
              onClick={() =>
                setServices([
                  ...services,
                  { name: "", price: "", duration: "" },
                ])
              }
              style={{
                padding: "8px 16px",
                marginBottom: "20px",
                cursor: "pointer",
              }}
            >
              + Add another service
            </button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setStep(2)}
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              ← Back
            </button>
            <button
              onClick={() => {
                const validServices = services.filter(
                  (s) => s.name && s.price && s.duration,
                );
                if (validServices.length === 0) {
                  setError("Please add at least one complete service");
                  return;
                }
                setError("");
                setStep(4);
              }}
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Logo Upload */}
      {step === 4 && (
        <div>
          <h2>Upload your salon logo</h2>
          <p style={{ color: "#666" }}>
            Optional — you can add this later from your dashboard.
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setLogoFile(file);
              const reader = new FileReader();
              reader.onload = () => setLogoPreview(reader.result as string);
              reader.readAsDataURL(file);
            }}
            style={{ marginBottom: "10px" }}
          />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo preview"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              onClick={() => setStep(3)}
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(5)}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                background: "#ccc",
              }}
            >
              Skip for now
            </button>
            <button
              onClick={() => setStep(5)}
              disabled={!logoFile}
              style={{ padding: "10px 20px", cursor: "pointer" }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Confirm — Coming Day 7 */}
      {step === 5 && (
        <div>
          <h2>Almost done!</h2>
          <p>Save to database coming in Day 7...</p>
          <button
            onClick={() => setStep(4)}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}

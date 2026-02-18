// src/app/auth/login/page.tsx
// Public page — allows existing salon owners to log in
// On success, redirects to /dashboard

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Redirect to dashboard after successful login
    router.push("/dashboard");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px" }}>
      <h1>Login to BeautyGlow</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          marginBottom: "10px",
          padding: "8px",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          marginBottom: "10px",
          padding: "8px",
        }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p style={{ marginTop: "20px" }}>
        Don&apos;t have an account? <a href="/auth/signup">Sign Up</a>
      </p>
    </div>
  );
}

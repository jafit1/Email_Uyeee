"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      if (!res.ok) throw new Error("Login gagal atau akun sedang terkunci.");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card card">
        <div className="auth-heading">
          <p className="auth-kicker">PERSONAL EMAIL VAULT</p>
          <h1>Masuk</h1>
          <p>Gunakan akun master untuk membuka vault.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email master
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <label>
            Master password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? "Memeriksa..." : "Masuk ke Vault"}
          </button>
        </form>
      </section>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 1.5rem;
        }
        .auth-card { width: min(100%, 26rem); padding: 2rem; }
        .auth-heading { margin-bottom: 1.75rem; }
        .auth-kicker { color: var(--accent); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
        h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.375rem; }
        .auth-heading > p:last-child { color: var(--text-muted); font-size: 0.875rem; }
        .auth-form { display: grid; gap: 1rem; }
        label { display: grid; gap: 0.375rem; font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); }
        .auth-submit { justify-content: center; width: 100%; margin-top: 0.5rem; }
        .form-error { color: var(--danger); font-size: 0.875rem; }
      `}</style>
    </main>
  );
}

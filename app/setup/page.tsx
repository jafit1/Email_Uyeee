"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Setup() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));

    if (password !== String(form.get("confirm"))) {
      setError("Password tidak sama.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password }),
      });

      if (!res.ok) throw new Error("Setup gagal. Gunakan password minimal 12 karakter.");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="setup-page">
      <section className="setup-card card">
        <div className="setup-heading">
          <p className="setup-kicker">PERSONAL EMAIL VAULT</p>
          <h1>Buat Vault</h1>
          <p>Atur akun master pertama. Password tidak dapat dipulihkan.</p>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          <label>
            Email master
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <label>
            Master password
            <input name="password" type="password" minLength={12} autoComplete="new-password" placeholder="Minimal 12 karakter" required />
          </label>
          <label>
            Ulangi master password
            <input name="confirm" type="password" autoComplete="new-password" required />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary setup-submit" disabled={submitting}>
            {submitting ? "Membuat..." : "Buat Vault"}
          </button>
        </form>
      </section>

      <style jsx>{`
        .setup-page { min-height: 100vh; display: grid; place-items: center; padding: 1.5rem; }
        .setup-card { width: min(100%, 28rem); padding: 2rem; }
        .setup-heading { margin-bottom: 1.75rem; }
        .setup-kicker { color: var(--accent); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
        h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.375rem; }
        .setup-heading > p:last-child { color: var(--text-muted); font-size: 0.875rem; line-height: 1.5; }
        .setup-form { display: grid; gap: 1rem; }
        label { display: grid; gap: 0.375rem; font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); }
        .setup-submit { justify-content: center; width: 100%; margin-top: 0.5rem; }
        .form-error { color: var(--danger); font-size: 0.875rem; }
      `}</style>
    </main>
  );
}

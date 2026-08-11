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
    <main className="min-h-screen grid place-items-center p-6">
      <section className="card w-full max-w-md p-8">
        <div className="mb-7">
          <p className="mb-2 text-xs font-bold tracking-[0.08em]" style={{ color: "var(--accent)" }}>
            PERSONAL EMAIL VAULT
          </p>
          <h1 className="mb-1 text-3xl font-bold">Buat Vault</h1>
          <p className="text-sm leading-6" style={{ color: "var(--text-muted)" }}>
            Atur akun master pertama. Password tidak dapat dipulihkan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            Email master
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            Master password
            <input name="password" type="password" minLength={12} autoComplete="new-password" placeholder="Minimal 12 karakter" required />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            Ulangi master password
            <input name="confirm" type="password" autoComplete="new-password" required />
          </label>
          {error && <p className="text-sm" style={{ color: "var(--danger)" }} role="alert">{error}</p>}
          <button type="submit" className="btn btn-primary mt-2 w-full justify-center" disabled={submitting}>
            {submitting ? "Membuat..." : "Buat Vault"}
          </button>
        </form>
      </section>
    </main>
  );
}

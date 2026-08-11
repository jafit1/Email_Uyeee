"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Setup() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    const confirm = String(form.get("confirm"));
    const email = String(form.get("email"));

    if (password !== confirm) {
      setError("Password tidak sama.");
      return;
    }

    const res = await fetch("/api/auth/setup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Setup gagal. Gunakan password minimal 12 karakter.");
    }
  }

  return (
    <main className="max-w-md mx-auto p-4">
      <section className="card">
        <h1 className="text-2xl font-bold mb-2">Setup Vault</h1>
        <p className="text-slate-400 mb-6">Buat akun master pertama.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="email" type="email" placeholder="Email master" required />
          <input
            name="password"
            type="password"
            minLength={12}
            placeholder="Master password, min. 12 karakter"
            required
          />
          <input
            name="confirm"
            type="password"
            placeholder="Ulangi password"
            required
          />
          <button type="submit" className="w-full">
            Buat vault
          </button>
        </form>
        {error && <p className="text-red-300 mt-3">{error}</p>}
      </section>
    </main>
  );
}

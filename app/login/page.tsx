"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Login gagal atau terkunci.");
    }
  }

  return (
    <main className="max-w-md mx-auto p-4">
      <section className="card">
        <h1 className="text-2xl font-bold mb-6">Personal Email Vault</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="email" type="email" placeholder="Email master" required />
          <input
            name="password"
            type="password"
            placeholder="Master password"
            required
          />
          <button type="submit" className="w-full">
            Login
          </button>
        </form>
        {error && <p className="text-red-300 mt-3">{error}</p>}
      </section>
    </main>
  );
}

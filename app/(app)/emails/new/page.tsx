"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/toast";

type Label = { id: string; name: string };

export default function NewEmail() {
  const router = useRouter();
  const toast = useToast();
  const [labels, setLabels] = useState<Label[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/labels")
      .then((r) => r.json())
      .then(setLabels)
      .catch(() => {});
  }, []);

  function toggleLabel(id: string) {
    setSelectedLabels((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData(e.currentTarget);
      const value = (name: string) => String(form.get(name) || "") || null;
      const body = {
        email: String(form.get("email")),
        alias: value("alias"),
        provider: value("provider"),
        loginUrl: value("loginUrl"),
        username: value("username"),
        password: value("password"),
        twoFactorType: value("twoFactorType"),
        totpSecret: value("totpSecret"),
        recoveryCodes: value("recoveryCodes"),
        notes: value("notes"),
        labelIds: selectedLabels,
      };

      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Gagal menyimpan");
      }

      toast("Akun email berhasil disimpan", "success");
      router.push("/emails");
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Link href="/emails" style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
        ← Kembali
      </Link>
      <h1 className="text-2xl font-bold my-4">Tambah Akun</h1>
      <form onSubmit={handleSubmit} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div>
          <label style={{ fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.25rem", display: "block", color: "var(--text-muted)" }}>
            Email *
          </label>
          <input name="email" type="email" placeholder="user@example.com" required />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label style={{ fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.25rem", display: "block", color: "var(--text-muted)" }}>
              Nama/alias
            </label>
            <input name="alias" placeholder="Alias opsional" />
          </div>
          <div>
            <label style={{ fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.25rem", display: "block", color: "var(--text-muted)" }}>
              Provider
            </label>
            <input name="provider" placeholder="Gmail, Outlook, dll" />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.25rem", display: "block", color: "var(--text-muted)" }}>
            URL Login
          </label>
          <input name="loginUrl" type="url" placeholder="https://..." />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label style={{ fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.25rem", display: "block", color: "var(--text-muted)" }}>
              Username
            </label>
            <input name="username" placeholder="Username" />
          </div>
          <div>
            <label style={{ fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.25rem", display: "block", color: "var(--text-muted)" }}>
              Password
            </label>
            <input name="password" type="password" placeholder="Opsional" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label style={{ fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.25rem", display: "block", color: "var(--text-muted)" }}>
              Tipe 2FA
            </label>
            <input name="twoFactorType" placeholder="TOTP, SMS, dll" />
          </div>
          <div>
            <label style={{ fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.25rem", display: "block", color: "var(--text-muted)" }}>
              TOTP Secret
            </label>
            <input name="totpSecret" placeholder="Opsional" />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.25rem", display: "block", color: "var(--text-muted)" }}>
            Recovery Codes
          </label>
          <textarea name="recoveryCodes" placeholder="Opsional, satu per baris" rows={3} />
        </div>
        <div>
          <label style={{ fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.25rem", display: "block", color: "var(--text-muted)" }}>
            Catatan
          </label>
          <textarea name="notes" placeholder="Catatan privat opsional" rows={2} />
        </div>

        {labels.length > 0 && (
          <div>
            <label style={{ fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.5rem", display: "block", color: "var(--text-muted)" }}>
              Label
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {labels.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => toggleLabel(l.id)}
                  className={`badge`}
                  style={{
                    cursor: "pointer",
                    background: selectedLabels.includes(l.id) ? "var(--accent)" : undefined,
                    color: selectedLabels.includes(l.id) ? "#fff" : undefined,
                    borderColor: selectedLabels.includes(l.id) ? "var(--accent)" : undefined,
                  }}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: "0.5rem" }}>
          {submitting ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </>
  );
}

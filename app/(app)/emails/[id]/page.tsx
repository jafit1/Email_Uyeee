"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast";
import { CardSkeleton } from "@/components/skeleton";

type Account = {
  email: string;
  alias?: string;
  provider?: string;
  loginUrl?: string;
  username?: string;
  twoFactorType?: string;
};

export default function EmailDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState("");
  const [reAuthPw, setReAuthPw] = useState("");
  const [revealKind, setRevealKind] = useState<"password" | "totp" | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetch(`/api/emails/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setAccount)
      .catch(() => toast("Gagal memuat data", "error"))
      .finally(() => setLoading(false));
  }, [id]);

  async function reveal() {
    if (!reAuthPw || !revealKind) return;
    try {
      const res = await fetch(`/api/emails/${id}/reveal-${revealKind}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: reAuthPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal");
      setSecret(data.value);
      setRevealKind(null);
      setReAuthPw("");
    } catch (err: any) {
      toast(err.message, "error");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/emails/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast("Akun email dihapus", "success");
      router.push("/emails");
    } catch (err: any) {
      toast(err.message, "error");
      setDeleting(false);
    }
  }

  function copyTo(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast(`${label} disalin`, "info");
  }

  if (loading) {
    return (
      <>
        <CardSkeleton />
        <div style={{ marginTop: "1rem" }}>
          <CardSkeleton />
        </div>
      </>
    );
  }

  if (!account) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>😵</p>
        <p>Akun tidak ditemukan</p>
        <Link href="/emails" className="btn btn-ghost" style={{ marginTop: "1rem", display: "inline-flex" }}>
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <>
      <Link href="/emails" style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
        ← Kembali
      </Link>

      <section className="card" style={{ marginTop: "1rem" }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold">{account.email}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              {account.alias}{account.provider && ` · ${account.provider}`}
            </p>
          </div>
          {account.loginUrl && (
            <a href={account.loginUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
              Login ↗
            </a>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
          <button className="btn btn-ghost btn-sm" onClick={() => copyTo(account.email, "Email")}>
            📋 Email
          </button>
          {account.username && (
            <button className="btn btn-ghost btn-sm" onClick={() => copyTo(account.username!, "Username")}>
              📋 Username
            </button>
          )}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setRevealKind("password"); setSecret(""); }}
          >
            🔑 Password
          </button>
          {account.twoFactorType && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setRevealKind("totp"); setSecret(""); }}
            >
              🔐 TOTP
            </button>
          )}
        </div>

        {secret && (
          <div
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              fontFamily: "monospace",
              fontSize: "0.875rem",
              overflowX: "auto",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <code>{secret}</code>
            <button className="btn btn-ghost btn-sm" onClick={() => copyTo(secret, "Secret")}>
              📋
            </button>
          </div>
        )}

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "0.5rem" }}>
          {confirmDelete ? (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", color: "var(--danger)" }}>Yakin hapus?</span>
              <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Menghapus..." : "Ya, hapus"}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>
                Batal
              </button>
            </div>
          ) : (
            <button className="btn btn-ghost btn-sm" style={{ color: "var(--danger)" }} onClick={() => setConfirmDelete(true)}>
              🗑️ Hapus akun
            </button>
          )}
        </div>
      </section>

      {/* Re-auth modal */}
      {revealKind && (
        <div className="modal-overlay" onClick={() => setRevealKind(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-3">
              Konfirmasi untuk {revealKind === "password" ? "Password" : "TOTP"}
            </h3>
            <input
              type="password"
              placeholder="Master password"
              value={reAuthPw}
              onChange={(e) => setReAuthPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && reveal()}
              autoFocus
            />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", justifyContent: "flex-end" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setRevealKind(null)}>
                Batal
              </button>
              <button className="btn btn-primary btn-sm" onClick={reveal}>
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

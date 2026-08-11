"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TableSkeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";

type Account = {
  id: string;
  email: string;
  alias?: string;
  provider?: string;
  labels: { label: { id: string; name: string; color: string } }[];
};

export default function Emails() {
  const [items, setItems] = useState<Account[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(search = "") {
    try {
      setError("");
      const res = await fetch(`/api/emails?q=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error("Gagal memuat data");
      setItems(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Email</h1>
        <Link href="/emails/new" className="btn btn-primary">
          + Tambah
        </Link>
      </div>

      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            load(e.target.value);
          }}
          placeholder="Cari email, provider, label..."
        />
      </div>

      {error && (
        <div className="card mb-4" style={{ borderColor: "var(--danger)", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={5} cols={3} />
      ) : items.length === 0 ? (
        q ? (
          <EmptyState
            icon="🔍"
            title="Tidak ditemukan"
            description={`Tidak ada hasil untuk "${q}"`}
          />
        ) : (
          <EmptyState
            icon="📧"
            title="Belum ada akun email"
            description="Simpan akun email pertamamu"
            action={{ label: "Tambah Email", href: "/emails/new" }}
          />
        )
      ) : (
        <div className="card overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Provider</th>
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link href={`/emails/${a.id}`}>{a.email}</Link>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{a.provider || "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                      {a.labels.map((x) => (
                        <span key={x.label.id} className="badge">
                          {x.label.name}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

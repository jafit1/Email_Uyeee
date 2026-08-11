"use client";

import { useEffect, useState } from "react";
import { TableSkeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";

type Log = {
  id: string;
  action: string;
  targetId?: string;
  createdAt: string;
};

const ACTION_LABELS: Record<string, { icon: string; label: string }> = {
  LOGIN: { icon: "🔓", label: "Login" },
  LOGOUT: { icon: "🔒", label: "Logout" },
  CREATE_ACCOUNT: { icon: "➕", label: "Buat akun" },
  UPDATE_ACCOUNT: { icon: "✏️", label: "Edit akun" },
  DELETE_ACCOUNT: { icon: "🗑️", label: "Hapus akun" },
  REVEAL_PASSWORD: { icon: "🔑", label: "Lihat password" },
  REVEAL_TOTP: { icon: "🔐", label: "Lihat TOTP" },
};

export default function AuditLog() {
  const [items, setItems] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit-logs")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Audit Log</h1>

      {loading ? (
        <TableSkeleton rows={8} cols={3} />
      ) : items.length === 0 ? (
        <EmptyState icon="📋" title="Belum ada aktivitas" description="Semua aktivitas akan tercatat di sini" />
      ) : (
        <div className="card overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Aksi</th>
                <th>Target</th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => {
                const info = ACTION_LABELS[x.action] || { icon: "📝", label: x.action };
                return (
                  <tr key={x.id}>
                    <td style={{ whiteSpace: "nowrap", color: "var(--text-muted)" }}>
                      {new Date(x.createdAt).toLocaleString("id-ID")}
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                        {info.icon} {info.label}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontFamily: "monospace", fontSize: "0.8125rem" }}>
                      {x.targetId ? x.targetId.slice(0, 8) + "…" : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

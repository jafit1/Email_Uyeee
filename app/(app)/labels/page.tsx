"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/toast";
import { EmptyState } from "@/components/empty-state";
import { TableSkeleton } from "@/components/skeleton";

type Label = {
  id: string;
  name: string;
  color: string;
  _count: { accounts: number };
};

export default function Labels() {
  const [items, setItems] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  function load() {
    fetch("/api/labels")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => toast("Gagal memuat label", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/labels", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          color: form.get("color"),
        }),
      });
      if (!res.ok) throw new Error("Gagal menambah label");
      toast("Label ditambahkan", "success");
      e.currentTarget.reset();
      load();
    } catch (err: any) {
      toast(err.message, "error");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus label "${name}"?`)) return;
    try {
      const res = await fetch(`/api/labels/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast("Label dihapus", "success");
      load();
    } catch (err: any) {
      toast(err.message, "error");
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Label</h1>

      <form
        onSubmit={handleAdd}
        className="card mb-4"
        style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end", flexWrap: "wrap" }}
      >
        <div style={{ flex: 1, minWidth: "10rem" }}>
          <label style={{ fontSize: "0.8125rem", fontWeight: 500, display: "block", marginBottom: "0.25rem", color: "var(--text-muted)" }}>
            Nama label
          </label>
          <input name="name" placeholder="Contoh: Personal" required />
        </div>
        <div>
          <label style={{ fontSize: "0.8125rem", fontWeight: 500, display: "block", marginBottom: "0.25rem", color: "var(--text-muted)" }}>
            Warna
          </label>
          <input name="color" type="color" defaultValue="#64748b" style={{ width: "3rem", height: "2.375rem", padding: "0.25rem" }} />
        </div>
        <button type="submit" className="btn btn-primary">
          Tambah
        </button>
      </form>

      {loading ? (
        <TableSkeleton rows={3} cols={2} />
      ) : items.length === 0 ? (
        <EmptyState icon="🏷️" title="Belum ada label" description="Buat label untuk mengelompokkan akun email" />
      ) : (
        <div className="card overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Label</th>
                <th>Jumlah Akun</th>
                <th style={{ width: "4rem" }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.id}>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: "0.75rem",
                          height: "0.75rem",
                          borderRadius: "50%",
                          background: x.color,
                        }}
                      />
                      {x.name}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{x._count.accounts}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: "var(--danger)" }}
                      onClick={() => handleDelete(x.id, x.name)}
                    >
                      🗑️
                    </button>
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

  async function load(search = "") {
    const res = await fetch(`/api/emails?q=${encodeURIComponent(search)}`);
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <Link href="/dashboard">Email Vault</Link>
        <Link href="/emails/new">+ Tambah</Link>
      </header>

      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          load(e.target.value);
        }}
        placeholder="Cari email, provider, nama, label"
      />

      <section className="card mt-4 overflow-auto">
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
                <td>{a.provider || "-"}</td>
                <td>
                  {a.labels.map((x) => (
                    <span key={x.label.id} className="mr-2">
                      {x.label.name}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

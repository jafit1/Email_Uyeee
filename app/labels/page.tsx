"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Label = {
  id: string;
  name: string;
  color: string;
  _count: { accounts: number };
};

export default function Labels() {
  const [items, setItems] = useState<Label[]>([]);

  function load() {
    fetch("/api/labels")
      .then((r) => r.json())
      .then(setItems);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    await fetch("/api/labels", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        color: form.get("color"),
      }),
    });

    load();
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <Link href="/dashboard">Kembali</Link>
      <h1 className="text-2xl font-bold my-6">Label</h1>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input name="name" placeholder="Nama label" required />
        <input name="color" type="color" defaultValue="#64748b" />
        <button type="submit">Tambah</button>
      </form>

      <section className="card mt-4">
        {items.map((x) => (
          <p key={x.id}>
            <span style={{ color: x.color }}>●</span> {x.name} ({x._count.accounts})
          </p>
        ))}
      </section>
    </main>
  );
}

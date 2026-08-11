"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Log = {
  id: string;
  action: string;
  targetId?: string;
  createdAt: string;
};

export default function AuditLog() {
  const [items, setItems] = useState<Log[]>([]);

  useEffect(() => {
    fetch("/api/audit-logs")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-4">
      <Link href="/dashboard">Kembali</Link>
      <h1 className="text-2xl font-bold my-6">Audit Log</h1>
      <section className="card">
        {items.map((x) => (
          <p key={x.id}>
            {new Date(x.createdAt).toLocaleString()} · {x.action}
          </p>
        ))}
      </section>
    </main>
  );
}

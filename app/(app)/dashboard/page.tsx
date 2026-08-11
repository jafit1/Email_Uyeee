import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/empty-state";

export default async function Dashboard() {
  let user;
  try {
    user = await requireUser();
  } catch {
    redirect("/login");
  }

  const [total, labels, recent] = await Promise.all([
    db.emailAccount.count({ where: { userId: user!.id } }),
    db.label.findMany({
      where: { userId: user!.id },
      include: { _count: { select: { accounts: true } } },
    }),
    db.emailAccount.findMany({
      where: { userId: user!.id },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, provider: true },
    }),
  ]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <section className="card">
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Total akun</p>
          <p className="text-4xl font-bold">{total}</p>
        </section>
        <section className="card">
          <p className="font-semibold mb-2">Label</p>
          {labels.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {labels.map((l) => (
                <span key={l.id} className="badge">
                  {l.name} <strong>{l._count.accounts}</strong>
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Belum ada label</p>
          )}
        </section>
      </div>

      <section className="card">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Akun terbaru</h2>
          <Link href="/emails" className="text-sm" style={{ color: "var(--accent)" }}>
            Lihat semua →
          </Link>
        </div>
        {recent.length > 0 ? (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Provider</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link href={`/emails/${a.id}`}>{a.email}</Link>
                    </td>
                    <td style={{ color: "var(--text-muted)" }}>{a.provider || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon="📧"
            title="Belum ada akun email"
            description="Mulai simpan akun email pertamamu"
            action={{ label: "Tambah Email", href: "/emails/new" }}
          />
        )}
      </section>
    </>
  );
}

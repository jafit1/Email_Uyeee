import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

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
    <main className="max-w-4xl mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Email Vault</h1>
        <form action="/api/auth/logout" method="post">
          <button type="submit">Logout</button>
        </form>
      </header>

      <nav className="mb-6 flex gap-4">
        <Link href="/emails">Daftar Email</Link>
        <Link href="/labels">Label</Link>
        <Link href="/audit">Audit Log</Link>
        <Link href="/settings">Security</Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="card">
          <p className="text-slate-400">Total akun</p>
          <p className="text-4xl font-bold">{total}</p>
        </section>
        <section className="card">
          <p className="font-semibold mb-2">Label</p>
          {labels.length > 0
            ? labels.map((l) => (
                <p key={l.id}>
                  {l.name}: {l._count.accounts}
                </p>
              ))
            : "Belum ada label"}
        </section>
      </div>

      <section className="card mt-4">
        <h2 className="font-semibold mb-2">Akun terbaru</h2>
        {recent.map((a) => (
          <p key={a.id}>
            <Link href={`/emails/${a.id}`}>{a.email}</Link>{" "}
            {a.provider && `(${a.provider})`}
          </p>
        ))}
      </section>
    </main>
  );
}

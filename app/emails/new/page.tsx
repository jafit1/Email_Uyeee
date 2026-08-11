"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewEmail() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form);

    const res = await fetch("/api/emails", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...body, labelIds: [] }),
    });

    if (res.ok) router.push("/emails");
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <Link href="/emails">Kembali</Link>
      <h1 className="text-2xl font-bold my-6">Tambah Akun</h1>
      <form onSubmit={handleSubmit} className="card space-y-3">
        <input name="email" type="email" placeholder="Email" required />
        <input name="alias" placeholder="Nama/alias" />
        <input name="provider" placeholder="Provider" />
        <input name="loginUrl" type="url" placeholder="URL login" />
        <input name="username" placeholder="Username" />
        <input name="password" type="password" placeholder="Password opsional" />
        <input name="twoFactorType" placeholder="Tipe 2FA" />
        <input name="totpSecret" placeholder="TOTP secret opsional" />
        <textarea name="recoveryCodes" placeholder="Recovery codes opsional" />
        <textarea name="notes" placeholder="Catatan privat opsional" />
        <button type="submit">Simpan</button>
      </form>
    </main>
  );
}

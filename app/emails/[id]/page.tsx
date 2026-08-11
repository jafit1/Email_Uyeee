"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

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
  const [account, setAccount] = useState<Account | null>(null);
  const [secret, setSecret] = useState("");

  useEffect(() => {
    fetch(`/api/emails/${id}`)
      .then((r) => r.json())
      .then(setAccount);
  }, [id]);

  async function reveal(kind: "password" | "totp") {
    const password = prompt("Masukkan ulang master password");
    if (!password) return;

    const res = await fetch(`/api/emails/${id}/reveal-${kind}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    setSecret(data.value || data.error);
  }

  if (!account) return <main className="max-w-2xl mx-auto p-4">Memuat...</main>;

  const masked = account.email.replace(/^(.{2}).*(@.*)$/, "$1***$2");

  return (
    <main className="max-w-2xl mx-auto p-4">
      <Link href="/emails">Kembali</Link>
      <section className="card mt-6 space-y-3">
        <h1 className="text-2xl font-bold">{masked}</h1>
        <p>
          {account.alias} {account.provider && `· ${account.provider}`}
        </p>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigator.clipboard.writeText(account.email)}>
            Copy Email
          </button>
          {account.username && (
            <button
              onClick={() => navigator.clipboard.writeText(account.username!)}
            >
              Copy Username
            </button>
          )}
          {account.loginUrl && (
            <a
              className="ml-3"
              href={account.loginUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open Login URL
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => reveal("password")}>Reveal Password</button>
          <button onClick={() => reveal("totp")}>Reveal TOTP</button>
        </div>

        {secret && (
          <pre className="p-3 bg-slate-950 overflow-auto">{secret}</pre>
        )}

        <p className="text-sm text-slate-400">
          Autofill extension belum tersedia. Copy Email lalu buka URL login.
          Jangan auto-submit, CAPTCHA, OTP, atau 2FA.
        </p>
      </section>
    </main>
  );
}

export default function Settings() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Keamanan</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <section className="card">
          <h2 className="font-semibold mb-2">🔒 Sesi & Autentikasi</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            Session memakai cookie HttpOnly, SameSite=Strict, timeout server-side.
            Login terkunci 15 menit setelah 5 kegagalan berturut-turut.
          </p>
        </section>

        <section className="card">
          <h2 className="font-semibold mb-2">⚠️ Peringatan</h2>
          <p style={{ color: "var(--warning)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            Menyimpan password dan 2FA dalam vault yang sama meningkatkan risiko.
            Semua field sensitif bersifat opsional — hanya simpan yang diperlukan.
          </p>
        </section>

        <section className="card">
          <h2 className="font-semibold mb-2">🔐 Enkripsi</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            Field sensitif (password, TOTP secret, recovery codes, catatan) dienkripsi
            dengan AES-256-GCM sebelum disimpan ke database.
          </p>
        </section>

        <section className="card">
          <h2 className="font-semibold mb-2">📦 Ekspor Data</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>
            Export dinonaktifkan. Tambahkan hanya bila desain enkripsi memakai
            password export terpisah, re-authentication, serta audit.
          </p>
        </section>
      </div>
    </>
  );
}

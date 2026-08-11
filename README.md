# Personal Email Vault

Vault email pribadi. Next.js, TypeScript, Prisma/PostgreSQL, Argon2id, AES-256-GCM.

## Jalankan

1. Salin `.env.example` menjadi `.env`, isi `VAULT_ENCRYPTION_KEY` dengan 32 random bytes base64.
2. Jalankan PostgreSQL: `docker compose up -d`.
3. Instal: `npm install`.
4. Generate/migrasi: `npm run prisma:generate` lalu `npm run prisma:migrate -- --name init`.
5. Jalankan: `npm run dev`.
6. Buka `http://localhost:3000`, buat master account pertama.

Docker CLI tidak tersedia pada mesin ini. PostgreSQL lokal dapat dipakai dengan mengganti `DATABASE_URL`.

## Keamanan

- Master password di-hash Argon2id. Tidak pernah disimpan plaintext.
- Password email, secret TOTP, recovery codes, catatan dienkripsi AES-256-GCM memakai `VAULT_ENCRYPTION_KEY` server-side.
- API daftar/detail tidak mengembalikan secret. Reveal password/TOTP perlu master password ulang, tercatat audit log.
- Session token acak tersimpan hash di DB; cookie `HttpOnly`, `SameSite=Strict`, `Secure` pada produksi; timeout default 8 jam.
- Login lockout: 5 gagal, 15 menit. API memiliki pemeriksaan `Origin` untuk mutasi lintas situs. Header CSP, anti-frame, no-referrer, nosniff aktif.
- Zod memvalidasi input. Prisma memakai query parameterized. Tidak ada log field sensitif.
- Export sengaja nonaktif. Desain export aman perlu re-auth, password export berbeda, KDF, AES-GCM, audit, format versioning.

Peringatan: menyimpan password dan 2FA dalam vault sama meningkatkan dampak jika vault atau encryption key bocor. Password, TOTP, recovery code, serta catatan bersifat opsional. Lindungi backup database dan `VAULT_ENCRYPTION_KEY` secara terpisah.

## Batasan

Chrome/Edge extension tidak disertakan. UI memberi Copy Email dan Open Login URL. Extension, bila ditambah, wajib hanya menawarkan autofill domain cocok, meminta persetujuan eksplisit password saat vault unlocked, tidak auto-submit, tidak melewati CAPTCHA/OTP/2FA, serta tidak menyimpan secret pada storage/browser URL/log/analytics.

`npm test` menguji enkripsi, Argon2id, validasi API. Jalankan `npm run build` sebelum deploy.

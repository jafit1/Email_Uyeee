import argon2 from "argon2";
import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
const COOKIE = "vault_session", ttl = Number(process.env.SESSION_TTL_HOURS || 8) * 3600_000;
const hash = (v: string) => createHash("sha256").update(v).digest("hex");
export const passwordHash = (value: string) => argon2.hash(value, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
export const passwordVerify = (stored: string, value: string) => argon2.verify(stored, value);
export async function audit(userId: string, action: string, targetId?: string) { await db.auditLog.create({ data: { userId, action, targetId } }); }
export async function currentUser() { const token = (await cookies()).get(COOKIE)?.value; if (!token) return null; const session = await db.session.findUnique({ where: { tokenHash: hash(token) }, include: { user: true } }); if (!session || session.expiresAt < new Date()) return null; return session.user; }
export async function requireUser() { const user = await currentUser(); if (!user) throw new Error("UNAUTHORIZED"); return user; }
export async function createSession(userId: string) { const token = randomBytes(32).toString("base64url"), expiresAt = new Date(Date.now() + ttl); await db.session.create({ data: { userId, tokenHash: hash(token), expiresAt } }); (await cookies()).set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", expires: expiresAt }); }
export async function destroySession() { const jar = await cookies(), token = jar.get(COOKIE)?.value; if (token) await db.session.deleteMany({ where: { tokenHash: hash(token) } }); jar.delete(COOKIE); }

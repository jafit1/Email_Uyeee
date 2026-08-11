import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { audit, createSession, passwordVerify } from "@/lib/auth";
import { z } from "zod";
const input = z.object({ email: z.string().email(), password: z.string().max(256) });
export async function POST(req: Request) { try { const data = input.parse(await req.json()), user = await db.user.findUnique({ where: { email: data.email.toLowerCase() } }); if (!user || (user.lockedUntil && user.lockedUntil > new Date()) || !(await passwordVerify(user.masterPasswordHash, data.password))) { if (user) { const failed = user.failedAttempts + 1; await db.user.update({ where: { id: user.id }, data: { failedAttempts: failed, lockedUntil: failed >= 5 ? new Date(Date.now() + 15 * 60_000) : null } }); await audit(user.id, "LOGIN_FAILED"); } return NextResponse.json({ error: "Invalid credentials" }, { status: 401 }); } await db.user.update({ where: { id: user.id }, data: { failedAttempts: 0, lockedUntil: null } }); await createSession(user.id); await audit(user.id, "LOGIN"); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ error: "Invalid credentials" }, { status: 400 }); } }

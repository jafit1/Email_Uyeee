import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, passwordHash, audit } from "@/lib/auth";
import { z } from "zod";
const input = z.object({ email: z.string().email(), password: z.string().min(12).max(256) });
export async function POST(req: Request) { try { if (await db.user.count()) return NextResponse.json({ error: "Setup completed" }, { status: 409 }); const data = input.parse(await req.json()); const user = await db.user.create({ data: { email: data.email.toLowerCase(), masterPasswordHash: await passwordHash(data.password) } }); await audit(user.id, "SETUP"); await createSession(user.id); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ error: "Invalid setup data" }, { status: 400 }); } }

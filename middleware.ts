import { NextResponse, type NextRequest } from "next/server";
export function middleware(req: NextRequest) { if (req.nextUrl.pathname.startsWith("/api") && !["/api/auth/login", "/api/auth/setup"].includes(req.nextUrl.pathname)) { const origin = req.headers.get("origin"); if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 }); } return NextResponse.next(); }
export const config = { matcher: "/api/:path*" };

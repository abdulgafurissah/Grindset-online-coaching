import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

const rateLimit = new Map<string, { count: number; lastReset: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute
const LIMIT = 100; // requests per window

export default async function middleware(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    const record = rateLimit.get(ip) ?? { count: 0, lastReset: now };

    if (record.lastReset < windowStart) {
        record.count = 0;
        record.lastReset = now;
    }

    record.count++;
    rateLimit.set(ip, record);

    if (record.count > LIMIT) {
        return new NextResponse("Too Many Requests", { status: 429 });
    }

    return (auth as any)(req);
}

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

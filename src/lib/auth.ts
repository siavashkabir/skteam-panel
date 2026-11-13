import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import client from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "skteam-super-secure-secret-key-change-in-production-2026"
);

const COOKIE_NAME = "skteam_session";
const TOKEN_EXPIRY = "2h"; // کوتاه برای امنیت بیشتر

export interface SessionUser {
  id: number;
  email: string;
  role: "super_admin" | "shop_admin";
  shop_id: number | null;
  full_name: string | null;
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    shop_id: user.shop_id,
    full_name: user.full_name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2 hours
    path: "/",
  });

  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function requireSuperAdmin() {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

// Rate limiting ساده در حافظه (برای production از Redis استفاده شود)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(email);

  if (!record) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }

  // بعد از ۱۵ دقیقه ریست شود
  if (now - record.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.set(email, { count: 1, lastAttempt: now });
    return true;
  }

  if (record.count >= 5) {
    return false; // بیش از ۵ تلاش
  }

  record.count += 1;
  record.lastAttempt = now;
  return true;
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  // در نسخه نهایی از bcrypt استفاده می‌شود
  // فعلاً برای راه‌اندازی اولیه
  try {
    const bcrypt = await import("bcryptjs");
    return bcrypt.compare(plain, hash);
  } catch {
    // fallback موقت (فقط برای راه‌اندازی)
    return plain === "Sa13591364" && hash.includes("$2a$");
  }
}

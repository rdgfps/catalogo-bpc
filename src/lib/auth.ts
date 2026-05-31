import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "bpc_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  user: string;
  exp: number;
};

function getAdminUser(): string {
  return process.env.ADMIN_USER || "admin";
}

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (password) return password;
  if (process.env.NODE_ENV !== "production") return "admin";
  return "";
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

function base64Url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyAdminCredentials(user: string, password: string): boolean {
  const expectedUser = getAdminUser();
  const expectedPassword = getAdminPassword();
  if (!expectedPassword) return false;

  return safeEqual(user, expectedUser) && safeEqual(password, expectedPassword);
}

export function createAdminSession(user = getAdminUser()): string {
  const payload: SessionPayload = {
    user,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encoded = base64Url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function isValidAdminSession(token?: string): boolean {
  if (!token || !getSessionSecret()) return false;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || !safeEqual(signature, sign(encoded))) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    return payload.user === getAdminUser() && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function requireAdminPage(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!isValidAdminSession(token)) {
    redirect("/admin/login");
  }
}

export function isAdminRequest(request: NextRequest): boolean {
  return isValidAdminSession(request.cookies.get(SESSION_COOKIE)?.value);
}

export function unauthorizedJson() {
  return NextResponse.json(
    { success: false, errors: ["Sessão expirada. Faça login novamente."] },
    { status: 401 }
  );
}

export function setAdminSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

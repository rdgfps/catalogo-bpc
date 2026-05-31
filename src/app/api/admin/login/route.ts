import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, setAdminSessionCookie, verifyAdminCredentials } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const user = String(form.get("user") || "");
  const password = String(form.get("password") || "");

  if (!verifyAdminCredentials(user, password)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/admin/importar", request.url), 303);
  setAdminSessionCookie(response, createAdminSession(user));
  return response;
}

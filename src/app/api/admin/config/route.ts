import { NextRequest, NextResponse } from "next/server";
import { saveConfig } from "@/lib/store";
import { isAdminRequest, unauthorizedJson } from "@/lib/auth";

function normalizePhones(values: unknown[]): string[] {
  return values
    .map((value) => String(value || "").replace(/\D/g, ""))
    .filter((value) => value.length >= 10 && value.length <= 15)
    .slice(0, 2);
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) return unauthorizedJson();

    const body = await request.json();
    const rawNumbers = Array.isArray(body.whatsappNumbers)
      ? body.whatsappNumbers
      : [body.whatsappNumber].filter(Boolean);
    const whatsappNumbers = normalizePhones(rawNumbers);

    if (whatsappNumbers.length === 0) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    saveConfig({
      whatsappNumber: whatsappNumbers[0],
      whatsappNumbers,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

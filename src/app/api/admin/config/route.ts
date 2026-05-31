import { NextRequest, NextResponse } from "next/server";
import { saveConfig } from "@/lib/store";
import { isAdminRequest, unauthorizedJson } from "@/lib/auth";
import { defaultStoreLocation } from "@/lib/location";

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

    const rawLocation = body.location && typeof body.location === "object" ? body.location : {};
    const location = {
      label: String(rawLocation.label || defaultStoreLocation.label).trim(),
      address: String(rawLocation.address || defaultStoreLocation.address).trim(),
      mapsUrl: String(rawLocation.mapsUrl || defaultStoreLocation.mapsUrl).trim(),
    };

    saveConfig({
      whatsappNumber: whatsappNumbers[0],
      whatsappNumbers,
      location,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

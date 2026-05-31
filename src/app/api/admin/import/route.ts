import { NextRequest, NextResponse } from "next/server";
import { normalizeProductsFromBuffer } from "@/lib/normalize";
import { saveProducts, getProducts } from "@/lib/store";
import { isAdminRequest, unauthorizedJson } from "@/lib/auth";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) return unauthorizedJson();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, total: 0, imported: 0, errors: ["Nenhum arquivo enviado."] },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          success: false,
          total: 0,
          imported: 0,
          errors: ["Arquivo muito grande. Envie um arquivo de até 5MB."],
        },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();

    let format: "csv" | "json" | "xml" | "xlsx" | "auto" = "auto";
    if (fileName.endsWith(".csv")) format = "csv";
    else if (fileName.endsWith(".json")) format = "json";
    else if (fileName.endsWith(".xml")) format = "xml";
    else if (fileName.endsWith(".xlsx")) format = "xlsx";

    if (format === "csv" && buffer.subarray(0, 2).toString("utf8") === "PK") {
      format = "xlsx";
    }

    const products = normalizeProductsFromBuffer(buffer, format);
    const errors: string[] = [];

    if (products.length === 0) {
      return NextResponse.json({
        success: false,
        total: 0,
        imported: 0,
        errors: [
          "Nenhum produto encontrado no arquivo. Verifique o formato e as colunas.",
        ],
      });
    }

    // Merge com produtos existentes (por ID)
    const existing = getProducts();
    const existingMap = new Map(existing.map((p) => [p.id, p]));

    let importedCount = 0;
    for (const product of products) {
      if (!product.nome) {
        errors.push(`Produto sem nome ignorado.`);
        continue;
      }
      existingMap.set(product.id, product);
      importedCount++;
    }

    const merged = Array.from(existingMap.values());
    saveProducts(merged);

    return NextResponse.json({
      success: true,
      total: products.length,
      imported: importedCount,
      errors,
    });
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json(
      {
        success: false,
        total: 0,
        imported: 0,
        errors: ["Erro interno ao processar o arquivo."],
      },
      { status: 500 }
    );
  }
}

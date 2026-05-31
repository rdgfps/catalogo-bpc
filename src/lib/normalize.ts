import type { Product } from "@/types";
import { categorizeProduct } from "./categorize";
import { inflateRawSync } from "zlib";

// ============================================================
// Helpers
// ============================================================

function parsePrice(value: string | undefined): number {
  if (!value) return 0;
  let clean = value.replace(/R\$\s*/gi, "").trim();
  if (clean.includes(",") && clean.includes(".")) {
    clean = clean.replace(/\./g, "").replace(",", ".");
  } else if (clean.includes(",")) {
    clean = clean.replace(",", ".");
  }
  const n = parseFloat(clean);
  return isNaN(n) ? 0 : n;
}

function parseStock(value: string | undefined): number {
  if (!value) return 0;
  const n = parseInt(value.replace(",", "."), 10);
  return isNaN(n) ? 0 : n;
}

function parseActive(value: string | undefined): boolean {
  if (!value) return true;
  const lower = value.toLowerCase().trim();
  return lower === "sim" || lower === "true" || lower === "1" || lower === "ativo" || lower === "s";
}

function generateId(nome: string, codigoBarras?: string): string {
  if (codigoBarras) return codigoBarras;
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 64);
}

function normalizeHeader(value: string): string {
  return value
    .replace(/^\uFEFF/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getColumn(row: Record<string, string>, aliases: string[]): string | undefined {
  for (const alias of aliases) {
    const value = row[normalizeHeader(alias)];
    if (value) return value;
  }
  return undefined;
}

// ============================================================
// Product rows
// ============================================================

function fromRows(rows: Record<string, string>[]): Product[] {
  const products: Product[] = [];

  for (const row of rows) {
    const nome = getColumn(row, ["Produto", "Nome"]) || "";
    if (!nome) continue;

    const preco = parsePrice(
      getColumn(row, [
        "Preço de Venda (un.)",
        "Preco de Venda (un.)",
        "Preço",
        "Preco",
        "Valor",
      ])
    );

    const estoque = parseStock(
      getColumn(row, [
        "Quantidade Atual",
        "Quantidade - Atual",
        "Estoque",
        "Qtd",
      ])
    );

    const codigoBarras = getColumn(row, [
      "Código de Barras",
      "Codigo de Barras",
      "codigo_barras",
      "EAN",
      "BARCODE",
    ]);

    const ativo = parseActive(getColumn(row, ["Ativo", "Status"]) || "sim");
    const categoria = getColumn(row, ["Categoria"]) || categorizeProduct(nome);

    products.push({
      id: generateId(nome, codigoBarras),
      nome: nome.trim(),
      categoria,
      preco,
      estoque,
      codigoBarras: codigoBarras || undefined,
      imagem: undefined,
      ativo,
    });
  }

  return products;
}

// ============================================================
// CSV parser (MarketUP export format)
// ============================================================

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ";" && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function fromCSV(content: string): Product[] {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(delimiter).map((h) => normalizeHeader(h.replace(/"/g, "")));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });
    rows.push(row);
  }

  return fromRows(rows);
}

// ============================================================
// XLSX parser (simple MarketUP spreadsheet export)
// ============================================================

type ZipEntry = {
  name: string;
  method: number;
  compressedSize: number;
  offset: number;
};

function parseZipEntries(buffer: Buffer): Map<string, Buffer> {
  const entries = new Map<string, Buffer>();
  let eocdOffset = -1;

  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset === -1) throw new Error("Arquivo XLSX inválido.");

  const totalEntries = buffer.readUInt16LE(eocdOffset + 10);
  const centralDirectoryOffset = buffer.readUInt32LE(eocdOffset + 16);
  let cursor = centralDirectoryOffset;
  const zipEntries: ZipEntry[] = [];

  for (let i = 0; i < totalEntries; i++) {
    if (buffer.readUInt32LE(cursor) !== 0x02014b50) break;

    const method = buffer.readUInt16LE(cursor + 10);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const fileNameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const offset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.toString("utf8", cursor + 46, cursor + 46 + fileNameLength);

    zipEntries.push({ name, method, compressedSize, offset });
    cursor += 46 + fileNameLength + extraLength + commentLength;
  }

  for (const entry of zipEntries) {
    if (buffer.readUInt32LE(entry.offset) !== 0x04034b50) continue;

    const fileNameLength = buffer.readUInt16LE(entry.offset + 26);
    const extraLength = buffer.readUInt16LE(entry.offset + 28);
    const dataStart = entry.offset + 30 + fileNameLength + extraLength;
    const data = buffer.subarray(dataStart, dataStart + entry.compressedSize);

    if (entry.method === 0) {
      entries.set(entry.name, data);
    } else if (entry.method === 8) {
      entries.set(entry.name, inflateRawSync(data));
    }
  }

  return entries;
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function stripXml(value: string): string {
  return decodeXml(value.replace(/<[^>]+>/g, ""));
}

function columnIndex(cellReference: string): number {
  const letters = cellReference.replace(/[0-9]/g, "");
  let index = 0;
  for (const letter of letters) {
    index = index * 26 + letter.charCodeAt(0) - 64;
  }
  return index - 1;
}

function readSharedStrings(xml: string): string[] {
  const matches = xml.match(/<si[\s\S]*?<\/si>/g) || [];
  return matches.map((item) => {
    const parts = Array.from(item.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g), (match) => match[1]);
    return decodeXml(parts.join(""));
  });
}

function fromXLSX(buffer: Buffer): Product[] {
  const entries = parseZipEntries(buffer);
  const sheet = entries.get("xl/worksheets/sheet1.xml");
  if (!sheet) return [];

  const sharedStrings = readSharedStrings(entries.get("xl/sharedStrings.xml")?.toString("utf8") || "");
  const sheetXml = sheet.toString("utf8");
  const rawRows = sheetXml.match(/<row[\s\S]*?<\/row>/g) || [];
  const table: string[][] = [];

  for (const rawRow of rawRows) {
    const cells = Array.from(rawRow.matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g));
    const values: string[] = [];

    for (const cell of cells) {
      const attributes = cell[1];
      const body = cell[2];
      const reference = attributes.match(/\br="([^"]+)"/)?.[1] || "";
      const type = attributes.match(/\bt="([^"]+)"/)?.[1] || "";
      const value = body.match(/<v[^>]*>([\s\S]*?)<\/v>/)?.[1] || "";
      const inlineValue = body.match(/<is[^>]*>([\s\S]*?)<\/is>/)?.[1] || "";
      const index = reference ? columnIndex(reference) : values.length;

      if (type === "s") {
        values[index] = sharedStrings[Number(value)] || "";
      } else if (type === "inlineStr") {
        values[index] = stripXml(inlineValue);
      } else {
        values[index] = decodeXml(value);
      }
    }

    table.push(values);
  }

  const headers = table[0]?.map((header) => normalizeHeader(header)) || [];
  const rows = table.slice(1).map((values) => {
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? "";
    });
    return row;
  });

  return fromRows(rows);
}

// ============================================================
// JSON parser
// ============================================================

function fromJSON(content: string): Product[] {
  let data: unknown;
  try {
    data = JSON.parse(content);
  } catch {
    throw new Error("JSON inválido");
  }

  const items: unknown[] = Array.isArray(data)
    ? data
    : (data as Record<string, unknown>).produtos
    ? ((data as Record<string, unknown>).produtos as unknown[])
    : (data as Record<string, unknown>).products
    ? ((data as Record<string, unknown>).products as unknown[])
    : [data];

  const result: Product[] = [];
  for (const item of items) {
    const row = item as Record<string, unknown>;
    const nome = String(row.nome || row.Produto || row.name || row.produto || "").trim();
    if (!nome) continue;
    const codigoBarras = String(row.codigoBarras || row["Código de Barras"] || row.ean || row.EAN || "").trim() || undefined;
    result.push({
      id: generateId(nome, codigoBarras),
      nome,
      categoria: String(row.categoria || row.Categoria || categorizeProduct(nome)),
      preco: parsePrice(String(row.preco || row["Preço de Venda (un.)"] || row.price || 0)),
      estoque: parseStock(String(row.estoque || row["Quantidade Atual"] || row["Quantidade - Atual"] || row.stock || 0)),
      codigoBarras,
      imagem: String(row.imagem || row.image || "") || undefined,
      ativo: parseActive(String(row.ativo || row.Ativo || row.active || "sim")),
    });
  }
  return result;
}

// ============================================================
// XML parser (browser-compatible, simple)
// ============================================================

function fromXML(content: string): Product[] {
  const products: Product[] = [];

  try {
    const tagRegex = /<(?:produto|product|item|Produto|Product)\b[^>]*>([\s\S]*?)<\/(?:produto|product|item|Produto|Product)>/gi;
    const matches = Array.from(content.matchAll(tagRegex));

    for (const match of matches) {
      const block = match[1];

      const getTag = (tag: string): string => {
        const r = new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`, "i");
        return block.match(r)?.[1]?.trim() ?? "";
      };

      const nome = getTag("nome") || getTag("Produto") || getTag("name") || getTag("produto");
      if (!nome) continue;

      const codigoBarras = getTag("codigoBarras") || getTag("ean") || getTag("EAN") || undefined;

      products.push({
        id: generateId(nome, codigoBarras),
        nome,
        categoria: getTag("categoria") || categorizeProduct(nome),
        preco: parsePrice(getTag("preco") || getTag("PrecoVenda") || getTag("price")),
        estoque: parseStock(getTag("estoque") || getTag("QuantidadeAtual") || getTag("stock")),
        codigoBarras: codigoBarras || undefined,
        imagem: getTag("imagem") || getTag("image") || undefined,
        ativo: parseActive(getTag("ativo") || getTag("Ativo") || "sim"),
      });
    }
  } catch (e) {
    console.error("Erro ao parsear XML:", e);
  }

  return products;
}

// ============================================================
// normalizeProducts - main entry points
// ============================================================

export type FileFormat = "csv" | "json" | "xml" | "xlsx" | "auto";

export function normalizeProducts(content: string, format: FileFormat = "auto"): Product[] {
  let detected = format;

  if (detected === "auto") {
    const trimmed = content.trimStart();
    if (trimmed.startsWith("<")) {
      detected = "xml";
    } else if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      detected = "json";
    } else {
      detected = "csv";
    }
  }

  switch (detected) {
    case "csv":
      return fromCSV(content);
    case "json":
      return fromJSON(content);
    case "xml":
      return fromXML(content);
    default:
      return fromCSV(content);
  }
}

export function normalizeProductsFromBuffer(buffer: Buffer, format: FileFormat = "auto"): Product[] {
  const detected = format === "auto" && buffer.subarray(0, 2).toString("utf8") === "PK" ? "xlsx" : format;

  if (detected === "xlsx") {
    return fromXLSX(buffer);
  }

  return normalizeProducts(buffer.toString("utf8"), detected);
}

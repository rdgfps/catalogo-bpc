import fs from "fs";
import path from "path";
import type { Product, CatalogConfig } from "@/types";

// ============================================================
// Caminhos de dados (armazenados em /data no projeto)
// ============================================================

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");

let productsCache: { mtimeMs: number; data: Product[] } | null = null;
let configCache: { mtimeMs: number; data: CatalogConfig } | null = null;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ============================================================
// Configuração padrão
// ============================================================

const DEFAULT_CONFIG: CatalogConfig = {
  whatsappNumber: "5553991566695",
  whatsappNumbers: ["5553991566695", "53984170695"],
  storeName: "Bom Pra Cachorro Pet Shop",
};

// ============================================================
// Produtos
// ============================================================

export function getProducts(): Product[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(PRODUCTS_FILE)) return [];
    const stat = fs.statSync(PRODUCTS_FILE);
    if (productsCache && productsCache.mtimeMs === stat.mtimeMs) {
      return productsCache.data;
    }
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    const data = JSON.parse(raw) as Product[];
    productsCache = { mtimeMs: stat.mtimeMs, data };
    return data;
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  ensureDataDir();
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
  productsCache = null;
}

// ============================================================
// Configuração
// ============================================================

export function getConfig(): CatalogConfig {
  try {
    ensureDataDir();
    if (!fs.existsSync(CONFIG_FILE)) return DEFAULT_CONFIG;
    const stat = fs.statSync(CONFIG_FILE);
    if (configCache && configCache.mtimeMs === stat.mtimeMs) {
      return configCache.data;
    }
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    const whatsappNumbers = Array.isArray(parsed.whatsappNumbers)
      ? parsed.whatsappNumbers
      : [parsed.whatsappNumber || DEFAULT_CONFIG.whatsappNumber];
    const data = {
      ...DEFAULT_CONFIG,
      ...parsed,
      whatsappNumber: whatsappNumbers[0] || DEFAULT_CONFIG.whatsappNumber,
      whatsappNumbers,
    };
    configCache = { mtimeMs: stat.mtimeMs, data };
    return data;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: Partial<CatalogConfig>): void {
  ensureDataDir();
  const current = getConfig();
  fs.writeFileSync(
    CONFIG_FILE,
    JSON.stringify({ ...current, ...config }, null, 2),
    "utf-8"
  );
  configCache = null;
}

// ============================================================
// Filtros para o catálogo
// ============================================================

export interface ProductFilters {
  search?: string;
  categoria?: string;
  sort?: "preco_asc" | "preco_desc" | "az" | "za";
}

export function getFilteredProducts(filters: ProductFilters = {}): Product[] {
  let products = getProducts().filter((p) => p.ativo);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        (p.codigoBarras && p.codigoBarras.includes(q))
    );
  }

  if (filters.categoria && filters.categoria !== "Todos") {
    products = products.filter((p) => p.categoria === filters.categoria);
  }

  switch (filters.sort) {
    case "preco_asc":
      products.sort((a, b) => a.preco - b.preco);
      break;
    case "preco_desc":
      products.sort((a, b) => b.preco - a.preco);
      break;
    case "za":
      products.sort((a, b) => b.nome.localeCompare(a.nome));
      break;
    case "az":
    default:
      products.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  return products;
}

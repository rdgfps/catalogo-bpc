// ============================================================
// Formato interno padronizado de produto
// ============================================================
export interface Product {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  codigoBarras?: string;
  imagem?: string;
  ativo: boolean;
}

// ============================================================
// Configurações do catálogo
// ============================================================
export interface CatalogConfig {
  whatsappNumber: string;
  whatsappNumbers: string[];
  storeName: string;
}

// ============================================================
// Tipos de importação
// ============================================================
export type ImportFileType = "csv" | "json" | "xml";

export interface ImportResult {
  success: boolean;
  total: number;
  imported: number;
  errors: string[];
}

// ============================================================
// Formato do arquivo MarketUP (CSV)
// ============================================================
export interface MarketUPRow {
  Produto?: string;
  "Preço de Venda (un.)"?: string;
  "Quantidade Atual"?: string;
  "Código de Barras"?: string;
  Ativo?: string;
  [key: string]: string | undefined;
}

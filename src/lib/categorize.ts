// ============================================================
// Categorização automática de produtos pelo nome
// Edite os arrays abaixo para adicionar novas palavras-chave
// ============================================================

const CATEGORY_RULES: Array<{ keywords: string[]; category: string }> = [
  {
    keywords: [
      "DOG CHOW", "CAT CHOW", "BAHDOG", "FINOTRATO", "GOLDEN", "PREMIER",
      "PEDIGREE", "WHISKAS", "ROYAL CANIN", "HILLS", "EUKANUBA", "PURINA",
      "NUTRIÇÃO", "RAÇÃO", "RACAO", "KIBBLE", "ALIMENTO", "NUTRÓPICA",
      "NUTROPICA", "PRONAT", "TOTAL", "MAGNUS", "CANINUS", "FELINO",
    ],
    category: "Rações",
  },
  {
    keywords: [
      "AREIA", "PIPI CAT", "CANISTER", "FOFICAT", "GRANULADO", "SÍLICA",
      "SILICA", "SANITÁRIO", "SANITARIO", "HIGIÊNICO", "HIGIENICO",
    ],
    category: "Areias e Higiênico",
  },
  {
    keywords: [
      "COMEDOURO", "BEBEDOURO", "TIGELA", "BOWL", "POTE", "PETISCO",
      "SNACK", "BIFINHOS", "BIFINHO", "OSSINHO", "OSSO", "TREAT",
    ],
    category: "Alimentação",
  },
  {
    keywords: [
      "COLEIRA", "GUIA", "PEITORAL", "FOCINHEIRA", "ADAPTIL", "CINTO",
      "CORRENTE", "ENFORCADOR", "TRELA",
    ],
    category: "Passeio",
  },
  {
    keywords: [
      "CAMA", "CASA", "CANIL", "TOCA", "MANTA", "COBERTA", "ALMOFADA",
      "CASINHA", "CAMINHA",
    ],
    category: "Descanso",
  },
  {
    keywords: [
      "BOLA", "BRINQUEDO", "PELÚCIA", "PELUCIA", "TOY", "FRISBEE",
      "MORDEDOR", "CORDA", "LATEX", "LÁTEX", "SQUEAKY",
    ],
    category: "Brinquedos",
  },
  {
    keywords: [
      "FRONTLINE", "VERMÍFUGO", "VERMIFUGO", "ANTIPULGAS", "ANTIPULGA",
      "ANTIPARASITÁRIO", "ANTIPARASITARIO", "BRAVECTO", "NEXGARD",
      "REVOLUTION", "ADVOCATE", "SERESTO", "SIMPARICA", "COMFORTIS",
      "CAPSTAR", "DRONTAL", "MILBEMAX", "PANACUR", "ENDOGARD",
      "PROFENDER", "MILBEMAX", "MEDICAMENTO", "REMÉDIO", "REMEDIO",
      "SHAMPOO MEDICADO", "POMADA", "COLÍRIO", "COLIRIO",
    ],
    category: "Medicamentos",
  },
  {
    keywords: [
      "SHAMPOO", "CONDICIONADOR", "PERFUME", "COLÔNIA", "COLONIA",
      "BANHO", "TOSA", "ESCOVA", "PENTE", "TESOURA", "TALCO",
      "HIDRATANTE", "LEAVE-ON",
    ],
    category: "Banho e Tosa",
  },
  {
    keywords: [
      "AQUÁRIO", "AQUARIO", "PEIXE", "TARTARUGA", "COELHO", "HAMSTER",
      "GERBIL", "ROEDOR", "PÁSSARO", "PASSARO", "CALOPSITA",
    ],
    category: "Outros Animais",
  },
  {
    keywords: [
      "BOLSA", "MOCHILA", "CAIXA DE TRANSPORTE", "TRANSPORTE", "CARRIER",
      "PET TAXI",
    ],
    category: "Transporte",
  },
];

/**
 * Tenta identificar a categoria de um produto pelo nome.
 * Retorna "Outros" se nenhuma regra for encontrada.
 */
export function categorizeProduct(nome: string): string {
  const upperName = nome.toUpperCase();

  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (upperName.includes(keyword.toUpperCase())) {
        return rule.category;
      }
    }
  }

  return "Outros";
}

/**
 * Retorna todas as categorias disponíveis para filtros
 */
export function getAllCategories(): string[] {
  return [
    "Rações",
    "Areias e Higiênico",
    "Alimentação",
    "Passeio",
    "Descanso",
    "Brinquedos",
    "Medicamentos",
    "Banho e Tosa",
    "Transporte",
    "Outros Animais",
    "Outros",
  ];
}

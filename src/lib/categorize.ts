// Categoriza produtos por prioridade. Regras de tipo vêm antes de marcas para
// evitar casos como "AREIA FINOTRATO" cair em rações só por conter a marca.

const CATEGORY_RULES: Array<{ keywords: string[]; category: string }> = [
  {
    category: "Areias e Higiênico",
    keywords: [
      "AREIA", "PIPI CAT", "PIPI POSTE", "BANDEJA HIGIENICA", "BANHEIRO",
      "CANISTER", "FOFICAT", "GRANULADO", "SILICA", "SANITARIO",
      "HIGIENICO", "TAPETE COLETOR",
    ],
  },
  {
    category: "Medicamentos",
    keywords: [
      "ANTI PULGAS", "ANTIBIOTICO", "ANTIDIARREICO", "ANTIPARASIT", "ANTIPULGA", "ANTITOXICO",
      "BABECID", "BALSAMEX", "BIODEX", "BRAVECTO", "CALCIO", "CANEX",
      "CAPSTAR", "CARTELA VERM", "CETOCONAZOL", "CHARMDOG", "CHEMITAL",
      "CHEMITEC", "CHEMITRIL", "COLIRIO", "CONDRO", "CONTRACEPTIVO",
      "COPROVET", "CRUZWALDINA", "DECTOMAX", "DEXIUM", "DIGESTIV",
      "DIPIRONA", "DIUZON", "DRONTAL", "ENDOGARD", "ENTERO", "EXTROGIN",
      "COMFORTIS", "DIPIL", "FRONTLINE", "MATA PULGAS", "MEDICAMENTO",
      "MILBEMAX", "NATU VERM", "NEXGARD", "PANACUR", "POMADA", "PROFENDER",
      "PROVERME", "REMEDIO", "REVOLUTION",
      "SERESTO", "SIMPARICA", "STRONDAL", "VERMEX", "VERMICANIS",
      "VERMICIDA", "VERMIFUGO", "VERMINEX", "VERMITRIL",
    ],
  },
  {
    category: "Banho e Tosa",
    keywords: [
      "ALICATE UNHA", "BANHO", "COLONIA", "CONDICIONADOR", "ESCOVA",
      "HIDRATANTE", "LEAVE ON", "LEAVE-ON", "PENTE", "PERFUME", "SHAMPOO",
      "TALCO", "TESOURA", "TOSA",
    ],
  },
  {
    category: "Brinquedos",
    keywords: [
      "BOLA", "BOLINHA", "BONECO", "BORRACHA", "BRINQUEDO", "CABO DE GUERRA",
      "CORDA", "FRISBEE", "LATEX", "MORDEDOR", "PELUCIA", "SINO", "TOY",
    ],
  },
  {
    category: "Passeio",
    keywords: [
      "ADAPTIL", "CINTO", "COLEIRA", "CORRENTE", "DESTORCEDOR", "ENFORCADOR",
      "FOCINHEIRA", "GUIA", "PEITORAL", "TRELA",
    ],
  },
  {
    category: "Descanso",
    keywords: [
      "ALMOFADA", "CAMA", "CAMINHA", "CANIL", "CASA", "CASINHA", "COBERTA",
      "MANTA", "TOCA",
    ],
  },
  {
    category: "Transporte",
    keywords: [
      "BOLSA", "CAIXA DE TRANSPORTE", "CARRIER", "MOCHILA", "PET TAXI",
      "TRANSPORTE",
    ],
  },
  {
    category: "Alimentação",
    keywords: [
      "BEBEDOURO", "BIFINHO", "BIFINHOS", "BOWL", "COMEDOURO", "DENTALIFE",
      "DOGUITOS", "OSSO", "OSSINHO", "PETISCO", "POTE", "SACHE", "SACHET",
      "SNACK", "TREAT",
    ],
  },
  {
    category: "Outros Animais",
    keywords: [
      "AQUARIO", "AVES", "AVITRIN", "CALOPSITA", "CAPA GAIOLA", "COELHO",
      "CONCENTRADO P GALINHA", "GAIOLA", "GALINHA", "GERBIL", "HAMSTER",
      "PASSARO", "PEIXE", "ROEDOR", "TARTARUGA",
    ],
  },
  {
    category: "Rações",
    keywords: [
      "ALIM CAES", "ALIMENTO", "BAGUAL DOG", "BAH CAT", "BAHDOG", "BAITACAO",
      "BILLY CAT", "BIOCARE", "BRAIN PLUS", "CANNY DOG", "CANINUS",
      "CATCHOW", "CAT CHOW", "CAO", "CAES", "DODI", "DODOG", "DOCKY",
      "DOG CHOW", "DON NICO", "EUKANUBA", "FAMIL CA", "FAMIL GATOS",
      "FELINO", "FINOTRATO", "GATO", "GATOS", "GDOG", "GOLDEN", "GRANEL BILLY DOG",
      "GRANEL MIKDOG", "GRANEL MIMOS CAT", "HILLS", "KELCAT", "KELDOG",
      "LILIDOG", "LOGICAT", "MAGNUS", "MEK DOG", "NUTRICAO", "NUTROPICA",
      "OPTIMUM", "PEDIGREE", "PREMIER", "PRONAT", "PURINA", "RACAO",
      "ROYAL CANIN", "THREE CATS", "THREE DOGS", "TOTAL", "WHISKAS",
    ],
  },
];

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

export function categorizeProduct(nome: string): string {
  const normalizedName = normalize(nome);

  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (normalizedName.includes(normalize(keyword))) {
        return rule.category;
      }
    }
  }

  return "Outros";
}

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

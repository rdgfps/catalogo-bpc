# 🐾 Bom Pra Cachorro Pet Shop — Catálogo Online

Catálogo digital para o Bom Pra Cachorro Pet Shop, integrado ao estoque exportado do MarketUP.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide Icons**

## Início Rápido

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Acessar
# Site: http://localhost:3000
# Produtos: http://localhost:3000/produtos
# Admin: http://localhost:3000/admin/importar
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx                  # Homepage com hero e produtos em destaque
│   ├── produtos/page.tsx         # Catálogo completo
│   ├── admin/importar/page.tsx   # Área de importação de estoque
│   └── api/
│       ├── admin/import/route.ts # Endpoint de importação
│       └── admin/config/route.ts # Endpoint de configuração
├── components/
│   ├── catalog/CatalogClient.tsx # Catálogo com filtros (client)
│   ├── admin/ImportClient.tsx    # UI de importação (client)
│   └── layout/                   # Header, Footer, MobileMenu
└── lib/
    ├── normalize.ts              # normalizeProducts() — CSV/JSON/XML → Product[]
    ├── categorize.ts             # categorizeProduct() — categorização automática
    ├── store.ts                  # Leitura/escrita de products.json e config.json
    └── utils.ts                  # buildWhatsAppLink(), formatPrice()

data/
├── products.json                 # Produtos (gerado/atualizado pelo import)
├── config.json                   # Configurações (WhatsApp, comportamento estoque)
└── exemplo-marketup.csv          # Arquivo de exemplo para teste
```

## Como Importar o Estoque do MarketUP

1. Acesse `http://localhost:3000/admin/importar`
2. Faça upload do CSV exportado pelo MarketUP
3. O sistema detecta automaticamente o formato (CSV, JSON, XML)
4. Os produtos são atualizados no catálogo imediatamente

### Colunas esperadas do MarketUP (CSV)

| Coluna | Descrição |
|--------|-----------|
| `Produto` | Nome do produto |
| `Preço de Venda (un.)` | Preço unitário (ex: R$ 19,90) |
| `Quantidade Atual` | Estoque atual |
| `Código de Barras` | EAN/código de barras |
| `Ativo` | Sim/Não — se deve aparecer no catálogo |

## Configurações

No painel admin (`/admin/importar`) você pode:

- **Número do WhatsApp**: número de contato para os botões de consulta
- **Produtos Esgotados**: exibir com badge "ESGOTADO" ou ocultar do catálogo

## Categorização Automática

O arquivo `src/lib/categorize.ts` contém regras de categorização por palavras-chave no nome do produto. Edite o array `CATEGORY_RULES` para adicionar novas categorias ou palavras-chave.

## Deploy na Vercel

```bash
# Build local
npm run build

# Deploy via Vercel CLI
npx vercel --prod
```

> **Importante**: na Vercel, o sistema de arquivos é efêmero. Para produção, considere usar o Vercel Blob Storage ou KV para persistir o `products.json`. Em desenvolvimento local e em VPS, funciona perfeitamente com o sistema de arquivos.

## Personalização

### WhatsApp
Altere o número no painel admin ou diretamente em `data/config.json`.

### Identidade Visual
As cores principais estão em `tailwind.config.ts`:
- `brand.orange`: #F97316
- `brand.black`: #0A0A0A
- `brand.white`: #FFFFFF

### Adicionar Categorias
Edite `src/lib/categorize.ts` e adicione novas palavras-chave no array `CATEGORY_RULES`.

import type { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { getAllCategories } from "@/lib/categorize";
import { getConfig, getFilteredProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Catálogo de Produtos",
  description:
    "Explore o catálogo completo do Bom Pra Cachorro Pet Shop. Rações, medicamentos, acessórios e muito mais para o seu pet.",
};

interface Props {
  searchParams: Promise<{
    search?: string;
    categoria?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const config = getConfig();

  const products = getFilteredProducts({
    search: params.search,
    categoria: params.categoria,
    sort: params.sort as "preco_asc" | "preco_desc" | "az" | "za" | undefined,
  });

  const allProducts = getFilteredProducts();
  const categoriesWithCount = getAllCategories()
    .map((cat) => ({
      name: cat,
      count: allProducts.filter((p) => p.categoria === cat).length,
    }))
    .filter((c) => c.count > 0);

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="relative overflow-hidden border-b border-orange-300/15 bg-[#070504]">
        <div className="absolute inset-0 bpc-grid opacity-45" />
        <div className="absolute -right-28 top-4 h-72 w-72 rounded-full bg-orange-500/14 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-px w-[78vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <p className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-orange-300">
            Bom Pra Cachorro Pet Shop
          </p>
          <h1 className="mb-3 font-display text-3xl font-extrabold text-orange-50 md:text-5xl">
            Catálogo em modo radar
          </h1>
          <p className="max-w-2xl text-orange-50/58">
            Busque, filtre e escolha o atendimento no WhatsApp. Sem checkout, sem carrinho, sem ruído.
            <span className="mt-2 block text-sm text-orange-300/74">
              {products.length} produto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
            </span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CatalogClient
          initialProducts={products}
          categories={categoriesWithCount}
          whatsappNumbers={config.whatsappNumbers}
          initialSearch={params.search ?? ""}
          initialCategory={params.categoria ?? ""}
          initialSort={params.sort ?? "az"}
        />
      </div>
    </div>
  );
}

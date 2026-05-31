"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Package, Search, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/types";
import { buildWhatsAppLink, formatPrice, formatWhatsAppLabel } from "@/lib/utils";

const PAGE_SIZE = 48;

interface CategoryItem {
  name: string;
  count: number;
}

interface Props {
  initialProducts: Product[];
  categories: CategoryItem[];
  whatsappNumbers: string[];
  initialSearch: string;
  initialCategory: string;
  initialSort: string;
}

export function CatalogClient({
  initialProducts,
  categories,
  whatsappNumbers,
  initialSearch,
  initialCategory,
  initialSort,
}: Props) {
  const [search, setSearch] = useState(initialSearch);
  const [categoria, setCategoria] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [contactProduct, setContactProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredProducts = useMemo(() => {
    let products = [...initialProducts];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.nome.toLowerCase().includes(q) ||
          (p.codigoBarras && p.codigoBarras.includes(q))
      );
    }

    if (categoria && categoria !== "Todos") {
      products = products.filter((p) => p.categoria === categoria);
    }

    switch (sort) {
      case "preco_asc":
        products.sort((a, b) => a.preco - b.preco);
        break;
      case "preco_desc":
        products.sort((a, b) => b.preco - a.preco);
        break;
      case "za":
        products.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      default:
        products.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    return products;
  }, [initialProducts, search, categoria, sort]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, categoria, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategoria("");
    setSort("az");
  };

  const hasActiveFilters = search || categoria || sort !== "az";
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleProducts.length < filteredProducts.length;

  return (
    <div>
      <div className="bpc-glass relative mb-5 overflow-hidden rounded-lg p-4">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-300" />
            <input
              type="text"
              placeholder="Buscar produto ou código de barras"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-orange-300/14 bg-black/28 py-3 pl-10 pr-10 text-sm text-orange-50 placeholder:text-orange-50/34 transition-all focus:border-transparent focus:bg-black/42 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-50/42 transition-colors hover:text-orange-200"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="cursor-pointer rounded-md border border-orange-300/14 bg-black/30 px-3 py-3 text-sm text-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="az">Nome: A-Z</option>
            <option value="za">Nome: Z-A</option>
            <option value="preco_asc">Menor preço</option>
            <option value="preco_desc">Maior preço</option>
          </select>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategoria("")}
            className={`shrink-0 rounded-md px-3 py-2 text-sm font-bold transition-all ${
              !categoria
                ? "bg-orange-500 text-[#120804] shadow-[0_0_26px_rgba(249,115,22,0.22)]"
                : "border border-orange-300/12 bg-white/[0.035] text-orange-50/62 hover:border-orange-300/28 hover:text-orange-100"
            }`}
          >
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setCategoria(c.name)}
              className={`shrink-0 rounded-md px-3 py-2 text-sm font-bold transition-all ${
                categoria === c.name
                  ? "bg-orange-500 text-[#120804] shadow-[0_0_26px_rgba(249,115,22,0.22)]"
                  : "border border-orange-300/12 bg-white/[0.035] text-orange-50/62 hover:border-orange-300/28 hover:text-orange-100"
              }`}
            >
              {c.name} <span className="opacity-60">({c.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-orange-300" />
          <span className="text-sm text-orange-50/58">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""}
            {categoria && <span className="font-semibold text-orange-300"> em {categoria}</span>}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-sm text-orange-50/46 transition-colors hover:text-orange-200"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </button>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-lg border border-orange-300/14 bg-white/[0.035] py-24 text-center">
          <Package className="mx-auto mb-4 h-14 w-14 text-orange-300/28" />
          <h3 className="mb-2 font-display text-xl font-semibold text-orange-50">
            Nenhum produto encontrado
          </h3>
          <p className="mb-6 text-orange-50/45">Tente ajustar os filtros ou a busca.</p>
          <button
            onClick={clearFilters}
            className="rounded-md bg-orange-500 px-6 py-2.5 text-sm font-bold text-[#120804] transition-colors hover:bg-orange-300"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onContact={() => setContactProduct(product)}
            />
          ))}
        </div>
      )}

      {hasMoreProducts && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-md border border-orange-300/18 bg-white/[0.04] px-6 py-3 font-display text-sm font-bold text-orange-50 transition-all hover:border-orange-300/45 hover:bg-orange-500/12"
          >
            Carregar mais produtos
          </button>
        </div>
      )}

      <ContactDialog
        product={contactProduct}
        whatsappNumbers={whatsappNumbers}
        onClose={() => setContactProduct(null)}
      />
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onContact: () => void;
}

function ProductCard({ product, onContact }: ProductCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-orange-300/12 bg-[#120c08] transition-all duration-300 hover:-translate-y-1 hover:border-orange-300/35 hover:shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative h-36 overflow-hidden bg-[#d96b2b] sm:h-44">
        {product.imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imagem}
            alt={product.nome}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src="/logo-bpc.jpeg"
            alt=""
            fill
            sizes="280px"
            className="object-cover opacity-[0.78] transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/5 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-1 truncate text-[11px] font-bold uppercase tracking-wide text-orange-300">
          {product.categoria}
        </div>

        <h3 className="mb-2 line-clamp-2 flex-1 font-display text-sm font-bold leading-snug text-orange-50">
          {product.nome}
        </h3>

        {product.codigoBarras && (
          <div className="mb-2 truncate font-mono text-[11px] text-orange-50/28">
            #{product.codigoBarras}
          </div>
        )}

        <span className="mt-auto font-display text-lg font-extrabold text-orange-100">
          {formatPrice(product.preco)}
        </span>

        <button
          type="button"
          onClick={onContact}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-orange-500 py-2.5 text-sm font-extrabold text-[#120804] transition-all hover:bg-orange-300"
        >
          <MessageCircle className="h-4 w-4" />
          Consultar
        </button>
      </div>
    </article>
  );
}

interface ContactDialogProps {
  product: Product | null;
  whatsappNumbers: string[];
  onClose: () => void;
}

function ContactDialog({ product, whatsappNumbers, onClose }: ContactDialogProps) {
  if (!product) return null;

  const links = whatsappNumbers.map((phone) => buildWhatsAppLink(phone, product.nome));

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 px-4 py-6 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md overflow-hidden rounded-lg border border-orange-300/18 bg-[#0b0705] shadow-2xl">
        <div className="border-b border-orange-300/12 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-orange-300">
                Consultar produto
              </p>
              <h2 className="font-display text-lg font-extrabold leading-snug text-orange-50">
                {product.nome}
              </h2>
              <p className="mt-2 font-display text-xl font-extrabold text-orange-200">
                {formatPrice(product.preco)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-orange-50/42 transition-colors hover:text-orange-100"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3 p-5">
          {links.map((link, index) => (
            <a
              key={link}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-between gap-3 rounded-md border border-orange-300/14 bg-orange-500/10 px-4 py-3 text-orange-50 transition-colors hover:border-orange-300/35 hover:bg-orange-500/18"
            >
              <span className="font-display font-bold">
                Falar com {formatWhatsAppLabel(whatsappNumbers[index], index)}
              </span>
              <MessageCircle className="h-5 w-5 text-orange-300" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

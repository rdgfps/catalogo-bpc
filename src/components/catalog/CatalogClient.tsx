"use client";

import { useEffect, useMemo, useState } from "react";
import { Command, MessageCircle, Package, Search, SlidersHorizontal, X } from "lucide-react";
import { CategoryCover } from "@/components/catalog/CategoryCover";
import type { Product } from "@/types";
import { buildWhatsAppLink, formatPrice, formatWhatsAppLabel, matchesSearch } from "@/lib/utils";

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
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");

  const filteredProducts = useMemo(() => {
    let products = [...initialProducts];

    if (search.trim()) {
      products = products.filter(
        (p) =>
          matchesSearch(`${p.nome} ${p.categoria}`, search) ||
          (p.codigoBarras && p.codigoBarras.includes(search.trim()))
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

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
        return;
      }

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        setCommandOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const clearFilters = () => {
    setSearch("");
    setCategoria("");
    setSort("az");
  };

  const hasActiveFilters = search || categoria || sort !== "az";
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleProducts.length < filteredProducts.length;
  const commandProducts = useMemo(() => {
    const q = commandSearch.trim();
    const source = q
      ? initialProducts.filter(
          (p) =>
            matchesSearch(`${p.nome} ${p.categoria}`, q) ||
            (p.codigoBarras && p.codigoBarras.includes(q))
        )
      : initialProducts;
    return source.slice(0, 8);
  }, [commandSearch, initialProducts]);

  const commandCategories = useMemo(() => {
    const q = commandSearch.trim();
    return categories
      .filter((c) => !q || matchesSearch(c.name, q))
      .slice(0, 5);
  }, [categories, commandSearch]);

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
              className="w-full rounded-md border border-orange-300/14 bg-orange-50 py-3 pl-10 pr-10 text-sm text-black placeholder:text-black/45 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="cursor-pointer rounded-md border border-orange-300/14 bg-orange-50 px-3 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="az">Nome: A-Z</option>
            <option value="za">Nome: Z-A</option>
            <option value="preco_asc">Menor preço</option>
            <option value="preco_desc">Maior preço</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="mt-3 flex w-full items-center justify-between rounded-md border border-orange-300/12 bg-black/20 px-3 py-2.5 text-left text-sm text-orange-50/60 transition-colors hover:border-orange-300/30 hover:bg-orange-500/10"
        >
          <span className="inline-flex items-center gap-2">
            <Command className="h-4 w-4 text-orange-300" />
            Abrir busca rápida
          </span>
          <span className="rounded border border-orange-300/20 px-1.5 py-0.5 font-mono text-[11px] text-orange-50/40">
            Ctrl K
          </span>
        </button>

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

      <CommandPalette
        open={commandOpen}
        query={commandSearch}
        products={commandProducts}
        categories={commandCategories}
        onQueryChange={setCommandSearch}
        onClose={() => setCommandOpen(false)}
        onPickProduct={(product) => {
          setSearch(product.nome);
          setCategoria("");
          setCommandOpen(false);
          setCommandSearch("");
        }}
        onPickCategory={(category) => {
          setCategoria(category);
          setSearch("");
          setCommandOpen(false);
          setCommandSearch("");
        }}
        onClear={() => {
          clearFilters();
          setCommandOpen(false);
          setCommandSearch("");
        }}
      />
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onContact: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  query: string;
  products: Product[];
  categories: CategoryItem[];
  onQueryChange: (value: string) => void;
  onClose: () => void;
  onPickProduct: (product: Product) => void;
  onPickCategory: (category: string) => void;
  onClear: () => void;
}

function CommandPalette({
  open,
  query,
  products,
  categories,
  onQueryChange,
  onClose,
  onPickProduct,
  onPickCategory,
  onClear,
}: CommandPaletteProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[85] flex items-start justify-center bg-black/72 px-4 py-20 backdrop-blur-md">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Fechar busca rápida"
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-orange-300/18 bg-[#090604] shadow-[0_32px_140px_rgba(0,0,0,0.7)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />
        <div className="flex items-center gap-3 border-b border-orange-300/12 bg-orange-50 px-4 py-3">
          <Command className="h-5 w-5 text-orange-300" />
          <input
            autoFocus
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Digite produto, categoria ou código..."
            className="min-w-0 flex-1 bg-transparent text-base font-semibold text-black placeholder:text-black/45 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-black/45 transition-colors hover:text-black"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-3">
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onClear}
              className="rounded-md border border-orange-300/14 bg-white/[0.035] px-3 py-2 text-xs font-bold text-orange-50/64 transition-colors hover:bg-orange-500/12 hover:text-orange-100"
            >
              Ver tudo
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => onPickCategory(category.name)}
                className="rounded-md border border-orange-300/14 bg-white/[0.035] px-3 py-2 text-xs font-bold text-orange-50/64 transition-colors hover:bg-orange-500/12 hover:text-orange-100"
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            {products.length === 0 ? (
              <div className="rounded-md border border-orange-300/12 bg-white/[0.025] px-4 py-8 text-center text-sm text-orange-50/44">
                Nenhum item encontrado.
              </div>
            ) : (
              products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onPickProduct(product)}
                  className="group flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition-colors hover:bg-orange-500/10"
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-[#d96b2b]">
                    {product.imagem ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.imagem} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <CategoryCover category={product.categoria} compact />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-sm font-bold text-orange-50 group-hover:text-orange-200">
                      {product.nome}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-orange-50/42">
                      <span>{product.categoria}</span>
                      <span>/</span>
                      <span>{formatPrice(product.preco)}</span>
                    </div>
                  </div>
                  <OpenGlyph />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OpenGlyph() {
  return (
    <span className="flex h-7 w-12 flex-shrink-0 items-center justify-center rounded border border-orange-300/12 text-[10px] font-bold text-orange-300/60 transition-colors group-hover:border-orange-300/35 group-hover:text-orange-200">
      Abrir
    </span>
  );
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
          <CategoryCover category={product.categoria} name={product.nome} />
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

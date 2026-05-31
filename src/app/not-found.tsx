import Link from "next/link";
import { ArrowRight, Home, Search } from "lucide-react";
import { WhatsAppSelector } from "@/components/common/WhatsAppSelector";
import { getConfig } from "@/lib/store";

export default function NotFound() {
  const config = getConfig();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bpc-grid opacity-40" />
      <div className="absolute inset-0 bpc-noise opacity-30" />
      <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-orange-500/12 blur-3xl" />
      <div className="absolute left-1/2 top-0 h-px w-[78vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-orange-300/18 bg-orange-500/10 px-3 py-2 text-sm font-bold text-orange-200">
            <Search className="h-4 w-4" />
            Rota não encontrada
          </div>

          <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-none text-orange-50 sm:text-7xl">
            404.
            <span className="block text-3xl text-orange-300 sm:text-5xl">
              Esse caminho saiu para passear.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-orange-50/58">
            A página não existe ou mudou de endereço. Volte para o catálogo ou fale direto com a loja.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/produtos"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-7 py-3.5 font-display text-base font-extrabold text-[#120804] shadow-[0_20px_70px_rgba(249,115,22,0.28)] transition-all hover:-translate-y-0.5 hover:bg-orange-300"
            >
              Ir para o catálogo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-orange-300/18 bg-white/[0.04] px-7 py-3.5 font-display text-base font-bold text-orange-50 transition-all hover:border-orange-300/45 hover:bg-orange-500/12"
            >
              <Home className="h-4 w-4 text-orange-300" />
              Voltar ao início
            </Link>
            <WhatsAppSelector phones={config.whatsappNumbers} label="WhatsApp" align="left" />
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[420px]">
          <div className="absolute inset-0 rounded-lg border border-orange-300/14 bg-[#0a0604] shadow-[0_32px_120px_rgba(0,0,0,0.45)]" />
          <div className="absolute inset-6 rounded-lg border border-orange-300/10 bpc-grid opacity-70" />
          <div className="absolute left-8 top-8 text-[7rem] font-display font-extrabold leading-none text-white/[0.035]">
            404
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <CartoonDog />
          </div>
        </div>
      </div>
    </section>
  );
}

function CartoonDog() {
  return (
    <svg
      viewBox="0 0 260 260"
      className="h-[260px] w-[260px] drop-shadow-[0_24px_70px_rgba(249,115,22,0.18)]"
      role="img"
      aria-label="Cachorro cartoon"
    >
      <circle cx="130" cy="136" r="88" fill="#f97316" opacity="0.14" />
      <ellipse cx="130" cy="183" rx="72" ry="23" fill="#000" opacity="0.25" />
      <path d="M73 103c-14-22-26-42-42-37-13 4-14 27 5 54 11 16 21 19 37-17Z" fill="#2b1710" />
      <path d="M187 103c14-22 26-42 42-37 13 4 14 27-5 54-11 16-21 19-37-17Z" fill="#2b1710" />
      <path d="M66 123c0-44 28-77 64-77s64 33 64 77c0 47-27 78-64 78s-64-31-64-78Z" fill="#f7efe7" />
      <path d="M83 118c0-36 20-62 47-62s47 26 47 62c0 39-19 64-47 64s-47-25-47-64Z" fill="#f97316" opacity="0.16" />
      <circle cx="105" cy="121" r="8" fill="#160b07" />
      <circle cx="155" cy="121" r="8" fill="#160b07" />
      <circle cx="108" cy="118" r="2.5" fill="#fff" />
      <circle cx="158" cy="118" r="2.5" fill="#fff" />
      <path d="M121 141c0-7 18-7 18 0 0 6-5 10-9 10s-9-4-9-10Z" fill="#160b07" />
      <path d="M130 151c0 12-13 15-22 8" fill="none" stroke="#160b07" strokeWidth="5" strokeLinecap="round" />
      <path d="M130 151c0 12 13 15 22 8" fill="none" stroke="#160b07" strokeWidth="5" strokeLinecap="round" />
      <path d="M91 88c13-22 39-28 62-14" fill="none" stroke="#160b07" strokeWidth="8" strokeLinecap="round" opacity="0.18" />
      <path d="M87 178c17 19 69 22 89 0" fill="none" stroke="#160b07" strokeWidth="7" strokeLinecap="round" opacity="0.12" />
      <circle cx="74" cy="88" r="7" fill="#f97316" />
      <circle cx="190" cy="88" r="7" fill="#f97316" />
    </svg>
  );
}

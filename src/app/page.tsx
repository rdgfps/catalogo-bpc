import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, MapPin, Navigation, Radar, Sparkles, Zap } from "lucide-react";
import { WhatsAppSelector } from "@/components/common/WhatsAppSelector";
import { CategoryCover } from "@/components/catalog/CategoryCover";
import { getConfig, getProducts } from "@/lib/store";
import { getAllCategories } from "@/lib/categorize";
import { formatPrice } from "@/lib/utils";

export default function HomePage() {
  const config = getConfig();
  const allProducts = getProducts().filter((p) => p.ativo);
  const featured = allProducts.slice(0, 6);
  const totalProducts = allProducts.length;
  const location = config.location;

  const categories = getAllCategories()
    .map((cat) => ({
      name: cat,
      count: allProducts.filter((p) => p.categoria === cat).length,
    }))
    .filter((cat) => cat.count > 0)
    .slice(0, 8);

  return (
    <>
      <section className="relative overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 bpc-grid opacity-60" />
        <div className="absolute inset-0 bpc-noise opacity-40" />
        <div className="absolute left-1/2 top-0 h-px w-[80vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-orange-500/14 blur-3xl bpc-orbit" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-orange-300/20 bg-orange-500/10 px-3 py-2 text-sm font-bold text-orange-200 shadow-[0_0_28px_rgba(249,115,22,0.12)]">
              <Radar className="h-4 w-4" />
              {totalProducts > 0 ? `${totalProducts} produtos mapeados` : "Catálogo ativo"}
            </div>

            <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-[1.04] text-orange-50 sm:text-5xl md:text-7xl">
              Tudo para o seu pet com atendimento próximo e catálogo inteligente.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-orange-50/62 md:text-xl">
              Um catálogo rápido, direto e diferente do varejo comum: você encontra o produto, escolhe com quem falar e resolve pelo WhatsApp da loja.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/produtos"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-7 py-3.5 font-display text-base font-extrabold text-[#120804] shadow-[0_20px_70px_rgba(249,115,22,0.28)] transition-all hover:bg-orange-300 hover:-translate-y-0.5"
              >
                Abrir catálogo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <WhatsAppSelector
                phones={config.whatsappNumbers}
                label="Chamar no WhatsApp"
                align="left"
              />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[460px]">
            <div className="absolute -inset-5 rounded-[2rem] border border-orange-300/10 bg-orange-500/5 blur-sm" />
            <div className="relative overflow-hidden rounded-lg border border-orange-300/18 bg-[#130d09] shadow-[0_32px_120px_rgba(0,0,0,0.55)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/80 to-transparent" />
              <div className="relative aspect-square">
                <Image
                  src="/logo-bpc.jpeg"
                  alt="Bom Pra Cachorro Pet Shop"
                  fill
                  sizes="460px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
                <div className="absolute bottom-4 left-4 right-4 overflow-hidden rounded-md border border-white/10 bg-black/45 p-4 backdrop-blur-md">
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-orange-300/18 to-transparent bpc-scan" />
                  <div className="relative flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-orange-300">
                        Bom Pra Cachorro
                      </p>
                      <p className="mt-1 text-sm font-semibold text-orange-50/78">
                        Catálogo local, atendimento humano.
                      </p>
                    </div>
                    <Sparkles className="h-5 w-5 text-orange-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 rounded-md border border-orange-300/18 bg-[#0a0705]/90 px-4 py-3 shadow-2xl backdrop-blur bpc-float">
              <div className="flex items-center gap-2 text-sm font-bold text-orange-50">
                <Zap className="h-4 w-4 text-orange-300" />
                Consulta sem checkout
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-orange-300/10 bg-[#0a0604] py-14">
        <div className="absolute inset-0 bpc-grid opacity-25" />
        <div className="absolute left-1/2 top-0 h-px w-[68vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-300/55 to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-orange-300/18 bg-white/[0.035] px-3 py-2 text-sm font-bold text-orange-200">
              <MapPin className="h-4 w-4" />
              Localização
            </div>
            <h2 className="max-w-3xl font-display text-3xl font-extrabold leading-tight text-orange-50 md:text-5xl">
              Estamos em Canguçu para atender você e seu pet.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-orange-50/58">
              Passe na loja para conferir produtos, tirar dúvidas e encontrar o cuidado certo para o seu pet.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-orange-300/12 bg-white/[0.035] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-orange-300">
                  Região
                </p>
                <p className="mt-2 font-display text-xl font-extrabold text-orange-50">
                  {location.label}
                </p>
                <p className="mt-1 text-sm text-orange-50/44">{location.address}</p>
              </div>
              <div className="rounded-lg border border-orange-300/12 bg-white/[0.035] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-orange-300">
                  Antes de sair
                </p>
                <p className="mt-2 text-sm leading-relaxed text-orange-50/58">
                  Chame no WhatsApp para confirmar produto, preço ou melhor horário de atendimento.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-orange-500 px-6 py-3 font-display text-sm font-extrabold text-[#120804] shadow-[0_20px_70px_rgba(249,115,22,0.22)] transition-all hover:-translate-y-0.5 hover:bg-orange-300"
              >
                Abrir rota
                <Navigation className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <WhatsAppSelector
                phones={config.whatsappNumbers}
                label="Confirmar atendimento"
                align="left"
              />
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center rounded-lg border border-orange-300/14 bg-[#050505] shadow-[0_32px_120px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-6 rounded-full border border-orange-300/10" />
            <div className="absolute inset-14 rounded-full border border-orange-300/12" />
            <div className="absolute inset-24 rounded-full border border-orange-300/14" />
            <div className="absolute left-1/2 top-8 h-[calc(50%-2rem)] w-px origin-bottom -translate-x-1/2 bg-gradient-to-t from-orange-300/65 to-transparent bpc-radar-sweep" />
            <div className="absolute h-28 w-28 rounded-full border border-orange-300/20 bpc-radar-pulse" />
            <div className="absolute h-44 w-44 rounded-full border border-orange-300/10 bpc-radar-pulse [animation-delay:900ms]" />

            <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-lg border border-orange-300/25 bg-orange-500/12 shadow-[0_0_55px_rgba(249,115,22,0.28)] backdrop-blur">
              <Image
                src="/logo-bpc.jpeg"
                alt="Bom Pra Cachorro Pet Shop"
                width={68}
                height={68}
                className="rounded-md object-cover"
              />
            </div>

            <div className="absolute right-8 top-16 rounded-md border border-orange-300/16 bg-black/50 px-3 py-2 text-xs font-bold text-orange-200 backdrop-blur">
              rota ativa
            </div>
            <div className="absolute bottom-10 left-8 rounded-md border border-orange-300/16 bg-black/50 px-3 py-2 text-xs font-bold text-orange-50/70 backdrop-blur">
              {location.label}
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="relative bg-[#090604] py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 font-display text-sm font-bold uppercase tracking-wide text-orange-300">
                  Comandos rápidos
                </p>
                <h2 className="font-display text-2xl font-extrabold text-orange-50 md:text-3xl">
                  Encontre por categoria
                </h2>
              </div>
              <Link
                href="/produtos"
                className="hidden items-center gap-1 text-sm font-bold text-orange-300 hover:text-orange-100 sm:inline-flex"
              >
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {categories.map((cat, index) => (
                <Link
                  key={cat.name}
                  href={`/produtos?categoria=${encodeURIComponent(cat.name)}`}
                  className="group relative overflow-hidden rounded-lg border border-orange-300/12 bg-white/[0.035] p-4 transition-all hover:-translate-y-1 hover:border-orange-300/35 hover:bg-orange-500/10"
                >
                  <div className="absolute right-3 top-3 font-display text-5xl font-extrabold text-white/[0.025]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-orange-500 text-sm font-display font-extrabold text-[#120804] shadow-[0_0_30px_rgba(249,115,22,0.18)]">
                    {cat.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="font-display text-sm font-bold text-orange-50 transition-colors group-hover:text-orange-200">
                    {cat.name}
                  </div>
                  <div className="mt-1 text-xs text-orange-50/42">
                    {cat.count} produto{cat.count !== 1 ? "s" : ""}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="relative overflow-hidden bg-[#050505] py-14">
          <div className="absolute inset-0 bpc-grid opacity-30" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-orange-300">
                  <Compass className="h-4 w-4" />
                  Radar da loja
                </p>
                <h2 className="font-display text-2xl font-extrabold text-orange-50 md:text-3xl">
                  Produtos em destaque
                </h2>
              </div>
              <Link
                href="/produtos"
                className="inline-flex items-center gap-1 text-sm font-bold text-orange-300 hover:text-orange-100"
              >
                Ver catálogo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {featured.map((product) => (
                <Link
                  key={product.id}
                  href={`/produtos?search=${encodeURIComponent(product.nome)}`}
                  className="group overflow-hidden rounded-lg border border-orange-300/12 bg-[#120c08] transition-all duration-300 hover:-translate-y-1 hover:border-orange-300/35 hover:shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
                >
                  <div className="relative h-32 overflow-hidden bg-[#d96b2b] sm:h-44">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </div>
                  <div className="p-4">
                    <div className="mb-1 truncate text-[11px] font-bold uppercase tracking-wide text-orange-300">
                      {product.categoria}
                    </div>
                    <h3 className="mb-3 line-clamp-2 font-display text-sm font-bold leading-snug text-orange-50">
                      {product.nome}
                    </h3>
                    <span className="font-display text-lg font-extrabold text-orange-100">
                      {formatPrice(product.preco)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

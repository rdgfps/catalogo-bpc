import Link from "next/link";
import Image from "next/image";
import { WhatsAppSelector } from "@/components/common/WhatsAppSelector";
import { MobileMenu } from "./MobileMenu";

interface Props {
  whatsapps: string[];
}

export function Header({ whatsapps }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-orange-300/10 bg-[#050505]/78 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-md overflow-hidden bg-orange-500 ring-1 ring-orange-300/30 shadow-[0_0_30px_rgba(249,115,22,0.22)]">
              <Image
                src="/logo-bpc.jpeg"
                alt="Bom Pra Cachorro Pet Shop"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <div className="font-display font-extrabold text-orange-50 text-sm leading-tight">
                Bom Pra Cachorro
              </div>
              <div className="text-xs text-orange-300 leading-tight font-semibold">Pet Shop</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/"
              className="text-orange-50/68 hover:text-orange-200 transition-colors text-sm font-semibold"
            >
              Início
            </Link>
            <Link
              href="/produtos"
              className="text-orange-50/68 hover:text-orange-200 transition-colors text-sm font-semibold"
            >
              Catálogo
            </Link>
            <WhatsAppSelector phones={whatsapps} iconOnly />
          </nav>

          <MobileMenu whatsapps={whatsapps} />
        </div>
      </div>
    </header>
  );
}

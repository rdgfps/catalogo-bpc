import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { buildGeneralWhatsAppLink, formatWhatsAppLabel } from "@/lib/utils";

interface Props {
  whatsapps: string[];
}

export function Header({ whatsapps }: Props) {
  const whatsappLinks = whatsapps.map((phone) => buildGeneralWhatsAppLink(phone));

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
            <div className="flex items-center gap-2">
              {whatsappLinks.map((link, index) => (
                <a
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md border border-orange-300/20 bg-orange-500/10 px-3 py-2 text-sm font-bold text-orange-50 transition-all hover:border-orange-300/45 hover:bg-orange-500/20 hover:shadow-[0_0_24px_rgba(249,115,22,0.16)]"
                >
                  <MessageCircle className="w-4 h-4 text-orange-300" />
                  {formatWhatsAppLabel(whatsapps[index], index)}
                </a>
              ))}
            </div>
          </nav>

          <MobileMenu whatsappLinks={whatsappLinks} whatsapps={whatsapps} />
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Clock, MessageCircle } from "lucide-react";
import { buildGeneralWhatsAppLink, formatWhatsAppLabel } from "@/lib/utils";

interface Props {
  whatsapps: string[];
}

export function Footer({ whatsapps }: Props) {
  const whatsappLinks = whatsapps.map((phone) => buildGeneralWhatsAppLink(phone));
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-orange-300/15 bg-[#050505]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/70 to-transparent" />
      <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-orange-600/10 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative w-11 h-11 rounded-md overflow-hidden bg-orange-500 ring-1 ring-orange-300/30">
                <Image
                  src="/logo-bpc.jpeg"
                  alt="Bom Pra Cachorro Pet Shop"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-display font-extrabold text-white text-sm">Bom Pra Cachorro</div>
                <div className="text-xs text-orange-300 font-semibold">Pet Shop</div>
              </div>
            </div>
            <p className="text-orange-50/52 text-sm leading-relaxed max-w-xs">
              Tudo para o seu melhor amigo em um só lugar.
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-white text-sm mb-3">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-orange-50/52 hover:text-orange-300 text-sm transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/produtos" className="text-orange-50/52 hover:text-orange-300 text-sm transition-colors">
                  Catálogo de Produtos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white text-sm mb-3">Contato</h3>
            <div className="space-y-2">
              {whatsappLinks.map((link, index) => (
                <a
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-orange-300 hover:text-orange-100 text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {formatWhatsAppLabel(whatsapps[index], index)}
                </a>
              ))}
              <div className="flex items-center gap-2 text-orange-50/42 text-sm">
                <Clock className="w-4 h-4" />
                Seg-Sex: 9h-12:30h / 13:30h-18:30h | Sáb: 9h-13h
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-orange-50/34 text-xs">
              © {year} Bom Pra Cachorro Pet Shop. Todos os direitos reservados.
            </p>
            <p className="text-orange-50/34 text-xs">
              Desenvolvido por{" "}
              <a
                href="https://www.instagram.com/rodeghierotech"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-orange-300 transition-colors hover:text-orange-100"
              >
                Henrique Rodeghiero
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

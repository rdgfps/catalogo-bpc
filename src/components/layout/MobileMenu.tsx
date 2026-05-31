"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { formatWhatsAppLabel } from "@/lib/utils";

interface Props {
  whatsappLinks: string[];
  whatsapps: string[];
}

export function MobileMenu({ whatsappLinks, whatsapps }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-orange-50 hover:text-orange-300 transition-colors p-1"
        aria-label="Menu"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 z-50 space-y-3 border-b border-orange-300/15 bg-[#090604]/96 px-4 py-4 shadow-2xl backdrop-blur-xl">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block py-2 text-sm font-semibold text-orange-50/78 hover:text-orange-300"
          >
            Início
          </Link>
          <Link
            href="/produtos"
            onClick={() => setOpen(false)}
            className="block py-2 text-sm font-semibold text-orange-50/78 hover:text-orange-300"
          >
            Catálogo
          </Link>
          {whatsappLinks.map((link, index) => (
            <a
              key={link}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-orange-300/20 bg-orange-500/12 px-4 py-2.5 text-sm font-bold text-orange-50 transition-colors hover:bg-orange-500/22"
            >
              <MessageCircle className="w-4 h-4 text-orange-300" />
              {formatWhatsAppLabel(whatsapps[index], index)}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

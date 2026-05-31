"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { WhatsAppSelector } from "@/components/common/WhatsAppSelector";

interface Props {
  whatsapps: string[];
}

export function MobileMenu({ whatsapps }: Props) {
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
          <WhatsAppSelector
            phones={whatsapps}
            label="Chamar no WhatsApp"
            align="left"
            fullWidth
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}

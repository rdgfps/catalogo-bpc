"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { buildGeneralWhatsAppLink, formatWhatsAppLabel } from "@/lib/utils";

interface Props {
  phones: string[];
}

export function FloatingWhatsApp({ phones }: Props) {
  const [open, setOpen] = useState(false);
  const links = phones.map((phone) => buildGeneralWhatsAppLink(phone));

  return (
    <div className="fixed bottom-20 right-4 z-[75] sm:bottom-5 sm:right-5">
      {open && (
        <div className="mb-3 w-60 overflow-hidden rounded-lg border border-orange-300/18 bg-[#090604]/98 p-2 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wide text-orange-300/80">
            Escolha o atendimento
          </p>
          <div className="space-y-1">
            {links.map((link, index) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-orange-50 transition-colors hover:bg-orange-500/14"
              >
                <span>{formatWhatsAppLabel(phones[index], index)}</span>
                <MessageCircle className="h-4 w-4 text-orange-300" />
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="group flex h-14 w-14 items-center justify-center rounded-full border border-orange-300/25 bg-orange-500 text-[#120804] shadow-[0_18px_70px_rgba(249,115,22,0.35)] transition-all hover:-translate-y-0.5 hover:bg-orange-300"
        aria-expanded={open}
        aria-label="Abrir WhatsApp"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
        )}
      </button>
    </div>
  );
}

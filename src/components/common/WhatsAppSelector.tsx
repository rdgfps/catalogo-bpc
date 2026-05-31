"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { buildGeneralWhatsAppLink, formatWhatsAppLabel } from "@/lib/utils";

interface Props {
  phones: string[];
  label?: string;
  iconOnly?: boolean;
  fullWidth?: boolean;
  align?: "left" | "right";
  className?: string;
}

export function WhatsAppSelector({
  phones,
  label = "WhatsApp",
  iconOnly = false,
  fullWidth = false,
  align = "right",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const links = phones.map((phone) => buildGeneralWhatsAppLink(phone));

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex items-center justify-center gap-2 rounded-md border border-orange-300/20 bg-orange-500/10 font-bold text-orange-50 transition-all hover:border-orange-300/45 hover:bg-orange-500/20 hover:shadow-[0_0_24px_rgba(249,115,22,0.16)] ${
          iconOnly ? "h-10 w-10 p-0" : "px-4 py-3 text-sm"
        } ${fullWidth ? "w-full" : ""}`}
        aria-expanded={open}
        aria-label="Escolher WhatsApp"
      >
        {open ? (
          <X className="h-4 w-4 text-orange-300" />
        ) : (
          <MessageCircle className="h-4 w-4 text-orange-300" />
        )}
        {!iconOnly && <span>{label}</span>}
      </button>

      {open && (
        <div
          className={`absolute top-[calc(100%+0.5rem)] z-[90] w-56 overflow-hidden rounded-lg border border-orange-300/18 bg-[#090604]/98 p-2 shadow-2xl backdrop-blur-xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
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
    </div>
  );
}

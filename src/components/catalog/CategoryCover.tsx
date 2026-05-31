import { Bone, Brush, HeartPulse, Package, PawPrint, ShieldPlus, Sparkles, Truck } from "lucide-react";

interface Props {
  category: string;
  name?: string;
  compact?: boolean;
}

const coverMap = [
  { match: ["ração", "racoes", "nutri"], icon: Bone, tone: "from-orange-500/85 via-[#7c2d12] to-[#120804]" },
  { match: ["higi", "areia"], icon: Sparkles, tone: "from-amber-400/80 via-orange-700 to-[#100806]" },
  { match: ["medic"], icon: HeartPulse, tone: "from-red-500/75 via-orange-800 to-[#100806]" },
  { match: ["banho", "tosa"], icon: Brush, tone: "from-orange-300/80 via-orange-700 to-[#120804]" },
  { match: ["passeio"], icon: PawPrint, tone: "from-orange-500/75 via-stone-800 to-[#090604]" },
  { match: ["transporte"], icon: Truck, tone: "from-orange-400/75 via-orange-900 to-[#090604]" },
  { match: ["descanso"], icon: ShieldPlus, tone: "from-yellow-500/65 via-orange-800 to-[#100806]" },
];

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function getCover(category: string) {
  const normalized = normalize(category);
  return coverMap.find((item) => item.match.some((term) => normalized.includes(term))) ?? {
    icon: Package,
    tone: "from-orange-500/80 via-[#3b1b0f] to-[#090604]",
  };
}

export function CategoryCover({ category, name, compact = false }: Props) {
  const cover = getCover(category);
  const Icon = cover.icon;

  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${cover.tone}`}>
      <div className="absolute inset-0 bpc-grid opacity-25" />
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-black/35 blur-2xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-100/60 to-transparent" />

      <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-black/22 text-orange-100 backdrop-blur">
        <Icon className="h-5 w-5" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="font-display text-[5rem] font-extrabold leading-none text-white/[0.08]">
          {category.slice(0, 1).toUpperCase()}
        </div>
      </div>

      {!compact && (
        <div className="absolute bottom-3 left-3 right-3">
          <p className="truncate text-[11px] font-bold uppercase tracking-wide text-orange-100/78">
            {category}
          </p>
          {name && (
            <p className="mt-1 line-clamp-1 text-xs font-semibold text-white/72">
              {name}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

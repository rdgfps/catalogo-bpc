export function buildWhatsAppLink(phone: string, productName: string): string {
  const message = encodeURIComponent(
    `Olá! Vi no site o produto *${productName}* e gostaria de saber mais sobre ele.`
  );
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${message}`;
}

export function buildGeneralWhatsAppLink(phone: string): string {
  const message = encodeURIComponent(
    "Olá! Gostaria de saber mais sobre os produtos do Bom Pra Cachorro Pet Shop."
  );
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${message}`;
}

export function formatWhatsAppLabel(phone: string, index: number): string {
  const clean = phone.replace(/\D/g, "");
  if (clean.endsWith("991566695")) return "Henrique";
  if (clean.endsWith("984170695")) return "Sergio";
  return `WhatsApp ${index + 1}`;
}

export function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function normalizeSearchText(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

  const aliases: string[] = [];

  if (/\bracao\b|\bracoes\b/.test(normalized)) {
    aliases.push("racao", "racoes");
  }

  if (/\bacessorio\b|\bacessorios\b/.test(normalized)) {
    aliases.push("acessorio", "acessorios");
  }

  if (/\bhigiene\b|\bhigienico\b|\bhigienicos\b/.test(normalized)) {
    aliases.push("higiene", "higienico", "higienicos");
  }

  return [normalized, ...aliases].join(" ").trim();
}

export function matchesSearch(value: string, query: string): boolean {
  const normalizedValue = normalizeSearchText(value);
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  return normalizedQuery
    .split(" ")
    .filter(Boolean)
    .every((term) => normalizedValue.includes(term));
}

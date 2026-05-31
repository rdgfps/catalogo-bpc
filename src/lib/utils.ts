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

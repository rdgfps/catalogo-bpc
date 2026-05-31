import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/common/FloatingWhatsApp";
import { getConfig } from "@/lib/store";

export const metadata: Metadata = {
  metadataBase: new URL("https://bompracachorro.com.br"),
  title: {
    default: "Bom Pra Cachorro Pet Shop | Catálogo de Produtos",
    template: "%s | Bom Pra Cachorro Pet Shop",
  },
  description:
    "Catálogo online do Bom Pra Cachorro Pet Shop. Rações, medicamentos, acessórios, brinquedos e itens para pets.",
  keywords: [
    "pet shop",
    "ração para cachorro",
    "ração para gato",
    "acessórios para pets",
    "medicamentos veterinários",
    "bom pra cachorro",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Bom Pra Cachorro Pet Shop",
    description:
      "Consulte produtos do Bom Pra Cachorro Pet Shop e fale direto com a loja pelo WhatsApp.",
    siteName: "Bom Pra Cachorro Pet Shop",
    images: [
      {
        url: "/logo-bpc.jpeg",
        width: 1119,
        height: 1119,
        alt: "Bom Pra Cachorro Pet Shop",
      },
    ],
  },
  icons: {
    icon: "/logo-bpc.jpeg",
    apple: "/logo-bpc.jpeg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = getConfig();

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050505] text-orange-50 antialiased">
        <Header whatsapps={config.whatsappNumbers} />
        <main className="min-h-screen">{children}</main>
        <FloatingWhatsApp phones={config.whatsappNumbers} />
        <Footer whatsapps={config.whatsappNumbers} location={config.location} />
      </body>
    </html>
  );
}

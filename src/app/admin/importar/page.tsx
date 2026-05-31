import type { Metadata } from "next";
import { getConfig, getProducts } from "@/lib/store";
import { ImportClient } from "@/components/admin/ImportClient";
import { requireAdminPage } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Importar Produtos | Admin",
  robots: { index: false, follow: false },
};

export default async function AdminImportPage() {
  await requireAdminPage();

  const config = getConfig();
  const currentProducts = getProducts();
  const activeProducts = currentProducts.filter((p) => p.ativo).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-lg text-white">
              Admin — Bom Pra Cachorro
            </h1>
            <p className="text-xs text-gray-500">Área restrita</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Voltar ao site
            </a>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-red-300 transition-colors"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-3xl font-display font-bold text-orange-500">
              {currentProducts.length}
            </div>
            <div className="text-sm text-gray-400 mt-1">Produtos cadastrados</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-3xl font-display font-bold text-green-400">
              {activeProducts}
            </div>
            <div className="text-sm text-gray-400 mt-1">Produtos ativos</div>
          </div>
        </div>

        <ImportClient whatsappNumbers={config.whatsappNumbers} />
      </div>
    </div>
  );
}

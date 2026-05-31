import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login Admin | Bom Pra Cachorro",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-orange-500 ring-1 ring-white/10 mb-4">
            <Image
              src="/logo-bpc.jpeg"
              alt="Bom Pra Cachorro Pet Shop"
              fill
              sizes="80px"
              className="object-cover"
              priority
            />
          </div>
          <h1 className="font-display font-bold text-2xl">Área Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Bom Pra Cachorro Pet Shop</p>
        </div>

        <form action="/api/admin/login" method="post" className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          {params.error && (
            <div className="rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-sm text-red-300">
              Usuário ou senha inválidos.
            </div>
          )}

          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-300 mb-1.5">
              Usuário
            </label>
            <input
              id="user"
              name="user"
              type="text"
              autoComplete="username"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-display font-semibold py-2.5 rounded-xl transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

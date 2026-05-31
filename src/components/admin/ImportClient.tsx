"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, XCircle, AlertTriangle, Settings } from "lucide-react";

interface Props {
  whatsappNumbers: string[];
}

interface ImportResult {
  success: boolean;
  total: number;
  imported: number;
  errors: string[];
}

export function ImportClient({ whatsappNumbers }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [whatsapp1, setWhatsapp1] = useState(whatsappNumbers[0] ?? "");
  const [whatsapp2, setWhatsapp2] = useState(whatsappNumbers[1] ?? "");
  const [configSaved, setConfigSaved] = useState(false);

  async function handleFile(file: File) {
    setFileName(file.name);
    setResult(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        success: false,
        total: 0,
        imported: 0,
        errors: ["Erro ao enviar o arquivo. Tente novamente."],
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function saveConfig() {
    const res = await fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsappNumbers: [whatsapp1, whatsapp2].filter(Boolean) }),
    });
    if (res.status === 401) {
      window.location.href = "/admin/login";
      return;
    }
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg text-white mb-1 flex items-center gap-2">
          <Upload className="w-5 h-5 text-orange-500" />
          Importar Produtos
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Faça upload do arquivo exportado pelo MarketUP (CSV, XLSX, JSON ou XML). O sistema detecta o formato automaticamente.
        </p>

        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-orange-500 bg-orange-500/5"
              : "border-gray-700 hover:border-gray-500 hover:bg-gray-800/50"
          }`}
        >
          <FileText className={`w-12 h-12 mx-auto mb-3 transition-colors ${isDragging ? "text-orange-500" : "text-gray-600"}`} />
          <p className="text-white font-medium mb-1">
            {fileName ? fileName : "Clique ou arraste o arquivo aqui"}
          </p>
          <p className="text-gray-500 text-sm">CSV, XLSX, JSON ou XML — exportado pelo MarketUP</p>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".csv,.xlsx,.json,.xml"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {isLoading && (
          <div className="mt-4 flex items-center gap-3 text-orange-400">
            <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Importando produtos...</span>
          </div>
        )}

        {result && (
          <div className={`mt-4 rounded-xl p-4 border ${result.success ? "bg-green-900/20 border-green-800" : "bg-red-900/20 border-red-800"}`}>
            <div className="flex items-center gap-2 mb-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`font-display font-semibold ${result.success ? "text-green-400" : "text-red-400"}`}>
                {result.success ? "Importação concluída!" : "Erro na importação"}
              </span>
            </div>
            <p className="text-sm text-gray-300">
              {result.imported} de {result.total} produtos importados com sucesso.
            </p>
            {result.errors.length > 0 && (
              <div className="mt-2 space-y-1">
                {result.errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-red-400">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {err}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="font-display font-bold text-lg text-white mb-1 flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-500" />
          Configurações
        </h2>
        <p className="text-sm text-gray-400 mb-6">Ajuste o contato usado no catálogo.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              WhatsApp Henrique
              <span className="text-gray-500 font-normal ml-1">(com código do país, ex: 5551999999999)</span>
            </label>
            <input
              type="text"
              value={whatsapp1}
              onChange={(e) => setWhatsapp1(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="5551999999999"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              WhatsApp Sergio
              <span className="text-gray-500 font-normal ml-1">(opcional)</span>
            </label>
            <input
              type="text"
              value={whatsapp2}
              onChange={(e) => setWhatsapp2(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="53984170695"
            />
          </div>

          <button
            onClick={saveConfig}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
              configSaved
                ? "bg-green-600 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {configSaved ? "Configurações salvas!" : "Salvar Configurações"}
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="font-display font-bold text-base text-white mb-3">
          Como exportar do MarketUP
        </h2>
        <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
          <li>Acesse o MarketUP e vá em <strong className="text-gray-300">Estoque → Produtos</strong></li>
          <li>Clique em <strong className="text-gray-300">Exportar</strong> e escolha o formato CSV ou Excel</li>
          <li>Certifique-se que as colunas incluem: <code className="bg-gray-800 px-1 rounded text-orange-400">Produto</code>, <code className="bg-gray-800 px-1 rounded text-orange-400">Preço de Venda (un.)</code>, <code className="bg-gray-800 px-1 rounded text-orange-400">Código de Barras</code>, <code className="bg-gray-800 px-1 rounded text-orange-400">Ativo</code></li>
          <li>Faça upload do arquivo acima</li>
          <li>O catálogo será atualizado automaticamente</li>
        </ol>
      </div>
    </div>
  );
}

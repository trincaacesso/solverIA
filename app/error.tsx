"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Settings } from "lucide-react";

/**
 * Tela mostrada quando algo quebra no navegador.
 *
 * Sem este arquivo, o Next mostra apenas "Application error: a
 * client-side exception has occurred" sobre fundo preto — o usuário não
 * faz ideia do que houve nem do que fazer.
 *
 * O caso mais comum aqui é o site ter sido publicado sem as variáveis
 * do Supabase, e para esse a gente diz exatamente onde configurar.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ctvh] erro na tela:", error);
  }, [error]);

  const faltaConfiguracao = /NEXT_PUBLIC_SUPABASE|Faltam as variáveis|supabaseUrl/i.test(
    error.message,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-950 p-6">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
        {faltaConfiguracao ? (
          <>
            <Settings className="mx-auto h-10 w-10 text-brand-violet" />
            <h1 className="mt-4 text-lg font-bold text-white">
              Falta configurar o endereço do banco
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              O site subiu sem as chaves de acesso, então não consegue
              carregar nada.
            </p>
            <div className="mt-4 rounded-lg bg-black/40 p-4 text-left text-xs text-slate-300">
              <p className="font-semibold text-white">Como resolver:</p>
              <ol className="mt-2 list-inside list-decimal space-y-1.5">
                <li>
                  Na Vercel, abra <strong>Settings → Environment Variables</strong>
                </li>
                <li>
                  Cadastre <code className="text-brand-cyan">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                  e <code className="text-brand-cyan">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                </li>
                <li>Marque Production, Preview e Development</li>
                <li>
                  Vá em <strong>Deployments</strong> e clique em{" "}
                  <strong>Redeploy</strong>
                </li>
              </ol>
              <p className="mt-3 text-slate-400">
                O <strong>Redeploy</strong> é obrigatório: as variáveis entram
                no site na hora em que ele é montado, então cadastrá-las depois
                não muda o que já está no ar.
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertTriangle className="mx-auto h-10 w-10 text-brand-violet" />
            <h1 className="mt-4 text-lg font-bold text-white">
              Algo deu errado nesta tela
            </h1>
            <p className="mt-2 break-words text-sm text-slate-400">
              {error.message || "Erro inesperado."}
            </p>
            {error.digest && (
              <p className="mt-1 font-mono text-[11px] text-slate-600">
                código: {error.digest}
              </p>
            )}
          </>
        )}

        <button
          onClick={reset}
          className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar de novo
        </button>
      </div>
    </main>
  );
}

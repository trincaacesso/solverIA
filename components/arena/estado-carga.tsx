"use client";

import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/** Enquanto os dados vêm do banco. */
export function Carregando({
  texto = "Carregando...",
  className,
}: {
  texto?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-12 text-sm text-arena-muted",
        className,
      )}
    >
      <Loader2 className="h-4 w-4 animate-spin" />
      {texto}
    </div>
  );
}

/**
 * Quando o banco recusa ou a rede cai.
 *
 * Mostra a mensagem real em vez de um "algo deu errado" genérico: aqui
 * o erro costuma ser uma regra de segurança recusando a operação, e
 * saber disso é a diferença entre entender e ficar no escuro.
 */
export function Erro({
  mensagem,
  aoTentarDeNovo,
  className,
}: {
  mensagem: string;
  aoTentarDeNovo?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-arena-red/25 bg-arena-red/5 px-4 py-8 text-center",
        className,
      )}
    >
      <AlertTriangle className="h-6 w-6 text-arena-red" />
      <div>
        <p className="text-sm font-semibold text-arena-ink">
          Não consegui carregar
        </p>
        <p className="mt-1 max-w-md text-xs text-arena-muted">{mensagem}</p>
      </div>
      {aoTentarDeNovo && (
        <button
          onClick={aoTentarDeNovo}
          className="inline-flex items-center gap-1.5 rounded-md border border-arena-border bg-arena-card px-3 py-1.5 text-xs font-semibold text-arena-ink transition-colors hover:bg-arena-bg"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Tentar de novo
        </button>
      )}
    </div>
  );
}

/** Aviso curto de falha ao salvar, para aparecer dentro de um formulário. */
export function ErroAoSalvar({ mensagem }: { mensagem: string }) {
  return (
    <p className="rounded-md bg-arena-red/10 px-3 py-2 text-sm font-medium text-arena-red">
      {mensagem}
    </p>
  );
}

/** Quando a consulta funcionou mas não há nada para mostrar. */
export function Vazio({
  texto,
  className,
}: {
  texto: string;
  className?: string;
}) {
  return (
    <p className={cn("py-10 text-center text-sm text-arena-muted", className)}>
      {texto}
    </p>
  );
}

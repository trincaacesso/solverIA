"use client";

import { useEffect, useState } from "react";
import { Share, Plus, X, Download } from "lucide-react";
import { isNative } from "@/lib/platform";

const CHAVE_DISPENSADO = "ctvh-instalar-dispensado";

/** Já está aberto como app instalado? */
function rodandoInstalado(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // o iPhone não implementa display-mode; usa esta propriedade própria
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

function ehIPhone(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // iPad moderno se identifica como Mac; o toque o denuncia
  const iPadNovo = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/.test(ua) || iPadNovo;
}

/**
 * Explica como instalar o app.
 *
 * No Android o navegador oferece um botão de instalar sozinho, e a
 * gente só o aproveita. No iPhone esse botão NÃO EXISTE: a Apple obriga
 * o usuário a passar pelo menu de compartilhar, e quem não souber disso
 * nunca descobre. Daí a explicação com os dois toques.
 */
export function InstalarApp() {
  const [visivel, setVisivel] = useState(false);
  const [eventoAndroid, setEventoAndroid] = useState<Event | null>(null);
  const [iPhone, setIPhone] = useState(false);

  useEffect(() => {
    if (isNative()) return; // já é o app nativo
    if (rodandoInstalado()) return; // já instalou
    if (localStorage.getItem(CHAVE_DISPENSADO) === "1") return;

    if (ehIPhone()) {
      setIPhone(true);
      setVisivel(true);
      return;
    }

    // Android/Chrome: o navegador avisa quando pode instalar
    const aoPoderInstalar = (e: Event) => {
      e.preventDefault(); // guardamos para disparar no nosso botão
      setEventoAndroid(e);
      setVisivel(true);
    };
    window.addEventListener("beforeinstallprompt", aoPoderInstalar);
    return () => window.removeEventListener("beforeinstallprompt", aoPoderInstalar);
  }, []);

  const dispensar = () => {
    localStorage.setItem(CHAVE_DISPENSADO, "1");
    setVisivel(false);
  };

  const instalarNoAndroid = async () => {
    if (!eventoAndroid) return;
    const evt = eventoAndroid as Event & {
      prompt: () => Promise<void>;
      userChoice: Promise<{ outcome: string }>;
    };
    await evt.prompt();
    await evt.userChoice;
    setVisivel(false);
  };

  if (!visivel) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-xl border border-arena-border bg-arena-card p-4 shadow-xl pb-safe">
      <button
        onClick={dispensar}
        aria-label="Fechar"
        className="absolute right-2 top-2 rounded-md p-1.5 text-arena-muted transition-colors hover:bg-arena-bg hover:text-arena-ink"
      >
        <X className="h-4 w-4" />
      </button>

      <p className="pr-6 text-sm font-semibold text-arena-ink">
        Instale o CT VH no seu celular
      </p>

      {iPhone ? (
        <>
          <p className="mt-1 text-xs text-arena-muted">
            Fica com ícone na tela inicial e abre em tela cheia.
          </p>
          <ol className="mt-3 space-y-2 text-xs text-arena-ink">
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-arena-blue text-[10px] font-bold text-white">
                1
              </span>
              Toque em
              <Share className="h-3.5 w-3.5 text-arena-blue" />
              <span className="font-medium">Compartilhar</span>, na barra de baixo
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-arena-blue text-[10px] font-bold text-white">
                2
              </span>
              Escolha
              <Plus className="h-3.5 w-3.5 text-arena-blue" />
              <span className="font-medium">Adicionar à Tela de Início</span>
            </li>
          </ol>
        </>
      ) : (
        <>
          <p className="mt-1 text-xs text-arena-muted">
            Fica com ícone na tela inicial, abre em tela cheia e funciona mesmo
            com internet ruim.
          </p>
          <button
            onClick={instalarNoAndroid}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-arena-blue px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-arena-blue-dark"
          >
            <Download className="h-3.5 w-3.5" />
            Instalar agora
          </button>
        </>
      )}
    </div>
  );
}

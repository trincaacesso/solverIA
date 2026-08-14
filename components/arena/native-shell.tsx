"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import { isNative, isAndroid } from "@/lib/platform";

/**
 * Ajusta o comportamento nativo do app. Não desenha nada na tela.
 *
 * No navegador não faz absolutamente nada — todas as chamadas ficam
 * atrás do isNative().
 */
export function NativeShell() {
  // No navegador (site e PWA), liga o service worker — é ele que faz o
  // app abrir com internet ruim e receber notificação fechado.
  // Dentro do app nativo não faz sentido: os arquivos já vêm no APK.
  useEffect(() => {
    if (isNative()) return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Espera a página terminar de carregar para não disputar banda com
    // o que o usuário está esperando ver.
    const registrar = () => {
      navigator.serviceWorker.register("/sw.js").catch((e) => {
        console.warn("[pwa] service worker não registrou:", e);
      });
    };

    if (document.readyState === "complete") registrar();
    else {
      window.addEventListener("load", registrar);
      return () => window.removeEventListener("load", registrar);
    }
  }, []);

  useEffect(() => {
    if (!isNative()) return;

    // Barra de status combinando com o fundo escuro do app.
    // Os .catch() vazios são de propósito: se um ajuste visual falhar,
    // o app continua funcionando — não vale derrubar a tela por isso.
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    if (isAndroid()) {
      StatusBar.setBackgroundColor({ color: "#05060c" }).catch(() => {});
      Keyboard.setResizeMode({ mode: KeyboardResize.Body }).catch(() => {});
    }

    // Some com a tela de abertura assim que o app já desenhou.
    SplashScreen.hide().catch(() => {});

    /**
     * Botão físico de voltar do Android.
     *
     * Sem isto, apertar "voltar" na tela do calendário FECHA o app —
     * porque não há histórico e o Android encerra a activity. O certo é
     * voltar no histórico e, quando não houver, mandar para segundo
     * plano (como o WhatsApp faz), preservando a sessão.
     */
    const listener = App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else App.minimizeApp();
    });

    return () => {
      listener.then((l) => l.remove()).catch(() => {});
    };
  }, []);

  return null;
}

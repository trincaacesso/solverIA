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

import { Browser } from "@capacitor/browser";
import { Share } from "@capacitor/share";
import { isNative } from "./platform";

/**
 * Abrir link e compartilhar texto funcionam de forma diferente dentro
 * de um app. No navegador, `window.open` abre uma aba. Dentro do app,
 * ele simplesmente NÃO FAZ NADA: o WebView não tem para onde abrir uma
 * "nova aba", e o clique morre sem aviso nenhum.
 */

/** Abre uma página fora do app, na janela do navegador do sistema. */
export async function openExternal(url: string) {
  if (isNative()) {
    await Browser.open({ url, presentationStyle: "popover" });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Compartilha um texto.
 *
 * No app abre a folha nativa do Android/iOS — a mesma de sempre, com
 * WhatsApp, Telegram e afins na lista. É melhor que o link wa.me porque
 * o professor escolhe o grupo direto, sem passar pelo navegador.
 */
export async function shareText(text: string, title = "Lista do treino") {
  if (isNative()) {
    await Share.share({ title, text, dialogTitle: title });
    return;
  }
  window.open(
    `https://wa.me/?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer",
  );
}

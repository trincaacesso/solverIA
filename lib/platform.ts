import { Capacitor } from "@capacitor/core";

/**
 * O mesmo código roda em três lugares: no site (Vercel), no app Android
 * e no app iOS. Estas funções dizem onde estamos, para tratar o que é
 * diferente — abrir um link, pedir permissão de notificação, etc.
 */

/** true dentro do app instalado; false no navegador. */
export const isNative = () => Capacitor.isNativePlatform();

/** "web" | "android" | "ios" */
export const platform = () => Capacitor.getPlatform();

export const isAndroid = () => platform() === "android";
export const isIOS = () => platform() === "ios";

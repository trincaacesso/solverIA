import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";

/**
 * Configuração do app nativo.
 *
 * O appId é o nome do app para o Android e o iOS. Ele é DEFINITIVO
 * depois da primeira publicação numa loja — é assim que o sistema
 * reconhece atualizações do mesmo app. Também precisa ser exatamente
 * este valor no console do Firebase, ou o push não chega.
 *
 * webDir aponta para a pasta gerada por `npm run build:mobile`.
 */
const config: CapacitorConfig = {
  appId: "br.com.ctvh.arena",
  appName: "CT VH Futevôlei",
  webDir: "out",

  // Em produção o app serve os arquivos de dentro do próprio APK.
  // Para testar com recarregamento automático no celular, rode
  // `npm run dev` e descomente abaixo com o IP do seu PC na rede:
  //   server: { url: "http://192.168.0.10:3000", cleartext: true },

  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "always",
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#05060c",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#05060c",
      overlaysWebView: false,
    },
    Keyboard: {
      // ao abrir o teclado, encolhe o corpo da página em vez de empurrar
      // a tela inteira para cima — evita o cabeçalho sumir
      resize: KeyboardResize.Body,
      resizeOnFullScreen: true,
    },
  },
};

export default config;

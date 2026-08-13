/** @type {import('next').NextConfig} */

// Um código, dois destinos:
//
//   npm run build          -> site normal do Next, servido pela Vercel
//   npm run build:mobile   -> site 100% estático em ./out, empacotado
//                             dentro do app Android/iOS pelo Capacitor
//
// O app nativo não tem servidor Node: ele serve arquivos de dentro do
// próprio APK/IPA. Por isso o modo mobile precisa de output: "export".
const isMobile = process.env.MOBILE_BUILD === "1";

const nextConfig = {
  reactStrictMode: true,
  ...(isMobile
    ? {
        output: "export",

        // Gera out/arena/calendar/index.html em vez de out/arena/calendar.html.
        // O servidor interno do Capacitor resolve pasta -> index.html; sem isso
        // o WebView pede /arena/calendar, recebe 404 e o app abre em tela branca.
        // Fica fora do build web para não mudar as URLs canônicas do site.
        trailingSlash: true,

        // Não existe servidor de otimização de imagem no export estático.
        images: { unoptimized: true },

        // Nada de distDir customizado aqui: com output: "export" o Next
        // passa a exportar para dentro do distDir, e o Capacitor espera
        // encontrar os arquivos em ./out (webDir do capacitor.config.ts).
      }
    : {}),
};

export default nextConfig;

import type { Metadata, Viewport } from "next";
import { Poppins, Sora } from "next/font/google";
import "./globals.css";

// Poppins — tipografia geométrica no estilo do dashboard de referência.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = "https://solveria.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SolverIA — We save time and increase sales using AI",
    template: "%s · SolverIA",
  },
  description:
    "SolverIA builds AI WhatsApp agents, dashboards and automations that save time, boost productivity and help companies sell more with Artificial Intelligence.",
  keywords: [
    "AI automation",
    "AI WhatsApp agents",
    "business dashboards",
    "process automation",
    "AI sales assistant",
    "SolverIA",
  ],
  authors: [{ name: "SolverIA" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "SolverIA — We solve business problems with Artificial Intelligence",
    description:
      "We automate repetitive tasks, increase productivity, improve customer service and help companies sell more using AI.",
    siteName: "SolverIA",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolverIA — AI automation for growing businesses",
    description:
      "AI WhatsApp agents, dashboards and automations that help companies sell more.",
  },
  robots: { index: true, follow: true },

  // ── Instalação como app (PWA) ──────────────────────────────────────
  // Sem estas marcações, "Adicionar à Tela de Início" no iPhone cria só
  // um atalho de navegador, com a barra de endereço à mostra.
  manifest: "/manifest.json",

  appleWebApp: {
    capable: true, // abre em tela cheia, sem a barra do Safari
    title: "CT VH",
    // "default" mantém a barra de status legível sobre o fundo escuro
    statusBarStyle: "black-translucent",
  },

  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // O iPhone ignora o manifest para o ícone e usa este.
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },

  // O Safari em standalone tenta transformar números em links de
  // telefone, o que estraga horários como "18:30".
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#05060c",
  width: "device-width",
  initialScale: 1,
  // Comportamento de app, não de página web: sem zoom por pinça e sem
  // duplo-toque ampliando o layout.
  maximumScale: 1,
  userScalable: false,
  // Libera o env(safe-area-inset-*) do CSS. Sem isto, o conteúdo fica
  // escondido atrás do notch e da barra de gestos do iPhone.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${sora.variable} dark`}>
      <body>{children}</body>
    </html>
  );
}

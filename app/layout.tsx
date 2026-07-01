import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
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
};

export const viewport: Viewport = {
  themeColor: "#05060c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} dark`}>
      <body>{children}</body>
    </html>
  );
}

import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { UpgradeDialogProvider } from "@/providers/UpgradeDialogProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://partiecommune.fr'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Partie Commune — Gestion de projet pour agences",
    template: "%s | Partie Commune",
  },
  description:
    "La plateforme de gestion de projet pensée pour les agences. Portail client, collecte de contenus, validation par jalons et marque blanche.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Partie Commune",
    title: "Partie Commune — Gestion de projet pour agences",
    description:
      "La plateforme de gestion de projet pensée pour les agences. Portail client, collecte de contenus, validation par jalons et marque blanche.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Partie Commune — Gestion de projet pour agences",
    description:
      "La plateforme de gestion de projet pensée pour les agences. Portail client, collecte de contenus, validation par jalons et marque blanche.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <UpgradeDialogProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </UpgradeDialogProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}

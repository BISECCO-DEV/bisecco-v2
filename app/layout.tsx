import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlobalClientWidgets } from "@/components/layout/GlobalClientWidgets";
import { JsonLd } from "@/components/ui/JsonLd";
import { getCurrentUser } from "@/lib/db/current-user";
import { countUnreadNotifications } from "@/lib/notifications/actions";
import { getMetierOptions } from "@/lib/db/metier-options";
import { countUnreadCvs } from "@/lib/cv/count-unread";

const inter = localFont({
  src: "../public/fonts/Inter.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
});

const instrumentSans = localFont({
  src: "../public/fonts/InstrumentSans.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "400 700",
  fallback: ["Inter", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bisecco.eu"),
  title: {
    default: "Bisecco · Le réseau social des artisans français",
    template: "%s | Bisecco",
  },
  description:
    "Trouvez un artisan qualifié et vérifié près de chez vous. SIREN vérifié, avis clients réels, devis gratuit. Plombier, électricien, maçon, menuisier, développeur informatique et bien plus.",
  keywords: ["artisan", "artisan vérifié", "plombier", "électricien", "maçon", "développeur informatique", "devis gratuit", "Meaux", "Île-de-France"],
  authors: [{ name: "Bisecco" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://bisecco.eu",
    siteName: "Bisecco",
    title: "Bisecco · Le réseau social des artisans français",
    description: "Trouvez un artisan qualifié et vérifié près de chez vous.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bisecco",
    description: "Le réseau social des artisans français",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/icon-app.png", type: "image/png" },
    ],
    shortcut: "/icon-app.png",
    apple: [
      // Apple Touch Icon · utilisé quand un utilisateur iOS ajoute Bisecco à son écran d'accueil
      { url: "/icon-app.png", sizes: "180x180", type: "image/png" },
      { url: "/icon-app.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-app.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Bisecco",
    statusBarStyle: "default",
    startupImage: ["/icon-app.png"],
  },
  applicationName: "Bisecco",
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  themeColor: "#f07a2f",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bisecco",
  url: "https://bisecco.eu",
  logo: "https://bisecco.eu/logo.jpg",
  description: "Le 1er réseau social des artisans français vérifiés. SIREN contrôlé, avis authentiques, devis gratuit.",
  sameAs: ["https://www.linkedin.com/company/bisecco", "https://twitter.com/bisecco_fr"],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@bisecco.fr",
    contactType: "customer service",
    availableLanguage: "French",
    areaServed: "FR",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bisecco",
  url: "https://bisecco.eu",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://bisecco.eu/rechercher?metier={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const current = await getCurrentUser();
  const headerUser = current
    ? {
        // Pour les pros : on affiche le nom commercial (entreprise), pas celui du gérant.
        name: current.display_name,
        email: current.email,
        role: current.role,
        profile_photo: current.profile_photo,
        client_number: current.client_number,
      }
    : null;
  const unreadNotifs = current ? await countUnreadNotifications() : 0;
  const unreadCvs = current && (current.role === "artisan" || current.role === "admin")
    ? await countUnreadCvs(current.id)
    : 0;
  const metierOptions = await getMetierOptions();

  return (
    <html lang="fr" className={`${inter.variable} ${instrumentSans.variable}`}>
      <head>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Header user={headerUser} unreadNotifications={unreadNotifs} currentUserId={current?.id ?? null} metierOptions={metierOptions} unreadCvs={unreadCvs} />
        <main className="flex-1">{children}</main>
        <Footer />
        <GlobalClientWidgets />
      </body>
    </html>
  );
}

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
  metadataBase: new URL("https://bisecco.fr"),
  title: {
    default: "Bisecco · Le réseau social des professionnels français",
    template: "%s | Bisecco",
  },
  description:
    "Trouvez un artisan ou professionnel vérifié SIREN près de chez vous : plombier, électricien, maçon, menuisier… Avis clients réels, devis gratuit en 2 min.",
  authors: [{ name: "Bisecco" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://bisecco.fr",
    siteName: "Bisecco",
    title: "Bisecco · Le réseau social des professionnels français",
    description: "Trouvez un professionnel qualifié et vérifié près de chez vous.",
    images: [{ url: "/og-image.jpg?v=3", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bisecco",
    description: "Le réseau social des professionnels français",
    images: ["/og-image.jpg?v=3"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
    apple: [
      // Toutes les tailles iOS — évite le fallback "B sur fond orange" généré
      // automatiquement par iOS quand il ne trouve pas la bonne taille
      { url: "/apple-touch-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/apple-touch-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-touch-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-touch-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-touch-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-touch-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-touch-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-touch-icon-167x167.png", sizes: "167x167", type: "image/png" },
      { url: "/apple-touch-icon-180x180.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      // Précomposé : ancien iOS, mais ne mange pas de bande passante en plus
      { rel: "apple-touch-icon-precomposed", url: "/apple-touch-icon-precomposed.png" },
    ],
  },
  // Le manifest est généré automatiquement par app/manifest.ts à /manifest.webmanifest
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Bisecco",
    statusBarStyle: "default",
    startupImage: ["/apple-touch-icon.png"],
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
  "@id": "https://bisecco.fr/#organization",
  name: "Bisecco",
  legalName: "AGISCO HOLDING SAS",
  url: "https://bisecco.fr",
  logo: {
    "@type": "ImageObject",
    url: "https://bisecco.fr/logo.jpg",
    width: 400,
    height: 400,
  },
  description: "Le 1er réseau social des professionnels français vérifiés. SIREN contrôlé, avis authentiques, devis gratuit.",
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    streetAddress: "45 Boulevard de la Croisette",
    postalCode: "06400",
    addressLocality: "Cannes",
    addressRegion: "Provence-Alpes-Côte d'Azur",
    addressCountry: "FR",
  },
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
  "@id": "https://bisecco.fr/#website",
  name: "Bisecco",
  url: "https://bisecco.fr",
  publisher: { "@id": "https://bisecco.fr/#organization" },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://bisecco.fr/rechercher?metier={search_term_string}",
    },
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
        <GlobalClientWidgets
          currentUserId={current?.id ?? null}
          referralUrl={
            current?.referral_code
              ? `https://bisecco.fr/r/${current.referral_code}`
              : null
          }
        />
      </body>
    </html>
  );
}

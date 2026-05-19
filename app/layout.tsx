import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Chatbot } from "@/components/layout/Chatbot";
import { ServiceWorkerRegister } from "@/components/ui/ServiceWorkerRegister";
import { JsonLd } from "@/components/ui/JsonLd";
import { getCurrentUser } from "@/lib/db/current-user";
import { countUnreadNotifications } from "@/lib/notifications/actions";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bisecco.fr"),
  title: {
    default: "Bisecco — Le réseau social des artisans français",
    template: "%s | Bisecco",
  },
  description:
    "Trouvez un artisan qualifié et vérifié près de chez vous. SIREN vérifié, avis clients réels, devis gratuit. Plombier, électricien, maçon, menuisier et bien plus.",
  keywords: ["artisan", "artisan vérifié", "plombier", "électricien", "maçon", "devis gratuit", "Meaux", "Île-de-France"],
  authors: [{ name: "Bisecco" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://bisecco.fr",
    siteName: "Bisecco",
    title: "Bisecco — Le réseau social des artisans français",
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
  icons: { icon: "/favicon.ico" },
  manifest: "/manifest.json",
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
  url: "https://bisecco.fr",
  logo: "https://bisecco.fr/logo.jpg",
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
  url: "https://bisecco.fr",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://bisecco.fr/rechercher?metier={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const current = await getCurrentUser();
  const headerUser = current
    ? {
        name: current.name,
        email: current.email,
        role: current.role,
        profile_photo: current.profile_photo,
        client_number: current.client_number,
      }
    : null;
  const unreadNotifs = current ? await countUnreadNotifications() : 0;

  return (
    <html lang="fr" className={manrope.variable}>
      <head>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Header user={headerUser} unreadNotifications={unreadNotifs} />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
        <StickyMobileCTA />
        <CookieBanner />
        <Chatbot />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}

import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Configuration Capacitor — wrap Bisecco V2 dans 2 vraies apps natives (iOS + Android).
 *
 * Stratégie : l'app charge directement le site live bisecco.eu (server.url).
 * → tu mets à jour le site web, l'app se met à jour automatiquement (pas besoin
 *   de re-soumettre aux stores à chaque modif).
 * → tous les Server Components, Server Actions, auth Supabase fonctionnent
 *   exactement comme sur le web.
 *
 * Pour build :  npx cap sync && npx cap open android (ou ios)
 */
const config: CapacitorConfig = {
  appId: "eu.bisecco.app",
  appName: "Bisecco",
  webDir: "capacitor-www",

  server: {
    url: "https://bisecco.eu",
    cleartext: false,
    androidScheme: "https",
    // Domaines autorisés à être ouverts DANS la webview (pas dans le navigateur externe)
    allowNavigation: [
      "bisecco.eu",
      "*.bisecco.eu",
      "bisecco.fr",
      "*.bisecco.fr",
      "*.supabase.co",
      "accounts.google.com", // pour login Google si activé un jour
    ],
  },

  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // mets à true pour debug Chrome DevTools
    backgroundColor: "#0d1e4aff",
  },

  ios: {
    contentInset: "automatic",
    backgroundColor: "#0d1e4aff",
    scrollEnabled: true,
    // permet à WKWebView d'utiliser le partage natif iOS, picker, etc.
    limitsNavigationsToAppBoundDomains: false,
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#0d1e4a",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "large",
      spinnerColor: "#f07a2f",
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0d1e4a",
      overlaysWebView: false,
    },
  },
};

export default config;

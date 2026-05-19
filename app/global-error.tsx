"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body style={{
        fontFamily: "system-ui, sans-serif",
        background: "#05122e",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{
            fontSize: "5rem",
            fontWeight: 900,
            background: "linear-gradient(135deg, #f07a2f, #ef4444)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}>500</div>
          <h1 style={{ fontSize: "1.5rem", marginTop: 8 }}>Erreur critique</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 12 }}>
            Une erreur fatale s&apos;est produite. Veuillez recharger la page.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "12px 28px",
              borderRadius: 12,
              background: "linear-gradient(135deg, #f07a2f, #e8621a)",
              color: "#fff",
              border: 0,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Recharger
          </button>
        </div>
      </body>
    </html>
  );
}

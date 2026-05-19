import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bisecco · Le réseau social des artisans français";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #05122e 0%, #0d1f4e 50%, #1a3d8a 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Logo block */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 64 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "linear-gradient(135deg, #f07a2f, #e8621a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            🔧
          </div>
          <div style={{ color: "white", fontSize: 28, fontWeight: 800, letterSpacing: 4 }}>
            BISECCO
          </div>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          <div style={{ color: "white", fontSize: 72, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>
            Le 1<sup style={{ fontSize: 36 }}>er</sup> réseau social
          </div>
          <div style={{ color: "#f07a2f", fontSize: 72, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>
            d&apos;artisans vérifiés.
          </div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 28, marginTop: 24, lineHeight: 1.4 }}>
            SIREN vérifié · Avis authentiques · Devis gratuit
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            marginTop: 24,
          }}
        >
          <div style={{ display: "flex", gap: 20 }}>
            {["100% gratuit", "247 avis", "+50 artisans"].map((t) => (
              <div
                key={t}
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                ✓ {t}
              </div>
            ))}
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 22, fontWeight: 600 }}>
            bisecco.fr
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

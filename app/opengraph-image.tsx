import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "GodKode | Portfolio";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

const gridSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Cpath d='M50 0L50 50M0 0L50 0' stroke='rgba(255,255,255,0.03)' stroke-width='1' fill='none'/%3E%3C/svg%3E")`;

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#050505",
        backgroundImage: `${gridSvg}, linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "50px 50px, 50px 50px, 50px 50px",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <span
        style={{
          fontSize: "72px",
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: "-2px",
          lineHeight: 1,
          fontFamily: "monospace",
        }}
      >
        GODKODE
      </span>
      <span
        style={{
          fontSize: "24px",
          color: "#5f9ea0",
          fontFamily: "monospace",
          letterSpacing: "4px",
          textTransform: "uppercase",
        }}
      >
        Software Developer
      </span>
      <span
        style={{
          fontSize: "16px",
          color: "rgba(255,255,255,0.35)",
          fontFamily: "monospace",
          position: "absolute",
          bottom: "40px",
        }}
      >
        godkode.xyz
      </span>
    </div>,
    { ...size },
  );
}

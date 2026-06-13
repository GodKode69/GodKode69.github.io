import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "GodKode | Portfolio";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#050505",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #5f9ea0 0%, #2dd4bf 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 700,
              color: "#050505",
              fontFamily: "monospace",
            }}
          >
            GK
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontSize: "64px",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-2px",
                lineHeight: 1,
                fontFamily: "monospace",
              }}
            >
              GODKODE
            </span>
          </div>
        </div>
        <span
          style={{
            fontSize: "24px",
            color: "#5f9ea0",
            fontFamily: "monospace",
            letterSpacing: "2px",
          }}
        >
          Web &amp; Desktop Developer
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
      </div>
    ),
    { ...size }
  );
}

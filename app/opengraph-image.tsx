import { ImageResponse } from "next/og";
export const alt = "Shramdaan – Harka Sampang fan game";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#1f2a33",
          color: "#faf9f6",
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 800 }}>Shramdaan</div>
        <div style={{ fontSize: 44, color: "#f2a93b", marginTop: 16 }}>
          Break rocks. Rally volunteers. Build bridges.
        </div>
        <div style={{ fontSize: 28, marginTop: 40, opacity: 0.7 }}>
          Unofficial fan-made game
        </div>
      </div>
    ),
    size
  );
}

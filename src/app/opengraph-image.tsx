import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Pseudo-random but deterministic node layout for the background network.
const NODES = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 397) % 1200,
  y: (i * 211 + 80) % 630,
}));

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#05060f",
          color: "#e6e9f5",
          position: "relative",
        }}
      >
        {NODES.map((n, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              width: 6,
              height: 6,
              borderRadius: 6,
              background: i % 2 ? "#8b5cf6" : "#22d3ee",
              opacity: 0.55,
            }}
          />
        ))}
        <div style={{ display: "flex", fontSize: 26, color: "#22d3ee", letterSpacing: 4 }}>{"// PORTFOLIO"}</div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 700, marginTop: 18, letterSpacing: -2 }}>{profile.name}</div>
        <div
          style={{
            display: "flex",
            fontSize: 46,
            marginTop: 8,
            color: "#22d3ee",
          }}
        >
          {profile.role}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#9aa3c0", marginTop: 30, maxWidth: 900 }}>
          {profile.rotatingRoles.slice(1).join("  ·  ")}
        </div>
      </div>
    ),
    size,
  );
}

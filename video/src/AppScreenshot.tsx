import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from "remotion";
import { COLORS } from "./styles";

// A framed app screenshot with browser chrome effect
export const AppScreenshot: React.FC<{
  src: string;
  width?: number;
  height?: number;
  delay?: number;
  x?: number;
  y?: number;
  label?: string;
}> = ({ src, width = 700, height = 420, delay = 0, x, y, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const scale = interpolate(p, [0, 1], [0.9, 1]);

  const style: React.CSSProperties = {
    opacity,
    transform: `scale(${scale})`,
    width,
    position: x !== undefined ? "absolute" : "relative",
    ...(x !== undefined && { left: x }),
    ...(y !== undefined && { top: y }),
  };

  return (
    <div style={style}>
      {/* Browser chrome bar */}
      <div style={{
        background: "#1e293b",
        borderRadius: "12px 12px 0 0",
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
        </div>
        {label && (
          <div style={{
            flex: 1,
            textAlign: "center",
            fontSize: 12,
            color: "#64748b",
            fontFamily: "Inter, sans-serif",
          }}>
            {label}
          </div>
        )}
      </div>
      {/* Screenshot */}
      <div style={{
        borderRadius: "0 0 12px 12px",
        overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
        borderTop: "none",
      }}>
        <Img
          src={staticFile(`screenshots/${src}`)}
          style={{ width: "100%", height, objectFit: "cover", objectPosition: "top", display: "block" }}
        />
      </div>
    </div>
  );
};

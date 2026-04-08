import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONTS, SAFE } from "./styles";

// Animated entrance with spring
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, direction = "up", distance = 40, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const offsets = { up: [distance, 0], down: [-distance, 0], left: [distance, 0], right: [-distance, 0], none: [0, 0] };
  const [from, to] = offsets[direction];
  const translate = interpolate(progress, [0, 1], [from, to]);
  const prop = direction === "left" || direction === "right" ? "translateX" : "translateY";

  return (
    <div style={{ opacity, transform: `${prop}(${translate}px)`, ...style }}>
      {children}
    </div>
  );
};

// Stagger a list of items
export const StaggerList: React.FC<{
  items: React.ReactNode[];
  staggerFrames?: number;
  baseDelay?: number;
  style?: React.CSSProperties;
}> = ({ items, staggerFrames = 10, baseDelay = 0, style }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, ...style }}>
    {items.map((item, i) => (
      <FadeIn key={i} delay={baseDelay + i * staggerFrames} direction="left" distance={30}>
        {item}
      </FadeIn>
    ))}
  </div>
);

// Badge / pill component
export const Badge: React.FC<{
  label: string;
  color: string;
  delay?: number;
}> = ({ label, color, delay = 0 }) => (
  <FadeIn delay={delay} direction="up" distance={20}>
    <span
      style={{
        display: "inline-block",
        padding: "10px 24px",
        borderRadius: 999,
        background: color + "22",
        border: `2px solid ${color}`,
        color,
        fontSize: 28,
        fontWeight: 600,
        fontFamily: FONTS.sans,
      }}
    >
      {label}
    </span>
  </FadeIn>
);

// Section title
export const SectionTitle: React.FC<{
  text: string;
  color?: string;
  delay?: number;
}> = ({ text, color = COLORS.text, delay = 0 }) => (
  <FadeIn delay={delay} direction="up">
    <h2
      style={{
        fontSize: 56,
        fontWeight: 800,
        fontFamily: FONTS.sans,
        color,
        margin: 0,
        lineHeight: 1.2,
      }}
    >
      {text}
    </h2>
  </FadeIn>
);

// Subtitle
export const Subtitle: React.FC<{
  text: string;
  delay?: number;
}> = ({ text, delay = 8 }) => (
  <FadeIn delay={delay} direction="up">
    <p
      style={{
        fontSize: 32,
        fontWeight: 400,
        fontFamily: FONTS.sans,
        color: COLORS.textDim,
        margin: 0,
        lineHeight: 1.5,
        maxWidth: 1200,
      }}
    >
      {text}
    </p>
  </FadeIn>
);

// Code block with typing effect
export const CodeBlock: React.FC<{
  lines: string[];
  delay?: number;
  typingSpeed?: number;
}> = ({ lines, delay = 0, typingSpeed = 2 }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        background: COLORS.codeBg,
        borderRadius: 16,
        padding: 32,
        fontFamily: FONTS.mono,
        fontSize: 24,
        color: COLORS.codeText,
        lineHeight: 1.8,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      {lines.map((line, i) => {
        const lineStart = delay + i * 20;
        const charsToShow = Math.max(0, Math.floor((frame - lineStart) / typingSpeed));
        const visible = frame >= lineStart;
        return (
          <div key={i} style={{ opacity: visible ? 1 : 0, whiteSpace: "pre" }}>
            <span style={{ color: COLORS.emerald }}>$ </span>
            {line.substring(0, charsToShow)}
            {visible && charsToShow < line.length && (
              <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>_</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Checklist item
export const CheckItem: React.FC<{
  text: string;
  icon?: string;
  color?: string;
  delay?: number;
}> = ({ text, icon = "✓", color = COLORS.emerald, delay = 0 }) => (
  <FadeIn delay={delay} direction="left" distance={30}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: color + "22",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 800,
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <span style={{ fontSize: 28, fontFamily: FONTS.sans, color: COLORS.text, fontWeight: 500 }}>
        {text}
      </span>
    </div>
  </FadeIn>
);

// Scene wrapper with consistent padding
export const Scene: React.FC<{
  children: React.ReactNode;
  justify?: "center" | "flex-start";
}> = ({ children, justify = "center" }) => (
  <div
    style={{
      width: 1920,
      height: 1080,
      background: COLORS.bg,
      display: "flex",
      flexDirection: "column",
      justifyContent: justify,
      padding: SAFE.margin,
      overflow: "hidden",
      position: "relative",
    }}
  >
    {children}
  </div>
);

// Animated SVG line drawing
export const DrawLine: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  color?: string; delay?: number; width?: number;
}> = ({ x1, y1, x2, y2, color = COLORS.blue, delay = 0, width = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={length}
      strokeDashoffset={length * (1 - progress)}
      strokeLinecap="round"
    />
  );
};

// Box node for diagrams
export const BoxNode: React.FC<{
  x: number; y: number; w: number; h: number;
  label: string; color: string; delay?: number;
  sublabel?: string;
}> = ({ x, y, w, h, label, color, delay = 0, sublabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });

  return (
    <g style={{ opacity: progress, transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`, transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}>
      <rect x={x} y={y} width={w} height={h} rx={12} fill={color + "22"} stroke={color} strokeWidth={2} />
      <text x={x + w / 2} y={y + h / 2 + (sublabel ? -8 : 6)} textAnchor="middle" fill={color} fontSize={20} fontWeight={700} fontFamily="Inter, sans-serif">
        {label}
      </text>
      {sublabel && (
        <text x={x + w / 2} y={y + h / 2 + 18} textAnchor="middle" fill={COLORS.textDim} fontSize={14} fontFamily="Inter, sans-serif">
          {sublabel}
        </text>
      )}
    </g>
  );
};

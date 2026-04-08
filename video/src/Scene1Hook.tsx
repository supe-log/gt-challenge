import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Scene, FadeIn } from "./helpers";
import { AppScreenshot } from "./AppScreenshot";
import { COLORS, FONTS } from "./styles";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 200 } });
  const glow = interpolate(frame, [0, 60, 120, 150], [0, 0.6, 0.3, 0.5], { extrapolateRight: "clamp" });

  return (
    <Scene>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, gap: 60 }}>
        {/* Left: Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 700 }}>
          <div style={{ fontSize: 80, transform: `scale(${scale})`, transformOrigin: "center" }}>🧠</div>
          <FadeIn delay={10} direction="up">
            <h1 style={{
              fontSize: 72,
              fontWeight: 800,
              fontFamily: FONTS.sans,
              lineHeight: 1.1,
              margin: 0,
              background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.purple}, ${COLORS.pink})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: `drop-shadow(0 0 ${glow * 40}px ${COLORS.blue}44)`,
            }}>
              GT Challenge
            </h1>
          </FadeIn>
          <FadeIn delay={20} direction="up">
            <p style={{
              fontSize: 32,
              fontFamily: FONTS.sans,
              color: COLORS.textDim,
              margin: 0,
            }}>
              An adaptive gifted assessment you can game — if you love learning.
            </p>
          </FadeIn>
        </div>

        {/* Right: Landing page screenshot */}
        <AppScreenshot
          src="landing.png"
          width={750}
          height={450}
          delay={30}
          label="gt-challenge.amplifyapp.com"
        />
      </div>
    </Scene>
  );
};

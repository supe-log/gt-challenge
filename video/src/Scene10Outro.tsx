import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Scene, FadeIn } from "./helpers";
import { COLORS, FONTS } from "./styles";

export const Scene10Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame / 20), [-1, 1], [0.95, 1.05]);

  return (
    <Scene>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 32 }}>
        <FadeIn delay={0} direction="up">
          <div style={{ fontSize: 72, transform: `scale(${pulse})` }}>🧠</div>
        </FadeIn>
        <FadeIn delay={10} direction="up">
          <h1 style={{
            fontSize: 64,
            fontWeight: 800,
            fontFamily: FONTS.sans,
            background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.purple})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}>
            GT Challenge
          </h1>
        </FadeIn>
        <FadeIn delay={20} direction="up">
          <p style={{ fontSize: 34, color: COLORS.blue, fontFamily: FONTS.mono, margin: 0 }}>
            github.com/supe-log/gt-challenge
          </p>
        </FadeIn>
        <FadeIn delay={30} direction="up">
          <p style={{ fontSize: 34, color: COLORS.emerald, fontFamily: FONTS.mono, margin: 0 }}>
            main.d1ft6a4fdhj1nr.amplifyapp.com
          </p>
        </FadeIn>
        <FadeIn delay={45} direction="up">
          <p style={{
            fontSize: 40,
            fontWeight: 700,
            fontFamily: FONTS.sans,
            color: COLORS.text,
            margin: 0,
            marginTop: 24,
          }}>
            Questions? Let&apos;s build.
          </p>
        </FadeIn>
      </div>
    </Scene>
  );
};

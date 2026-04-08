import React from "react";
import { Scene, SectionTitle, Subtitle, FadeIn } from "./helpers";
import { COLORS, FONTS } from "./styles";

export const Scene2Problem: React.FC = () => (
  <Scene justify="center">
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <SectionTitle text="The Problem" color={COLORS.amber} />
      <Subtitle
        text="Gifted testing is broken. CogAT costs $5-180/student, happens once, and coaching shifts scores 5-10 percentile points. A bad test day means a bright kid gets missed."
        delay={10}
      />
      <div style={{ display: "flex", gap: 40, marginTop: 20 }}>
        {[
          { icon: "💰", label: "Expensive", detail: "$5-180 per student" },
          { icon: "📅", label: "Single shot", detail: "One day, one score" },
          { icon: "📚", label: "Coachable", detail: "5-10 percentile shift" },
        ].map((item, i) => (
          <FadeIn key={i} delay={20 + i * 10} direction="up">
            <div style={{
              flex: 1,
              background: COLORS.amber + "11",
              border: `2px solid ${COLORS.amber}33`,
              borderRadius: 16,
              padding: 32,
              textAlign: "center",
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.amber, fontFamily: FONTS.sans }}>{item.label}</div>
              <div style={{ fontSize: 22, color: COLORS.textDim, fontFamily: FONTS.sans, marginTop: 8 }}>{item.detail}</div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </Scene>
);

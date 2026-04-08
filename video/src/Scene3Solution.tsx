import React from "react";
import { Scene, SectionTitle, Subtitle, Badge, FadeIn } from "./helpers";
import { AppScreenshot } from "./AppScreenshot";
import { COLORS } from "./styles";

export const Scene3Solution: React.FC = () => (
  <Scene justify="center">
    <div style={{ display: "flex", gap: 50, alignItems: "flex-start" }}>
      {/* Left: Text + Badges */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
        <SectionTitle text="The Solution" color={COLORS.emerald} />
        <Subtitle
          text="Multi-session adaptive assessment measuring cognitive ability + learning drive. The only way to beat it is to keep coming back."
          delay={8}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
          {[
            { label: "Next.js 16", color: COLORS.blue },
            { label: "React 19", color: COLORS.blue },
            { label: "Supabase", color: COLORS.emerald },
            { label: "PostgreSQL 17", color: COLORS.emerald },
            { label: "IRT Engine", color: COLORS.purple },
            { label: "Tailwind 4", color: COLORS.blue },
            { label: "AWS Amplify", color: COLORS.amber },
            { label: "Karpathy QA", color: COLORS.amber },
          ].map((b, i) => (
            <Badge key={i} label={b.label} color={b.color} delay={16 + i * 3} />
          ))}
        </div>
      </div>

      {/* Right: Login + Demo screenshots stacked */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <AppScreenshot src="login.png" width={520} height={320} delay={25} label="Login — Google OAuth + Email" />
        <AppScreenshot src="demo-welcome.png" width={520} height={240} delay={40} label="Demo — No login needed" />
      </div>
    </div>
  </Scene>
);

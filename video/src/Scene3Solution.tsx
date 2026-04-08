import React from "react";
import { Scene, SectionTitle, Subtitle, Badge, FadeIn } from "./helpers";
import { COLORS } from "./styles";

export const Scene3Solution: React.FC = () => (
  <Scene justify="center">
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <SectionTitle text="The Solution" color={COLORS.emerald} />
      <Subtitle
        text="Multi-session adaptive assessment that measures both cognitive ability (aptitude) and learning drive (appetite). The only way to beat it is to keep coming back."
        delay={8}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 24 }}>
        {[
          { label: "Next.js 16", color: COLORS.blue },
          { label: "React 19", color: COLORS.blue },
          { label: "TypeScript", color: COLORS.blue },
          { label: "Supabase", color: COLORS.emerald },
          { label: "PostgreSQL 17", color: COLORS.emerald },
          { label: "Edge Functions", color: COLORS.emerald },
          { label: "IRT Engine", color: COLORS.purple },
          { label: "Tailwind 4", color: COLORS.blue },
          { label: "Zustand", color: COLORS.blue },
          { label: "Framer Motion", color: COLORS.pink },
          { label: "AWS Amplify", color: COLORS.amber },
          { label: "Karpathy QA", color: COLORS.amber },
        ].map((b, i) => (
          <Badge key={i} label={b.label} color={b.color} delay={16 + i * 3} />
        ))}
      </div>
      <FadeIn delay={70} direction="up">
        <div style={{ display: "flex", gap: 40, marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: COLORS.blue }} />
            <span style={{ color: COLORS.textDim, fontSize: 22 }}>Frontend</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: COLORS.emerald }} />
            <span style={{ color: COLORS.textDim, fontSize: 22 }}>Backend</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: COLORS.purple }} />
            <span style={{ color: COLORS.textDim, fontSize: 22 }}>Psychometrics</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: COLORS.amber }} />
            <span style={{ color: COLORS.textDim, fontSize: 22 }}>Infra / QA</span>
          </div>
        </div>
      </FadeIn>
    </div>
  </Scene>
);

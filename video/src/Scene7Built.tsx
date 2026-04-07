import React from "react";
import { Scene, SectionTitle, CheckItem } from "./helpers";
import { COLORS } from "./styles";

export const Scene7Built: React.FC = () => (
  <Scene justify="flex-start">
    <SectionTitle text="What We've Built" color={COLORS.emerald} />
    <div style={{ display: "flex", gap: 60, marginTop: 40, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          { text: "Adaptive IRT engine (3PL model, 32 tests passing)", delay: 12 },
          { text: "334 items across 4 domains × 3 age bands", delay: 20 },
          { text: "Karpathy Loops QA pipeline (90/100 threshold)", delay: 28 },
          { text: "Parent auth + child profiles (COPPA-compliant)", delay: 36 },
          { text: "Live session UI with streaks, levels, bonus rounds", delay: 44 },
          { text: "Parent dashboard with aptitude + appetite scores", delay: 52 },
        ].map((item, i) => (
          <CheckItem key={i} text={item.text} delay={item.delay} color={COLORS.emerald} icon="✓" />
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        {[
          { text: "6 appetite signals (persistence, return visits, etc.)", delay: 60 },
          { text: "Cross-session theta tracking (λ=0.7 decay)", delay: 68 },
          { text: "Composite scoring (aptitude tier + appetite tier)", delay: 76 },
          { text: "Edge functions deployed (start-session, compute-next)", delay: 84 },
          { text: "Demo mode (no auth, full IRT, all age bands)", delay: 92 },
          { text: "Deployed to AWS Amplify (auto-build on push)", delay: 100 },
        ].map((item, i) => (
          <CheckItem key={i} text={item.text} delay={item.delay} color={COLORS.emerald} icon="✓" />
        ))}
      </div>
    </div>
  </Scene>
);

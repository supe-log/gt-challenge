import React from "react";
import { Scene, SectionTitle, CheckItem } from "./helpers";
import { COLORS } from "./styles";

export const Scene8NeedsWork: React.FC = () => (
  <Scene justify="flex-start">
    <SectionTitle text="What Needs Work" color={COLORS.amber} />
    <div style={{ display: "flex", gap: 60, marginTop: 40, flex: 1 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <CheckItem text="Privacy policy + Terms of Service pages" icon="⚠" color={COLORS.amber} delay={12} />
        <CheckItem text="COPPA parental consent verification" icon="⚠" color={COLORS.amber} delay={22} />
        <CheckItem text="Item exposure counting (Sympson-Hetter)" icon="🔧" color={COLORS.amber} delay={32} />
        <CheckItem text="More math + verbal items (bank imbalanced)" icon="🔧" color={COLORS.amber} delay={42} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        <CheckItem text="Custom email templates (using Supabase defaults)" icon="📋" color={COLORS.textDim} delay={52} />
        <CheckItem text="Error monitoring (Sentry integration)" icon="📋" color={COLORS.textDim} delay={62} />
        <CheckItem text="Mobile polish on parent dashboard" icon="📋" color={COLORS.textDim} delay={72} />
        <CheckItem text="Custom domain (currently amplifyapp.com)" icon="📋" color={COLORS.textDim} delay={82} />
      </div>
    </div>
  </Scene>
);

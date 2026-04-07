import React from "react";
import { Scene, SectionTitle, FadeIn, CodeBlock } from "./helpers";
import { COLORS, FONTS } from "./styles";

export const Scene9GettingStarted: React.FC = () => (
  <Scene justify="flex-start">
    <SectionTitle text="Getting Started" color={COLORS.blue} />
    <FadeIn delay={8}>
      <span style={{ fontSize: 24, color: COLORS.textDim, fontFamily: FONTS.sans }}>
        Clone, install, configure, run. Takes under 2 minutes.
      </span>
    </FadeIn>

    <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 30 }}>
      <CodeBlock
        lines={[
          "git clone https://github.com/supe-log/gt-challenge",
          "cd gt-challenge && npm install",
        ]}
        delay={15}
        typingSpeed={1}
      />

      <FadeIn delay={55} direction="up">
        <div style={{
          background: COLORS.codeBg,
          borderRadius: 16,
          padding: 24,
          fontFamily: FONTS.mono,
          fontSize: 22,
          color: COLORS.codeText,
          lineHeight: 1.8,
          border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ color: COLORS.textDim, marginBottom: 8 }}># apps/web/.env.local</div>
          <div><span style={{ color: COLORS.emerald }}>NEXT_PUBLIC_SUPABASE_URL</span>=https://xxx.supabase.co</div>
          <div><span style={{ color: COLORS.emerald }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>=eyJhbG...</div>
          <div><span style={{ color: COLORS.amber }}>SUPABASE_SERVICE_ROLE_KEY</span>=eyJhbG... <span style={{ color: COLORS.textDim }}># server only</span></div>
        </div>
      </FadeIn>

      <CodeBlock
        lines={[
          "npm run dev          # http://localhost:3000",
          "npm run test         # 32 IRT + 7 appetite tests",
          "npm run build        # production build",
        ]}
        delay={80}
        typingSpeed={1}
      />
    </div>
  </Scene>
);

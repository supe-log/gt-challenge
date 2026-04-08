import React from "react";
import { Scene, SectionTitle, FadeIn } from "./helpers";
import { AppScreenshot } from "./AppScreenshot";
import { COLORS, FONTS } from "./styles";

export const Scene7Screens: React.FC = () => (
  <Scene justify="flex-start">
    <SectionTitle text="The App in Action" color={COLORS.blue} />
    <FadeIn delay={6}>
      <span style={{ fontSize: 22, color: COLORS.textDim, fontFamily: FONTS.sans }}>
        Live at main.d1ft6a4fdhj1nr.amplifyapp.com
      </span>
    </FadeIn>

    <div style={{ display: "flex", gap: 30, marginTop: 30, flex: 1, alignItems: "flex-start" }}>
      {/* Left column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <AppScreenshot src="session-active.png" width={540} height={340} delay={12} label="Adaptive Session — Reasoning Question" />
        <AppScreenshot src="parent-dashboard.png" width={540} height={260} delay={35} label="Parent Dashboard" />
      </div>

      {/* Right column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <AppScreenshot src="session-midway.png" width={540} height={340} delay={22} label="Mid-Session — Streak + Stars + Domain Badge" />
        <AppScreenshot src="session-complete.png" width={540} height={260} delay={45} label="Session Complete — Aptitude Level" />
      </div>
    </div>
  </Scene>
);

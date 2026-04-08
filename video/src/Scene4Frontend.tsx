import React from "react";
import { Scene, SectionTitle, FadeIn, BoxNode, DrawLine } from "./helpers";
import { COLORS, FONTS } from "./styles";

export const Scene4Frontend: React.FC = () => {
  return (
    <Scene justify="flex-start">
      <SectionTitle text="Frontend Architecture" color={COLORS.blue} />
      <div style={{ marginTop: 16 }}>
        <FadeIn delay={8}>
          <span style={{ fontSize: 24, color: COLORS.textDim, fontFamily: FONTS.sans }}>
            Next.js 16 App Router · React 19 · Zustand · Tailwind 4 · Framer Motion
          </span>
        </FadeIn>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={1600} height={700} viewBox="0 0 1600 700">
          {/* Pages */}
          <BoxNode x={50} y={30} w={200} h={70} label="/ Landing" color={COLORS.blue} delay={15} />
          <BoxNode x={300} y={30} w={200} h={70} label="/demo" color={COLORS.blue} delay={18} sublabel="Client IRT" />
          <BoxNode x={550} y={30} w={200} h={70} label="/login" color={COLORS.blue} delay={21} />
          <BoxNode x={800} y={30} w={200} h={70} label="/signup" color={COLORS.blue} delay={24} />
          <BoxNode x={1050} y={30} w={250} h={70} label="/forgot-password" color={COLORS.blue} delay={27} />

          {/* Protected pages */}
          <BoxNode x={200} y={180} w={250} h={70} label="/parent" color={COLORS.purple} delay={32} sublabel="Dashboard" />
          <BoxNode x={500} y={180} w={300} h={70} label="/parent/children/[id]" color={COLORS.purple} delay={35} sublabel="Child Detail" />
          <BoxNode x={850} y={180} w={300} h={70} label="/session/[id]" color={COLORS.purple} delay={38} sublabel="Live Assessment" />

          {/* Middleware */}
          <BoxNode x={450} y={310} w={350} h={60} label="Auth Middleware" color={COLORS.amber} delay={42} sublabel="Protects /parent + /session" />

          {/* Stores */}
          <BoxNode x={100} y={430} w={280} h={60} label="useAuthStore" color={COLORS.emerald} delay={48} sublabel="Zustand — user + profile" />
          <BoxNode x={450} y={430} w={300} h={60} label="useSessionStore" color={COLORS.emerald} delay={51} sublabel="Zustand — items + theta" />

          {/* Components */}
          <BoxNode x={850} y={430} w={250} h={60} label="UI Components" color={COLORS.pink} delay={54} sublabel="shadcn + custom" />

          {/* Supabase clients */}
          <BoxNode x={250} y={560} w={300} h={60} label="supabase-browser" color={COLORS.emerald} delay={58} sublabel="Client-side auth + data" />
          <BoxNode x={620} y={560} w={300} h={60} label="supabase-server" color={COLORS.emerald} delay={61} sublabel="SSR + middleware" />

          {/* Connections */}
          <DrawLine x1={325} y1={250} x2={525} y2={310} color={COLORS.amber} delay={44} />
          <DrawLine x1={1000} y1={250} x2={625} y2={310} color={COLORS.amber} delay={46} />
          <DrawLine x1={600} y1={490} x2={400} y2={560} color={COLORS.emerald} delay={63} />
          <DrawLine x1={600} y1={490} x2={770} y2={560} color={COLORS.emerald} delay={65} />
        </svg>
      </div>
    </Scene>
  );
};

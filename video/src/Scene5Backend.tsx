import React from "react";
import { Scene, SectionTitle, FadeIn, BoxNode, DrawLine } from "./helpers";
import { COLORS, FONTS } from "./styles";

export const Scene5Backend: React.FC = () => (
  <Scene justify="flex-start">
    <SectionTitle text="Backend Architecture" color={COLORS.emerald} />
    <div style={{ marginTop: 16 }}>
      <FadeIn delay={8}>
        <span style={{ fontSize: 24, color: COLORS.textDim, fontFamily: FONTS.sans }}>
          Supabase · PostgreSQL 17 · Edge Functions · Row-Level Security
        </span>
      </FadeIn>
    </div>

    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={1600} height={700} viewBox="0 0 1600 700">
        {/* Edge Functions */}
        <BoxNode x={100} y={30} w={350} h={80} label="start-session" color={COLORS.emerald} delay={15} sublabel="Auth check → Create session → First item" />
        <BoxNode x={550} y={30} w={400} h={80} label="compute-next-item" color={COLORS.emerald} delay={20} sublabel="Score → EAP theta → Fisher Info → Next item" />

        {/* IRT Engine */}
        <BoxNode x={1050} y={30} w={350} h={80} label="IRT Engine (3PL)" color={COLORS.purple} delay={25} sublabel="probability · Fisher info · EAP · SE" />

        {/* Arrow to DB */}
        <DrawLine x1={275} y1={110} x2={275} y2={180} color={COLORS.emerald} delay={30} />
        <DrawLine x1={750} y1={110} x2={750} y2={180} color={COLORS.emerald} delay={32} />
        <DrawLine x1={1225} y1={110} x2={750} y2={50} color={COLORS.purple} delay={28} width={2} />

        {/* Database tables */}
        <BoxNode x={50} y={190} w={180} h={60} label="profiles" color={COLORS.blue} delay={35} sublabel="parents + children" />
        <BoxNode x={260} y={190} w={220} h={60} label="parent_child_links" color={COLORS.blue} delay={37} />
        <BoxNode x={510} y={190} w={160} h={60} label="sessions" color={COLORS.blue} delay={39} sublabel="theta tracking" />
        <BoxNode x={700} y={190} w={160} h={60} label="responses" color={COLORS.blue} delay={41} sublabel="per-item data" />
        <BoxNode x={890} y={190} w={180} h={60} label="items (334)" color={COLORS.blue} delay={43} sublabel="IRT-calibrated" />
        <BoxNode x={1100} y={190} w={200} h={60} label="appetite_signals" color={COLORS.blue} delay={45} sublabel="6 signal types" />
        <BoxNode x={1330} y={190} w={220} h={60} label="composite_scores" color={COLORS.blue} delay={47} sublabel="aptitude + appetite" />

        {/* Child PII isolated */}
        <BoxNode x={50} y={290} w={180} h={60} label="child_pii" color={COLORS.amber} delay={50} sublabel="COPPA isolated" />

        {/* RLS */}
        <FadeIn delay={55} direction="up">
          <g>
            <rect x={50} y={380} width={1500} height={80} rx={12} fill={COLORS.amber + "11"} stroke={COLORS.amber} strokeWidth={2} strokeDasharray="8 4" />
            <text x={800} y={420} textAnchor="middle" fill={COLORS.amber} fontSize={24} fontWeight={700} fontFamily="Inter, sans-serif">
              Row-Level Security — Parents see only their children&apos;s data
            </text>
            <text x={800} y={445} textAnchor="middle" fill={COLORS.textDim} fontSize={18} fontFamily="Inter, sans-serif">
              9 RLS policies · auth_user_id match · parent_child_link verification · denormalized parent_id for session/response reads
            </text>
          </g>
        </FadeIn>

        {/* Appetite computation */}
        <BoxNode x={200} y={500} w={500} h={70} label="Appetite Engine" color={COLORS.pink} delay={60} sublabel="return_visit · persistence · voluntary_hard · learning_velocity · time_investment · streak" />
        <BoxNode x={800} y={500} w={400} h={70} label="Composite Scoring" color={COLORS.pink} delay={65} sublabel="Weighted theta (λ=0.7 decay) + appetite tier" />
        <DrawLine x1={700} y1={535} x2={800} y2={535} color={COLORS.pink} delay={68} />
      </svg>
    </div>
  </Scene>
);

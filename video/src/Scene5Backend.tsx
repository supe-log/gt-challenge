import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Scene, SectionTitle, FadeIn } from "./helpers";
import { COLORS, FONTS } from "./styles";

// Proper box with guaranteed text containment
const Box: React.FC<{
  x: number; y: number; w: number; h: number;
  label: string; sub?: string; color: string; delay: number;
}> = ({ x, y, w, h, label, sub, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <g opacity={p} transform={`translate(${x},${y})`}>
      <rect width={w} height={h} rx={10} fill={color + "18"} stroke={color} strokeWidth={2} />
      <text x={w / 2} y={sub ? h / 2 - 6 : h / 2 + 6} textAnchor="middle" fill={color} fontSize={18} fontWeight={700} fontFamily="Inter,sans-serif">{label}</text>
      {sub && <text x={w / 2} y={h / 2 + 14} textAnchor="middle" fill="#94a3b8" fontSize={13} fontFamily="Inter,sans-serif">{sub}</text>}
    </g>
  );
};

// Arrow with proper endpoints
const Arrow: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  color?: string; delay: number; dashed?: boolean;
}> = ({ x1, y1, x2, y2, color = "#475569", delay, dashed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={2} opacity={p}
      strokeDasharray={dashed ? "6 4" : `${len}`}
      strokeDashoffset={dashed ? 0 : len * (1 - p)}
      markerEnd="url(#arrowhead)"
    />
  );
};

export const Scene5Backend: React.FC = () => (
  <Scene justify="flex-start">
    <SectionTitle text="Backend Architecture" color={COLORS.emerald} />
    <FadeIn delay={6}>
      <span style={{ fontSize: 22, color: COLORS.textDim, fontFamily: FONTS.sans }}>
        Supabase · PostgreSQL 17 · Edge Functions · Row-Level Security
      </span>
    </FadeIn>

    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -20 }}>
      <svg width={1700} height={680} viewBox="0 0 1700 680">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
        </defs>

        {/* === ROW 1: Edge Functions === */}
        <Box x={80} y={10} w={320} h={65} label="start-session" sub="Auth → Create session → First item" color={COLORS.emerald} delay={12} />
        <Box x={480} y={10} w={380} h={65} label="compute-next-item" sub="Score → EAP theta → Select next item" color={COLORS.emerald} delay={16} />
        <Box x={940} y={10} w={300} h={65} label="IRT Engine (3PL)" sub="probability · Fisher info · EAP · SE" color={COLORS.purple} delay={20} />

        {/* Arrow: IRT feeds into compute-next-item */}
        <Arrow x1={940} y1={42} x2={862} y2={42} color={COLORS.purple} delay={22} />

        {/* === Arrows down to DB === */}
        <Arrow x1={240} y1={75} x2={240} y2={120} color={COLORS.emerald} delay={25} />
        <Arrow x1={670} y1={75} x2={670} y2={120} color={COLORS.emerald} delay={27} />

        {/* === ROW 2: Database Tables === */}
        <Box x={60} y={125} w={200} h={60} label="profiles" sub="parents + children" color={COLORS.blue} delay={30} />
        <Box x={290} y={125} w={200} h={60} label="sessions" sub="theta tracking" color={COLORS.blue} delay={33} />
        <Box x={520} y={125} w={200} h={60} label="responses" sub="per-item answers" color={COLORS.blue} delay={36} />
        <Box x={750} y={125} w={220} h={60} label="items (334)" sub="IRT-calibrated bank" color={COLORS.blue} delay={39} />

        {/* === ROW 3: More tables === */}
        <Box x={60} y={215} w={230} h={60} label="appetite_signals" sub="6 behavioral signals" color={COLORS.blue} delay={42} />
        <Box x={320} y={215} w={240} h={60} label="composite_scores" sub="aptitude + appetite tiers" color={COLORS.blue} delay={45} />
        <Box x={590} y={215} w={200} h={60} label="child_pii" sub="COPPA isolated" color={COLORS.amber} delay={48} />
        <Box x={820} y={215} w={250} h={60} label="parent_child_links" sub="ownership verification" color={COLORS.blue} delay={51} />

        {/* === RLS Bar === */}
        <FadeIn delay={55} direction="up">
          <g>
            <rect x={60} y={305} width={1010} height={50} rx={8} fill={COLORS.amber + "12"} stroke={COLORS.amber} strokeWidth={2} strokeDasharray="8 4" />
            <text x={565} y={335} textAnchor="middle" fill={COLORS.amber} fontSize={20} fontWeight={700} fontFamily="Inter,sans-serif">
              Row-Level Security — Parents see only their children&apos;s data (9 policies)
            </text>
          </g>
        </FadeIn>

        {/* === ROW 4: Computation engines === */}
        <Box x={60} y={390} w={380} h={70} label="Appetite Engine" sub="6 signals: return · persist · bonus · velocity · time · streak" color={COLORS.pink} delay={60} />
        <Arrow x1={440} y1={425} x2={500} y2={425} color={COLORS.pink} delay={65} />
        <Box x={500} y={390} w={380} h={70} label="Composite Scoring" sub="Weighted θ (λ=0.7 decay) → aptitude + appetite tier" color={COLORS.pink} delay={63} />

        {/* Arrows from DB to engines */}
        <Arrow x1={175} y1={275} x2={175} y2={390} color={COLORS.pink} delay={58} dashed />
        <Arrow x1={440} y1={275} x2={690} y2={390} color={COLORS.pink} delay={61} dashed />

        {/* === Legend === */}
        <FadeIn delay={68} direction="up">
          <g>
            <rect x={60} y={500} width={18} height={18} rx={4} fill={COLORS.emerald} />
            <text x={86} y={514} fill="#94a3b8" fontSize={16} fontFamily="Inter,sans-serif">Edge Functions</text>
            <rect x={230} y={500} width={18} height={18} rx={4} fill={COLORS.blue} />
            <text x={256} y={514} fill="#94a3b8" fontSize={16} fontFamily="Inter,sans-serif">Database (8 tables)</text>
            <rect x={430} y={500} width={18} height={18} rx={4} fill={COLORS.purple} />
            <text x={456} y={514} fill="#94a3b8" fontSize={16} fontFamily="Inter,sans-serif">Psychometrics</text>
            <rect x={600} y={500} width={18} height={18} rx={4} fill={COLORS.pink} />
            <text x={626} y={514} fill="#94a3b8" fontSize={16} fontFamily="Inter,sans-serif">Computation</text>
            <rect x={760} y={500} width={18} height={18} rx={4} fill={COLORS.amber} />
            <text x={786} y={514} fill="#94a3b8" fontSize={16} fontFamily="Inter,sans-serif">Security / PII</text>
          </g>
        </FadeIn>
      </svg>
    </div>
  </Scene>
);

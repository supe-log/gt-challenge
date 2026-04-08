import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Scene, SectionTitle, FadeIn } from "./helpers";
import { COLORS, FONTS } from "./styles";

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
      <text x={w / 2} y={sub ? h / 2 - 6 : h / 2 + 6} textAnchor="middle" fill={color} fontSize={17} fontWeight={700} fontFamily="Inter,sans-serif">{label}</text>
      {sub && <text x={w / 2} y={h / 2 + 14} textAnchor="middle" fill="#94a3b8" fontSize={13} fontFamily="Inter,sans-serif">{sub}</text>}
    </g>
  );
};

const Arrow: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  color?: string; delay: number;
}> = ({ x1, y1, x2, y2, color = "#475569", delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={2} opacity={p}
      strokeDasharray={len}
      strokeDashoffset={len * (1 - p)}
      markerEnd="url(#flowArrow)"
    />
  );
};

// Curved path arrow for the loop
const CurveArrow: React.FC<{
  d: string; color: string; delay: number;
}> = ({ d, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <path d={d} fill="none" stroke={color} strokeWidth={2.5} opacity={p}
      strokeDasharray={600} strokeDashoffset={600 * (1 - p)}
      markerEnd="url(#flowArrow)" />
  );
};

export const Scene6Flow: React.FC = () => (
  <Scene justify="flex-start">
    <SectionTitle text="How It Works: End-to-End" color={COLORS.text} />
    <FadeIn delay={6}>
      <span style={{ fontSize: 22, color: COLORS.textDim, fontFamily: FONTS.sans }}>
        Parent signs up → Adds child → Child takes adaptive session → Scores computed
      </span>
    </FadeIn>

    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -10 }}>
      <svg width={1700} height={620} viewBox="0 0 1700 620">
        <defs>
          <marker id="flowArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
          </marker>
        </defs>

        {/* ═══ ROW 1: User Journey ═══ */}
        <FadeIn delay={10} direction="none">
          <g>
            <text x={80} y={20} fill="#64748b" fontSize={14} fontWeight={700} fontFamily="Inter,sans-serif" letterSpacing={2}>USER JOURNEY</text>
          </g>
        </FadeIn>

        <Box x={60}   y={30} w={210} h={60} label="Parent Signup" sub="email + password" color={COLORS.blue} delay={12} />
        <Arrow x1={270} y1={60} x2={310} y2={60} delay={16} />
        <Box x={310}  y={30} w={210} h={60} label="Add Child" sub="name + age band" color={COLORS.blue} delay={18} />
        <Arrow x1={520} y1={60} x2={560} y2={60} delay={22} />
        <Box x={560}  y={30} w={220} h={60} label="Start Challenge" sub="click Start button" color={COLORS.blue} delay={24} />
        <Arrow x1={780} y1={60} x2={820} y2={60} delay={28} />
        <Box x={820}  y={30} w={250} h={60} label="Answer Questions" sub="20-40 adaptive items" color={COLORS.blue} delay={30} />
        <Arrow x1={1070} y1={60} x2={1110} y2={60} delay={34} />
        <Box x={1110} y={30} w={230} h={60} label="View Results" sub="aptitude + appetite" color={COLORS.blue} delay={36} />

        {/* ═══ Down arrow to backend ═══ */}
        <Arrow x1={670} y1={90} x2={670} y2={140} color={COLORS.emerald} delay={40} />

        {/* ═══ ROW 2: Backend Processing ═══ */}
        <FadeIn delay={42} direction="none">
          <g>
            <text x={80} y={160} fill="#64748b" fontSize={14} fontWeight={700} fontFamily="Inter,sans-serif" letterSpacing={2}>BACKEND</text>
          </g>
        </FadeIn>

        <Box x={60}  y={170} w={280} h={60} label="Edge: start-session" sub="Verify parent → Create session" color={COLORS.emerald} delay={44} />
        <Arrow x1={340} y1={200} x2={380} y2={200} color={COLORS.emerald} delay={48} />
        <Box x={380} y={170} w={260} h={60} label="Select First Item" sub="Max Fisher Info at θ=0" color={COLORS.emerald} delay={50} />
        <Arrow x1={640} y1={200} x2={680} y2={200} color={COLORS.emerald} delay={54} />
        <Box x={680} y={170} w={240} h={60} label="Student Answers" sub="time + idle tracked" color={COLORS.purple} delay={56} />
        <Arrow x1={920} y1={200} x2={960} y2={200} color={COLORS.emerald} delay={60} />
        <Box x={960} y={170} w={280} h={60} label="compute-next-item" sub="Score → EAP theta → Next" color={COLORS.emerald} delay={62} />

        {/* ═══ Adaptive Loop (curved arrow back) ═══ */}
        <CurveArrow
          d="M 1100,230 L 1100,270 Q 1100,290 1080,290 L 820,290 Q 800,290 800,270 L 800,230"
          color={COLORS.purple}
          delay={66}
        />
        <FadeIn delay={68} direction="none">
          <g>
            <text x={950} y={308} textAnchor="middle" fill={COLORS.purple} fontSize={16} fontWeight={700} fontFamily="Inter,sans-serif">
              ADAPTIVE LOOP (20-40 items)
            </text>
          </g>
        </FadeIn>

        {/* ═══ Terminate branch ═══ */}
        <Arrow x1={1240} y1={200} x2={1300} y2={200} color={COLORS.amber} delay={70} />
        <Box x={1300} y={170} w={200} h={60} label="Terminate" sub="SE ≤ 0.25 or 40 max" color={COLORS.amber} delay={72} />

        {/* ═══ Down arrow to post-session ═══ */}
        <Arrow x1={1400} y1={230} x2={1400} y2={340} color={COLORS.amber} delay={76} />
        {/* Horizontal line to connect to post-session row */}
        <Arrow x1={1400} y1={370} x2={830} y2={370} color={COLORS.pink} delay={78} />

        {/* ═══ ROW 3: Post-Session ═══ */}
        <FadeIn delay={78} direction="none">
          <g>
            <text x={80} y={350} fill="#64748b" fontSize={14} fontWeight={700} fontFamily="Inter,sans-serif" letterSpacing={2}>POST-SESSION</text>
          </g>
        </FadeIn>

        <Box x={100} y={360} w={320} h={65} label="Compute Composite Score" sub="Weighted θ across sessions (λ=0.7)" color={COLORS.pink} delay={80} />
        <Arrow x1={420} y1={392} x2={470} y2={392} color={COLORS.pink} delay={85} />
        <Box x={470} y={360} w={320} h={65} label="Compute Appetite Signals" sub="6 behavioral signals (0-1 each)" color={COLORS.pink} delay={83} />

        {/* ═══ ROW 4: Result ═══ */}
        <Arrow x1={310} y1={425} x2={310} y2={470} color={COLORS.pink} delay={88} />
        <Arrow x1={630} y1={425} x2={630} y2={470} color={COLORS.pink} delay={90} />

        <Box x={150} y={475} w={680} h={65} label="Parent Dashboard Updated" sub="Aptitude tier (Developing → Exceptional) + Appetite tier + Progress chart" color={COLORS.text} delay={92} />

        {/* ═══ Legend ═══ */}
        <FadeIn delay={96} direction="up">
          <g>
            <rect x={100} y={570} width={14} height={14} rx={3} fill={COLORS.blue} />
            <text x={122} y={582} fill="#64748b" fontSize={14} fontFamily="Inter,sans-serif">User Actions</text>
            <rect x={260} y={570} width={14} height={14} rx={3} fill={COLORS.emerald} />
            <text x={282} y={582} fill="#64748b" fontSize={14} fontFamily="Inter,sans-serif">Edge Functions</text>
            <rect x={430} y={570} width={14} height={14} rx={3} fill={COLORS.purple} />
            <text x={452} y={582} fill="#64748b" fontSize={14} fontFamily="Inter,sans-serif">Adaptive Loop</text>
            <rect x={600} y={570} width={14} height={14} rx={3} fill={COLORS.pink} />
            <text x={622} y={582} fill="#64748b" fontSize={14} fontFamily="Inter,sans-serif">Post-Session</text>
            <rect x={760} y={570} width={14} height={14} rx={3} fill={COLORS.amber} />
            <text x={782} y={582} fill="#64748b" fontSize={14} fontFamily="Inter,sans-serif">Termination</text>
          </g>
        </FadeIn>
      </svg>
    </div>
  </Scene>
);

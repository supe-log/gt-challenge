import React from "react";
import { Scene, SectionTitle, FadeIn, BoxNode, DrawLine } from "./helpers";
import { COLORS, FONTS } from "./styles";

export const Scene6Flow: React.FC = () => (
  <Scene justify="flex-start">
    <SectionTitle text="How It Works: End-to-End" color={COLORS.text} />
    <FadeIn delay={8}>
      <span style={{ fontSize: 24, color: COLORS.textDim, fontFamily: FONTS.sans }}>
        Parent signs up → Adds child → Child takes adaptive session → Scores computed
      </span>
    </FadeIn>

    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={1600} height={600} viewBox="0 0 1600 600">
        {/* Row 1: User actions */}
        <BoxNode x={50} y={20} w={200} h={70} label="Parent Signup" color={COLORS.blue} delay={15} sublabel="email + password" />
        <DrawLine x1={250} y1={55} x2={320} y2={55} color={COLORS.textDim} delay={20} />
        <BoxNode x={320} y={20} w={200} h={70} label="Add Child" color={COLORS.blue} delay={22} sublabel="name + age band" />
        <DrawLine x1={520} y1={55} x2={590} y2={55} color={COLORS.textDim} delay={27} />
        <BoxNode x={590} y={20} w={250} h={70} label="Start Challenge" color={COLORS.blue} delay={29} sublabel="click Start button" />
        <DrawLine x1={840} y1={55} x2={910} y2={55} color={COLORS.textDim} delay={34} />
        <BoxNode x={910} y={20} w={250} h={70} label="Answer Questions" color={COLORS.blue} delay={36} sublabel="20-40 adaptive items" />
        <DrawLine x1={1160} y1={55} x2={1230} y2={55} color={COLORS.textDim} delay={41} />
        <BoxNode x={1230} y={20} w={250} h={70} label="View Results" color={COLORS.blue} delay={43} sublabel="aptitude + appetite" />

        {/* Row 2: What happens behind the scenes */}
        <DrawLine x1={715} y1={90} x2={715} y2={150} color={COLORS.emerald} delay={48} />

        <BoxNode x={50} y={160} w={280} h={70} label="Edge: start-session" color={COLORS.emerald} delay={50} sublabel="Verify parent → Create session" />
        <DrawLine x1={330} y1={195} x2={390} y2={195} color={COLORS.emerald} delay={55} />
        <BoxNode x={390} y={160} w={280} h={70} label="Select First Item" color={COLORS.emerald} delay={57} sublabel="Max Fisher Info at θ=0" />
        <DrawLine x1={670} y1={195} x2={730} y2={195} color={COLORS.emerald} delay={62} />
        <BoxNode x={730} y={160} w={280} h={70} label="Student Answers" color={COLORS.purple} delay={64} sublabel="time + idle tracked" />
        <DrawLine x1={1010} y1={195} x2={1070} y2={195} color={COLORS.emerald} delay={69} />
        <BoxNode x={1070} y={160} w={280} h={70} label="compute-next-item" color={COLORS.emerald} delay={71} sublabel="Score → EAP → Next" />

        {/* Loop arrow */}
        <DrawLine x1={1210} y1={230} x2={1210} y2={280} color={COLORS.purple} delay={76} />
        <DrawLine x1={1210} y1={280} x2={870} y2={280} color={COLORS.purple} delay={78} />
        <DrawLine x1={870} y1={280} x2={870} y2={230} color={COLORS.purple} delay={80} />

        <FadeIn delay={82} direction="none">
          <g>
            <text x={1040} y={300} textAnchor="middle" fill={COLORS.purple} fontSize={18} fontWeight={700} fontFamily="Inter, sans-serif">
              ADAPTIVE LOOP (20-40 items)
            </text>
          </g>
        </FadeIn>

        {/* Termination */}
        <DrawLine x1={1350} y1={195} x2={1420} y2={195} color={COLORS.amber} delay={85} />
        <BoxNode x={1380} y={160} w={180} h={70} label="Terminate" color={COLORS.amber} delay={87} sublabel="SE ≤ 0.25" />

        {/* Row 3: Post-session */}
        <DrawLine x1={1470} y1={230} x2={1470} y2={340} color={COLORS.amber} delay={90} />

        <BoxNode x={200} y={350} w={350} h={70} label="Compute Composite Score" color={COLORS.pink} delay={92} sublabel="Weighted θ across sessions (λ=0.7)" />
        <DrawLine x1={550} y1={385} x2={620} y2={385} color={COLORS.pink} delay={97} />
        <BoxNode x={620} y={350} w={350} h={70} label="Compute Appetite Signals" color={COLORS.pink} delay={99} sublabel="6 behavioral signals (0-1 each)" />
        <DrawLine x1={970} y1={385} x2={1040} y2={385} color={COLORS.pink} delay={104} />
        <BoxNode x={1040} y={350} w={350} h={70} label="Update Dashboard" color={COLORS.pink} delay={106} sublabel="Aptitude tier + Appetite tier" />
      </svg>
    </div>
  </Scene>
);

"use client";

import { thetaToPercentile, getPercentileLabel, getPercentileColor } from "@/lib/norms";

interface PercentileBadgeProps {
  theta: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CONFIG = {
  sm: { ring: 64, stroke: 5, fontSize: "text-lg", subText: "text-[10px]", gap: "gap-1" },
  md: { ring: 80, stroke: 6, fontSize: "text-2xl", subText: "text-xs", gap: "gap-1.5" },
  lg: { ring: 100, stroke: 7, fontSize: "text-3xl", subText: "text-sm", gap: "gap-2" },
} as const;

export function PercentileBadge({ theta, label, size = "md" }: PercentileBadgeProps) {
  const percentile = thetaToPercentile(theta);
  const percentileLabel = getPercentileLabel(percentile);
  const colorClasses = getPercentileColor(percentile);

  const config = SIZE_CONFIG[size];
  const radius = (config.ring - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = percentile / 100;
  const dashOffset = circumference * (1 - progress);

  // Gradient colors based on percentile
  const gradientId = `percentile-grad-${Math.round(theta * 100)}`;
  const gradientColors =
    percentile >= 90
      ? { start: "#7c3aed", end: "#a855f7" } // purple
      : percentile >= 75
        ? { start: "#4f46e5", end: "#818cf8" } // indigo
        : percentile >= 60
          ? { start: "#2563eb", end: "#60a5fa" } // blue
          : { start: "#9ca3af", end: "#d1d5db" }; // gray

  return (
    <div className={`flex flex-col items-center ${config.gap}`}>
      {/* SVG circular progress ring */}
      <div className="relative" style={{ width: config.ring, height: config.ring }}>
        <svg
          width={config.ring}
          height={config.ring}
          className="-rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientColors.start} />
              <stop offset="100%" stopColor={gradientColors.end} />
            </linearGradient>
          </defs>
          {/* Background track */}
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={config.stroke}
          />
          {/* Progress arc */}
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
          />
        </svg>
        {/* Center number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${config.fontSize} font-extrabold leading-none`}>
            {percentile}
          </span>
          <span className={`${config.subText} text-gray-400 leading-none`}>th</span>
        </div>
      </div>

      {/* Label */}
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}>
        {label ?? percentileLabel}
      </span>

      {/* Explainer */}
      <p className={`${config.subText} text-gray-400 text-center leading-tight`}>
        compared to age-band peers
      </p>
    </div>
  );
}

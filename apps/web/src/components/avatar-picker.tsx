"use client";

import { useState } from "react";

/**
 * 12 fun, gender-neutral avatar designs.
 * Each is a colored abstract shape with a simple face.
 */
export interface AvatarDef {
  id: number;
  bg: string; // tailwind gradient
  shape: "circle" | "square" | "diamond" | "hexagon";
  faceColor: string; // CSS color for eyes/mouth
}

const AVATARS: AvatarDef[] = [
  { id: 1, bg: "from-purple-400 to-purple-600", shape: "circle", faceColor: "#fff" },
  { id: 2, bg: "from-blue-400 to-blue-600", shape: "square", faceColor: "#fff" },
  { id: 3, bg: "from-emerald-400 to-emerald-600", shape: "circle", faceColor: "#fff" },
  { id: 4, bg: "from-orange-400 to-orange-500", shape: "diamond", faceColor: "#fff" },
  { id: 5, bg: "from-pink-400 to-pink-600", shape: "circle", faceColor: "#fff" },
  { id: 6, bg: "from-cyan-400 to-cyan-600", shape: "square", faceColor: "#fff" },
  { id: 7, bg: "from-amber-400 to-amber-600", shape: "hexagon", faceColor: "#fff" },
  { id: 8, bg: "from-red-400 to-red-500", shape: "circle", faceColor: "#fff" },
  { id: 9, bg: "from-indigo-400 to-indigo-600", shape: "diamond", faceColor: "#fff" },
  { id: 10, bg: "from-teal-400 to-teal-600", shape: "circle", faceColor: "#fff" },
  { id: 11, bg: "from-violet-400 to-violet-600", shape: "square", faceColor: "#fff" },
  { id: 12, bg: "from-lime-400 to-lime-600", shape: "hexagon", faceColor: "#fff" },
];

export { AVATARS };

/**
 * Renders a single avatar as an SVG.
 * Can be used standalone (e.g. in the parent dashboard child cards).
 */
export function AvatarIcon({
  avatarId,
  size = 48,
  className = "",
}: {
  avatarId: number;
  size?: number;
  className?: string;
}) {
  const avatar = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];
  return (
    <div
      className={`bg-gradient-to-br ${avatar.bg} rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 40 40" width={size * 0.65} height={size * 0.65}>
        {/* Shape background clip */}
        {avatar.shape === "circle" && (
          <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.15)" />
        )}
        {avatar.shape === "square" && (
          <rect x="4" y="4" width="32" height="32" rx="6" fill="rgba(255,255,255,0.15)" />
        )}
        {avatar.shape === "diamond" && (
          <polygon points="20,2 38,20 20,38 2,20" fill="rgba(255,255,255,0.15)" />
        )}
        {avatar.shape === "hexagon" && (
          <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="rgba(255,255,255,0.15)" />
        )}
        {/* Eyes */}
        <circle cx="14" cy="17" r="2.5" fill={avatar.faceColor} />
        <circle cx="26" cy="17" r="2.5" fill={avatar.faceColor} />
        {/* Pupils */}
        <circle cx="14.8" cy="16.5" r="1" fill="rgba(0,0,0,0.5)" />
        <circle cx="26.8" cy="16.5" r="1" fill="rgba(0,0,0,0.5)" />
        {/* Smile */}
        <path
          d="M13 25 Q20 31 27 25"
          fill="none"
          stroke={avatar.faceColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Avatar picker grid. Calls onSelect when the user picks an avatar.
 */
export function AvatarPicker({
  selectedId,
  onSelect,
  saving = false,
}: {
  selectedId: number;
  onSelect: (id: number) => void;
  saving?: boolean;
}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <h2 className="font-semibold text-lg mb-4">Choose Your Avatar</h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {AVATARS.map((avatar) => {
          const isSelected = avatar.id === selectedId;
          const isHovered = avatar.id === hoveredId;
          return (
            <button
              key={avatar.id}
              onClick={() => onSelect(avatar.id)}
              onMouseEnter={() => setHoveredId(avatar.id)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={saving}
              className={`relative p-1.5 rounded-xl transition-all ${
                isSelected
                  ? "ring-3 ring-indigo-500 ring-offset-2 scale-105"
                  : isHovered
                  ? "ring-2 ring-indigo-300 ring-offset-1"
                  : "hover:bg-gray-50"
              } ${saving ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
              aria-label={`Avatar ${avatar.id}`}
            >
              <AvatarIcon avatarId={avatar.id} size={56} />
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {saving && (
        <p className="text-xs text-gray-400 mt-3 text-center">Saving...</p>
      )}
    </div>
  );
}

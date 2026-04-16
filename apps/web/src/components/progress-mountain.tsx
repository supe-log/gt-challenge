"use client";

/**
 * Progress Mountain: a fun SVG mountain that kids climb across sessions.
 * 10 stations from base (0 sessions) to peak (10+ sessions).
 */

interface Station {
  label: string;
  x: number;
  y: number;
  sessions: number; // sessions needed to reach this station
}

const STATIONS: Station[] = [
  { label: "Base Camp", x: 50, y: 340, sessions: 0 },
  { label: "Trail Start", x: 90, y: 310, sessions: 1 },
  { label: "Meadow", x: 130, y: 275, sessions: 2 },
  { label: "Forest", x: 165, y: 245, sessions: 3 },
  { label: "Waterfall", x: 195, y: 210, sessions: 4 },
  { label: "Ridge", x: 225, y: 175, sessions: 5 },
  { label: "Snow Line", x: 255, y: 140, sessions: 6 },
  { label: "Cloud Pass", x: 280, y: 110, sessions: 7 },
  { label: "Sky Camp", x: 305, y: 80, sessions: 8 },
  { label: "Summit!", x: 330, y: 45, sessions: 10 },
];

function getCurrentStation(sessionsCompleted: number): number {
  for (let i = STATIONS.length - 1; i >= 0; i--) {
    if (sessionsCompleted >= STATIONS[i].sessions) return i;
  }
  return 0;
}

export function ProgressMountain({
  sessionsCompleted,
  childName,
}: {
  sessionsCompleted: number;
  childName: string;
}) {
  const currentIdx = getCurrentStation(sessionsCompleted);
  const current = STATIONS[currentIdx];

  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Progress Mountain</h2>
        <span className="text-sm text-gray-400">
          {current.label}
        </span>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-sky-100 via-sky-50 to-green-50">
        <svg viewBox="0 0 400 380" className="w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Mountain gradient */}
            <linearGradient id="mountainGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#16a34a" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.6" />
              <stop offset="85%" stopColor="#a855f7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.9" />
            </linearGradient>
            {/* Snow cap */}
            <linearGradient id="snowGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            {/* Glow for active station */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Clouds */}
          <ellipse cx="80" cy="50" rx="40" ry="15" fill="white" opacity="0.6" />
          <ellipse cx="60" cy="55" rx="30" ry="12" fill="white" opacity="0.5" />
          <ellipse cx="350" cy="70" rx="35" ry="12" fill="white" opacity="0.5" />

          {/* Mountain shape */}
          <polygon
            points="330,30 400,370 260,370 10,370 50,350"
            fill="url(#mountainGrad)"
          />

          {/* Snow cap at peak */}
          <polygon
            points="330,30 350,80 310,85 295,70"
            fill="url(#snowGrad)"
            opacity="0.7"
          />

          {/* Secondary ridge */}
          <polygon
            points="330,30 190,370 400,370"
            fill="rgba(255,255,255,0.08)"
          />

          {/* Trail path connecting stations */}
          <polyline
            points={STATIONS.map((s) => `${s.x},${s.y}`).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeDasharray="6,4"
            strokeLinecap="round"
          />

          {/* Stations */}
          {STATIONS.map((station, i) => {
            const reached = i <= currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <g key={station.label}>
                {/* Station dot */}
                <circle
                  cx={station.x}
                  cy={station.y}
                  r={isCurrent ? 8 : 5}
                  fill={
                    isCurrent
                      ? "#6366f1"
                      : reached
                      ? "#a78bfa"
                      : "rgba(255,255,255,0.3)"
                  }
                  stroke={reached ? "white" : "rgba(255,255,255,0.2)"}
                  strokeWidth={isCurrent ? 3 : 1.5}
                  filter={isCurrent ? "url(#glow)" : undefined}
                />
                {/* Station label for reached or current */}
                {(reached || i === currentIdx + 1) && (
                  <text
                    x={station.x + (i < 5 ? 14 : -14)}
                    y={station.y + 4}
                    textAnchor={i < 5 ? "start" : "end"}
                    fontSize="9"
                    fontWeight={isCurrent ? "bold" : "normal"}
                    fill={reached ? "white" : "rgba(255,255,255,0.5)"}
                    className="select-none"
                  >
                    {station.label}
                  </text>
                )}
                {/* Character marker at current station */}
                {isCurrent && (
                  <g>
                    {/* Flag */}
                    <line
                      x1={station.x}
                      y1={station.y - 10}
                      x2={station.x}
                      y2={station.y - 28}
                      stroke="white"
                      strokeWidth="1.5"
                    />
                    <polygon
                      points={`${station.x},${station.y - 28} ${station.x + 12},${station.y - 24} ${station.x},${station.y - 20}`}
                      fill="#f59e0b"
                    />
                    {/* Name label */}
                    <rect
                      x={station.x - 24}
                      y={station.y + 10}
                      width="48"
                      height="16"
                      rx="8"
                      fill="#6366f1"
                    />
                    <text
                      x={station.x}
                      y={station.y + 21}
                      textAnchor="middle"
                      fontSize="8"
                      fontWeight="bold"
                      fill="white"
                      className="select-none"
                    >
                      {childName.length > 6 ? childName.slice(0, 6) + ".." : childName}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Peak star */}
          <polygon
            points="330,10 333,20 343,20 335,26 338,36 330,30 322,36 325,26 317,20 327,20"
            fill={currentIdx === STATIONS.length - 1 ? "#eab308" : "rgba(255,255,255,0.3)"}
          />
        </svg>

        {/* Progress bar below mountain */}
        <div className="px-4 pb-3 pt-1">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Base</span>
            <span>{Math.min(sessionsCompleted, 10)}/10 sessions</span>
            <span>Summit</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 via-purple-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((sessionsCompleted / 10) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

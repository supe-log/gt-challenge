"use client";

/**
 * Visual Item Renderer
 *
 * Renders SVG-based visual assessment items: matrices, pattern sequences,
 * figure analogies, and shape transformations. Items define visual content
 * as structured JSON, and this component renders them as interactive SVGs.
 *
 * Visual content schema (stored in content_json.visual):
 * {
 *   type: "matrix" | "sequence" | "analogy",
 *   grid?: { rows: number, cols: number, cells: ShapeDef[][] },
 *   sequence?: ShapeDef[],
 *   analogy?: { a: ShapeDef, b: ShapeDef, c: ShapeDef },
 *   missingIndex?: number  // which cell is the "?" (for matrices)
 * }
 *
 * ShapeDef:
 * {
 *   shape: "circle" | "square" | "triangle" | "diamond" | "star" | "hexagon" | "pentagon" | "cross",
 *   color: string (CSS color),
 *   size: "sm" | "md" | "lg",
 *   fill: "solid" | "striped" | "empty",
 *   rotation?: number (degrees),
 *   count?: number (1-3, for multiple shapes in one cell)
 * }
 */

// ─── Types ────────────────────────────────────────────────────

interface ShapeDef {
  shape: string;
  color: string;
  size?: "sm" | "md" | "lg";
  fill?: "solid" | "striped" | "empty";
  rotation?: number;
  count?: number;
}

interface VisualMatrix {
  type: "matrix";
  rows: number;
  cols: number;
  cells: (ShapeDef | null)[][];
  missingIndex?: [number, number]; // [row, col] of the "?" cell
}

interface VisualSequence {
  type: "sequence";
  items: (ShapeDef | null)[];
  missingIndex?: number;
}

interface VisualAnalogy {
  type: "analogy";
  a: ShapeDef;
  b: ShapeDef;
  c: ShapeDef;
  // d is the answer — not rendered
}

export type VisualContent = VisualMatrix | VisualSequence | VisualAnalogy;

// ─── Size map ─────────────────────────────────────────────────

const SIZE_MAP = { sm: 18, md: 28, lg: 40 };

// ─── Shape rendering ──────────────────────────────────────────

function renderShape(
  def: ShapeDef,
  cx: number,
  cy: number,
  cellSize: number,
  key: string
) {
  const size = SIZE_MAP[def.size ?? "md"];
  const r = size / 2;
  const color = def.color || "#6366f1";
  const rotation = def.rotation ?? 0;
  const isFilled = def.fill !== "empty";
  const isStriped = def.fill === "striped";

  const fillColor = isFilled ? color : "none";
  const strokeColor = color;
  const strokeWidth = 2.5;

  const patternId = `stripe-${key}`;

  const transform = rotation !== 0 ? `rotate(${rotation} ${cx} ${cy})` : undefined;

  let shapeEl: React.ReactNode;

  switch (def.shape) {
    case "circle":
      shapeEl = (
        <circle
          cx={cx} cy={cy} r={r}
          fill={isStriped ? `url(#${patternId})` : fillColor}
          stroke={strokeColor} strokeWidth={strokeWidth}
          transform={transform}
        />
      );
      break;

    case "square":
      shapeEl = (
        <rect
          x={cx - r} y={cy - r} width={size} height={size}
          fill={isStriped ? `url(#${patternId})` : fillColor}
          stroke={strokeColor} strokeWidth={strokeWidth}
          transform={transform}
        />
      );
      break;

    case "triangle": {
      const pts = [
        `${cx},${cy - r}`,
        `${cx - r},${cy + r * 0.75}`,
        `${cx + r},${cy + r * 0.75}`,
      ].join(" ");
      shapeEl = (
        <polygon
          points={pts}
          fill={isStriped ? `url(#${patternId})` : fillColor}
          stroke={strokeColor} strokeWidth={strokeWidth}
          transform={transform}
        />
      );
      break;
    }

    case "diamond": {
      const pts = [
        `${cx},${cy - r}`,
        `${cx + r},${cy}`,
        `${cx},${cy + r}`,
        `${cx - r},${cy}`,
      ].join(" ");
      shapeEl = (
        <polygon
          points={pts}
          fill={isStriped ? `url(#${patternId})` : fillColor}
          stroke={strokeColor} strokeWidth={strokeWidth}
          transform={transform}
        />
      );
      break;
    }

    case "star": {
      const outerR = r;
      const innerR = r * 0.4;
      const points = [];
      for (let i = 0; i < 5; i++) {
        const outerAngle = (i * 72 - 90) * (Math.PI / 180);
        const innerAngle = ((i * 72 + 36) - 90) * (Math.PI / 180);
        points.push(`${cx + outerR * Math.cos(outerAngle)},${cy + outerR * Math.sin(outerAngle)}`);
        points.push(`${cx + innerR * Math.cos(innerAngle)},${cy + innerR * Math.sin(innerAngle)}`);
      }
      shapeEl = (
        <polygon
          points={points.join(" ")}
          fill={isStriped ? `url(#${patternId})` : fillColor}
          stroke={strokeColor} strokeWidth={strokeWidth}
          transform={transform}
        />
      );
      break;
    }

    case "hexagon": {
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 30) * (Math.PI / 180);
        pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      shapeEl = (
        <polygon
          points={pts.join(" ")}
          fill={isStriped ? `url(#${patternId})` : fillColor}
          stroke={strokeColor} strokeWidth={strokeWidth}
          transform={transform}
        />
      );
      break;
    }

    case "pentagon": {
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      shapeEl = (
        <polygon
          points={pts.join(" ")}
          fill={isStriped ? `url(#${patternId})` : fillColor}
          stroke={strokeColor} strokeWidth={strokeWidth}
          transform={transform}
        />
      );
      break;
    }

    case "cross": {
      const arm = r * 0.35;
      const pts = [
        `${cx - arm},${cy - r}`, `${cx + arm},${cy - r}`,
        `${cx + arm},${cy - arm}`, `${cx + r},${cy - arm}`,
        `${cx + r},${cy + arm}`, `${cx + arm},${cy + arm}`,
        `${cx + arm},${cy + r}`, `${cx - arm},${cy + r}`,
        `${cx - arm},${cy + arm}`, `${cx - r},${cy + arm}`,
        `${cx - r},${cy - arm}`, `${cx - arm},${cy - arm}`,
      ].join(" ");
      shapeEl = (
        <polygon
          points={pts}
          fill={isStriped ? `url(#${patternId})` : fillColor}
          stroke={strokeColor} strokeWidth={strokeWidth}
          transform={transform}
        />
      );
      break;
    }

    default:
      shapeEl = (
        <circle
          cx={cx} cy={cy} r={r}
          fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}
        />
      );
  }

  return (
    <g key={key}>
      {isStriped && (
        <defs>
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="2" />
          </pattern>
        </defs>
      )}
      {shapeEl}
    </g>
  );
}

// ─── Cell rendering ───────────────────────────────────────────

function renderCell(
  def: ShapeDef | null,
  x: number,
  y: number,
  cellSize: number,
  key: string,
  isMissing?: boolean
) {
  const cx = x + cellSize / 2;
  const cy = y + cellSize / 2;

  return (
    <g key={key}>
      {/* Cell background */}
      <rect
        x={x + 1} y={y + 1}
        width={cellSize - 2} height={cellSize - 2}
        rx={6}
        fill={isMissing ? "#f3f4f6" : "white"}
        stroke={isMissing ? "#9ca3af" : "#e5e7eb"}
        strokeWidth={isMissing ? 2 : 1}
        strokeDasharray={isMissing ? "6 3" : undefined}
      />

      {isMissing ? (
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#9ca3af">?</text>
      ) : def ? (
        // Handle count > 1
        def.count && def.count > 1 ? (
          <>
            {Array.from({ length: Math.min(def.count, 3) }, (_, i) => {
              const offset = def.count === 2
                ? (i === 0 ? -cellSize * 0.15 : cellSize * 0.15)
                : (i - 1) * cellSize * 0.2;
              return renderShape(
                { ...def, size: def.count === 3 ? "sm" : "sm" },
                cx + offset,
                cy + (def.count === 3 && i === 0 ? -cellSize * 0.12 : def.count === 3 ? cellSize * 0.1 : 0),
                cellSize,
                `${key}-s${i}`
              );
            })}
          </>
        ) : (
          renderShape(def, cx, cy, cellSize, `${key}-s`)
        )
      ) : null}
    </g>
  );
}

// ─── Matrix renderer ──────────────────────────────────────────

function MatrixRenderer({ visual }: { visual: VisualMatrix }) {
  const cellSize = 56;
  const gap = 4;
  const padding = 8;
  const width = visual.cols * (cellSize + gap) - gap + padding * 2;
  const height = visual.rows * (cellSize + gap) - gap + padding * 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[220px] sm:max-w-[260px] mx-auto max-h-[28vh]" aria-label="Matrix pattern puzzle">
      {visual.cells.map((row, ri) =>
        row.map((cell, ci) => {
          const x = padding + ci * (cellSize + gap);
          const y = padding + ri * (cellSize + gap);
          const isMissing = visual.missingIndex
            ? visual.missingIndex[0] === ri && visual.missingIndex[1] === ci
            : false;
          return renderCell(cell, x, y, cellSize, `m-${ri}-${ci}`, isMissing);
        })
      )}
    </svg>
  );
}

// ─── Sequence renderer ────────────────────────────────────────

function SequenceRenderer({ visual }: { visual: VisualSequence }) {
  const cellSize = 52;
  const gap = 6;
  const padding = 8;
  const count = visual.items.length;
  const width = count * (cellSize + gap) - gap + padding * 2;
  const height = cellSize + padding * 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md mx-auto max-h-[22vh]" aria-label="Pattern sequence puzzle">
      {visual.items.map((item, i) => {
        const x = padding + i * (cellSize + gap);
        const y = padding;
        const isMissing = visual.missingIndex === i;

        // Arrow between items
        const arrow = i < count - 1 ? (
          <text
            key={`arrow-${i}`}
            x={x + cellSize + gap / 2}
            y={padding + cellSize / 2 + 5}
            textAnchor="middle"
            fontSize="14"
            fill="#d1d5db"
          >
            {"\u2192"}
          </text>
        ) : null;

        return (
          <g key={`seq-${i}`}>
            {renderCell(item, x, y, cellSize, `s-${i}`, isMissing)}
            {arrow}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Analogy renderer ─────────────────────────────────────────

function AnalogyRenderer({ visual }: { visual: VisualAnalogy }) {
  const cellSize = 56;
  const gap = 8;
  const padding = 8;
  const width = 4 * cellSize + 3 * gap + padding * 2 + 40; // extra for "is to" / "as"
  const height = cellSize + padding * 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-md mx-auto max-h-[22vh]" aria-label="Analogy puzzle">
      {/* A */}
      {renderCell(visual.a, padding, padding, cellSize, "a-cell")}
      {/* "is to" */}
      <text x={padding + cellSize + 10} y={padding + cellSize / 2 + 5} fontSize="13" fill="#9ca3af" fontWeight="600">is to</text>
      {/* B */}
      {renderCell(visual.b, padding + cellSize + gap + 40, padding, cellSize, "b-cell")}
      {/* "as" */}
      <text x={padding + 2 * cellSize + 2 * gap + 40 + 4} y={padding + cellSize / 2 + 5} fontSize="13" fill="#9ca3af" fontWeight="600">as</text>
      {/* C */}
      {renderCell(visual.c, padding + 2 * (cellSize + gap) + 80, padding, cellSize, "c-cell")}
      {/* "is to" */}
      <text x={padding + 3 * cellSize + 2 * gap + 80 + 10} y={padding + cellSize / 2 + 5} fontSize="13" fill="#9ca3af" fontWeight="600">is to</text>
      {/* ? */}
      {renderCell(null, padding + 3 * (cellSize + gap) + 120, padding, cellSize, "d-cell", true)}
    </svg>
  );
}

// ─── Option shape renderer (for visual answer options) ────────

export function VisualOption({ shape }: { shape: ShapeDef }) {
  const size = 44;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-8 h-8 sm:w-10 sm:h-10 inline-block" aria-label={`${shape.color} ${shape.shape}`}>
      {renderShape(shape, size / 2, size / 2, size, "opt")}
    </svg>
  );
}

// ─── Main renderer ────────────────────────────────────────────

export function VisualItemRenderer({ visual }: { visual: VisualContent }) {
  switch (visual.type) {
    case "matrix":
      return <MatrixRenderer visual={visual} />;
    case "sequence":
      return <SequenceRenderer visual={visual} />;
    case "analogy":
      return <AnalogyRenderer visual={visual} />;
    default:
      return null;
  }
}

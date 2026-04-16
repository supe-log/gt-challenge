import type { DemoItem } from "./items";
import type { VisualContent } from "@/components/visual-item-renderer";

/**
 * Visual items use SVG rendering instead of text descriptions.
 * The `visual` field contains structured data for the VisualItemRenderer.
 * The `content.stem` still exists as an accessible text fallback.
 * Answer options can have a `visual` field for shape-based answers.
 */

export interface VisualDemoItem extends DemoItem {
  visual?: VisualContent;
  visualOptions?: Array<{
    shape: string;
    color: string;
    size?: "sm" | "md" | "lg";
    fill?: "solid" | "striped" | "empty";
    rotation?: number;
    count?: number;
  }>;
}

// ─── K-2 Visual Items ──────────────────────────────────────────

export const K2_VISUAL_ITEMS: VisualDemoItem[] = [
  // Matrix: 2x2 with color pattern
  {
    id: "K2-v001",
    domain: "pattern",
    ageBand: "K-2",
    difficulty: -1.5,
    discrimination: 1.3,
    guessing: 0.25,
    content: {
      stem: "What shape goes in the empty box?",
      type: "matrix",
      options: [
        { text: "Red circle" },
        { text: "Blue circle" },
        { text: "Red square" },
        { text: "Blue square" },
      ],
      correct_index: 3,
    },
    visual: {
      type: "matrix",
      rows: 2,
      cols: 2,
      cells: [
        [
          { shape: "circle", color: "#ef4444", fill: "solid" },
          { shape: "square", color: "#ef4444", fill: "solid" },
        ],
        [
          { shape: "circle", color: "#3b82f6", fill: "solid" },
          null,
        ],
      ],
      missingIndex: [1, 1],
    },
    visualOptions: [
      { shape: "circle", color: "#ef4444", fill: "solid" },
      { shape: "circle", color: "#3b82f6", fill: "solid" },
      { shape: "square", color: "#ef4444", fill: "solid" },
      { shape: "square", color: "#3b82f6", fill: "solid" },
    ],
  },
  // Sequence: growing shapes
  {
    id: "K2-v002",
    domain: "pattern",
    ageBand: "K-2",
    difficulty: -2,
    discrimination: 1.1,
    guessing: 0.25,
    content: {
      stem: "What comes next in the pattern?",
      type: "sequence",
      options: [
        { text: "Small green circle" },
        { text: "Large green circle" },
        { text: "Small red circle" },
        { text: "Large red circle" },
      ],
      correct_index: 1,
    },
    visual: {
      type: "sequence",
      items: [
        { shape: "circle", color: "#22c55e", size: "sm", fill: "solid" },
        { shape: "circle", color: "#22c55e", size: "lg", fill: "solid" },
        { shape: "circle", color: "#22c55e", size: "sm", fill: "solid" },
        { shape: "circle", color: "#22c55e", size: "lg", fill: "solid" },
        { shape: "circle", color: "#22c55e", size: "sm", fill: "solid" },
        null,
      ],
      missingIndex: 5,
    },
    visualOptions: [
      { shape: "circle", color: "#22c55e", size: "sm", fill: "solid" },
      { shape: "circle", color: "#22c55e", size: "lg", fill: "solid" },
      { shape: "circle", color: "#ef4444", size: "sm", fill: "solid" },
      { shape: "circle", color: "#ef4444", size: "lg", fill: "solid" },
    ],
  },
  // Analogy: shape transformation
  {
    id: "K2-v003",
    domain: "reasoning",
    ageBand: "K-2",
    difficulty: -1,
    discrimination: 1.4,
    guessing: 0.25,
    content: {
      stem: "Circle is to square as triangle is to...?",
      type: "analogy",
      options: [
        { text: "Diamond" },
        { text: "Circle" },
        { text: "Triangle" },
        { text: "Star" },
      ],
      correct_index: 0,
    },
    visual: {
      type: "analogy",
      a: { shape: "circle", color: "#8b5cf6", fill: "solid" },
      b: { shape: "square", color: "#8b5cf6", fill: "solid" },
      c: { shape: "triangle", color: "#f59e0b", fill: "solid" },
    },
    visualOptions: [
      { shape: "diamond", color: "#f59e0b", fill: "solid" },
      { shape: "circle", color: "#f59e0b", fill: "solid" },
      { shape: "triangle", color: "#f59e0b", fill: "solid" },
      { shape: "star", color: "#f59e0b", fill: "solid" },
    ],
  },
  // Sequence: color alternation
  {
    id: "K2-v004",
    domain: "pattern",
    ageBand: "K-2",
    difficulty: -2.5,
    discrimination: 0.9,
    guessing: 0.25,
    content: {
      stem: "What color comes next?",
      type: "sequence",
      options: [
        { text: "Red star" },
        { text: "Blue star" },
        { text: "Green star" },
        { text: "Yellow star" },
      ],
      correct_index: 0,
    },
    visual: {
      type: "sequence",
      items: [
        { shape: "star", color: "#ef4444", fill: "solid" },
        { shape: "star", color: "#3b82f6", fill: "solid" },
        { shape: "star", color: "#ef4444", fill: "solid" },
        { shape: "star", color: "#3b82f6", fill: "solid" },
        null,
      ],
      missingIndex: 4,
    },
    visualOptions: [
      { shape: "star", color: "#ef4444", fill: "solid" },
      { shape: "star", color: "#3b82f6", fill: "solid" },
      { shape: "star", color: "#22c55e", fill: "solid" },
      { shape: "star", color: "#eab308", fill: "solid" },
    ],
  },
];

// ─── 3-5 Visual Items ──────────────────────────────────────────

export const ITEMS_35_VISUAL: VisualDemoItem[] = [
  // 3x3 Matrix: shape + color pattern
  {
    id: "35-v001",
    domain: "pattern",
    ageBand: "3-5",
    difficulty: 0.5,
    discrimination: 1.7,
    guessing: 0.25,
    content: {
      stem: "What goes in the empty cell?",
      type: "matrix",
      options: [
        { text: "Blue triangle" },
        { text: "Red triangle" },
        { text: "Blue circle" },
        { text: "Red circle" },
      ],
      correct_index: 0,
    },
    visual: {
      type: "matrix",
      rows: 3,
      cols: 3,
      cells: [
        [
          { shape: "circle", color: "#ef4444", fill: "solid" },
          { shape: "square", color: "#ef4444", fill: "solid" },
          { shape: "triangle", color: "#ef4444", fill: "solid" },
        ],
        [
          { shape: "circle", color: "#22c55e", fill: "solid" },
          { shape: "square", color: "#22c55e", fill: "solid" },
          { shape: "triangle", color: "#22c55e", fill: "solid" },
        ],
        [
          { shape: "circle", color: "#3b82f6", fill: "solid" },
          { shape: "square", color: "#3b82f6", fill: "solid" },
          null,
        ],
      ],
      missingIndex: [2, 2],
    },
    visualOptions: [
      { shape: "triangle", color: "#3b82f6", fill: "solid" },
      { shape: "triangle", color: "#ef4444", fill: "solid" },
      { shape: "circle", color: "#3b82f6", fill: "solid" },
      { shape: "circle", color: "#ef4444", fill: "solid" },
    ],
  },
  // 3x3 Matrix: fill pattern (solid, striped, empty)
  {
    id: "35-v002",
    domain: "pattern",
    ageBand: "3-5",
    difficulty: 1.0,
    discrimination: 1.8,
    guessing: 0.25,
    content: {
      stem: "Each row and column has one of each fill type. What goes in the empty cell?",
      type: "matrix",
      options: [
        { text: "Striped diamond" },
        { text: "Solid diamond" },
        { text: "Empty diamond" },
        { text: "Striped circle" },
      ],
      correct_index: 0,
    },
    visual: {
      type: "matrix",
      rows: 3,
      cols: 3,
      cells: [
        [
          { shape: "diamond", color: "#8b5cf6", fill: "solid" },
          { shape: "diamond", color: "#8b5cf6", fill: "striped" },
          { shape: "diamond", color: "#8b5cf6", fill: "empty" },
        ],
        [
          { shape: "diamond", color: "#8b5cf6", fill: "empty" },
          { shape: "diamond", color: "#8b5cf6", fill: "solid" },
          { shape: "diamond", color: "#8b5cf6", fill: "striped" },
        ],
        [
          { shape: "diamond", color: "#8b5cf6", fill: "striped" },
          null,
          { shape: "diamond", color: "#8b5cf6", fill: "solid" },
        ],
      ],
      missingIndex: [2, 1],
    },
    // Note: We don't need visualOptions here since text options work for fill types
  },
  // Sequence: rotation pattern
  {
    id: "35-v003",
    domain: "pattern",
    ageBand: "3-5",
    difficulty: 0.8,
    discrimination: 1.6,
    guessing: 0.25,
    content: {
      stem: "The arrow rotates 90 degrees each step. What comes next?",
      type: "sequence",
      options: [
        { text: "Arrow pointing left" },
        { text: "Arrow pointing up" },
        { text: "Arrow pointing right" },
        { text: "Arrow pointing down" },
      ],
      correct_index: 0,
    },
    visual: {
      type: "sequence",
      items: [
        { shape: "triangle", color: "#6366f1", fill: "solid", rotation: 0 },
        { shape: "triangle", color: "#6366f1", fill: "solid", rotation: 90 },
        { shape: "triangle", color: "#6366f1", fill: "solid", rotation: 180 },
        { shape: "triangle", color: "#6366f1", fill: "solid", rotation: 270 },
        { shape: "triangle", color: "#6366f1", fill: "solid", rotation: 0 },
        null,
      ],
      missingIndex: 5,
    },
    visualOptions: [
      { shape: "triangle", color: "#6366f1", fill: "solid", rotation: 90 },
      { shape: "triangle", color: "#6366f1", fill: "solid", rotation: 0 },
      { shape: "triangle", color: "#6366f1", fill: "solid", rotation: 270 },
      { shape: "triangle", color: "#6366f1", fill: "solid", rotation: 180 },
    ],
  },
  // Analogy: size transformation
  {
    id: "35-v004",
    domain: "reasoning",
    ageBand: "3-5",
    difficulty: 0.3,
    discrimination: 1.5,
    guessing: 0.25,
    content: {
      stem: "Small solid hexagon is to large solid hexagon, as small empty star is to...?",
      type: "analogy",
      options: [
        { text: "Large empty star" },
        { text: "Small solid star" },
        { text: "Large solid star" },
        { text: "Small empty hexagon" },
      ],
      correct_index: 0,
    },
    visual: {
      type: "analogy",
      a: { shape: "hexagon", color: "#0ea5e9", size: "sm", fill: "solid" },
      b: { shape: "hexagon", color: "#0ea5e9", size: "lg", fill: "solid" },
      c: { shape: "star", color: "#f97316", size: "sm", fill: "empty" },
    },
    visualOptions: [
      { shape: "star", color: "#f97316", size: "lg", fill: "empty" },
      { shape: "star", color: "#f97316", size: "sm", fill: "solid" },
      { shape: "star", color: "#f97316", size: "lg", fill: "solid" },
      { shape: "hexagon", color: "#0ea5e9", size: "sm", fill: "empty" },
    ],
  },
  // 3x3 Matrix: count pattern (1, 2, 3)
  {
    id: "35-v005",
    domain: "pattern",
    ageBand: "3-5",
    difficulty: 1.2,
    discrimination: 1.9,
    guessing: 0.25,
    content: {
      stem: "Each row increases by one shape. What fills the empty cell?",
      type: "matrix",
      options: [
        { text: "3 circles" },
        { text: "2 circles" },
        { text: "1 circle" },
        { text: "3 squares" },
      ],
      correct_index: 0,
    },
    visual: {
      type: "matrix",
      rows: 3,
      cols: 3,
      cells: [
        [
          { shape: "square", color: "#ef4444", count: 1, fill: "solid" },
          { shape: "square", color: "#ef4444", count: 2, fill: "solid" },
          { shape: "square", color: "#ef4444", count: 3, fill: "solid" },
        ],
        [
          { shape: "triangle", color: "#22c55e", count: 1, fill: "solid" },
          { shape: "triangle", color: "#22c55e", count: 2, fill: "solid" },
          { shape: "triangle", color: "#22c55e", count: 3, fill: "solid" },
        ],
        [
          { shape: "circle", color: "#3b82f6", count: 1, fill: "solid" },
          { shape: "circle", color: "#3b82f6", count: 2, fill: "solid" },
          null,
        ],
      ],
      missingIndex: [2, 2],
    },
    visualOptions: [
      { shape: "circle", color: "#3b82f6", count: 3, fill: "solid" },
      { shape: "circle", color: "#3b82f6", count: 2, fill: "solid" },
      { shape: "circle", color: "#3b82f6", count: 1, fill: "solid" },
      { shape: "square", color: "#ef4444", count: 3, fill: "solid" },
    ],
  },
];

// ─── 6-8 Visual Items ──────────────────────────────────────────

export const ITEMS_68_VISUAL: VisualDemoItem[] = [
  // Complex 3x3 matrix: shape + color + fill
  {
    id: "68-v001",
    domain: "pattern",
    ageBand: "6-8",
    difficulty: 1.5,
    discrimination: 2.0,
    guessing: 0.25,
    content: {
      stem: "Three rules govern this matrix: shape changes across columns, color changes across rows, and fill alternates. What completes it?",
      type: "matrix",
      options: [
        { text: "Empty blue pentagon" },
        { text: "Solid blue pentagon" },
        { text: "Striped blue hexagon" },
        { text: "Empty green pentagon" },
      ],
      correct_index: 0,
    },
    visual: {
      type: "matrix",
      rows: 3,
      cols: 3,
      cells: [
        [
          { shape: "circle", color: "#ef4444", fill: "solid" },
          { shape: "hexagon", color: "#ef4444", fill: "empty" },
          { shape: "pentagon", color: "#ef4444", fill: "solid" },
        ],
        [
          { shape: "circle", color: "#22c55e", fill: "empty" },
          { shape: "hexagon", color: "#22c55e", fill: "solid" },
          { shape: "pentagon", color: "#22c55e", fill: "empty" },
        ],
        [
          { shape: "circle", color: "#3b82f6", fill: "solid" },
          { shape: "hexagon", color: "#3b82f6", fill: "empty" },
          null,
        ],
      ],
      missingIndex: [2, 2],
    },
    visualOptions: [
      { shape: "pentagon", color: "#3b82f6", fill: "empty" },  // wrong description in text to test visual
      { shape: "pentagon", color: "#3b82f6", fill: "solid" },
      { shape: "hexagon", color: "#3b82f6", fill: "striped" },
      { shape: "pentagon", color: "#22c55e", fill: "empty" },
    ],
  },
  // Sequence: double transformation (shape morphs + color shifts)
  {
    id: "68-v002",
    domain: "pattern",
    ageBand: "6-8",
    difficulty: 2.0,
    discrimination: 1.9,
    guessing: 0.25,
    content: {
      stem: "Two rules: the number of sides increases by 1, and the color alternates. What comes next?",
      type: "sequence",
      options: [
        { text: "Orange hexagon" },
        { text: "Purple hexagon" },
        { text: "Orange pentagon" },
        { text: "Purple pentagon" },
      ],
      correct_index: 0,
    },
    visual: {
      type: "sequence",
      items: [
        { shape: "triangle", color: "#f97316", fill: "solid" },
        { shape: "square", color: "#8b5cf6", fill: "solid" },
        { shape: "pentagon", color: "#f97316", fill: "solid" },
        null,
      ],
      missingIndex: 3,
    },
    visualOptions: [
      { shape: "hexagon", color: "#8b5cf6", fill: "solid" },
      { shape: "hexagon", color: "#f97316", fill: "solid" },
      { shape: "pentagon", color: "#f97316", fill: "solid" },
      { shape: "pentagon", color: "#8b5cf6", fill: "solid" },
    ],
  },
  // Analogy: fill transformation
  {
    id: "68-v003",
    domain: "reasoning",
    ageBand: "6-8",
    difficulty: 1.0,
    discrimination: 1.7,
    guessing: 0.25,
    content: {
      stem: "Solid circle is to empty circle, as solid diamond is to...?",
      type: "analogy",
      options: [
        { text: "Empty diamond" },
        { text: "Striped diamond" },
        { text: "Solid square" },
        { text: "Empty circle" },
      ],
      correct_index: 0,
    },
    visual: {
      type: "analogy",
      a: { shape: "circle", color: "#6366f1", fill: "solid" },
      b: { shape: "circle", color: "#6366f1", fill: "empty" },
      c: { shape: "diamond", color: "#ec4899", fill: "solid" },
    },
    visualOptions: [
      { shape: "diamond", color: "#ec4899", fill: "empty" },
      { shape: "diamond", color: "#ec4899", fill: "striped" },
      { shape: "square", color: "#ec4899", fill: "solid" },
      { shape: "circle", color: "#6366f1", fill: "empty" },
    ],
  },
];

// ─── Combined by age band ──────────────────────────────────────

export const VISUAL_ITEMS: Record<string, VisualDemoItem[]> = {
  "K-2": K2_VISUAL_ITEMS,
  "3-5": ITEMS_35_VISUAL,
  "6-8": ITEMS_68_VISUAL,
};

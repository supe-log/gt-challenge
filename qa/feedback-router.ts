/**
 * qa/feedback-router.ts
 *
 * Routes evaluation deltas to the right micro-loop target.
 * Takes evaluation result JSON and classifies each delta into
 * categories: stem, distractors, irt_params, metadata.
 *
 * Can be used as a CLI tool or imported as a module.
 *
 * Usage (CLI):
 *   echo '{"score":65,"deltas":["Stem is ambiguous","Distractor C is implausible"]}' | npx tsx qa/feedback-router.ts
 *
 * Or with a file:
 *   EVAL_PATH=qa/scores/eval-result.json npx tsx qa/feedback-router.ts
 */

// ─── Types ──────────────────────────────────────────────────────

export interface EvaluationResult {
  item_id?: string;
  score: number;
  deltas: string[];
  details?: Record<string, unknown>;
}

export interface RoutedDelta {
  original: string;
  category: "stem" | "distractors" | "irt_params" | "metadata";
  target_fields: string[];
  priority: "high" | "medium" | "low";
}

export interface RoutingResult {
  item_id?: string;
  score: number;
  needs_revision: boolean;
  routed_deltas: RoutedDelta[];
  summary: {
    stem_issues: number;
    distractor_issues: number;
    irt_issues: number;
    metadata_issues: number;
  };
}

// ─── Classification rules ───────────────────────────────────────

const STEM_KEYWORDS = [
  "stem",
  "question",
  "prompt",
  "wording",
  "clarity",
  "ambiguous",
  "confusing",
  "unclear",
  "rewrite",
  "rephrase",
  "reading level",
  "too complex",
  "too simple",
  "age-appropriate",
  "vocabulary",
  "grammar",
  "typo",
  "language",
];

const DISTRACTOR_KEYWORDS = [
  "distractor",
  "option",
  "answer",
  "choice",
  "plausib",
  "implausib",
  "correct_index",
  "correct answer",
  "wrong answer",
  "misconception",
  "too easy",
  "too obvious",
  "give away",
  "guessing",
  "elimination",
  "option a",
  "option b",
  "option c",
  "option d",
];

const IRT_KEYWORDS = [
  "difficulty",
  "discrimination",
  "guessing",
  "irt",
  "b parameter",
  "a parameter",
  "c parameter",
  "calibrat",
  "theta",
  "too hard",
  "too easy",
  "difficulty level",
  "parameter",
];

const METADATA_KEYWORDS = [
  "metadata",
  "bloom",
  "dok",
  "cognitive load",
  "tag",
  "subdomain",
  "classification",
  "misconception_targeted",
  "explanation",
  "teach",
  "domain",
  "age_band",
  "category",
];

// ─── Route a single delta ───────────────────────────────────────

function classifyDelta(delta: string): RoutedDelta {
  const lower = delta.toLowerCase();

  // Score each category
  const scores = {
    stem: STEM_KEYWORDS.reduce(
      (acc, kw) => acc + (lower.includes(kw) ? 1 : 0),
      0
    ),
    distractors: DISTRACTOR_KEYWORDS.reduce(
      (acc, kw) => acc + (lower.includes(kw) ? 1 : 0),
      0
    ),
    irt_params: IRT_KEYWORDS.reduce(
      (acc, kw) => acc + (lower.includes(kw) ? 1 : 0),
      0
    ),
    metadata: METADATA_KEYWORDS.reduce(
      (acc, kw) => acc + (lower.includes(kw) ? 1 : 0),
      0
    ),
  };

  // Find the highest-scoring category
  const entries = Object.entries(scores) as [
    "stem" | "distractors" | "irt_params" | "metadata",
    number,
  ][];
  entries.sort((a, b) => b[1] - a[1]);

  // Default to stem if no keywords match (most common issue)
  const category = entries[0][1] > 0 ? entries[0][0] : "stem";

  // Map categories to target fields
  const targetFieldsMap: Record<string, string[]> = {
    stem: ["content.stem", "content.type"],
    distractors: [
      "content.options",
      "content.correct_index",
      "content.explanation",
    ],
    irt_params: ["difficulty", "discrimination", "guessing"],
    metadata: [
      "metadata.misconception_targeted",
      "metadata.bloom_level",
      "metadata.dok_level",
      "metadata.cognitive_load",
    ],
  };

  // Determine priority based on category
  const priorityMap: Record<string, "high" | "medium" | "low"> = {
    stem: "high",
    distractors: "high",
    irt_params: "medium",
    metadata: "low",
  };

  return {
    original: delta,
    category,
    target_fields: targetFieldsMap[category],
    priority: priorityMap[category],
  };
}

// ─── Route all deltas ───────────────────────────────────────────

export function routeDeltas(evalResult: EvaluationResult): RoutingResult {
  const routed = evalResult.deltas.map(classifyDelta);

  const summary = {
    stem_issues: routed.filter((d) => d.category === "stem").length,
    distractor_issues: routed.filter((d) => d.category === "distractors")
      .length,
    irt_issues: routed.filter((d) => d.category === "irt_params").length,
    metadata_issues: routed.filter((d) => d.category === "metadata").length,
  };

  return {
    item_id: evalResult.item_id,
    score: evalResult.score,
    needs_revision: evalResult.score < 85,
    routed_deltas: routed,
    summary,
  };
}

// ─── Convert routed deltas to edit instructions ─────────────────

export function routedDeltasToEditDeltas(routing: RoutingResult): string[] {
  // Sort by priority (high first) and return the original delta text
  const sorted = [...routing.routed_deltas].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return sorted.map((d) => d.original);
}

// ─── CLI mode ───────────────────────────────────────────────────

async function main() {
  let evalResult: EvaluationResult;

  const evalPath = process.env.EVAL_PATH;

  if (evalPath) {
    // Read from file
    const fs = await import("fs");
    const path = await import("path");
    const resolved = path.resolve(evalPath);
    const raw = fs.readFileSync(resolved, "utf-8");
    evalResult = JSON.parse(raw);
  } else {
    // Read from stdin
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    const input = Buffer.concat(chunks).toString("utf-8").trim();
    if (!input) {
      console.error(
        "ERROR: No input. Pipe evaluation JSON or set EVAL_PATH."
      );
      process.exit(1);
    }
    evalResult = JSON.parse(input);
  }

  if (!evalResult.deltas || !Array.isArray(evalResult.deltas)) {
    console.error(
      'ERROR: Evaluation result must have a "deltas" array.'
    );
    process.exit(1);
  }

  const routing = routeDeltas(evalResult);

  // Output as JSON
  console.log(JSON.stringify(routing, null, 2));
}

// Run CLI if executed directly
const isMain =
  typeof require !== "undefined" && require.main === module;
const isDirectRun = process.argv[1]?.endsWith("feedback-router.ts") ||
  process.argv[1]?.endsWith("feedback-router.js");

if (isMain || isDirectRun) {
  main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
}

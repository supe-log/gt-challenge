/**
 * evaluate-item.ts — Frozen Item Evaluator for GT Challenge QA
 *
 * Scores an assessment item on 8 quality dimensions using deterministic
 * pre-flight checks + LLM judge (OpenAI).
 *
 * This evaluator is FROZEN. Generators iterate against it; it does not change.
 * Following the Karpathy Loops / mw-autoqa pattern.
 *
 * Usage:
 *   ITEM_PATH=path/to/item.json npx tsx qa/evaluate-item.ts
 *   cat item.json | npx tsx qa/evaluate-item.ts
 *
 * Requires: OPENAI_API_KEY environment variable
 */

import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ItemOption {
  text: string;
  image?: string;
  audio?: string;
}

interface Item {
  id: string;
  domain: string;
  subdomain?: string;
  age_bands: string[];
  difficulty: number;
  discrimination: number;
  guessing: number;
  // Also accept nested irt for backwards compat
  irt?: {
    difficulty: number;
    discrimination: number;
    guessing: number;
  };
  content: {
    stem: string;
    type: string;
    options: ItemOption[];
    correct_index: number;
    explanation?: string;
    media?: string[];
  };
  metadata: {
    cognitive_skill?: string;
    misconception_targeted: string;
    bloom_level: string;
    dok_level?: number;
    cognitive_load?: string;
    distractor_rationale?: { option_index: number; misconception_id: string; reasoning: string }[];
    tags?: string[];
  };
  status?: string;
  qa_score?: number;
  created_at?: string;
}

// Normalize item: flatten nested irt to top-level if needed
function normalizeItem(raw: any): Item {
  const item = { ...raw };
  if (item.irt && typeof item.irt === "object") {
    if (item.difficulty === undefined) item.difficulty = item.difficulty;
    if (item.discrimination === undefined) item.discrimination = item.discrimination;
    if (item.guessing === undefined) item.guessing = item.guessing;
  }
  return item as Item;
}

interface DimensionResult {
  score: number;
  weighted: number;
  max: number;
  delta: string | null;
}

interface EvalOutput {
  item_id: string;
  composite_score: number;
  status: "keep" | "flagged" | "crash";
  critical_pass: boolean;
  dimensions: Record<string, DimensionResult>;
  revision_deltas: string[];
  raw_scores: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Load frozen schemas
// ---------------------------------------------------------------------------

const SCHEMAS_DIR = path.resolve(
  decodeURIComponent(path.dirname(new URL(import.meta.url).pathname)),
  "schemas"
);

function loadJson(filename: string): any {
  const filepath = path.join(SCHEMAS_DIR, filename);
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}

const ITEM_SCHEMA = loadJson("item-schema.json");
const DOMAIN_TAXONOMY = loadJson("domain-taxonomy.json");
const GRADE_SPECS = loadJson("grade-specs.json");
const MISCONCEPTION_LIB = loadJson("misconception-library.json");

// ---------------------------------------------------------------------------
// Dimension definitions
// ---------------------------------------------------------------------------

interface DimensionDef {
  key: string;
  max_points: number;
  critical: boolean;
  model: "gpt-4o-mini" | "gpt-4o";
  median_calls: number; // 1 for non-critical, 3 for critical
}

const DIMENSIONS: DimensionDef[] = [
  {
    key: "content_accuracy",
    max_points: 15,
    critical: true,
    model: "gpt-4o",
    median_calls: 3,
  },
  {
    key: "cognitive_depth",
    max_points: 20,
    critical: true,
    model: "gpt-4o",
    median_calls: 3,
  },
  {
    key: "distractor_quality",
    max_points: 20,
    critical: true,
    model: "gpt-4o",
    median_calls: 3,
  },
  {
    key: "age_appropriateness",
    max_points: 10,
    critical: false,
    model: "gpt-4o-mini",
    median_calls: 1,
  },
  {
    key: "stem_clarity",
    max_points: 10,
    critical: false,
    model: "gpt-4o-mini",
    median_calls: 1,
  },
  {
    key: "domain_alignment",
    max_points: 10,
    critical: false,
    model: "gpt-4o-mini",
    median_calls: 1,
  },
  {
    key: "bias_sensitivity",
    max_points: 10,
    critical: false,
    model: "gpt-4o-mini",
    median_calls: 1,
  },
  {
    key: "irt_parameter_validity",
    max_points: 5,
    critical: false,
    model: "gpt-4o-mini",
    median_calls: 1,
  },
];

// ---------------------------------------------------------------------------
// Pre-flight checks (deterministic, no LLM)
// ---------------------------------------------------------------------------

interface PreFlightResult {
  pass: boolean;
  errors: string[];
}

const PLACEHOLDER_PATTERNS = [
  /\bTODO\b/i,
  /\bTBD\b/i,
  /\bFIXME\b/i,
  /\[fill\s*in\]/i,
  /\[insert\b/i,
  /\[your\b/i,
  /\bplaceholder\b/i,
  /\bXXX\b/,
  /lorem\s+ipsum/i,
  /\.\.\.\s*$/,
];

function runPreFlightChecks(item: any): PreFlightResult {
  const errors: string[] = [];

  // --- Schema validation: required top-level fields ---
  const requiredTopLevel = [
    "id",
    "domain",
    "age_bands",
    "content",
    "metadata",
  ];
  for (const field of requiredTopLevel) {
    if (item[field] === undefined || item[field] === null) {
      errors.push(`Missing required top-level field: ${field}`);
    }
  }

  // --- Domain enum ---
  const validDomains = ["reasoning", "math", "verbal", "pattern_recognition"];
  if (item.domain && !validDomains.includes(item.domain)) {
    errors.push(
      `Invalid domain "${item.domain}". Must be one of: ${validDomains.join(", ")}`
    );
  }

  // --- Age bands ---
  const validBands = ["K-2", "3-5", "6-8"];
  if (Array.isArray(item.age_bands)) {
    if (item.age_bands.length === 0) {
      errors.push("age_bands array is empty");
    }
    for (const band of item.age_bands) {
      if (!validBands.includes(band)) {
        errors.push(
          `Invalid age band "${band}". Must be one of: ${validBands.join(", ")}`
        );
      }
    }
  } else if (item.age_bands !== undefined) {
    errors.push("age_bands must be an array");
  }

  // --- IRT parameters (flat or nested) ---
  const diff = item.difficulty ?? item.irt?.difficulty;
  const disc = item.discrimination ?? item.irt?.discrimination;
  const guess = item.guessing ?? item.irt?.guessing;
  if (typeof diff !== "number") {
    errors.push("difficulty must be a number");
  } else if (diff < -3 || diff > 3) {
    errors.push(`difficulty=${diff} out of bounds [-3, 3]`);
  }
  if (typeof disc !== "number") {
    errors.push("discrimination must be a number");
  } else if (disc < 0.5 || disc > 2.5) {
    errors.push(`discrimination=${disc} out of bounds [0.5, 2.5]`);
  }
  if (typeof guess !== "number") {
    errors.push("guessing must be a number");
  } else if (guess < 0.0 || guess > 0.35) {
    errors.push(`guessing=${guess} out of bounds [0.0, 0.35]`);
  }

  // --- Content fields ---
  if (item.content && typeof item.content === "object") {
    const requiredContent = [
      "stem",
      "type",
      "options",
      "correct_index",
    ];
    for (const field of requiredContent) {
      if (
        item.content[field] === undefined ||
        item.content[field] === null
      ) {
        errors.push(`Missing required content field: content.${field}`);
      }
    }

    // Options validation — gifted test requires minimum 4 options
    if (Array.isArray(item.content.options)) {
      if (item.content.options.length < 4) {
        errors.push(`content.options has only ${item.content.options.length} options — gifted assessment items require at least 4 options to reduce guessing probability`);
      }
      if (item.content.options.length > 6) {
        errors.push("content.options must have at most 6 options");
      }
      for (let i = 0; i < item.content.options.length; i++) {
        const opt = item.content.options[i];
        if (!opt || typeof opt.text !== "string" || opt.text.trim() === "") {
          errors.push(`content.options[${i}].text is missing or empty`);
        }
      }
    }

    // Answer key correctness: correct_index within bounds
    if (
      typeof item.content.correct_index === "number" &&
      Array.isArray(item.content.options)
    ) {
      if (
        item.content.correct_index < 0 ||
        item.content.correct_index >= item.content.options.length
      ) {
        errors.push(
          `content.correct_index=${item.content.correct_index} is out of bounds for ${item.content.options.length} options`
        );
      }
      if (!Number.isInteger(item.content.correct_index)) {
        errors.push("content.correct_index must be an integer");
      }
    }

    // Stem not empty
    if (
      typeof item.content.stem === "string" &&
      item.content.stem.trim() === ""
    ) {
      errors.push("content.stem is empty");
    }

    // Explanation not empty
    if (
      typeof item.content.explanation === "string" &&
      item.content.explanation.trim() === ""
    ) {
      errors.push("content.explanation is empty");
    }
  }

  // --- Metadata fields ---
  if (item.metadata && typeof item.metadata === "object") {
    const requiredMeta = [
      "misconception_targeted",
      "bloom_level",
    ];
    for (const field of requiredMeta) {
      if (
        item.metadata[field] === undefined ||
        item.metadata[field] === null
      ) {
        errors.push(`Missing required metadata field: metadata.${field}`);
      }
    }

    const validBlooms = [
      "remember",
      "understand",
      "apply",
      "analyze",
      "evaluate",
      "create",
    ];
    if (
      item.metadata.bloom_level &&
      !validBlooms.includes(item.metadata.bloom_level)
    ) {
      errors.push(
        `Invalid bloom_level "${item.metadata.bloom_level}". Must be one of: ${validBlooms.join(", ")}`
      );
    }

    // Gifted test gate: "remember" level items are too shallow for 3-5 and 6-8
    if (
      item.metadata.bloom_level === "remember" &&
      Array.isArray(item.age_bands) &&
      item.age_bands.some((b: string) => b === "3-5" || b === "6-8")
    ) {
      errors.push(
        `bloom_level "remember" is too shallow for a gifted assessment targeting ${item.age_bands.join(", ")}. Items must require at least "understand" level cognitive processing.`
      );
    }

    // Gifted test gate: "understand" level also too shallow for 6-8
    if (
      item.metadata.bloom_level === "understand" &&
      Array.isArray(item.age_bands) &&
      item.age_bands.some((b: string) => b === "6-8")
    ) {
      errors.push(
        `bloom_level "understand" is too shallow for 6-8 gifted assessment. Items must require at least "apply" level cognitive processing.`
      );
    }

    // Distractor rationale: at least 2 distractors must map to misconceptions
    if (item.metadata.distractor_rationale) {
      if (!Array.isArray(item.metadata.distractor_rationale)) {
        errors.push("metadata.distractor_rationale must be an array");
      } else if (item.metadata.distractor_rationale.length < 2) {
        errors.push(
          `metadata.distractor_rationale has only ${item.metadata.distractor_rationale.length} entries — at least 2 distractors must target documented misconceptions`
        );
      }
    } else {
      errors.push(
        "Missing metadata.distractor_rationale — each distractor must map to a specific misconception"
      );
    }

    if (typeof item.metadata.dok_level === "number") {
      if (item.metadata.dok_level < 1 || item.metadata.dok_level > 4) {
        errors.push(
          `metadata.dok_level=${item.metadata.dok_level} out of bounds [1, 4]`
        );
      }
    }

    const validLoads = ["low", "medium", "high"];
    if (
      item.metadata.cognitive_load &&
      !validLoads.includes(item.metadata.cognitive_load)
    ) {
      errors.push(
        `Invalid cognitive_load "${item.metadata.cognitive_load}". Must be one of: ${validLoads.join(", ")}`
      );
    }
  }

  // --- Placeholder text detection ---
  const textFields = [
    item.content?.stem,
    item.content?.explanation,
    ...(item.content?.options?.map((o: any) => o?.text) ?? []),
    item.metadata?.misconception_targeted,
  ].filter((t) => typeof t === "string");

  for (const text of textFields) {
    for (const pattern of PLACEHOLDER_PATTERNS) {
      if (pattern.test(text)) {
        errors.push(
          `Placeholder text detected: "${text.substring(0, 60)}..." matches pattern ${pattern}`
        );
        break; // one error per field is enough
      }
    }
  }

  return { pass: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Rubric prompts for each dimension
// ---------------------------------------------------------------------------

function buildRubricPrompt(
  dimension: string,
  item: Item,
  schemas: {
    taxonomy: any;
    gradeSpecs: any;
    misconceptions: any;
  }
): { system: string; user: string } {
  const itemJson = JSON.stringify(item, null, 2);
  const ageBand = item.age_bands[0]; // primary age band

  // grade-specs.json has bands at top level (e.g., gradeSpecs["K-2"])
  const bandSpec = schemas.gradeSpecs[ageBand] ?? {};

  // misconception-library.json has misconceptions as an array of { domain, age_band, misconceptions }
  const domainMisconceptions: any[] = Array.isArray(schemas.misconceptions.misconceptions)
    ? schemas.misconceptions.misconceptions
        .filter((m: any) => m.domain === item.domain && m.age_band === ageBand)
        .flatMap((m: any) => m.misconceptions ?? [])
    : [];

  // domain-taxonomy.json has domains keyed by domain name with a description field
  const domainTaxonomy = schemas.taxonomy.domains?.[item.domain] ?? {};

  const sharedContext = `
You are an expert psychometrician and assessment item reviewer for a gifted and talented identification test (GT Challenge). You are evaluating a single multiple-choice assessment item.

THE ITEM UNDER REVIEW:
${itemJson}

TARGET AGE BAND: ${ageBand} (${bandSpec?.grade_range ?? "unknown"})
DOMAIN: ${item.domain} (${domainTaxonomy.description ?? item.domain})
SUBDOMAIN: ${item.subdomain ?? "N/A"}
QUESTION TYPE: ${item.content.type}

CORRECT ANSWER: Option ${item.content.correct_index} = "${item.content.options[item.content.correct_index]?.text}"
EXPLANATION: ${item.content.explanation}

ALL OPTIONS:
${item.content.options.map((o, i) => `  [${i}]${i === item.content.correct_index ? " (CORRECT)" : ""} ${o.text}`).join("\n")}

IRT PARAMETERS: difficulty=${item.difficulty}, discrimination=${item.discrimination}, guessing=${item.guessing}
BLOOM LEVEL: ${item.metadata.bloom_level}
DOK LEVEL: ${item.metadata.dok_level ?? "N/A"}
COGNITIVE LOAD: ${item.metadata.cognitive_load ?? "N/A"}
MISCONCEPTION TARGETED: ${item.metadata.misconception_targeted}
`;

  const rubrics: Record<string, { system: string; user: string }> = {
    // =====================================================================
    // CONTENT ACCURACY (Critical, 20 pts)
    // =====================================================================
    content_accuracy: {
      system: `${sharedContext}

You are scoring CONTENT ACCURACY. This is a CRITICAL dimension — if this item fails, it cannot be used regardless of other scores.

RUBRIC — Score 0-4:

4 (Exemplary): The marked correct answer is definitively, unambiguously correct. Every distractor is definitively wrong and cannot be argued as correct by a subject-matter expert. The explanation accurately and completely justifies why the correct answer is right and why each distractor is wrong. No factual errors anywhere in the item. If the item involves computation, the computation is verified correct.

3 (Acceptable): The correct answer is correct. Distractors are wrong. However, there may be a minor issue: the explanation is slightly incomplete, or one distractor could be argued as partially correct in an edge case that a student in the target age band would not encounter. No factual errors.

2 (Needs revision): One of these is true: (a) a distractor has a legitimate claim to being correct that a thoughtful student could defend, (b) the correct answer has a subtle error or oversimplification that makes it not fully correct, (c) there is a factual error in the explanation, or (d) for computation items, the arithmetic or logic has an error.

1 (Seriously flawed): The correct answer is wrong, OR two or more distractors are arguably correct, OR there is a major factual error that would teach students incorrect information.

0 (Unusable): The item is fundamentally broken — correct answer is clearly wrong, question makes no sense, or content is nonsensical.

IMPORTANT: Actually verify the correct answer yourself. Do not trust the item's claim. For math items, recompute. For reasoning items, trace the logic. For verbal items, verify the relationship. Be rigorous.`,
      user: `Score this item on CONTENT ACCURACY (0-4).

Think step by step:
1. Is the marked correct answer actually correct? Verify independently.
2. Is each distractor definitely wrong? Could any be argued as correct?
3. Is the explanation accurate and complete?
4. Are there any factual errors anywhere in the item?

Respond in exactly this JSON format:
{
  "score": <0-4>,
  "reasoning": "<your step-by-step verification>",
  "delta": "<specific revision instruction if score < 4, otherwise null>"
}`,
    },

    // =====================================================================
    // AGE APPROPRIATENESS (Critical, 15 pts)
    // =====================================================================
    age_appropriateness: {
      system: `${sharedContext}

You are scoring AGE APPROPRIATENESS. This is a CRITICAL dimension.

GRADE-BAND SPECIFICATIONS FOR ${ageBand}:
- Vocabulary ceiling: ${JSON.stringify(bandSpec?.vocabulary_ceiling ?? "N/A")}
- Stem constraints: ${JSON.stringify(bandSpec?.stem_constraints ?? "N/A")}
- Max sentence length: ${bandSpec?.reading_level?.max_words_per_sentence ?? "N/A"} words
- Max word syllables: ${bandSpec?.reading_level?.max_syllables_per_word ?? "N/A"}
- Expected difficulty range: ${JSON.stringify(bandSpec?.irt_parameter_ranges?.difficulty ?? "N/A")}
- Option constraints: ${JSON.stringify(bandSpec?.option_constraints ?? "N/A")}
- Reading level: ${JSON.stringify(bandSpec?.reading_level ?? "N/A")}

RUBRIC — Score 0-4:

4 (Exemplary): Every word in the stem and options is within the age band's vocabulary ceiling. Sentence structure is appropriate. Concepts are within the band's concept ceiling. The cognitive demand matches the stated difficulty level. A gifted child in this age band would understand every word and concept without adult help. The item's difficulty parameter aligns with what is reasonable for this age band.

3 (Acceptable): The item is generally appropriate for the age band. There may be 1 word that is slightly above the vocabulary ceiling but is inferable from context, OR the sentence structure is slightly complex but manageable. A gifted child in this age band would likely still succeed if they know the tested concept.

2 (Needs revision): The item has 2-3 vocabulary or concept violations for the age band. Some words are clearly above the reading level. A typical gifted child in this age band would struggle with the language, not the concept being tested. The item is accidentally testing reading ability rather than the intended domain.

1 (Seriously inappropriate): The item is clearly written for a different age band. Multiple vocabulary violations. Concepts significantly above or below the band's ceiling. A gifted child in this age band would not understand the question.

0 (Unusable): The item is completely inappropriate — written for adults, contains mature content, or is absurdly below the age band (e.g., a K-2 item with a single-digit addition problem with no reasoning component).

IMPORTANT: For gifted assessment, items should challenge cognitive ability, not reading ability. A hard reasoning problem can use simple words. Score down if the difficulty comes from language rather than from the cognitive task.`,
      user: `Score this item on AGE APPROPRIATENESS (0-4) for the ${ageBand} age band.

Think step by step:
1. Check each word in the stem against the vocabulary ceiling. Flag any violations.
2. Count the stem length in words. Compare to the max.
3. Check if concepts are within the band's ceiling.
4. Check if the Bloom's level and DOK level are within the band's ceiling.
5. Does the stated IRT difficulty make sense for this age band and content?
6. Would difficulty come from the cognitive task or from the language?

Respond in exactly this JSON format:
{
  "score": <0-4>,
  "reasoning": "<your step-by-step analysis>",
  "delta": "<specific revision instruction if score < 4, otherwise null>"
}`,
    },

    // =====================================================================
    // DISTRACTOR QUALITY (20 pts, CRITICAL)
    // =====================================================================
    distractor_quality: {
      system: `${sharedContext}

You are scoring DISTRACTOR QUALITY.

KNOWN MISCONCEPTIONS FOR ${item.domain.toUpperCase()} (${ageBand}):
${domainMisconceptions
  .map((m: any) => `  - ${m.id}: ${m.description}${m.distractor_strategy ? ` | Strategy: ${m.distractor_strategy}` : ""}`)
  .join("\n")}

ITEM'S STATED TARGETED MISCONCEPTION: ${item.metadata.misconception_targeted}

RUBRIC — Score 0-4:

4 (Exemplary): Every distractor is plausible — a student with a specific misconception or incomplete understanding would genuinely choose it. Each distractor targets a different, identifiable misconception or error pattern. No distractor is obviously silly or trivially eliminatable. The correct answer does not stand out by format, length, or style. The stated misconception_targeted accurately describes what the distractors test.

3 (Acceptable): Most distractors are plausible and target real misconceptions. One distractor might be slightly weak (less plausible than others) but is not absurd. The correct answer does not stand out by superficial features.

2 (Needs revision): One or more distractors are implausible — a student with any reasonable understanding would immediately eliminate them. OR two distractors target the same misconception (redundant). OR the correct answer stands out by being longer, more qualified, or differently formatted than distractors.

1 (Seriously flawed): Most distractors are implausible. They appear to be random wrong answers rather than misconception-based. OR the correct answer is obviously distinguishable by format or style (e.g., it is the only option with a qualifier like "sometimes" or the only one with a specific number).

0 (Unusable): Distractors are nonsensical, or there is only one real distractor with the rest being filler.

KEY PRINCIPLES FOR GT ASSESSMENT DISTRACTORS:
- A gifted assessment item MUST have at least 4 options. Fewer than 4 is an automatic score of 0.
- Each distractor should represent a specific, nameable error in reasoning
- Distractors should be derived from known misconceptions, not random wrong answers
- The "best wrong answer" (most common misconception) should be among the distractors
- All options should be parallel in structure, length, and grammatical form
- No option should be eliminatable by test-taking strategy alone (e.g., "all of the above")
- Distractors must be challenging enough that a bright-but-not-gifted student would find them plausible
- If any distractor can be eliminated without domain knowledge (by process of elimination, format, or common sense), score 2 or below`,
      user: `Score this item on DISTRACTOR QUALITY (0-4).

Think step by step:
1. For each distractor, identify what misconception or error would lead a student to choose it.
2. Is each distractor genuinely plausible for the target age band?
3. Do the distractors target different misconceptions, or are they redundant?
4. Does the correct answer stand out by format, length, or style?
5. Does the stated misconception_targeted match what the distractors actually test?

Respond in exactly this JSON format:
{
  "score": <0-4>,
  "reasoning": "<your step-by-step analysis>",
  "delta": "<specific revision instruction if score < 4, otherwise null>"
}`,
    },

    // =====================================================================
    // STEM CLARITY (10 pts)
    // =====================================================================
    stem_clarity: {
      system: `${sharedContext}

You are scoring STEM CLARITY.

RUBRIC — Score 0-4:

4 (Exemplary): The stem is clear, concise, and unambiguous. It asks exactly one question. A student reading it knows immediately what they need to do. There is no unnecessary information (unless it serves as a reasoning challenge). Technical terms, if any, are used correctly. The stem is self-contained — a student does not need to read the options to understand what is being asked.

3 (Acceptable): The stem is clear and asks one question. There may be a minor wordiness issue or a slightly awkward phrasing that does not create ambiguity. A student would understand what is being asked without confusion.

2 (Needs revision): The stem has one of these issues: (a) it is ambiguous — a reasonable person could interpret the question two different ways, (b) it asks more than one question (double-barreled), (c) it contains unnecessary complexity that is not part of the cognitive challenge, (d) it uses negative phrasing ("which is NOT...") without strong justification, or (e) the stem cannot be understood without reading the options first.

1 (Seriously flawed): The stem is confusing, poorly written, or ambiguous in multiple ways. A student would waste time trying to understand the question rather than solving it.

0 (Unusable): The stem is incomprehensible, contradictory, or missing.

KEY PRINCIPLES:
- The stem should be answerable before looking at options (for well-prepared students)
- Avoid negative phrasing when possible; if used, bold/capitalize NOT
- One question per stem — no "and also" constructions
- Remove extraneous information unless it is a deliberate part of the reasoning challenge
- Use simple sentence structure even for complex concepts`,
      user: `Score this item on STEM CLARITY (0-4).

Think step by step:
1. Read the stem. Is there exactly one clear question being asked?
2. Could the stem be interpreted differently by two reasonable people?
3. Is the stem self-contained (answerable without seeing options)?
4. Is there unnecessary complexity or wordiness?
5. Does it use negative phrasing? If so, is it justified?

Respond in exactly this JSON format:
{
  "score": <0-4>,
  "reasoning": "<your step-by-step analysis>",
  "delta": "<specific revision instruction if score < 4, otherwise null>"
}`,
    },

    // =====================================================================
    // IRT PARAMETER VALIDITY (5 pts)
    // =====================================================================
    irt_parameter_validity: {
      system: `${sharedContext}

You are scoring IRT PARAMETER VALIDITY. You are checking whether the stated IRT parameters are plausible for the actual item content.

IRT 3PL MODEL PARAMETERS:
- difficulty (b): ${item.difficulty} — The ability level at which P(correct)=0.5 (after accounting for guessing). Range: -3 (very easy) to +3 (very hard). 0 = average difficulty.
- discrimination (a): ${item.discrimination} — How sharply the item differentiates between ability levels. Range: 0.5 (poor discrimination) to 2.5 (excellent discrimination). Typical good items: 0.8-1.5.
- guessing (c): ${item.guessing} — Lower asymptote / probability of correct answer by pure guessing. For k options, random guessing = 1/k. This item has ${item.content.options.length} options, so random guessing = ${(1 / item.content.options.length).toFixed(3)}.

EXPECTED IRT PARAMETER RANGES FOR ${ageBand}: ${JSON.stringify(bandSpec?.irt_parameter_ranges ?? "N/A")}

RUBRIC — Score 0-4:

4 (Exemplary): The difficulty parameter accurately reflects the actual cognitive demand of the item for the target age band. A gifted ${ageBand} student would experience this item at roughly the stated difficulty. The discrimination parameter is reasonable for the item type and distractor quality. The guessing parameter is close to 1/k (appropriate for the number of options). All parameters are internally consistent.

3 (Acceptable): Parameters are in the right ballpark. Difficulty might be off by ~0.5 from what the content suggests. Discrimination is reasonable. Guessing is within 0.05 of 1/k.

2 (Needs revision): One parameter is notably off: (a) difficulty is off by more than 1.0 from what the content suggests (e.g., an easy pattern completion is labeled as difficulty=2.0), (b) discrimination is implausibly high for items with weak distractors or implausibly low for well-constructed items, or (c) guessing parameter significantly deviates from 1/k without justification.

1 (Seriously flawed): Multiple parameters are implausible. The difficulty does not match the content at all (e.g., a simple recall question labeled as difficulty=2.5). Parameters appear to be randomly assigned.

0 (Unusable): Parameters are outside the valid range or internally contradictory.

NOTE: You are not recalibrating the item — that requires response data. You are checking face validity: do the stated parameters MAKE SENSE given the item content?`,
      user: `Score this item on IRT PARAMETER VALIDITY (0-4).

Think step by step:
1. Look at the actual content. How hard is this item really for a gifted ${ageBand} student?
2. Does the stated difficulty (${item.difficulty}) match your assessment?
3. Given the distractor quality, is the discrimination (${item.discrimination}) plausible?
4. With ${item.content.options.length} options, is the guessing parameter (${item.guessing}) reasonable? (1/${item.content.options.length} = ${(1 / item.content.options.length).toFixed(3)})
5. Is the difficulty within the expected range for ${ageBand}?

Respond in exactly this JSON format:
{
  "score": <0-4>,
  "reasoning": "<your step-by-step analysis>",
  "delta": "<specific revision instruction if score < 4, otherwise null>"
}`,
    },

    // =====================================================================
    // DOMAIN ALIGNMENT (10 pts)
    // =====================================================================
    domain_alignment: {
      system: `${sharedContext}

You are scoring DOMAIN ALIGNMENT.

DOMAIN TAXONOMY:
Domain: ${item.domain} — ${domainTaxonomy.description ?? ""}
Valid question types for this domain: ${JSON.stringify(schemas.taxonomy.domain_to_question_types?.[item.domain] ?? [])}
Cognitive skills tested: ${JSON.stringify(domainTaxonomy.cognitive_skills_tested ?? [])}

RUBRIC — Score 0-4:

4 (Exemplary): The item genuinely and primarily tests the stated domain and subdomain. The cognitive skill exercised matches the domain's cognitive skill list. The item could not be correctly answered using only general knowledge or a different domain's skills. The subdomain is specific and accurate.

3 (Acceptable): The item primarily tests the stated domain. The subdomain is reasonable, though a slightly more precise subdomain label might exist. The cognitive skill is within the domain's scope.

2 (Needs revision): The item partially tests the stated domain but also heavily relies on another domain (e.g., a "reasoning" item that is really a reading comprehension test, or a "math" item that is really a verbal word problem). OR the subdomain is misclassified (e.g., labeled "analogical_reasoning" but it is really "classification").

1 (Seriously flawed): The item is fundamentally misclassified. It tests a different domain than stated. A student strong in the stated domain but average in the actual domain would not benefit.

0 (Unusable): The item has no meaningful connection to the stated domain.

KEY INSIGHT: In gifted assessment, domain purity matters. An item labeled "math" that primarily tests reading comprehension will produce biased estimates of mathematical ability. Each item should test ONE primary domain.`,
      user: `Score this item on DOMAIN ALIGNMENT (0-4).

Think step by step:
1. What cognitive skill does this item actually exercise?
2. Does that skill belong to the stated domain (${item.domain})?
3. Is the domain (${item.domain}) the most accurate classification?
4. Could this item be solved using only general knowledge or a different domain?
5. Is the item primarily testing the stated domain, or is another domain dominant?

Respond in exactly this JSON format:
{
  "score": <0-4>,
  "reasoning": "<your step-by-step analysis>",
  "delta": "<specific revision instruction if score < 4, otherwise null>"
}`,
    },

    // =====================================================================
    // BIAS & SENSITIVITY (10 pts)
    // =====================================================================
    bias_sensitivity: {
      system: `${sharedContext}

You are scoring BIAS & SENSITIVITY.

This is a gifted and talented identification test. It will be taken by children ages ${bandSpec?.age_range ?? "5-14"} (${bandSpec?.grade_range ?? ageBand}) from diverse backgrounds. Bias in items directly causes inequitable identification of gifted students, which has profound consequences for children's educational trajectories.

RUBRIC — Score 0-4:

4 (Exemplary): The item is free from cultural, gender, racial, socioeconomic, and regional bias. Content does not assume specific cultural knowledge (holidays, sports, foods, customs specific to one culture). Names, if used, are diverse or neutral. The item does not rely on experiences only available to privileged socioeconomic groups (travel, expensive hobbies, technology). No stereotypes. No potentially traumatic content (violence, abuse, disaster, death, family conflict). Inclusive of students with disabilities where applicable.

3 (Acceptable): The item is largely bias-free. There may be a very minor cultural reference that is widely known across cultures, or a slight assumption about background knowledge that is part of standard curriculum. No stereotypes or sensitivity issues.

2 (Needs revision): The item contains one of these: (a) content that assumes specific cultural knowledge not shared across all US demographic groups, (b) a name or scenario that reinforces a stereotype, (c) content that assumes a specific socioeconomic background (e.g., references to skiing, international travel, musical instruments that require wealth), (d) gendered language that could create stereotype threat.

1 (Seriously biased): The item contains multiple bias indicators. Content is clearly culturally specific, reinforces stereotypes, or assumes privilege. A student from a different background would be disadvantaged not by ability but by life experience.

0 (Unusable): The item contains offensive content, overt stereotypes, traumatic material, or content that is clearly inappropriate for children.

IMPORTANT: Be thorough but not hypersensitive. The goal is to catch real bias that would disadvantage real children, not to flag every possible theoretical concern. A math problem about apples is not biased against children who have never seen an apple.`,
      user: `Score this item on BIAS & SENSITIVITY (0-4).

Think step by step:
1. Does the item assume specific cultural knowledge?
2. Are there names or scenarios that could reinforce stereotypes?
3. Does the item assume a specific socioeconomic background?
4. Is there gendered language or content that could create stereotype threat?
5. Is there any traumatic or sensitive content inappropriate for children?
6. Would a child from any US demographic group be disadvantaged by something other than the tested ability?

Respond in exactly this JSON format:
{
  "score": <0-4>,
  "reasoning": "<your step-by-step analysis>",
  "delta": "<specific revision instruction if score < 4, otherwise null>"
}`,
    },

    // =====================================================================
    // COGNITIVE DEPTH (20 pts, CRITICAL)
    // =====================================================================
    cognitive_depth: {
      system: `${sharedContext}

You are scoring COGNITIVE DEPTH.

This is a GIFTED AND TALENTED assessment. Items should test genuine cognitive ability — the kind of thinking that distinguishes gifted learners. Rote recall is insufficient.

ITEM'S STATED BLOOM LEVEL: ${item.metadata.bloom_level}
ITEM'S STATED DOK LEVEL: ${item.metadata.dok_level ?? "N/A"}

RUBRIC — Score 0-4:

4 (Exemplary): The item requires genuine higher-order thinking — analysis, evaluation, or creative problem-solving. It cannot be answered by memorization or simple recall. The cognitive demand is authentic (not artificially inflated by complex language). The item's actual Bloom's level and DOK match or exceed the stated levels. The item differentiates between students who truly understand the concept and those who have surface-level knowledge. This is the kind of item that makes gifted students light up with interest.

3 (Acceptable): The item requires meaningful thinking beyond recall. It involves application or analysis. The cognitive demand is real, though not exceptional. The stated Bloom's and DOK levels are accurate.

2 (Needs revision): The item claims a higher Bloom's/DOK level than it actually requires. What is labeled as "analyze" is really "remember" or "understand" in disguise. OR the item can be solved by a simple heuristic or test-taking strategy without understanding the concept.

1 (Seriously shallow): The item is pure recall or recognition. It tests whether a student has memorized a fact, not whether they can think. It is inappropriate for gifted assessment because it does not differentiate by cognitive ability.

0 (Unusable): The item has no cognitive demand — it is trivially obvious, tests no skill, or is answerable without any knowledge or reasoning.

KEY PRINCIPLE: For gifted assessment, the bar is higher than for general assessment. Items should not just test knowledge — they should test the ABILITY TO THINK with that knowledge. A gifted child should need to reason, not just remember.`,
      user: `Score this item on COGNITIVE DEPTH (0-4).

Think step by step:
1. What cognitive process does a student actually use to answer this item?
2. Could it be answered by pure memorization or simple recall?
3. Does it require analysis, evaluation, or creative problem-solving?
4. Does the actual cognitive demand match the stated Bloom's level (${item.metadata.bloom_level}) and DOK (${item.metadata.dok_level})?
5. Would this item differentiate gifted students from high-performing memorizers?

Respond in exactly this JSON format:
{
  "score": <0-4>,
  "reasoning": "<your step-by-step analysis>",
  "delta": "<specific revision instruction if score < 4, otherwise null>"
}`,
    },
  };

  return rubrics[dimension]!;
}

// ---------------------------------------------------------------------------
// OpenAI judge call
// ---------------------------------------------------------------------------

async function callJudge(
  openai: OpenAI,
  model: string,
  system: string,
  user: string
): Promise<{ score: number; reasoning: string; delta: string | null }> {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.3,
    max_tokens: 1024,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error(`Empty response from ${model}`);
  }

  const parsed = JSON.parse(content);

  // Validate score
  const score = Number(parsed.score);
  if (isNaN(score) || score < 0 || score > 4) {
    throw new Error(
      `Invalid score from judge: ${parsed.score}. Must be 0-4.`
    );
  }

  return {
    score: Math.round(score),
    reasoning: String(parsed.reasoning ?? ""),
    delta: parsed.delta === null || parsed.delta === "null"
      ? null
      : String(parsed.delta ?? ""),
  };
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

// ---------------------------------------------------------------------------
// Main evaluation pipeline
// ---------------------------------------------------------------------------

async function evaluateItem(item: Item): Promise<EvalOutput> {
  // --- Pre-flight checks ---
  const preflight = runPreFlightChecks(item);

  if (!preflight.pass) {
    // Return crash result — skip LLM entirely
    const dimensions: Record<string, DimensionResult> = {};
    const rawScores: Record<string, number> = {};

    for (const dim of DIMENSIONS) {
      dimensions[dim.key] = {
        score: 0,
        weighted: 0,
        max: dim.max_points,
        delta: `Pre-flight failure: ${preflight.errors.join("; ")}`,
      };
      rawScores[dim.key] = 0;
    }

    return {
      item_id: item.id ?? "unknown",
      composite_score: 0,
      status: "crash",
      critical_pass: false,
      dimensions,
      revision_deltas: preflight.errors.map((e) => `[PRE-FLIGHT] ${e}`),
      raw_scores: rawScores,
    };
  }

  // --- LLM judge scoring ---
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY environment variable is required for LLM evaluation"
    );
  }

  const openai = new OpenAI({ apiKey });

  const schemas = {
    taxonomy: DOMAIN_TAXONOMY,
    gradeSpecs: GRADE_SPECS,
    misconceptions: MISCONCEPTION_LIB,
  };

  const dimensions: Record<string, DimensionResult> = {};
  const rawScores: Record<string, number> = {};
  const revisionDeltas: string[] = [];

  // Process all dimensions in parallel
  const results = await Promise.all(
    DIMENSIONS.map(async (dim) => {
      const rubric = buildRubricPrompt(dim.key, item, schemas);

      if (dim.median_calls > 1) {
        // Critical dimensions: make multiple calls and take median
        const calls = await Promise.all(
          Array.from({ length: dim.median_calls }, () =>
            callJudge(openai, dim.model, rubric.system, rubric.user)
          )
        );

        const scores = calls.map((c) => c.score);
        const medianScore = median(scores);

        // Pick the reasoning from the call closest to the median score
        const bestCall =
          calls.find((c) => c.score === medianScore) ?? calls[0];

        return {
          dim,
          score: medianScore,
          reasoning: bestCall.reasoning,
          delta: bestCall.delta,
          allScores: scores,
        };
      } else {
        // Non-critical: single call
        const result = await callJudge(
          openai,
          dim.model,
          rubric.system,
          rubric.user
        );
        return {
          dim,
          score: result.score,
          reasoning: result.reasoning,
          delta: result.delta,
          allScores: [result.score],
        };
      }
    })
  );

  // Assemble results
  let totalWeighted = 0;
  const totalMax = DIMENSIONS.reduce((sum, d) => sum + d.max_points, 0); // 100

  for (const r of results) {
    const weighted = (r.score / 4) * r.dim.max_points;
    totalWeighted += weighted;

    dimensions[r.dim.key] = {
      score: r.score,
      weighted: Math.round(weighted * 100) / 100,
      max: r.dim.max_points,
      delta: r.delta,
    };

    rawScores[r.dim.key] = r.score;

    if (r.score < 4 && r.delta) {
      revisionDeltas.push(
        `[${r.dim.key}] ${r.delta}`
      );
    }
  }

  // Composite score (0-100)
  const compositeScore =
    Math.round((totalWeighted / totalMax) * 100 * 100) / 100;

  // Critical pass: both critical dimensions must score >= 3
  const criticalDims = DIMENSIONS.filter((d) => d.critical);
  const criticalPass = criticalDims.every(
    (d) => (rawScores[d.key] ?? 0) >= 3
  );

  // Status determination
  let status: "keep" | "flagged" | "crash";
  if (compositeScore >= 85 && criticalPass) {
    status = "keep";
  } else {
    status = "flagged";
  }

  return {
    item_id: item.id,
    composite_score: compositeScore,
    status,
    critical_pass: criticalPass,
    dimensions,
    revision_deltas: revisionDeltas,
    raw_scores: rawScores,
  };
}

// ---------------------------------------------------------------------------
// Input loading
// ---------------------------------------------------------------------------

async function loadItem(): Promise<Item> {
  const itemPath = process.env.ITEM_PATH;

  if (itemPath) {
    // Load from file
    const resolved = path.resolve(itemPath);
    const raw = fs.readFileSync(resolved, "utf-8");
    const parsed = JSON.parse(raw);
    // If file is an array and ITEM_INDEX is set, extract that item
    const itemIndex = process.env.ITEM_INDEX;
    if (Array.isArray(parsed) && itemIndex !== undefined) {
      const idx = parseInt(itemIndex, 10);
      if (idx < 0 || idx >= parsed.length) {
        throw new Error(`ITEM_INDEX=${idx} out of bounds for array of ${parsed.length} items`);
      }
      return parsed[idx];
    }
    // If array but no index, take first item
    if (Array.isArray(parsed)) {
      return parsed[0];
    }
    return parsed;
  }

  // Read from stdin
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new Error(`Failed to parse JSON from stdin: ${err}`));
      }
    });
    process.stdin.on("error", reject);

    // If stdin is a TTY (no pipe), give a hint and exit
    if (process.stdin.isTTY) {
      console.error(
        "Usage: ITEM_PATH=path/to/item.json npx tsx qa/evaluate-item.ts"
      );
      console.error("   or: cat item.json | npx tsx qa/evaluate-item.ts");
      process.exit(1);
    }
  });
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

async function main() {
  try {
    const item = normalizeItem(await loadItem());
    const result = await evaluateItem(item);
    console.log(JSON.stringify(result, null, 2));

    // Exit code: 0 for keep, 1 for flagged/crash
    process.exit(result.status === "keep" ? 0 : 1);
  } catch (err: any) {
    console.error(`[evaluate-item] Fatal error: ${err.message}`);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(2);
  }
}

main();

/**
 * qa/generate-items.ts
 *
 * Generates new IRT-calibrated assessment items using Claude API.
 *
 * Environment variables:
 *   DOMAIN            - reasoning | math | verbal | pattern_recognition
 *   AGE_BAND          - K-2 | 3-5 | 6-8
 *   COUNT             - Number of items to generate (default 10)
 *   DIFFICULTY_RANGE  - Comma-separated min,max (e.g. "-1,1")
 *   ANTHROPIC_API_KEY - Claude API key
 *
 * Usage:
 *   DOMAIN=reasoning AGE_BAND=3-5 COUNT=10 npx tsx qa/generate-items.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

// ─── Config ─────────────────────────────────────────────────────

const DOMAIN = process.env.DOMAIN;
const AGE_BAND = process.env.AGE_BAND;
const COUNT = parseInt(process.env.COUNT || "10", 10);
const DIFFICULTY_RANGE = process.env.DIFFICULTY_RANGE || null;

const VALID_DOMAINS = ["reasoning", "math", "verbal", "pattern_recognition"];
const VALID_AGE_BANDS = ["K-2", "3-5", "6-8"];

if (!DOMAIN || !VALID_DOMAINS.includes(DOMAIN)) {
  console.error(
    `ERROR: DOMAIN must be one of: ${VALID_DOMAINS.join(", ")}. Got: ${DOMAIN}`
  );
  process.exit(1);
}

if (!AGE_BAND || !VALID_AGE_BANDS.includes(AGE_BAND)) {
  console.error(
    `ERROR: AGE_BAND must be one of: ${VALID_AGE_BANDS.join(", ")}. Got: ${AGE_BAND}`
  );
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ERROR: ANTHROPIC_API_KEY environment variable is required.");
  process.exit(1);
}

// ─── Load schemas for context ───────────────────────────────────

const QA_DIR = path.resolve(__dirname);
const SCHEMAS_DIR = path.join(QA_DIR, "schemas");
const GENERATED_DIR = path.join(QA_DIR, "generated");

function loadJson(filePath: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    console.warn(`Warning: Could not load ${filePath}`);
    return null;
  }
}

const itemSchema = loadJson(path.join(SCHEMAS_DIR, "item-schema.json"));
const domainTaxonomy = loadJson(
  path.join(SCHEMAS_DIR, "domain-taxonomy.json")
) as Record<string, unknown> | null;
const gradeSpecs = loadJson(path.join(SCHEMAS_DIR, "grade-specs.json")) as Record<
  string,
  unknown
> | null;
const misconceptionLibrary = loadJson(
  path.join(SCHEMAS_DIR, "misconception-library.json")
) as Record<string, unknown> | null;

// ─── Load existing items to avoid duplicates ────────────────────

function loadExistingItems(): unknown[] {
  const items: unknown[] = [];
  if (!fs.existsSync(GENERATED_DIR)) return items;

  const files = fs.readdirSync(GENERATED_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    try {
      const data = JSON.parse(
        fs.readFileSync(path.join(GENERATED_DIR, file), "utf-8")
      );
      if (Array.isArray(data)) {
        items.push(...data);
      } else if (data && typeof data === "object") {
        items.push(data);
      }
    } catch {
      // Skip malformed files
    }
  }
  return items;
}

const existingItems = loadExistingItems();
const existingStems = existingItems
  .map((item: any) => item?.content?.stem || "")
  .filter(Boolean);

// ─── Build difficulty range ─────────────────────────────────────

let difficultyMin = -3.0;
let difficultyMax = 3.0;

if (DIFFICULTY_RANGE) {
  const parts = DIFFICULTY_RANGE.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    difficultyMin = parts[0];
    difficultyMax = parts[1];
  }
} else if (gradeSpecs) {
  // Use grade spec default range (handle both string "X to Y" and array [X, Y] formats)
  const gradeRoot = (gradeSpecs as any).age_bands || gradeSpecs;
  const spec = (gradeRoot as any)[AGE_BAND!];
  if (spec?.expected_difficulty_range) {
    const range = spec.expected_difficulty_range;
    if (Array.isArray(range) && range.length === 2) {
      difficultyMin = range[0];
      difficultyMax = range[1];
    }
  } else if (spec?.difficulty_range) {
    const match = spec.difficulty_range.match(/([-\d.]+)\s*to\s*([-\d.]+)/);
    if (match) {
      difficultyMin = parseFloat(match[1]);
      difficultyMax = parseFloat(match[2]);
    }
  }
}

// ─── Build the generation prompt ────────────────────────────────

function buildPrompt(): string {
  // Handle both flat and nested schema formats (schemas may have wrapper keys)
  const taxonomyRoot = domainTaxonomy && (domainTaxonomy as any).domains
    ? (domainTaxonomy as any).domains
    : domainTaxonomy;
  const domainInfo = taxonomyRoot
    ? (taxonomyRoot as any)[DOMAIN!]
    : { description: DOMAIN, question_types: [] };

  const gradeRoot = gradeSpecs && (gradeSpecs as any).age_bands
    ? (gradeSpecs as any).age_bands
    : gradeSpecs;
  const gradeInfo = gradeRoot ? (gradeRoot as any)[AGE_BAND!] : {};

  const misconceptionRoot = misconceptionLibrary && (misconceptionLibrary as any).misconceptions
    ? (misconceptionLibrary as any).misconceptions
    : misconceptionLibrary;
  const misconceptions = misconceptionRoot
    ? (misconceptionRoot as any)[DOMAIN!]
    : {};

  const existingStemSample =
    existingStems.length > 0
      ? existingStems.slice(0, 30).map((s: string) => `  - "${s}"`).join("\n")
      : "  (none yet)";

  // Map domain to ID initial: reasoning=r, math=m, verbal=v, pattern_recognition=p
  const domainInitialMap: Record<string, string> = {
    reasoning: "r", math: "m", verbal: "v", pattern_recognition: "p",
  };
  const domainInitial = domainInitialMap[DOMAIN!] || "r";

  // Map age band to band code: K-2=K2, 3-5=35, 6-8=68
  const bandCodeMap: Record<string, string> = {
    "K-2": "K2", "3-5": "35", "6-8": "68",
  };
  const bandCode = bandCodeMap[AGE_BAND!] || "35";

  // Compute next sequence number from existing items
  const existingIds = existingItems
    .map((item: any) => item?.id || "")
    .filter((id: string) => id.startsWith(`${bandCode}-${domainInitial}`));
  const existingSeqNums = existingIds
    .map((id: string) => {
      const match = id.match(new RegExp(`^${bandCode}-${domainInitial}(\\d{4})$`));
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n: number) => n > 0);
  const nextSeq = existingSeqNums.length > 0 ? Math.max(...existingSeqNums) + 1 : 1;

  return `You are an expert psychometrician and item writer for a gifted identification assessment (GT Challenge). Generate exactly ${COUNT} high-quality multiple-choice assessment items.

## Domain: ${DOMAIN}
${domainInfo?.description || ""}

### Question Types Available
${JSON.stringify(domainInfo?.subdomains || domainInfo?.question_types || [], null, 2)}

## Target Age Band: ${AGE_BAND}
${JSON.stringify(gradeInfo, null, 2)}

## Difficulty Range
Generate items with IRT difficulty (b) parameters spread across: ${difficultyMin} to ${difficultyMax}
- Spread items evenly across this range
- discrimination (a) should be between 0.8 and 2.0
- guessing (c) should be consistent with the number of options (1/num_options, within 0.02)

## Misconception Library for Distractor Design
Each distractor (wrong answer) should target a specific misconception. Here is the misconception library for this domain:
${JSON.stringify(misconceptions, null, 2)}

## CRITICAL REQUIREMENTS — GIFTED ASSESSMENT STANDARD
This is a GIFTED AND TALENTED cognitive assessment (like CogAT). Items must test genuine cognitive ability, not recall.

1. Every item MUST have exactly 4 options. No exceptions. (3 distractors + 1 correct)
2. Distractors must be HIGHLY plausible — a bright-but-not-gifted student should find them tempting. No obviously wrong answers.
3. Each distractor MUST target a specific, nameable misconception from the misconception library. Include distractor_rationale for EVERY distractor.
4. The correct answer must be unambiguously correct but not obviously so.
5. Stems must be age-appropriate per the grade specs.
6. Every item MUST include content.explanation explaining WHY the correct answer is correct (min 30 chars).
7. Every item MUST include metadata.misconception_targeted.
8. Every item MUST include metadata.cognitive_skill (the specific cognitive ability measured).
9. Bloom's level requirements by age band:
   - K-2: minimum "understand" (no "remember" items)
   - 3-5: minimum "apply" (prefer "analyze")
   - 6-8: minimum "apply" (strongly prefer "analyze" or "evaluate")
10. Items must test REASONING, not knowledge. A student should not be able to answer by memorization alone.
11. Vary question types across the available types for this domain.
12. For difficulty > 1.0, items should require multi-step reasoning or handling of ambiguity.
13. Items must NOT duplicate any of these existing stems:
${existingStemSample}

## ID Format
IDs must follow the pattern: {band_code}-{domain_initial}{4-digit-seq}
- Band codes: K2 (K-2), 35 (3-5), 68 (6-8)
- Domain initials: r=reasoning, m=math, v=verbal, p=pattern_recognition
- Start sequence numbering at ${nextSeq}
- Examples: ${bandCode}-${domainInitial}${String(nextSeq).padStart(4, "0")}, ${bandCode}-${domainInitial}${String(nextSeq + 1).padStart(4, "0")}

## Output Format
Return a JSON array of items. Each item must have these TOP-LEVEL fields (IRT params are NOT nested):
{
  "id": "${bandCode}-${domainInitial}NNNN",
  "domain": "${DOMAIN}",
  "age_bands": ["${AGE_BAND}"],
  "difficulty": <number -3 to 3>,
  "discrimination": <number 0.5 to 2.5>,
  "guessing": <number 0.1 to 0.35>,
  "content": {
    "stem": "...",
    "type": "...",
    "options": [{"text": "..."}, ...],
    "correct_index": <int>,
    "explanation": "..."
  },
  "metadata": {
    "cognitive_skill": "...",
    "misconception_targeted": "...",
    "bloom_level": "remember|understand|apply|analyze",
    "distractor_rationale": [
      {"option_index": N, "misconception_id": "...", "reasoning": "..."},
      ...
    ]
  }
}

Return ONLY the JSON array, no markdown code fences, no commentary.`;
}

// ─── Call Claude API ────────────────────────────────────────────

async function generateItems(): Promise<unknown[]> {
  const client = new Anthropic();

  const prompt = buildPrompt();

  console.log(`Generating ${COUNT} ${DOMAIN} items for age band ${AGE_BAND}...`);
  console.log(
    `Difficulty range: [${difficultyMin}, ${difficultyMax}]`
  );
  console.log(`Existing items in bank: ${existingItems.length}`);

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 16000,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  // Extract text content
  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  let responseText = textBlock.text.trim();

  // Strip markdown code fences if Claude included them despite instructions
  if (responseText.startsWith("```")) {
    responseText = responseText
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "");
  }

  const items = JSON.parse(responseText);

  if (!Array.isArray(items)) {
    throw new Error("Response is not a JSON array");
  }

  // Map domain to ID initial
  const domainInitialMap: Record<string, string> = {
    reasoning: "r", math: "m", verbal: "v", pattern_recognition: "p",
  };
  const domainInitial = domainInitialMap[DOMAIN!] || "r";
  const bandCodeMap: Record<string, string> = {
    "K-2": "K2", "3-5": "35", "6-8": "68",
  };
  const bandCode = bandCodeMap[AGE_BAND!] || "35";

  // Collect all used IDs to avoid duplicates
  const usedIds = new Set(
    existingItems.map((item: any) => item?.id || "").filter(Boolean)
  );

  // Post-process: ensure IDs follow schema pattern and are unique
  let seqCounter = 1;
  // Find max existing sequence for this band+domain
  for (const item of existingItems as any[]) {
    const match = item?.id?.match(new RegExp(`^${bandCode}-${domainInitial}(\\d{4})$`));
    if (match) {
      seqCounter = Math.max(seqCounter, parseInt(match[1], 10) + 1);
    }
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Validate or regenerate ID to match schema pattern
    const idPattern = new RegExp(`^(K2|35|68)-(r|m|v|p)\\d{4}$`);
    if (!item.id || !idPattern.test(item.id) || usedIds.has(item.id)) {
      item.id = `${bandCode}-${domainInitial}${String(seqCounter).padStart(4, "0")}`;
      seqCounter++;
    }
    usedIds.add(item.id);

    // Ensure domain and age_bands are correct
    item.domain = DOMAIN;
    if (!item.age_bands) {
      item.age_bands = [AGE_BAND];
    }

    // Flatten IRT params if Claude nested them under "irt"
    if (item.irt && typeof item.irt === "object") {
      if (item.irt.difficulty !== undefined) item.difficulty = item.irt.difficulty;
      if (item.irt.discrimination !== undefined) item.discrimination = item.irt.discrimination;
      if (item.irt.guessing !== undefined) item.guessing = item.irt.guessing;
      delete item.irt;
    }

    // Remove fields not in the frozen schema
    delete item.status;
    delete item.created_at;
    delete item.qa_score;
  }

  return items;
}

// ─── Main ───────────────────────────────────────────────────────

async function main() {
  try {
    const items = await generateItems();

    // Write output
    fs.mkdirSync(GENERATED_DIR, { recursive: true });
    const timestamp = Date.now();
    const outFile = path.join(
      GENERATED_DIR,
      `${DOMAIN}-${AGE_BAND?.toLowerCase().replace(/[^a-z0-9]/g, "")}-${timestamp}.json`
    );

    fs.writeFileSync(outFile, JSON.stringify(items, null, 2));

    console.log(`\nGenerated ${items.length} items.`);
    console.log(`Output: ${outFile}`);

    // Print summary
    const difficulties = items.map((i: any) => i.difficulty ?? 0);
    const types = items.map((i: any) => i.content?.type || "unknown");
    const uniqueTypes = [...new Set(types)];

    console.log(
      `Difficulty range: [${Math.min(...difficulties).toFixed(2)}, ${Math.max(...difficulties).toFixed(2)}]`
    );
    console.log(`Question types: ${uniqueTypes.join(", ")}`);
  } catch (error) {
    console.error("Failed to generate items:", error);
    process.exit(1);
  }
}

main();

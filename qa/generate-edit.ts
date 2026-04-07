/**
 * qa/generate-edit.ts
 *
 * Surgically edits a single assessment item based on revision deltas.
 * Only changes what the deltas specify; leaves everything else intact.
 *
 * Environment variables:
 *   ITEM_PATH         - Path to the item JSON file
 *   DELTAS            - JSON array of revision instructions
 *   ANTHROPIC_API_KEY - Claude API key
 *
 * Usage:
 *   ITEM_PATH=qa/generated/item.json DELTAS='["Fix stem clarity","Improve distractor B"]' npx tsx qa/generate-edit.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

// ─── Config ─────────────────────────────────────────────────────

const ITEM_PATH = process.env.ITEM_PATH;
const DELTAS_RAW = process.env.DELTAS;

if (!ITEM_PATH) {
  console.error("ERROR: ITEM_PATH environment variable is required.");
  process.exit(1);
}

if (!DELTAS_RAW) {
  console.error(
    'ERROR: DELTAS environment variable is required. Example: \'["Fix stem clarity","Improve distractor B"]\''
  );
  process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ERROR: ANTHROPIC_API_KEY environment variable is required.");
  process.exit(1);
}

let deltas: string[];
try {
  deltas = JSON.parse(DELTAS_RAW);
  if (!Array.isArray(deltas)) {
    throw new Error("DELTAS must be a JSON array");
  }
} catch (error) {
  console.error("ERROR: DELTAS must be a valid JSON array of strings.", error);
  process.exit(1);
}

// ─── Load the item ──────────────────────────────────────────────

const resolvedPath = path.resolve(ITEM_PATH);

if (!fs.existsSync(resolvedPath)) {
  console.error(`ERROR: Item file not found: ${resolvedPath}`);
  process.exit(1);
}

let itemData: unknown;
let isArray = false;
let itemIndex = -1;

try {
  const raw = JSON.parse(fs.readFileSync(resolvedPath, "utf-8"));

  // Support both single items and arrays of items
  if (Array.isArray(raw)) {
    isArray = true;
    // If ITEM_INDEX is set, edit that specific item; otherwise edit the first
    itemIndex = parseInt(process.env.ITEM_INDEX || "0", 10);
    if (itemIndex < 0 || itemIndex >= raw.length) {
      console.error(
        `ERROR: ITEM_INDEX ${itemIndex} is out of range. File has ${raw.length} items.`
      );
      process.exit(1);
    }
    itemData = raw[itemIndex];
  } else {
    itemData = raw;
  }
} catch (error) {
  console.error(`ERROR: Could not parse item file: ${resolvedPath}`, error);
  process.exit(1);
}

// ─── Load schemas for context ───────────────────────────────────

const QA_DIR = path.resolve(__dirname);
const SCHEMAS_DIR = path.join(QA_DIR, "schemas");

function loadJson(filePath: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

const itemSchema = loadJson(path.join(SCHEMAS_DIR, "item-schema.json"));

// ─── Build the edit prompt ──────────────────────────────────────

function buildEditPrompt(): string {
  const deltasFormatted = deltas
    .map((d, i) => `  ${i + 1}. ${d}`)
    .join("\n");

  return `You are an expert psychometrician performing a surgical edit on an assessment item.

## Current Item
${JSON.stringify(itemData, null, 2)}

## Revision Deltas (changes to apply)
${deltasFormatted}

## Instructions
1. Apply ONLY the specified deltas. Do not change anything else.
2. If a delta says to fix the stem, only change the stem.
3. If a delta says to improve a distractor, only change that specific option.
4. If a delta says to adjust IRT parameters, only change those parameters.
5. Maintain the exact same JSON structure and all unmentioned fields.
6. The edited item must still be valid per this schema:
${JSON.stringify(itemSchema, null, 2)}

## Output
Return ONLY the complete edited item as a JSON object. No markdown fences, no commentary.
Only change what the deltas specify. Everything else must remain byte-for-byte identical.`;
}

// ─── Call Claude API ────────────────────────────────────────────

async function editItem(): Promise<unknown> {
  const client = new Anthropic();

  const prompt = buildEditPrompt();

  console.log(`Editing item: ${(itemData as any)?.id || "unknown"}`);
  console.log(`Applying ${deltas.length} delta(s):`);
  deltas.forEach((d, i) => console.log(`  ${i + 1}. ${d}`));

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  let responseText = textBlock.text.trim();

  // Strip markdown code fences if present
  if (responseText.startsWith("```")) {
    responseText = responseText
      .replace(/^```(?:json)?\n?/, "")
      .replace(/\n?```$/, "");
  }

  const editedItem = JSON.parse(responseText);

  if (!editedItem || typeof editedItem !== "object") {
    throw new Error("Response is not a valid JSON object");
  }

  return editedItem;
}

// ─── Main ───────────────────────────────────────────────────────

async function main() {
  try {
    const editedItem = await editItem();

    // Write back to the same file
    if (isArray) {
      const raw = JSON.parse(fs.readFileSync(resolvedPath, "utf-8"));
      raw[itemIndex] = editedItem;
      fs.writeFileSync(resolvedPath, JSON.stringify(raw, null, 2));
    } else {
      fs.writeFileSync(resolvedPath, JSON.stringify(editedItem, null, 2));
    }

    console.log(`\nItem edited successfully.`);
    console.log(`Written to: ${resolvedPath}`);

    // Show what changed at a high level
    const original = itemData as any;
    const edited = editedItem as any;

    if (original.content?.stem !== edited.content?.stem) {
      console.log(`  Stem: changed`);
    }
    if (
      JSON.stringify(original.content?.options) !==
      JSON.stringify(edited.content?.options)
    ) {
      console.log(`  Options: changed`);
    }
    if (
      original.difficulty !== edited.difficulty ||
      original.discrimination !== edited.discrimination ||
      original.guessing !== edited.guessing
    ) {
      console.log(`  IRT params: changed`);
    }
    if (JSON.stringify(original.metadata) !== JSON.stringify(edited.metadata)) {
      console.log(`  Metadata: changed`);
    }
  } catch (error) {
    console.error("Failed to edit item:", error);
    process.exit(1);
  }
}

main();

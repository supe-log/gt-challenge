#!/usr/bin/env bash
#
# qa/run-micro-loops.sh — Orchestrates the full Karpathy micro-loop for item QA.
#
# Usage:
#   bash qa/run-micro-loops.sh [domain] [age_band] [count]
#
# Example:
#   bash qa/run-micro-loops.sh reasoning 3-5 10
#
# Steps:
#   1. Generate items via generate-items.ts
#   2. Evaluate each item via evaluate-item.ts
#   3. For items scoring < 85:
#      a. Route deltas via feedback-router.ts
#      b. Apply surgical edits via generate-edit.ts
#      c. Re-evaluate
#      d. Ratchet: if improved, keep; if worse, revert
#   4. Repeat up to MAX_ITERATIONS (default 3) per item
#   5. Log results to qa/results.tsv
#   6. Items scoring >= 85 get copied to qa/approved/

set -euo pipefail

# ─── Colors ──────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m' # No Color

# ─── Config ──────────────────────────────────────────────────────

DOMAIN="${1:-reasoning}"
AGE_BAND="${2:-3-5}"
COUNT="${3:-10}"
MAX_ITERATIONS="${MAX_ITERATIONS:-3}"
PASS_THRESHOLD="${PASS_THRESHOLD:-85}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
QA_DIR="$SCRIPT_DIR"
GENERATED_DIR="$QA_DIR/generated"
APPROVED_DIR="$QA_DIR/approved"
SCORES_DIR="$QA_DIR/scores"
RESULTS_TSV="$QA_DIR/results.tsv"

mkdir -p "$GENERATED_DIR" "$APPROVED_DIR" "$SCORES_DIR"

# Create results.tsv header if it doesn't exist
if [[ ! -f "$RESULTS_TSV" ]]; then
  printf 'timestamp\titem_id\tdomain\tage_band\titeration\tscore\tstatus\tdescription\n' > "$RESULTS_TSV"
fi

# ─── Helpers ─────────────────────────────────────────────────────

log_info() {
  echo -e "${BLUE}[INFO]${NC} $*"
}

log_success() {
  echo -e "${GREEN}[PASS]${NC} $*"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $*"
}

log_error() {
  echo -e "${RED}[FAIL]${NC} $*"
}

log_step() {
  echo -e "\n${BOLD}${CYAN}=== $* ===${NC}\n"
}

progress_bar() {
  local current=$1
  local total=$2
  local width=30
  local pct=$((current * 100 / total))
  local filled=$((current * width / total))
  local empty=$((width - filled))
  printf "\r  ${DIM}[${NC}"
  printf "%${filled}s" | tr ' ' '#'
  printf "%${empty}s" | tr ' ' '-'
  printf "${DIM}]${NC} %d/%d (%d%%)" "$current" "$total" "$pct"
}

log_result() {
  local item_id="$1"
  local domain="$2"
  local age_band="$3"
  local iteration="$4"
  local score="$5"
  local status="$6"
  local description="$7"
  local ts
  ts="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
    "$ts" "$item_id" "$domain" "$age_band" "$iteration" "$score" "$status" "$description" \
    >> "$RESULTS_TSV"
}

# ─── Check prerequisites ────────────────────────────────────────

if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
  log_error "ANTHROPIC_API_KEY is not set. Export it before running."
  exit 1
fi

# Check for npx/tsx
if ! command -v npx &> /dev/null; then
  log_error "npx is not installed. Install Node.js >= 20."
  exit 1
fi

# ─── Step 1: Generate Items ─────────────────────────────────────

log_step "Step 1: Generating $COUNT $DOMAIN items for $AGE_BAND"

cd "$REPO_DIR"

GENERATE_OUTPUT=$(DOMAIN="$DOMAIN" AGE_BAND="$AGE_BAND" COUNT="$COUNT" \
  npx tsx qa/generate-items.ts 2>&1) || {
  log_error "Item generation failed:"
  echo "$GENERATE_OUTPUT"
  exit 1
}

echo "$GENERATE_OUTPUT"

# Find the most recently generated file for this domain/band
BAND_SLUG=$(echo "$AGE_BAND" | tr -d '-' | tr '[:upper:]' '[:lower:]')
LATEST_FILE=$(ls -t "$GENERATED_DIR/${DOMAIN}-${BAND_SLUG}-"*.json 2>/dev/null | head -1)

if [[ -z "$LATEST_FILE" || ! -f "$LATEST_FILE" ]]; then
  log_error "No generated file found in $GENERATED_DIR"
  exit 1
fi

log_info "Generated file: $LATEST_FILE"

# Count items in the file
ITEM_COUNT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$LATEST_FILE','utf-8')).length)")
log_info "Items generated: $ITEM_COUNT"

# ─── Step 2-4: Evaluate and micro-loop each item ────────────────

log_step "Step 2-4: Evaluate + Micro-loop (max $MAX_ITERATIONS iterations, threshold $PASS_THRESHOLD)"

APPROVED_COUNT=0
FAILED_COUNT=0
IMPROVED_COUNT=0

for ((idx=0; idx<ITEM_COUNT; idx++)); do
  # Extract item ID
  ITEM_ID=$(node -e "
    const items = JSON.parse(require('fs').readFileSync('$LATEST_FILE','utf-8'));
    console.log(items[$idx]?.id || 'unknown-$idx');
  ")

  echo -e "\n${BOLD}--- Item $((idx+1))/$ITEM_COUNT: ${ITEM_ID} ---${NC}"

  BEST_SCORE=0
  CURRENT_ITERATION=0
  ITEM_STATUS="pending"

  # Save original for ratchet revert
  BACKUP_FILE=$(mktemp)
  node -e "
    const items = JSON.parse(require('fs').readFileSync('$LATEST_FILE','utf-8'));
    require('fs').writeFileSync('$BACKUP_FILE', JSON.stringify(items[$idx], null, 2));
  "

  for ((iter=1; iter<=MAX_ITERATIONS; iter++)); do
    CURRENT_ITERATION=$iter
    echo -e "  ${DIM}Iteration $iter/$MAX_ITERATIONS${NC}"

    # ── Evaluate ──
    # Check if evaluate-item.ts exists
    if [[ -f "$QA_DIR/evaluate-item.ts" ]]; then
      EVAL_OUTPUT=$(ITEM_PATH="$LATEST_FILE" ITEM_INDEX="$idx" \
        npx tsx qa/evaluate-item.ts 2>&1) || {
        log_warn "  Evaluation failed for $ITEM_ID, skipping"
        EVAL_OUTPUT='{"score":0,"deltas":["Evaluation failed"]}'
      }
    else
      # Fallback: simulate evaluation if evaluate-item.ts doesn't exist yet
      log_warn "  evaluate-item.ts not found, using placeholder scoring"
      EVAL_OUTPUT=$(node -e "
        const item = JSON.parse(require('fs').readFileSync('$LATEST_FILE','utf-8'))[$idx];
        let score = 50;
        const deltas = [];

        // Basic heuristic scoring
        if (item.content?.stem && item.content.stem.length > 10) score += 10;
        if (item.content?.explanation && item.content.explanation.length > 20) score += 10;
        if (item.content?.options && item.content.options.length >= 3) score += 5;
        if (item.metadata?.misconception_targeted) score += 10;
        if (item.metadata?.cognitive_skill) score += 5;
        if (item.metadata?.bloom_level) score += 5;
        if (item.metadata?.distractor_rationale) score += 5;
        if (typeof item.difficulty === 'number') score += 5;
        if (typeof item.discrimination === 'number') score += 5;

        // Check for issues
        if (!item.content?.explanation || item.content.explanation.length < 20)
          deltas.push('Explanation is too short or missing');
        if (!item.metadata?.misconception_targeted)
          deltas.push('Missing misconception_targeted in metadata');
        if (!item.metadata?.distractor_rationale)
          deltas.push('Missing distractor_rationale in metadata');
        if (item.content?.options && item.content.options.length < 3)
          deltas.push('Too few options');

        score = Math.min(score, 100);
        console.log(JSON.stringify({ item_id: item.id, score, deltas }));
      ")
    fi

    # Parse score from evaluation output (extract full JSON object)
    # The evaluator outputs pretty-printed JSON to stdout; extract it
    EVAL_JSON=$(echo "$EVAL_OUTPUT" | node -e "
      let buf=''; process.stdin.on('data',d=>buf+=d);
      process.stdin.on('end',()=>{
        // Find the first { and last } to extract JSON
        const start = buf.indexOf('{');
        const end = buf.lastIndexOf('}');
        if (start >= 0 && end > start) {
          try { const obj = JSON.parse(buf.slice(start, end+1)); console.log(JSON.stringify(obj)); }
          catch(e) { console.log('{\"composite_score\":0,\"revision_deltas\":[\"JSON parse error\"]}'); }
        } else {
          console.log('{\"composite_score\":0,\"revision_deltas\":[\"No JSON in output\"]}');
        }
      });
    ")
    if [[ -z "$EVAL_JSON" ]]; then
      EVAL_JSON='{"composite_score":0,"revision_deltas":["Could not parse evaluation output"]}'
    fi

    SCORE=$(echo "$EVAL_JSON" | node -e "
      let buf=''; process.stdin.on('data',d=>buf+=d);
      process.stdin.on('end',()=>{ try{const d=JSON.parse(buf);console.log(d.composite_score||d.score||0)}catch(e){console.log(0)} });
    ")
    SCORE=${SCORE:-0}

    DELTA_COUNT=$(echo "$EVAL_JSON" | node -e "
      let buf=''; process.stdin.on('data',d=>buf+=d);
      process.stdin.on('end',()=>{ try{const d=JSON.parse(buf);console.log((d.revision_deltas||d.deltas||[]).length)}catch(e){console.log(0)} });
    ")

    echo -e "  Score: ${BOLD}${SCORE}${NC}/100  (${DELTA_COUNT} deltas)"

    # ── Ratchet check (use bc for float comparison) ──
    # Truncate floats to integers for bash arithmetic
    SCORE_INT=$(echo "$SCORE" | awk '{printf "%d", $1}')
    BEST_INT=$(echo "$BEST_SCORE" | awk '{printf "%d", $1}')
    if (( iter > 1 )); then
      if (( SCORE_INT > BEST_INT )); then
        log_success "  Improved: $BEST_SCORE -> $SCORE"
        IMPROVED_COUNT=$((IMPROVED_COUNT + 1))
        # Save new best as backup
        node -e "
          const items = JSON.parse(require('fs').readFileSync('$LATEST_FILE','utf-8'));
          require('fs').writeFileSync('$BACKUP_FILE', JSON.stringify(items[$idx], null, 2));
        "
      elif (( SCORE_INT < BEST_INT )); then
        log_warn "  Regression: $BEST_SCORE -> $SCORE. Reverting."
        # Revert to backup
        node -e "
          const items = JSON.parse(require('fs').readFileSync('$LATEST_FILE','utf-8'));
          items[$idx] = JSON.parse(require('fs').readFileSync('$BACKUP_FILE','utf-8'));
          require('fs').writeFileSync('$LATEST_FILE', JSON.stringify(items, null, 2));
        "
        SCORE=$BEST_SCORE
      else
        echo -e "  ${DIM}No change in score${NC}"
      fi
    fi

    if (( SCORE_INT > BEST_INT )); then BEST_SCORE=$SCORE; fi

    # ── Check if passed ──
    BEST_INT=$(echo "$BEST_SCORE" | awk '{printf "%d", $1}')
    if (( BEST_INT >= PASS_THRESHOLD )); then
      ITEM_STATUS="approved"
      log_success "  PASSED (score $BEST_SCORE >= $PASS_THRESHOLD)"
      break
    fi

    # ── If last iteration, don't try to fix ──
    if (( iter >= MAX_ITERATIONS )); then
      ITEM_STATUS="failed"
      log_warn "  Max iterations reached. Final score: $BEST_SCORE"
      break
    fi

    # ── Route deltas and apply edits ──
    echo -e "  ${DIM}Routing deltas and applying edits...${NC}"

    # Route deltas
    ROUTING=$(echo "$EVAL_JSON" | npx tsx qa/feedback-router.ts 2>/dev/null) || {
      log_warn "  Delta routing failed, using raw deltas"
      ROUTING="$EVAL_JSON"
    }

    # Extract edit deltas
    EDIT_DELTAS=$(echo "$EVAL_JSON" | node -e "
      let buf=''; process.stdin.on('data',d=>buf+=d);
      process.stdin.on('end',()=>{
        try { const d=JSON.parse(buf); console.log(JSON.stringify(d.revision_deltas || d.deltas || [])); }
        catch(e) { console.log('[]'); }
      });
    ")

    if [[ "$EDIT_DELTAS" == "[]" ]]; then
      echo -e "  ${DIM}No deltas to apply${NC}"
      break
    fi

    # Apply surgical edit
    ITEM_PATH="$LATEST_FILE" ITEM_INDEX="$idx" DELTAS="$EDIT_DELTAS" \
      npx tsx qa/generate-edit.ts 2>&1 | while read -r line; do
        echo -e "  ${DIM}$line${NC}"
      done || {
        log_warn "  Edit failed, continuing with current version"
      }
  done

  # ── Log result ──
  log_result "$ITEM_ID" "$DOMAIN" "$AGE_BAND" "$CURRENT_ITERATION" "$BEST_SCORE" "$ITEM_STATUS" "$DOMAIN item $AGE_BAND"

  if [[ "$ITEM_STATUS" == "approved" ]]; then
    APPROVED_COUNT=$((APPROVED_COUNT + 1))
  else
    FAILED_COUNT=$((FAILED_COUNT + 1))
  fi

  # Clean up backup
  rm -f "$BACKUP_FILE"
done

# ─── Step 5: Copy approved items ────────────────────────────────

log_step "Step 5: Copying approved items to qa/approved/"

node -e "
  const fs = require('fs');
  const path = require('path');
  const items = JSON.parse(fs.readFileSync('$LATEST_FILE', 'utf-8'));
  const resultsLines = fs.readFileSync('$RESULTS_TSV', 'utf-8').trim().split('\n');

  let approvedCount = 0;
  for (const item of items) {
    // Check if this item was approved in the results
    const approved = resultsLines.some(line => {
      const cols = line.split('\t');
      return cols[1] === item.id && cols[6] === 'approved';
    });

    if (approved) {
      const outPath = path.join('$APPROVED_DIR', item.id + '.json');
      fs.writeFileSync(outPath, JSON.stringify(item, null, 2));
      approvedCount++;
    }
  }
  console.log('Approved items written: ' + approvedCount);
"

# ─── Summary ─────────────────────────────────────────────────────

log_step "Summary"
echo -e "  Domain:       ${BOLD}$DOMAIN${NC}"
echo -e "  Age Band:     ${BOLD}$AGE_BAND${NC}"
echo -e "  Generated:    ${BOLD}$ITEM_COUNT${NC}"
echo -e "  Approved:     ${GREEN}${BOLD}$APPROVED_COUNT${NC}"
echo -e "  Failed:       ${RED}${BOLD}$FAILED_COUNT${NC}"
echo -e "  Improvements: ${YELLOW}${BOLD}$IMPROVED_COUNT${NC}"
echo -e "  Results:      $RESULTS_TSV"
echo -e "  Approved dir: $APPROVED_DIR"
echo ""

if (( APPROVED_COUNT == 0 )); then
  log_warn "No items passed. Consider lowering PASS_THRESHOLD or increasing MAX_ITERATIONS."
  exit 1
fi

log_success "Done. $APPROVED_COUNT/$ITEM_COUNT items approved."

#!/usr/bin/env bash
#
# qa/run-pipeline.sh — Runs micro-loops for ALL domains and age bands.
#
# Generates and evaluates items across all 12 combinations (4 domains x 3 age bands).
# Logs summary to stdout.
#
# Usage:
#   bash qa/run-pipeline.sh
#
# Environment variables:
#   COUNT             - Items per domain/band combination (default 10)
#   MAX_ITERATIONS    - Max micro-loop iterations per item (default 3)
#   PASS_THRESHOLD    - Score threshold for approval (default 85)
#   ANTHROPIC_API_KEY - Required

set -euo pipefail

# ─── Colors ──────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ─── Config ──────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COUNT="${COUNT:-10}"
MAX_ITERATIONS="${MAX_ITERATIONS:-3}"
PASS_THRESHOLD="${PASS_THRESHOLD:-85}"

DOMAINS=("reasoning" "math" "verbal" "pattern_recognition")
AGE_BANDS=("K-2" "3-5" "6-8")

# ─── Preflight ───────────────────────────────────────────────────

if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
  echo -e "${RED}[ERROR]${NC} ANTHROPIC_API_KEY is not set."
  exit 1
fi

TOTAL_COMBOS=$(( ${#DOMAINS[@]} * ${#AGE_BANDS[@]} ))
COMBO_NUM=0
TOTAL_APPROVED=0
TOTAL_FAILED=0
TOTAL_GENERATED=0

START_TIME=$(date +%s)

echo -e "\n${BOLD}${MAGENTA}============================================${NC}"
echo -e "${BOLD}${MAGENTA}  GT Challenge QA Pipeline${NC}"
echo -e "${BOLD}${MAGENTA}============================================${NC}"
echo -e ""
echo -e "  Domains:        ${BOLD}${#DOMAINS[@]}${NC} (${DOMAINS[*]})"
echo -e "  Age Bands:      ${BOLD}${#AGE_BANDS[@]}${NC} (${AGE_BANDS[*]})"
echo -e "  Combinations:   ${BOLD}$TOTAL_COMBOS${NC}"
echo -e "  Items/combo:    ${BOLD}$COUNT${NC}"
echo -e "  Total items:    ${BOLD}$((TOTAL_COMBOS * COUNT))${NC}"
echo -e "  Max iterations: ${BOLD}$MAX_ITERATIONS${NC}"
echo -e "  Pass threshold: ${BOLD}$PASS_THRESHOLD${NC}"
echo -e ""

# Track results per combo
declare -A COMBO_RESULTS

# ─── Run each combination ────────────────────────────────────────

for domain in "${DOMAINS[@]}"; do
  for age_band in "${AGE_BANDS[@]}"; do
    COMBO_NUM=$((COMBO_NUM + 1))

    echo -e "\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${CYAN}  [$COMBO_NUM/$TOTAL_COMBOS] $domain / $age_band${NC}"
    echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    COMBO_START=$(date +%s)

    # Run micro-loops for this combination
    if bash "$SCRIPT_DIR/run-micro-loops.sh" "$domain" "$age_band" "$COUNT" 2>&1; then
      COMBO_STATUS="success"
    else
      COMBO_STATUS="partial"
      echo -e "${YELLOW}[WARN]${NC} Some items may not have passed for $domain/$age_band"
    fi

    COMBO_END=$(date +%s)
    COMBO_DURATION=$((COMBO_END - COMBO_START))

    # Count approved items for this combo
    APPROVED_DIR="$SCRIPT_DIR/approved"
    BAND_SLUG=$(echo "$age_band" | tr -d '-' | tr '[:upper:]' '[:lower:]')

    # Map domain to initial for ID pattern matching
    case "$domain" in
      reasoning) DOM_INIT="r" ;;
      math) DOM_INIT="m" ;;
      verbal) DOM_INIT="v" ;;
      pattern_recognition) DOM_INIT="p" ;;
      *) DOM_INIT="x" ;;
    esac

    # Map age band to band code
    case "$age_band" in
      K-2) BAND_CODE="K2" ;;
      3-5) BAND_CODE="35" ;;
      6-8) BAND_CODE="68" ;;
      *) BAND_CODE="XX" ;;
    esac

    COMBO_APPROVED=$(ls "$APPROVED_DIR/${BAND_CODE}-${DOM_INIT}"*.json 2>/dev/null | wc -l | tr -d ' ')
    COMBO_APPROVED=${COMBO_APPROVED:-0}

    TOTAL_APPROVED=$((TOTAL_APPROVED + COMBO_APPROVED))
    TOTAL_GENERATED=$((TOTAL_GENERATED + COUNT))

    COMBO_RESULTS["$domain/$age_band"]="approved=$COMBO_APPROVED time=${COMBO_DURATION}s"

    echo -e "\n  ${DIM}$domain/$age_band: $COMBO_APPROVED approved in ${COMBO_DURATION}s${NC}"
  done
done

# ─── Final Summary ───────────────────────────────────────────────

END_TIME=$(date +%s)
TOTAL_DURATION=$((END_TIME - START_TIME))
TOTAL_MINUTES=$((TOTAL_DURATION / 60))
TOTAL_SECONDS=$((TOTAL_DURATION % 60))
TOTAL_FAILED=$((TOTAL_GENERATED - TOTAL_APPROVED))

echo -e "\n\n${BOLD}${MAGENTA}============================================${NC}"
echo -e "${BOLD}${MAGENTA}  Pipeline Complete${NC}"
echo -e "${BOLD}${MAGENTA}============================================${NC}"
echo -e ""
echo -e "  ${BOLD}Results by combination:${NC}"
echo -e ""

printf "  %-30s %s\n" "DOMAIN / AGE BAND" "RESULT"
printf "  %-30s %s\n" "------------------------------" "--------------------"

for domain in "${DOMAINS[@]}"; do
  for age_band in "${AGE_BANDS[@]}"; do
    key="$domain/$age_band"
    result="${COMBO_RESULTS[$key]:-unknown}"
    printf "  %-30s %s\n" "$key" "$result"
  done
done

echo -e ""
echo -e "  ${BOLD}Totals:${NC}"
echo -e "    Generated:   ${BOLD}$TOTAL_GENERATED${NC}"
echo -e "    Approved:    ${GREEN}${BOLD}$TOTAL_APPROVED${NC}"
echo -e "    Failed:      ${RED}${BOLD}$TOTAL_FAILED${NC}"
echo -e "    Pass rate:   ${BOLD}$(( TOTAL_APPROVED * 100 / (TOTAL_GENERATED > 0 ? TOTAL_GENERATED : 1) ))%${NC}"
echo -e "    Duration:    ${BOLD}${TOTAL_MINUTES}m ${TOTAL_SECONDS}s${NC}"
echo -e ""
echo -e "  Results TSV:   $SCRIPT_DIR/results.tsv"
echo -e "  Approved dir:  $SCRIPT_DIR/approved/"
echo -e ""

if (( TOTAL_APPROVED == 0 )); then
  echo -e "${RED}${BOLD}  WARNING: No items approved across any combination.${NC}"
  echo -e "${RED}  Check ANTHROPIC_API_KEY and review qa/results.tsv for details.${NC}"
  exit 1
fi

echo -e "${GREEN}${BOLD}  Pipeline complete. $TOTAL_APPROVED items ready for seeding.${NC}"
echo -e "${DIM}  Run: npx tsx qa/seed-approved.ts${NC}"

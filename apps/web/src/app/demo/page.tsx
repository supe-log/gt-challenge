"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_ITEMS, DEMO_ITEMS, type DemoItem } from "./items";
import { VISUAL_ITEMS, type VisualDemoItem } from "./visual-items";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { VisualItemRenderer, VisualOption } from "@/components/visual-item-renderer";
import { TeachItem } from "@/components/teach-item";
import { useSpeech } from "@/hooks/use-speech";
import { SpeakButton } from "@/components/speak-button";
import { thetaToPercentile, getPercentileLabel } from "@/lib/norms";
import { PercentileBadge } from "@/components/percentile-badge";

// ─── IRT Math ───────────────────────────────────────────────

function probability3PL(theta: number, a: number, b: number, c: number): number {
  const exp = Math.exp(Math.min(Math.max(-a * (theta - b), -700), 700));
  return c + (1 - c) / (1 + exp);
}

function fisherInfo(theta: number, a: number, b: number, c: number): number {
  const P = probability3PL(theta, a, b, c);
  if (P <= c || P >= 1) return 0;
  return (a * a * (P - c) * (P - c) * (1 - P)) / ((1 - c) * (1 - c) * P);
}

function normalPDF(x: number, mean: number, sd: number): number {
  const z = (x - mean) / sd;
  return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
}

interface Resp { itemId: string; isCorrect: boolean }

function estimateTheta(responses: Resp[], items: Map<string, DemoItem>, priorMean: number): number {
  if (responses.length === 0) return priorMean;
  let num = 0, den = 0;
  for (let q = -4; q <= 4; q += 0.1) {
    const theta = Math.round(q * 100) / 100;
    let logL = Math.log(normalPDF(theta, priorMean, 1));
    for (const r of responses) {
      const it = items.get(r.itemId);
      if (!it) continue;
      const p = probability3PL(theta, it.discrimination, it.difficulty, it.guessing);
      logL += r.isCorrect ? Math.log(Math.max(p, 1e-10)) : Math.log(Math.max(1 - p, 1e-10));
    }
    const w = Math.exp(logL);
    num += theta * w;
    den += w;
  }
  return den === 0 ? priorMean : num / den;
}

function computeSE(theta: number, usedItems: DemoItem[]): number {
  let total = 0;
  for (const it of usedItems) total += fisherInfo(theta, it.discrimination, it.difficulty, it.guessing);
  return total <= 0 ? Infinity : 1 / Math.sqrt(total);
}

function selectNext(theta: number, remaining: DemoItem[], lastDomains: string[]): DemoItem | null {
  if (remaining.length === 0) return null;

  // Count domain proportions so far
  const domainCounts: Record<string, number> = {};
  for (const d of lastDomains) domainCounts[d] = (domainCounts[d] || 0) + 1;
  const totalSoFar = lastDomains.length || 1;

  // Score all items
  const scored: { item: DemoItem; score: number }[] = [];
  for (const it of remaining) {
    let score = fisherInfo(theta, it.discrimination, it.difficulty, it.guessing);

    // Consecutive same-domain penalty
    let consecutive = 0;
    for (let i = lastDomains.length - 1; i >= 0; i--) {
      if (lastDomains[i] === it.domain) consecutive++; else break;
    }
    if (consecutive >= 3) score *= 0.05;
    else if (consecutive >= 2) score *= 0.3;

    // Proportion-based domain balance: hard cap at 30%, soft penalty at 25%
    const proportion = (domainCounts[it.domain] || 0) / totalSoFar;
    if (proportion > 0.30) score *= 0.05;
    else if (proportion > 0.25) score *= 0.4;

    scored.push({ item: it, score });
  }

  // Weighted random from top 3 (avoids identical sequences for all students)
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, Math.min(3, scored.length));
  const totalScore = top.reduce((s, t) => s + Math.max(t.score, 0.001), 0);
  let r = Math.random() * totalScore;
  for (const t of top) {
    r -= Math.max(t.score, 0.001);
    if (r <= 0) return t.item;
  }
  return top[0].item;
}

// ─── Domain visuals ─────────────────────────────────────────

const DOMAIN_CONFIG: Record<string, { emoji: string; label: string; color: string; bg: string; border: string }> = {
  reasoning: { emoji: "🧩", label: "Reasoning", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  math:      { emoji: "🔢", label: "Math",      color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  verbal:    { emoji: "📖", label: "Verbal",    color: "text-emerald-700",bg: "bg-emerald-50",border: "border-emerald-200" },
  pattern:   { emoji: "🔷", label: "Patterns",  color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
};

const OPTION_COLORS = [
  { bg: "bg-rose-50 hover:bg-rose-100", border: "border-rose-200 hover:border-rose-400", selected: "bg-rose-200 border-rose-500", letter: "bg-rose-200 text-rose-700" },
  { bg: "bg-sky-50 hover:bg-sky-100", border: "border-sky-200 hover:border-sky-400", selected: "bg-sky-200 border-sky-500", letter: "bg-sky-200 text-sky-700" },
  { bg: "bg-amber-50 hover:bg-amber-100", border: "border-amber-200 hover:border-amber-400", selected: "bg-amber-200 border-amber-500", letter: "bg-amber-200 text-amber-700" },
  { bg: "bg-emerald-50 hover:bg-emerald-100", border: "border-emerald-200 hover:border-emerald-400", selected: "bg-emerald-200 border-emerald-500", letter: "bg-emerald-200 text-emerald-700" },
  { bg: "bg-violet-50 hover:bg-violet-100", border: "border-violet-200 hover:border-violet-400", selected: "bg-violet-200 border-violet-500", letter: "bg-violet-200 text-violet-700" },
  { bg: "bg-orange-50 hover:bg-orange-100", border: "border-orange-200 hover:border-orange-400", selected: "bg-orange-200 border-orange-500", letter: "bg-orange-200 text-orange-700" },
];

// Mountain levels for visual progress
const MOUNTAIN_LEVELS = ["🏖️", "🌿", "🌲", "⛰️", "🏔️", "🗻", "☁️", "✨", "🌟", "🚀"];

// ─── Component ──────────────────────────────────────────────

type Phase = "welcome" | "playing" | "complete";

export default function DemoPage() {
  const itemMap = useRef(new Map(DEMO_ITEMS.map((it) => [it.id, it])));
  const [phase, setPhase] = useState<Phase>("welcome");
  const [ageBand, setAgeBand] = useState<string | null>(null);
  const [responses, setResponses] = useState<Resp[]>([]);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [lastDomains, setLastDomains] = useState<string[]>([]);
  const [theta, setTheta] = useState(0);
  const [currentItem, setCurrentItem] = useState<DemoItem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [itemsCorrect, setItemsCorrect] = useState(0);
  const [highestDifficulty, setHighestDifficulty] = useState(-3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showingTeach, setShowingTeach] = useState(false);
  const [hoveredOptionText, setHoveredOptionText] = useState("");

  // ─── TTS ──────────────────────────────────────────────────
  const isK2 = ageBand === "K-2";
  const stemText = currentItem?.content.stem ?? "";

  // Stem speech: auto-speak for K-2, manual for others
  const {
    speak: speakStem,
    stop: stopStem,
    isSpeaking: isSpeakingStem,
    isSupported: ttsSupported,
  } = useSpeech(stemText, {
    autoSpeak: isK2 && phase === "playing",
    rate: isK2 ? 0.8 : 1.0,
    pitch: isK2 ? 1.1 : 1.0,
  });

  // Option hover speech (K-2 only)
  const { speak: speakOption } = useSpeech(hoveredOptionText, {
    rate: 0.85,
    pitch: 1.1,
  });

  // Speak hovered option text for K-2
  const handleOptionHover = useCallback(
    (text: string) => {
      if (!isK2 || !ttsSupported) return;
      setHoveredOptionText(text);
      // The hook auto-speaks on text change isn't used here;
      // we trigger manually after state settles
    },
    [isK2, ttsSupported]
  );

  // Trigger option speech when hoveredOptionText changes (K-2 only)
  useEffect(() => {
    if (isK2 && hoveredOptionText) {
      speakOption();
    }
  }, [isK2, hoveredOptionText, speakOption]);

  const bandItems = ageBand
    ? [...(ALL_ITEMS[ageBand] ?? DEMO_ITEMS), ...(VISUAL_ITEMS[ageBand] ?? [])]
    : DEMO_ITEMS;
  const currentLevel = Math.max(0, Math.min(9, Math.floor(((theta + 3) / 6) * 10)));
  const totalItems = Math.min(bandItems.length, 40);

  function startChallenge(band: string) {
    setAgeBand(band);
    setPhase("playing");
    // Merge text items with visual items for a richer experience
    const textItems = ALL_ITEMS[band] ?? DEMO_ITEMS;
    const visItems = VISUAL_ITEMS[band] ?? [];
    const items: DemoItem[] = [...textItems, ...visItems];
    itemMap.current = new Map(items.map((it) => [it.id, it]));
    const first = selectNext(0, items, []);
    if (first) {
      setCurrentItem(first);
      setUsedIds(new Set([first.id]));
      setLastDomains([first.domain]);
      setShowingTeach(!!first.teachContent);
    }
  }

  const handleAnswer = useCallback((index: number) => {
    if (transitioning || !currentItem) return;

    const isCorrect = index === currentItem.content.correct_index;
    setSelectedAnswer(index);
    setTransitioning(true);

    const newResponses = [...responses, { itemId: currentItem.id, isCorrect }];
    const newCorrect = itemsCorrect + (isCorrect ? 1 : 0);
    const newStreak = isCorrect ? streak + 1 : 0;
    const newMaxStreak = Math.max(maxStreak, newStreak);
    const newHighest = isCorrect && currentItem.difficulty > highestDifficulty
      ? currentItem.difficulty : highestDifficulty;
    const newTheta = estimateTheta(newResponses, itemMap.current, 0);
    const usedItems = newResponses.map((r) => itemMap.current.get(r.itemId)!);
    const se = computeSE(newTheta, usedItems);

    setResponses(newResponses);
    setItemsCorrect(newCorrect);
    setHighestDifficulty(newHighest);
    setTheta(newTheta);
    setStreak(newStreak);
    setMaxStreak(newMaxStreak);

    const count = newResponses.length;
    const remaining = bandItems.filter((it) => !usedIds.has(it.id) && it.id !== currentItem.id);
    const shouldStop = (count >= 20 && se <= 0.25) || count >= 40 || remaining.length === 0;

    // Quick transition — no feedback text, just slide to next
    setTimeout(() => {
      if (shouldStop) {
        setPhase("complete");
      } else {
        const newUsed = new Set(usedIds);
        newUsed.add(currentItem.id);
        const newDomains = [...lastDomains, currentItem.domain];
        const next = selectNext(newTheta, remaining, newDomains);
        setUsedIds(newUsed);
        setLastDomains(newDomains);
        setCurrentItem(next);
        setSelectedAnswer(null);
        setTransitioning(false);
        setShowingTeach(!!next?.teachContent);
      }
    }, 400);
  }, [transitioning, currentItem, responses, itemsCorrect, highestDifficulty, usedIds, lastDomains, streak, maxStreak]);

  const restart = () => {
    setPhase("welcome");
    setAgeBand(null);
    setResponses([]);
    setUsedIds(new Set());
    setLastDomains([]);
    setTheta(0);
    setSelectedAnswer(null);
    setTransitioning(false);
    setItemsCorrect(0);
    setHighestDifficulty(-3);
    setStreak(0);
    setMaxStreak(0);
    setShowingTeach(false);
    setCurrentItem(null);
  };

  // ─── Welcome Screen ────────────────────────────────────────

  if (phase === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg space-y-8"
        >
          <div className="text-7xl">🚀</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            GT Challenge
          </h1>
          <p className="text-lg text-gray-600">
            Ready to see how far you can climb? Pick your level to start!
          </p>

          <div className="grid gap-4">
            {[
              { band: "K-2", ages: "Ages 5–7", emoji: "🌱", color: "from-green-400 to-emerald-500" },
              { band: "3-5", ages: "Ages 8–10", emoji: "🌟", color: "from-blue-400 to-indigo-500" },
              { band: "6-8", ages: "Ages 11–14", emoji: "🔥", color: "from-purple-400 to-pink-500" },
            ].map(({ band, ages, emoji, color }) => (
              <button
                key={band}
                onClick={() => startChallenge(band)}
                className={`group relative overflow-hidden rounded-2xl p-6 text-left text-white bg-gradient-to-r ${color} shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{emoji}</span>
                  <div>
                    <p className="text-2xl font-bold">Grades {band}</p>
                    <p className="text-white/80">{ages}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Complete Screen ───────────────────────────────────────

  if (phase === "complete") {
    const level = Math.max(1, Math.min(10, Math.round(((highestDifficulty + 3) / 6) * 9 + 1)));
    const accuracy = responses.length > 0 ? Math.round((itemsCorrect / responses.length) * 100) : 0;
    const thetaLabel = theta >= 1.5 ? "Exceptional" : theta >= 0.75 ? "Very High" : theta >= 0 ? "High" : theta >= -0.75 ? "Average" : "Developing";
    const thetaEmoji = theta >= 1.5 ? "🚀" : theta >= 0.75 ? "🌟" : theta >= 0 ? "⭐" : theta >= -0.75 ? "💪" : "🌱";
    const demoPercentile = thetaToPercentile(theta);

    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="max-w-md w-full space-y-6"
        >
          <div className="text-center space-y-2">
            <motion.div
              className="text-7xl"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              🏆
            </motion.div>
            <h1 className="text-3xl font-extrabold">Challenge Complete!</h1>
            <p className="text-gray-500">You made it to level {level}!</p>
          </div>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-5xl">{thetaEmoji}</span>
              <div className="text-right">
                <p className="text-sm text-gray-500">Your Level</p>
                <p className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {thetaLabel}
                </p>
              </div>
            </div>

            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(8, ((theta + 3) / 6) * 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>

            {/* Percentile comparison */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
              <PercentileBadge theta={theta} size="sm" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-800">
                  You&apos;re in the {getPercentileLabel(demoPercentile)} of peers your age!
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Higher than {demoPercentile}% of age-band peers
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Questions", value: responses.length, emoji: "📝" },
              { label: "Accuracy", value: `${accuracy}%`, emoji: "🎯" },
              { label: "Best Streak", value: maxStreak, emoji: "🔥" },
              { label: "Peak Level", value: level, emoji: MOUNTAIN_LEVELS[Math.min(level - 1, 9)] },
            ].map(({ label, value, emoji }) => (
              <Card key={label} className="p-4 text-center">
                <div className="text-2xl mb-1">{emoji}</div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </Card>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <a
              href="/signup"
              className="flex items-center justify-center w-full h-14 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all"
            >
              Track Progress Across Sessions
            </a>
            <Button
              onClick={restart}
              variant="outline"
              className="w-full h-12 text-base font-semibold rounded-xl"
            >
              Try Again
            </Button>
            <p className="text-center text-sm text-gray-400">
              This was a single session. Create a free account to track your child&apos;s growth across multiple sessions and unlock appetite signals.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Playing Screen ────────────────────────────────────────

  if (!currentItem) return null;

  const domain = DOMAIN_CONFIG[currentItem.domain] ?? DOMAIN_CONFIG.reasoning;
  const progressPct = (responses.length / totalItems) * 100;

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Top bar */}
      <div className="px-4 pt-2 pb-1 shrink-0">
        <div className="max-w-2xl mx-auto space-y-1.5">
          {/* Level + domain + streak */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{MOUNTAIN_LEVELS[currentLevel]}</span>
              <span className="text-xs font-bold text-gray-700">Lv {currentLevel + 1}</span>
            </div>
            <Badge variant="outline" className={`${domain.bg} ${domain.color} ${domain.border} text-xs px-2 py-0.5`}>
              {domain.emoji} {domain.label}
            </Badge>
            {streak >= 3 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1"
              >
                <span className="text-base">🔥</span>
                <span className="text-xs font-bold text-orange-600">{streak}</span>
              </motion.div>
            )}
          </div>

          {/* Progress bar */}
          <Progress value={progressPct} className="h-2" />
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>{responses.length} of ~{totalItems}</span>
            <span className="flex gap-0.5">
              {Array.from({ length: Math.min(itemsCorrect, 15) }, (_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-3 py-2 min-h-0 overflow-hidden">
        {showingTeach && currentItem.teachContent ? (
          <TeachItem
            key={`teach-${currentItem.id}`}
            teachContent={currentItem.teachContent}
            onComplete={() => setShowingTeach(false)}
          />
        ) : (
        <div className="w-full max-w-2xl flex flex-col h-full justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-3 sm:space-y-4 flex flex-col justify-center"
            >
              {/* Question card with optional speak button */}
              <div className="relative">
              <Card className={`p-3 sm:p-4 ${domain.bg} ${domain.border} border-2`}>
                <h2 className="text-base sm:text-lg font-bold text-gray-800 leading-snug text-center">
                  {currentItem.content.stem}
                </h2>
                {/* Visual content (SVG matrix/sequence/analogy) */}
                {(currentItem as VisualDemoItem).visual && (
                  <div className="mt-2 max-h-[35vh] flex items-center justify-center">
                    <VisualItemRenderer visual={(currentItem as VisualDemoItem).visual!} />
                  </div>
                )}
              </Card>
                {/* Show SpeakButton for 3-5 and 6-8 (K-2 auto-speaks instead) */}
                {!isK2 && ttsSupported && (
                  <SpeakButton
                    isSpeaking={isSpeakingStem}
                    isSupported={ttsSupported}
                    onToggle={isSpeakingStem ? stopStem : speakStem}
                    className="absolute -top-2 -right-2"
                  />
                )}
              </div>

              {/* Answer options */}
              <div className={`grid gap-2 sm:gap-2.5 ${currentItem.content.options.length === 2 ? "grid-cols-2" : "grid-cols-2"}`}>
                {currentItem.content.options.map((option, i) => {
                  const colors = OPTION_COLORS[i % OPTION_COLORS.length];
                  const isSelected = selectedAnswer === i;
                  const visualOpt = (currentItem as VisualDemoItem).visualOptions?.[i];

                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: transitioning ? 1 : 1.02 }}
                      whileTap={{ scale: transitioning ? 1 : 0.97 }}
                      onClick={() => handleAnswer(i)}
                      onMouseEnter={() => handleOptionHover(option.text)}
                      onFocus={() => handleOptionHover(option.text)}
                      disabled={transitioning}
                      className={`relative p-3 sm:p-4 rounded-xl border-2 text-left font-semibold transition-all min-h-[56px] flex items-center gap-3 ${
                        isSelected ? colors.selected : `${colors.bg} ${colors.border}`
                      } disabled:cursor-default`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${colors.letter}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {visualOpt ? (
                        <VisualOption shape={visualOpt} />
                      ) : (
                        <span className="text-gray-800 text-sm sm:text-base">{option.text}</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        )}
      </div>
    </div>
  );
}

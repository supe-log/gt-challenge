"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/stores/session-store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// ─── Domain visuals ────────────────────────────────────────────

const DOMAIN_CONFIG: Record<string, { emoji: string; label: string; color: string; bg: string; border: string }> = {
  reasoning: { emoji: "🧩", label: "Reasoning", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  math:      { emoji: "🔢", label: "Math",      color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  verbal:    { emoji: "📖", label: "Verbal",    color: "text-emerald-700",bg: "bg-emerald-50",border: "border-emerald-200" },
  pattern_recognition: { emoji: "🔷", label: "Patterns", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
};

const OPTION_COLORS = [
  { bg: "bg-rose-50 hover:bg-rose-100", border: "border-rose-200 hover:border-rose-400", selected: "bg-rose-200 border-rose-500", correct: "bg-green-100 border-green-500", wrong: "bg-red-100 border-red-400", letter: "bg-rose-200 text-rose-700" },
  { bg: "bg-sky-50 hover:bg-sky-100", border: "border-sky-200 hover:border-sky-400", selected: "bg-sky-200 border-sky-500", correct: "bg-green-100 border-green-500", wrong: "bg-red-100 border-red-400", letter: "bg-sky-200 text-sky-700" },
  { bg: "bg-amber-50 hover:bg-amber-100", border: "border-amber-200 hover:border-amber-400", selected: "bg-amber-200 border-amber-500", correct: "bg-green-100 border-green-500", wrong: "bg-red-100 border-red-400", letter: "bg-amber-200 text-amber-700" },
  { bg: "bg-emerald-50 hover:bg-emerald-100", border: "border-emerald-200 hover:border-emerald-400", selected: "bg-emerald-200 border-emerald-500", correct: "bg-green-100 border-green-500", wrong: "bg-red-100 border-red-400", letter: "bg-emerald-200 text-emerald-700" },
];

const MOUNTAIN_LEVELS = ["🏖️", "🌿", "🌲", "⛰️", "🏔️", "🗻", "☁️", "✨", "🌟", "🚀"];

export default function SessionPage() {
  const searchParams = useSearchParams();
  const childId = searchParams.get("child");
  const {
    currentItem,
    currentItemId,
    currentItemDomain,
    itemsCompleted,
    isComplete,
    isLoading,
    error,
    startSession,
    submitResponse,
    dismissBonusRound,
    reset,
    itemsCorrect,
    highestDifficulty,
    bonusRoundsCompleted,
    offerBonusRound,
    startedAt,
  } = useSessionStore();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const itemStartTime = useRef<number>(Date.now());
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [idleMs, setIdleMs] = useState(0);
  const [showIdlePrompt, setShowIdlePrompt] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [streak, setStreak] = useState(0);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Update elapsed time every 15 seconds
  useEffect(() => {
    if (!startedAt) return;
    const interval = setInterval(() => {
      setElapsedMinutes(Math.floor((Date.now() - startedAt) / 60000));
    }, 15000);
    return () => clearInterval(interval);
  }, [startedAt]);

  // Start session on mount
  useEffect(() => {
    if (childId) {
      reset();
      startSession(childId);
    }
  }, [childId, reset, startSession]);

  // Track item presentation time
  useEffect(() => {
    if (currentItem) {
      itemStartTime.current = Date.now();
      setSelectedAnswer(null);
      setShowFeedback(false);
      resetIdleTimer();
    }
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [currentItem]);

  // Show bonus round modal when offered (only when flag transitions to true)
  useEffect(() => {
    if (offerBonusRound && !isComplete) {
      setShowBonusModal(true);
    }
  }, [offerBonusRound, isComplete]);

  function resetIdleTimer() {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setShowIdlePrompt(false);
    idleTimer.current = setTimeout(() => {
      setShowIdlePrompt(true);
    }, 3 * 60 * 1000);
  }

  async function handleAnswer(index: number) {
    if (isLoading || showFeedback || !currentItem) return;

    setSelectedAnswer(index);
    const isCorrect = index === currentItem.correct_index;
    setLastCorrect(isCorrect);
    setStreak(isCorrect ? streak + 1 : 0);
    setShowFeedback(true);

    const timeOnItem = Date.now() - itemStartTime.current;

    setTimeout(() => {
      submitResponse(index, timeOnItem, idleMs);
      setIdleMs(0);
    }, 800);
  }

  function dismissIdle() {
    setShowIdlePrompt(false);
    resetIdleTimer();
  }

  function handleBonusContinue() {
    setShowBonusModal(false);
    dismissBonusRound(); // Clear the flag so modal doesn't re-trigger
  }

  function handleBonusStop() {
    setShowBonusModal(false);
    dismissBonusRound();
    // Navigate back to parent dashboard — session stays active but user chose to stop
    window.location.href = "/parent";
  }

  const currentLevel = Math.max(0, Math.min(9, Math.floor(((highestDifficulty + 3) / 6) * 10)));
  const progressPct = Math.min(100, (itemsCompleted / 40) * 100);

  // ─── Loading state ───────────────────────────────────────────

  if (isLoading && !currentItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <motion.div
            className="text-7xl"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🚀
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Get Ready!
            </h1>
            <p className="text-gray-500 mt-2">Preparing your challenge...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Error state ─────────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-5xl">😅</div>
          <p className="text-lg text-red-600 font-semibold">Oops! Something went wrong.</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => childId && startSession(childId)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/parent"
              className="px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Go Back
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── Session complete ────────────────────────────────────────

  if (isComplete) {
    const level = Math.max(1, Math.min(10, Math.round(((highestDifficulty + 3) / 6) * 9 + 1)));
    const accuracy = itemsCompleted > 0 ? Math.round((itemsCorrect / itemsCompleted) * 100) : 0;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 via-amber-50 to-orange-50 px-4">
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

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Questions", value: itemsCompleted, emoji: "📝" },
              { label: "Accuracy", value: `${accuracy}%`, emoji: "🎯" },
              { label: "Bonus Rounds", value: bonusRoundsCompleted, emoji: "⭐" },
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
              href="/parent"
              className="block w-full text-center py-4 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-colors"
            >
              Back to Home
            </a>
            <p className="text-center text-sm text-gray-400">
              Come back tomorrow to climb even higher!
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Active session ──────────────────────────────────────────

  if (!currentItem) return null;

  const domain = DOMAIN_CONFIG[currentItemDomain ?? ""] ?? DOMAIN_CONFIG.reasoning;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Overlays */}

      {/* Exit confirm */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center max-w-sm w-full space-y-4"
          >
            <div className="text-4xl">🤔</div>
            <h2 className="text-xl font-bold">Leave the challenge?</h2>
            <p className="text-gray-500 text-sm">
              Your progress so far ({itemsCompleted} questions) will be saved, but this session won&apos;t count toward your score.
            </p>
            <div className="grid gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700"
              >
                Keep Going!
              </button>
              <a
                href="/parent"
                className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-center hover:bg-gray-200"
              >
                Leave Session
              </a>
            </div>
          </motion.div>
        </div>
      )}

      {/* Idle prompt */}
      {showIdlePrompt && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center max-w-sm w-full"
          >
            <p className="text-4xl mb-4">😴</p>
            <h2 className="text-xl font-bold mb-2">Need a break?</h2>
            <p className="text-gray-500 mb-6">Take your time! Tap below when you&apos;re ready.</p>
            <button onClick={dismissIdle} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">
              I&apos;m ready!
            </button>
          </motion.div>
        </div>
      )}

      {/* Bonus round modal */}
      {showBonusModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center max-w-sm w-full space-y-4"
          >
            <div className="text-5xl">⭐</div>
            <h2 className="text-2xl font-bold">Bonus Round!</h2>
            <p className="text-gray-600">
              You&apos;ve answered {itemsCompleted} questions! Want to keep going for bonus points?
            </p>
            <div className="grid gap-3">
              <button
                onClick={handleBonusContinue}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-purple-700"
              >
                🚀 Keep Going!
              </button>
              <button
                onClick={handleBonusStop}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
              >
                I&apos;m done for today
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── Top bar ──────────────────────────────────────────── */}
      <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2">
        <div className="max-w-2xl mx-auto space-y-2 sm:space-y-3">
          {/* Row 1: exit, level, domain, streak */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Exit button */}
            <button
              onClick={() => setShowExitConfirm(true)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Leave session"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl">{MOUNTAIN_LEVELS[currentLevel]}</span>
              <span className="text-xs sm:text-sm font-bold text-gray-700">Lv {currentLevel + 1}</span>
            </div>

            <div className="flex-1" />

            <Badge variant="outline" className={`${domain.bg} ${domain.color} ${domain.border} text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1`}>
              {domain.emoji} {domain.label}
            </Badge>

            {streak >= 3 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                <span className="text-base sm:text-lg">🔥</span>
                <span className="text-xs sm:text-sm font-bold text-orange-600">{streak}</span>
              </motion.div>
            )}
          </div>

          {/* Progress bar */}
          <Progress value={progressPct} className="h-2.5 sm:h-3" />

          {/* Row 2: counter + score */}
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-gray-500">
              {itemsCompleted} / ~40 questions
              {elapsedMinutes > 0 && <span className="text-gray-300 ml-2">{elapsedMinutes}m</span>}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-green-600">{itemsCorrect}</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-500">{itemsCompleted}</span>
              <span className="text-gray-400">correct</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Question area ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-3 sm:px-4 py-3 sm:py-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItemId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Question card */}
              <Card className={`p-5 sm:p-8 ${domain.bg} ${domain.border} border-2`}>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-800 leading-relaxed text-center">
                  {currentItem.stem}
                </h2>
              </Card>

              {/* Answer options */}
              <div className={`grid gap-2 sm:gap-3 ${currentItem.options.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
                {currentItem.options.map((option, i) => {
                  const colors = OPTION_COLORS[i % OPTION_COLORS.length];
                  const isSelected = selectedAnswer === i;

                  let classes = `${colors.bg} ${colors.border}`;
                  if (showFeedback && isSelected) {
                    classes = lastCorrect ? colors.correct : colors.wrong;
                  } else if (isSelected) {
                    classes = colors.selected;
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: showFeedback ? 1 : 1.02 }}
                      whileTap={{ scale: showFeedback ? 1 : 0.97 }}
                      onClick={() => handleAnswer(i)}
                      disabled={isLoading || showFeedback}
                      className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 text-left font-semibold transition-all min-h-[56px] sm:min-h-[72px] flex items-center gap-3 sm:gap-4 ${classes} disabled:cursor-default`}
                    >
                      <span className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg ${colors.letter}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-gray-800 text-sm sm:text-lg">{option.text}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
                    {lastCorrect ? (
                      <p className="text-green-600 font-semibold text-base sm:text-lg">⭐ Great job!</p>
                    ) : (
                      <p className="text-blue-600 font-semibold text-base sm:text-lg">Keep going, you&apos;re doing great!</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

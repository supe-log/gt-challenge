"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/stores/session-store";

export default function SessionPage() {
  const searchParams = useSearchParams();
  const childId = searchParams.get("child");
  const {
    currentItem,
    itemsCompleted,
    isComplete,
    isLoading,
    error,
    startSession,
    submitResponse,
    reset,
    itemsCorrect,
    highestDifficulty,
    bonusRoundsCompleted,
  } = useSessionStore();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const itemStartTime = useRef<number>(Date.now());
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [idleMs, setIdleMs] = useState(0);
  const [showIdlePrompt, setShowIdlePrompt] = useState(false);

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

  function resetIdleTimer() {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setShowIdlePrompt(false);
    idleTimer.current = setTimeout(() => {
      setShowIdlePrompt(true);
    }, 3 * 60 * 1000); // 3 minutes
  }

  async function handleAnswer(index: number) {
    if (isLoading || showFeedback || !currentItem) return;

    setSelectedAnswer(index);
    const isCorrect = index === currentItem.correct_index;
    setLastCorrect(isCorrect);
    setShowFeedback(true);

    const timeOnItem = Date.now() - itemStartTime.current;

    // Show feedback for 1.2 seconds, then submit
    setTimeout(() => {
      submitResponse(index, timeOnItem, idleMs);
      setIdleMs(0);
    }, 1200);
  }

  // Idle prompt dismissal
  function dismissIdle() {
    setShowIdlePrompt(false);
    resetIdleTimer();
  }

  // Loading state
  if (isLoading && !currentItem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-gray-600">Preparing your challenge...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-lg text-red-600">Oops! Something went wrong.</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={() => childId && startSession(childId)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Session complete
  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="text-6xl">&#11088;</div>
          <h1 className="text-3xl font-bold">Amazing work!</h1>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Questions answered</p>
              <p className="text-2xl font-bold">{itemsCompleted}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Correct</p>
              <p className="text-2xl font-bold">{itemsCorrect}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Bonus rounds</p>
              <p className="text-2xl font-bold">{bonusRoundsCompleted}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-500">Highest level</p>
              <p className="text-2xl font-bold">{difficultyToLevel(highestDifficulty)}</p>
            </div>
          </div>
          <p className="text-gray-500">
            New challenges unlock next time. Come back to climb higher!
          </p>
          <a
            href="/parent"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  // Active session — show current item
  if (!currentItem) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Idle prompt overlay */}
      {showIdlePrompt && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4"
          >
            <p className="text-4xl mb-4">&#128564;</p>
            <h2 className="text-xl font-bold mb-2">Need a break?</h2>
            <p className="text-gray-500 mb-6">
              Take your time! Tap below when you&apos;re ready to continue.
            </p>
            <button
              onClick={dismissIdle}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
            >
              I&apos;m ready!
            </button>
          </motion.div>
        </div>
      )}

      {/* Progress bar */}
      <div className="px-6 pt-6">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (itemsCompleted / 40) * 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {itemsCompleted} done
          </span>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={itemsCompleted}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Stem */}
              <h2 className="text-xl sm:text-2xl font-semibold text-center leading-relaxed">
                {currentItem.stem}
              </h2>

              {/* Options */}
              <div className="grid gap-3 sm:grid-cols-2">
                {currentItem.options.map((option, i) => {
                  let borderClass = "border-gray-200 hover:border-blue-400";
                  let bgClass = "bg-white hover:bg-blue-50";

                  if (showFeedback && selectedAnswer === i) {
                    if (lastCorrect) {
                      borderClass = "border-green-500";
                      bgClass = "bg-green-50";
                    } else {
                      borderClass = "border-red-400";
                      bgClass = "bg-red-50";
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={isLoading || showFeedback}
                      className={`p-5 rounded-xl border-2 text-left font-medium transition-all ${borderClass} ${bgClass} disabled:cursor-default min-h-[60px]`}
                    >
                      <span className="text-gray-400 mr-3 font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {option.text}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    {lastCorrect ? (
                      <p className="text-green-600 font-semibold text-lg">
                        &#11088; Great job!
                      </p>
                    ) : (
                      <p className="text-blue-600 font-semibold text-lg">
                        Keep going, you&apos;re doing great!
                      </p>
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

function difficultyToLevel(difficulty: number): number {
  // Map -3..3 to levels 1..10
  return Math.max(1, Math.min(10, Math.round(((difficulty + 3) / 6) * 9 + 1)));
}

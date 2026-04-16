"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export interface TeachContent {
  lesson_text: string;
  duration: number; // seconds
  examples?: { text: string }[];
}

interface TeachItemProps {
  teachContent: TeachContent;
  onComplete: () => void;
}

export function TeachItem({ teachContent, onComplete }: TeachItemProps) {
  const [secondsLeft, setSecondsLeft] = useState(teachContent.duration);
  const timerDone = secondsLeft <= 0;

  useEffect(() => {
    setSecondsLeft(teachContent.duration);
  }, [teachContent]);

  useEffect(() => {
    if (timerDone) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerDone, teachContent]);

  const handleReady = useCallback(() => {
    if (timerDone) onComplete();
  }, [timerDone, onComplete]);

  // Split lesson text into paragraphs on double newlines, or treat as one block
  const paragraphs = teachContent.lesson_text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      {/* Header icon */}
      <div className="text-center">
        <motion.div
          className="inline-block text-5xl sm:text-6xl"
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
        >
          📖
        </motion.div>
        <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
          Let&apos;s learn something new!
        </h2>
      </div>

      {/* Lesson card */}
      <Card className="p-6 sm:p-8 bg-amber-50 border-amber-200 border-2">
        <div className="space-y-4">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="text-base sm:text-lg text-gray-800 leading-relaxed"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </Card>

      {/* Examples */}
      {teachContent.examples && teachContent.examples.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-1">
            Examples
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {teachContent.examples.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.12 }}
              >
                <Card className="p-4 bg-white border-amber-100 border">
                  <p className="text-sm sm:text-base text-gray-700 leading-snug">
                    {ex.text}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Timer + Ready button */}
      <div className="text-center space-y-3 pt-2">
        {!timerDone ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <p className="text-sm text-gray-500 font-medium">
              Read carefully...
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-mono">
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  strokeLinecap="round"
                />
              </svg>
              {secondsLeft}s
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleReady}
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 shadow-lg hover:shadow-xl transition-all"
          >
            I&apos;m ready! Test me!
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

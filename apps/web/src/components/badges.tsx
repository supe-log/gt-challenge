"use client";

import { useState, useEffect } from "react";
import type { BadgeResult } from "@/lib/badges";

/* ─── BadgeGrid ──────────────────────────────────────────────────── */

export function BadgeGrid({ badges }: { badges: BadgeResult[] }) {
  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Badges</h2>
        <span className="text-sm text-gray-400">
          {badges.filter((b) => b.earned).length}/{badges.length} earned
        </span>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center gap-1.5 group"
            title={badge.earned ? `${badge.name}: ${badge.description}` : `Locked: ${badge.description}`}
          >
            <div className="relative">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all ${
                  badge.earned
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-200 group-hover:scale-105"
                    : "bg-gray-100 border border-gray-200"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`w-7 h-7 sm:w-8 sm:h-8 ${
                    badge.earned ? "text-white" : "text-gray-300"
                  }`}
                  fill="currentColor"
                >
                  <path d={badge.icon} />
                </svg>
              </div>
              {/* Lock overlay for unearned */}
              {!badge.earned && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <span
              className={`text-[10px] leading-tight text-center font-medium ${
                badge.earned ? "text-gray-700" : "text-gray-400"
              }`}
            >
              {badge.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── BadgeToast ─────────────────────────────────────────────────── */

export function BadgeToast({
  badge,
  onDismiss,
}: {
  badge: BadgeResult;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slide in
    const showTimer = setTimeout(() => setVisible(true), 50);
    // Auto dismiss after 4 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-indigo-200">
        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
            <path d={badge.icon} />
          </svg>
        </div>
        <div>
          <p className="text-xs text-indigo-200 font-medium">Badge Earned!</p>
          <p className="font-semibold">{badge.name}</p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onDismiss, 300);
          }}
          className="ml-2 text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

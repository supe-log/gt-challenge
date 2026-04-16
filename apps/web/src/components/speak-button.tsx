"use client";

import { motion } from "framer-motion";

interface SpeakButtonProps {
  isSpeaking: boolean;
  isSupported: boolean;
  onToggle: () => void;
  /** Extra Tailwind classes for positioning */
  className?: string;
}

/**
 * Small circular speaker button for TTS. Shows an animated pulse when speaking.
 */
export function SpeakButton({
  isSpeaking,
  isSupported,
  onToggle,
  className = "",
}: SpeakButtonProps) {
  if (!isSupported) return null;

  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isSpeaking ? "Stop reading" : "Read aloud"}
      className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
        isSpeaking
          ? "bg-indigo-100 border-indigo-400 text-indigo-600"
          : "bg-gray-100 border-gray-300 text-gray-500 hover:bg-gray-200 hover:border-gray-400"
      } ${className}`}
    >
      {/* Animated pulse ring when speaking */}
      {isSpeaking && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-indigo-400"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Speaker icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10"
      >
        {/* Speaker body */}
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {isSpeaking ? (
          <>
            {/* Sound waves when speaking */}
            <motion.path
              d="M15.54 8.46a5 5 0 0 1 0 7.07"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.path
              d="M19.07 4.93a10 10 0 0 1 0 14.14"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            />
          </>
        ) : (
          /* Single small wave when not speaking */
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        )}
      </svg>
    </motion.button>
  );
}

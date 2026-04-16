"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseSpeechOptions {
  /** Auto-speak whenever `text` changes */
  autoSpeak?: boolean;
  /** Speech rate (0.8 for K-2, 1.0 for older) */
  rate?: number;
  /** Pitch (1.1 for K-2, 1.0 for older) */
  pitch?: number;
}

export interface UseSpeechReturn {
  speak: () => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

/**
 * Picks a child-friendly voice if available.
 * Prefers Google US English female voices, then any female-sounding en-US voice,
 * then falls back to the first en-US voice, then the default.
 */
function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const enUS = voices.filter((v) => v.lang.startsWith("en"));

  // Prefer Google female voices (they sound friendlier for kids)
  const googleFemale = enUS.find(
    (v) =>
      v.name.includes("Google") &&
      (v.name.includes("Female") || v.name.includes("US English"))
  );
  if (googleFemale) return googleFemale;

  // Any female-sounding voice
  const female = enUS.find(
    (v) =>
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("samantha") ||
      v.name.toLowerCase().includes("karen") ||
      v.name.toLowerCase().includes("victoria")
  );
  if (female) return female;

  // First en-US voice
  if (enUS.length > 0) return enUS[0];

  // Absolute fallback
  return voices[0] ?? null;
}

export function useSpeech(
  text: string,
  options: UseSpeechOptions = {}
): UseSpeechReturn {
  const { autoSpeak = false, rate = 1.0, pitch = 1.0 } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mountedRef = useRef(true);

  // Check support on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      // Chrome loads voices asynchronously; this forces a refresh
      const handleVoicesChanged = () => {
        // voices are now available — no state to set, pickVoice() will find them
      };
      window.speechSynthesis.addEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
      // Trigger initial load
      window.speechSynthesis.getVoices();

      return () => {
        window.speechSynthesis.removeEventListener(
          "voiceschanged",
          handleVoicesChanged
        );
      };
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!text.trim()) return;

    // Cancel anything currently playing
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = pitch;

    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      if (mountedRef.current) setIsSpeaking(true);
    };
    utterance.onend = () => {
      if (mountedRef.current) setIsSpeaking(false);
    };
    utterance.onerror = () => {
      if (mountedRef.current) setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, rate, pitch]);

  // Auto-speak when text changes (if enabled)
  useEffect(() => {
    if (autoSpeak && text.trim()) {
      // Small delay to let the component settle after animation
      const timer = setTimeout(() => {
        speak();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoSpeak, text, speak]);

  return { speak, stop, isSpeaking, isSupported };
}

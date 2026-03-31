"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase-browser";

interface ItemContent {
  stem: string;
  type: string;
  options: { text?: string; image?: string; audio?: string }[];
  correct_index: number;
  media?: string[];
  audio_stem?: string;
}

interface SessionState {
  sessionId: string | null;
  sessionNumber: number;
  currentItem: ItemContent | null;
  currentItemId: string | null;
  itemsCompleted: number;
  itemsCorrect: number;
  offerBonusRound: boolean;
  isComplete: boolean;
  isLoading: boolean;
  error: string | null;
  startedAt: number | null;
  highestDifficulty: number;
  bonusRoundsCompleted: number;

  startSession: (childId: string) => Promise<void>;
  submitResponse: (answerIndex: number, timeOnItemMs: number, idleTimeMs?: number) => Promise<void>;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessionId: null,
  sessionNumber: 0,
  currentItem: null,
  currentItemId: null,
  itemsCompleted: 0,
  itemsCorrect: 0,
  offerBonusRound: false,
  isComplete: false,
  isLoading: false,
  error: null,
  startedAt: null,
  highestDifficulty: 0,
  bonusRoundsCompleted: 0,

  startSession: async (childId: string) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data, error } = await supabase.functions.invoke("start-session", {
        body: { child_id: childId, device_type: "web" },
      });

      if (error) throw error;

      set({
        sessionId: data.session_id,
        sessionNumber: data.session_number,
        currentItem: data.item,
        currentItemId: data.item_id,
        itemsCompleted: 0,
        itemsCorrect: 0,
        isComplete: false,
        isLoading: false,
        startedAt: Date.now(),
      });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  submitResponse: async (answerIndex: number, timeOnItemMs: number, idleTimeMs = 0) => {
    const { sessionId, currentItemId } = get();
    if (!sessionId || !currentItemId) return;

    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { data, error } = await supabase.functions.invoke("compute-next-item", {
        body: {
          session_id: sessionId,
          item_id: currentItemId,
          answer_index: answerIndex,
          time_on_item_ms: timeOnItemMs,
          idle_time_ms: idleTimeMs,
        },
      });

      if (error) throw error;

      if (data.done) {
        set({
          isComplete: true,
          itemsCompleted: data.items_completed,
          itemsCorrect: data.items_correct,
          highestDifficulty: data.highest_difficulty_reached,
          bonusRoundsCompleted: data.bonus_rounds_completed,
          currentItem: null,
          currentItemId: null,
          isLoading: false,
        });
      } else {
        set({
          currentItem: data.item,
          currentItemId: data.item_id,
          itemsCompleted: data.items_completed,
          offerBonusRound: data.offer_bonus_round,
          isLoading: false,
        });
      }
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  reset: () => {
    set({
      sessionId: null,
      sessionNumber: 0,
      currentItem: null,
      currentItemId: null,
      itemsCompleted: 0,
      itemsCorrect: 0,
      offerBonusRound: false,
      isComplete: false,
      isLoading: false,
      error: null,
      startedAt: null,
      highestDifficulty: 0,
      bonusRoundsCompleted: 0,
    });
  },
}));

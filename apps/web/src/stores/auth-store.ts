"use client";

import { create } from "zustand";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  parentProfile: { id: string; display_name: string } | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  parentProfile: null,
  loading: true,

  initialize: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, display_name")
        .eq("auth_user_id", user.id)
        .eq("role", "parent")
        .single();

      set({ user, parentProfile: profile, loading: false });
    } else {
      set({ user: null, parentProfile: null, loading: false });
    }
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ user: null, parentProfile: null });
  },
}));

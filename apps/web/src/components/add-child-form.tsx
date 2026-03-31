"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const AGE_BANDS = [
  { value: "K-2", label: "K-2 (Ages 5-7)" },
  { value: "3-5", label: "3-5 (Ages 8-10)" },
  { value: "6-8", label: "6-8 (Ages 11-14)" },
];

export function AddChildForm({ parentId }: { parentId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [ageBand, setAgeBand] = useState("3-5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    // Create child profile (NOT an auth user — COPPA)
    const { data: childProfile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        role: "child",
        display_name: name,
        age_band: ageBand,
      })
      .select("id")
      .single();

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    // Link parent to child
    const { error: linkError } = await supabase
      .from("parent_child_links")
      .insert({
        parent_id: parentId,
        child_id: childProfile.id,
        relationship: "parent",
      });

    if (linkError) {
      setError(linkError.message);
      setLoading(false);
      return;
    }

    // Store PII separately
    await supabase.from("child_pii").insert({
      child_id: childProfile.id,
      full_name: name,
    });

    setName("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1 w-full">
        <label htmlFor="child-name" className="block text-sm font-medium text-gray-700 mb-1">
          Child&apos;s display name
        </label>
        <input
          id="child-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="e.g., Alex"
        />
      </div>
      <div className="w-full sm:w-48">
        <label htmlFor="age-band" className="block text-sm font-medium text-gray-700 mb-1">
          Age band
        </label>
        <select
          id="age-band"
          value={ageBand}
          onChange={(e) => setAgeBand(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          {AGE_BANDS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? "Adding..." : "Add Child"}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}

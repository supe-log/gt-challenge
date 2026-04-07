import { z } from "zod";

// ─── Item Content ───────────────────────────────────────────────

export const ItemOptionSchema = z.object({
  text: z.string().optional(),
  image: z.string().optional(), // storage path or URL
  audio: z.string().optional(),
});

export const ItemContentSchema = z.object({
  stem: z.string(), // question text (may be empty for visual-only items)
  type: z.string(), // analogy, series_completion, matrix, etc.
  options: z.array(ItemOptionSchema).min(2).max(6),
  correct_index: z.number().int().min(0),
  media: z.array(z.string()).optional(), // images/audio for the stem
  audio_stem: z.string().optional(), // audio version for pre-readers
});
export type ItemContent = z.infer<typeof ItemContentSchema>;

export const TeachContentSchema = z.object({
  lesson_text: z.string(),
  lesson_media: z.array(z.string()).optional(),
  lesson_audio: z.string().optional(),
  duration_seconds: z.number().int().min(10).max(120),
});
export type TeachContent = z.infer<typeof TeachContentSchema>;

// ─── Database Row Types ─────────────────────────────────────────

export const ItemRowSchema = z.object({
  id: z.string().uuid(),
  domain: z.enum(["reasoning", "math", "verbal", "pattern_recognition"]),
  subdomain: z.string(),
  age_bands: z.array(z.enum(["K-2", "3-5", "6-8"])),
  difficulty: z.number().min(-3).max(3), // b parameter
  discrimination: z.number().min(0.5).max(2.5), // a parameter
  guessing: z.number().min(0).max(0.35), // c parameter
  content_json: ItemContentSchema,
  teach_item: z.boolean(),
  teach_content_json: TeachContentSchema.nullable(),
  exposure_count: z.number().int().min(0),
  status: z.enum(["draft", "active", "retired", "flagged"]),
  created_at: z.string(),
  reviewed_at: z.string().nullable(),
});
export type ItemRow = z.infer<typeof ItemRowSchema>;

export const SessionRowSchema = z.object({
  id: z.string().uuid(),
  child_id: z.string().uuid(),
  parent_id: z.string().uuid(),
  session_number: z.number().int().min(1),
  starting_theta: z.number(),
  terminal_theta: z.number().nullable(),
  terminal_se: z.number().nullable(),
  status: z.enum(["active", "completed", "abandoned", "invalidated"]),
  items_attempted: z.number().int().min(0),
  items_correct: z.number().int().min(0),
  voluntary_bonus_rounds: z.number().int().min(0),
  device_type: z.string(),
  is_proctored: z.boolean(),
  started_at: z.string(),
  ended_at: z.string().nullable(),
  duration_seconds: z.number().int().nullable(),
});
export type SessionRow = z.infer<typeof SessionRowSchema>;

export const ResponseRowSchema = z.object({
  id: z.string().uuid(),
  session_id: z.string().uuid(),
  item_id: z.string().uuid(),
  child_id: z.string().uuid(),
  presented_at: z.string(),
  answered_at: z.string(),
  time_on_item_ms: z.number().int().min(0),
  answer_given: z.unknown(), // jsonb
  is_correct: z.boolean(),
  difficulty_at_presentation: z.number(),
  is_teach_item: z.boolean(),
  idle_time_ms: z.number().int().min(0),
});
export type ResponseRow = z.infer<typeof ResponseRowSchema>;

// ─── API Contracts ──────────────────────────────────────────────

export const StartSessionRequestSchema = z.object({
  child_id: z.string().uuid(),
  device_type: z.enum(["web", "ios", "android"]),
});
export type StartSessionRequest = z.infer<typeof StartSessionRequestSchema>;

export const StartSessionResponseSchema = z.object({
  session_id: z.string().uuid(),
  session_number: z.number().int(),
  item: ItemContentSchema,
  item_id: z.string().uuid(),
});
export type StartSessionResponse = z.infer<typeof StartSessionResponseSchema>;

export const SubmitResponseRequestSchema = z.object({
  session_id: z.string().uuid(),
  item_id: z.string().uuid(),
  answer_index: z.number().int().min(0),
  time_on_item_ms: z.number().int().min(0),
  idle_time_ms: z.number().int().min(0).default(0),
});
export type SubmitResponseRequest = z.infer<typeof SubmitResponseRequestSchema>;

export const NextItemResponseSchema = z.object({
  done: z.literal(false),
  item: ItemContentSchema,
  item_id: z.string().uuid(),
  items_completed: z.number().int(),
  offer_bonus_round: z.boolean(), // true every 10 items
});

export const SessionCompleteResponseSchema = z.object({
  done: z.literal(true),
  items_completed: z.number().int(),
  items_correct: z.number().int(),
  highest_difficulty_reached: z.number(),
  bonus_rounds_completed: z.number().int(),
});

export const SubmitResponseResponseSchema = z.discriminatedUnion("done", [
  NextItemResponseSchema,
  SessionCompleteResponseSchema,
]);
export type SubmitResponseResponse = z.infer<typeof SubmitResponseResponseSchema>;

// ─── Appetite Signals ──────────────────────────────────────────

export const AppetiteSignalRowSchema = z.object({
  id: z.string().uuid(),
  child_id: z.string().uuid(),
  signal_type: z.enum([
    "return_visit",
    "persistence",
    "voluntary_hard",
    "learning_velocity",
    "time_investment",
    "streak",
  ]),
  signal_value: z.number().min(0).max(1),
  session_id: z.string().uuid().nullable(),
  computed_at: z.string(),
  raw_data: z.unknown(),
});
export type AppetiteSignalRow = z.infer<typeof AppetiteSignalRowSchema>;

export const CompositeScoreRowSchema = z.object({
  id: z.string().uuid(),
  child_id: z.string().uuid(),
  parent_id: z.string().uuid(),
  aptitude_theta: z.number().nullable(),
  aptitude_se: z.number().nullable(),
  aptitude_tier: z.enum(["high", "very_high", "exceptional"]).nullable(),
  appetite_score: z.number().nullable(),
  appetite_tier: z.enum(["high", "very_high", "exceptional"]).nullable(),
  sessions_completed: z.number().int().min(0),
  proctor_eligible: z.boolean(),
  proctor_validated: z.boolean(),
  proctor_session_id: z.string().uuid().nullable(),
  admission_eligible: z.boolean(),
  computed_at: z.string(),
});
export type CompositeScoreRow = z.infer<typeof CompositeScoreRowSchema>;

-- GT Challenge: Initial Schema
-- All tables use Row-Level Security (RLS).
-- Children are NOT Supabase Auth users (COPPA compliance).
-- Parents authenticate; children are linked profiles.

-- ─── Enums ──────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('child', 'parent', 'admin', 'psychometrician');
CREATE TYPE relationship_type AS ENUM ('parent', 'guardian', 'educator');
CREATE TYPE domain_type AS ENUM ('reasoning', 'math', 'verbal', 'pattern_recognition');
CREATE TYPE age_band_type AS ENUM ('K-2', '3-5', '6-8');
CREATE TYPE item_status AS ENUM ('draft', 'active', 'retired', 'flagged');
CREATE TYPE session_status AS ENUM ('active', 'completed', 'abandoned', 'invalidated');
CREATE TYPE aptitude_tier AS ENUM ('high', 'very_high', 'exceptional');
CREATE TYPE appetite_tier AS ENUM ('high', 'very_high', 'exceptional');
CREATE TYPE signal_type AS ENUM (
  'return_visit', 'persistence', 'voluntary_hard',
  'learning_velocity', 'time_investment', 'streak'
);

-- ─── Profiles ───────────────────────────────────────────────────

CREATE TABLE profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- For parents: references auth.users.id. For children: NULL.
  auth_user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role        user_role NOT NULL,
  display_name text NOT NULL,
  avatar_id   int DEFAULT 1,
  age_band    age_band_type,          -- NULL for parents/admins
  grade       int CHECK (grade >= 0 AND grade <= 8),
  timezone    text DEFAULT 'America/New_York',
  onboarding_complete boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- ─── Parent-Child Links ─────────────────────────────────────────

CREATE TABLE parent_child_links (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  relationship relationship_type NOT NULL DEFAULT 'parent',
  created_at  timestamptz DEFAULT now(),
  UNIQUE (parent_id, child_id)
);

-- ─── Child PII (isolated, encrypted at rest by Supabase) ────────

CREATE TABLE child_pii (
  child_id    uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  full_name   text NOT NULL,
  date_of_birth date,
  created_at  timestamptz DEFAULT now()
);

-- ─── Item Bank ──────────────────────────────────────────────────

CREATE TABLE items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain          domain_type NOT NULL,
  subdomain       text NOT NULL DEFAULT '',
  age_bands       age_band_type[] NOT NULL,
  difficulty      float NOT NULL CHECK (difficulty >= -3.0 AND difficulty <= 3.0),
  discrimination  float NOT NULL CHECK (discrimination >= 0.5 AND discrimination <= 2.5),
  guessing        float NOT NULL CHECK (guessing >= 0.0 AND guessing <= 0.35),
  content_json    jsonb NOT NULL,
  teach_item      boolean NOT NULL DEFAULT false,
  teach_content_json jsonb,
  exposure_count  int NOT NULL DEFAULT 0,
  status          item_status NOT NULL DEFAULT 'active',
  created_at      timestamptz DEFAULT now(),
  reviewed_at     timestamptz
);

CREATE INDEX idx_items_selection ON items (status, domain, difficulty)
  WHERE status = 'active';
CREATE INDEX idx_items_age_band ON items USING GIN (age_bands);

-- ─── Sessions ───────────────────────────────────────────────────

CREATE TABLE sessions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id              uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id             uuid NOT NULL REFERENCES profiles(id),  -- denormalized for RLS
  session_number        int NOT NULL CHECK (session_number >= 1),
  starting_theta        float NOT NULL DEFAULT 0,
  terminal_theta        float,
  terminal_se           float,
  status                session_status NOT NULL DEFAULT 'active',
  items_attempted       int NOT NULL DEFAULT 0,
  items_correct         int NOT NULL DEFAULT 0,
  voluntary_bonus_rounds int NOT NULL DEFAULT 0,
  abandonment_point     text,
  device_type           text NOT NULL DEFAULT 'web',
  is_proctored          boolean NOT NULL DEFAULT false,
  proctor_id            uuid REFERENCES profiles(id),
  started_at            timestamptz DEFAULT now(),
  ended_at              timestamptz,
  duration_seconds      int
);

CREATE INDEX idx_sessions_child ON sessions (child_id, session_number DESC);
CREATE INDEX idx_sessions_active ON sessions (status) WHERE status = 'active';

-- ─── Responses ──────────────────────────────────────────────────

CREATE TABLE responses (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id              uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  item_id                 uuid NOT NULL REFERENCES items(id),
  child_id                uuid NOT NULL REFERENCES profiles(id),  -- denormalized
  presented_at            timestamptz NOT NULL DEFAULT now(),
  answered_at             timestamptz,
  time_on_item_ms         int,
  answer_given            jsonb,
  is_correct              boolean,
  difficulty_at_presentation float,
  is_teach_item           boolean NOT NULL DEFAULT false,
  idle_time_ms            int NOT NULL DEFAULT 0
);

CREATE INDEX idx_responses_session ON responses (session_id, presented_at);
CREATE INDEX idx_responses_item ON responses (item_id);

-- ─── Appetite Signals ───────────────────────────────────────────

CREATE TABLE appetite_signals (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  signal_type signal_type NOT NULL,
  signal_value float NOT NULL CHECK (signal_value >= 0 AND signal_value <= 1),
  session_id  uuid REFERENCES sessions(id),
  computed_at timestamptz DEFAULT now(),
  raw_data    jsonb
);

CREATE INDEX idx_appetite_child ON appetite_signals (child_id, signal_type);

-- ─── Composite Scores ───────────────────────────────────────────

CREATE TABLE composite_scores (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id          uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id         uuid NOT NULL REFERENCES profiles(id),  -- denormalized for RLS
  aptitude_theta    float,
  aptitude_se       float,
  aptitude_tier     aptitude_tier,
  appetite_score    float,
  appetite_tier     appetite_tier,
  sessions_completed int NOT NULL DEFAULT 0,
  proctor_eligible  boolean NOT NULL DEFAULT false,
  proctor_validated boolean NOT NULL DEFAULT false,
  proctor_session_id uuid REFERENCES sessions(id),
  admission_eligible boolean NOT NULL DEFAULT false,
  computed_at       timestamptz DEFAULT now()
);

-- ─── Row-Level Security ─────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_child_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_pii ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE appetite_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE composite_scores ENABLE ROW LEVEL SECURITY;

-- Profiles: users see their own profile + their children's profiles
CREATE POLICY profiles_own ON profiles FOR ALL
  USING (auth_user_id = auth.uid());

CREATE POLICY profiles_children ON profiles FOR SELECT
  USING (
    id IN (
      SELECT child_id FROM parent_child_links
      WHERE parent_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    )
  );

-- Parent-child links: parents see their own links
CREATE POLICY pcl_parent ON parent_child_links FOR ALL
  USING (
    parent_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

-- Child PII: only the parent who owns the child
CREATE POLICY pii_parent ON child_pii FOR ALL
  USING (
    child_id IN (
      SELECT child_id FROM parent_child_links
      WHERE parent_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    )
  );

-- Items: all authenticated users can read active items
CREATE POLICY items_read ON items FOR SELECT
  USING (auth.uid() IS NOT NULL AND status = 'active');

-- Sessions: parent sees their children's sessions (using denormalized parent_id)
CREATE POLICY sessions_parent ON sessions FOR ALL
  USING (
    parent_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

-- Responses: parent sees their children's responses
CREATE POLICY responses_parent ON responses FOR ALL
  USING (
    session_id IN (
      SELECT id FROM sessions
      WHERE parent_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    )
  );

-- Appetite signals: parent sees their children's signals
CREATE POLICY appetite_parent ON appetite_signals FOR SELECT
  USING (
    child_id IN (
      SELECT child_id FROM parent_child_links
      WHERE parent_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    )
  );

-- Composite scores: parent sees their children's scores (denormalized parent_id)
CREATE POLICY scores_parent ON composite_scores FOR SELECT
  USING (
    parent_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

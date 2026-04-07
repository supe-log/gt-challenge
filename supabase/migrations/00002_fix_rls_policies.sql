-- Fix missing RLS policies for appetite signals and child profile creation

-- ─── Appetite Signals: Allow INSERT from edge functions (service role) ───
-- Edge functions run with the service role key, which bypasses RLS.
-- But for defense-in-depth, also allow authenticated users to insert
-- appetite signals for children they are linked to.

CREATE POLICY appetite_insert ON appetite_signals FOR INSERT
  WITH CHECK (
    child_id IN (
      SELECT child_id FROM parent_child_links
      WHERE parent_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    )
  );

-- ─── Child Profile Creation: Allow parents to INSERT child profiles ───
-- Children have auth_user_id = NULL (COPPA compliance).
-- Parents need to be able to create child profiles.

CREATE POLICY profiles_children_insert ON profiles FOR INSERT
  WITH CHECK (
    role = 'child' AND auth_user_id IS NULL
  );

-- ─── Parent-Child Links: Ensure INSERT is covered ───
-- The existing pcl_parent policy uses FOR ALL with USING, which in
-- PostgreSQL covers SELECT/UPDATE/DELETE but INSERT needs WITH CHECK.
-- Add explicit INSERT policy.

CREATE POLICY pcl_parent_insert ON parent_child_links FOR INSERT
  WITH CHECK (
    parent_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

-- ─── Child PII: Allow INSERT for linked parents ───
CREATE POLICY pii_parent_insert ON child_pii FOR INSERT
  WITH CHECK (
    child_id IN (
      SELECT child_id FROM parent_child_links
      WHERE parent_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    )
  );

-- ─── Composite Scores: Allow UPDATE from edge functions ───
-- Edge functions need to update appetite_score and appetite_tier.
-- Service role bypasses RLS, but add policy for completeness.

CREATE POLICY scores_parent_update ON composite_scores FOR UPDATE
  USING (
    parent_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
  );

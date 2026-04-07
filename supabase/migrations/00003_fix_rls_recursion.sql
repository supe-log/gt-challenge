-- Fix infinite recursion in profiles RLS policies.
-- The profiles_children policy subqueries profiles, triggering RLS again.
-- Solution: SECURITY DEFINER function bypasses RLS for the helper lookup.

CREATE OR REPLACE FUNCTION get_my_profile_id()
  RETURNS uuid
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
AS $$
  SELECT id FROM profiles WHERE auth_user_id = auth.uid() LIMIT 1
$$;

-- Drop the recursive policy and recreate it using the helper
DROP POLICY IF EXISTS profiles_children ON profiles;

CREATE POLICY profiles_children ON profiles FOR SELECT
  USING (
    id IN (
      SELECT child_id FROM parent_child_links
      WHERE parent_id = get_my_profile_id()
    )
  );

-- Also fix other policies that have the same recursion pattern
DROP POLICY IF EXISTS pii_parent ON child_pii;
CREATE POLICY pii_parent ON child_pii FOR ALL
  USING (
    child_id IN (
      SELECT child_id FROM parent_child_links
      WHERE parent_id = get_my_profile_id()
    )
  );

DROP POLICY IF EXISTS pii_parent_insert ON child_pii;
CREATE POLICY pii_parent_insert ON child_pii FOR INSERT
  WITH CHECK (
    child_id IN (
      SELECT child_id FROM parent_child_links
      WHERE parent_id = get_my_profile_id()
    )
  );

DROP POLICY IF EXISTS appetite_parent ON appetite_signals;
CREATE POLICY appetite_parent ON appetite_signals FOR SELECT
  USING (
    child_id IN (
      SELECT child_id FROM parent_child_links
      WHERE parent_id = get_my_profile_id()
    )
  );

DROP POLICY IF EXISTS appetite_insert ON appetite_signals;
CREATE POLICY appetite_insert ON appetite_signals FOR INSERT
  WITH CHECK (
    child_id IN (
      SELECT child_id FROM parent_child_links
      WHERE parent_id = get_my_profile_id()
    )
  );

-- Fix policies that reference profiles subquery
DROP POLICY IF EXISTS pcl_parent ON parent_child_links;
CREATE POLICY pcl_parent ON parent_child_links FOR ALL
  USING (parent_id = get_my_profile_id());

DROP POLICY IF EXISTS pcl_parent_insert ON parent_child_links;
CREATE POLICY pcl_parent_insert ON parent_child_links FOR INSERT
  WITH CHECK (parent_id = get_my_profile_id());

DROP POLICY IF EXISTS sessions_parent ON sessions;
CREATE POLICY sessions_parent ON sessions FOR ALL
  USING (parent_id = get_my_profile_id());

DROP POLICY IF EXISTS responses_parent ON responses;
CREATE POLICY responses_parent ON responses FOR ALL
  USING (
    session_id IN (
      SELECT id FROM sessions WHERE parent_id = get_my_profile_id()
    )
  );

DROP POLICY IF EXISTS scores_parent ON composite_scores;
CREATE POLICY scores_parent ON composite_scores FOR SELECT
  USING (parent_id = get_my_profile_id());

DROP POLICY IF EXISTS scores_parent_update ON composite_scores;
CREATE POLICY scores_parent_update ON composite_scores FOR UPDATE
  USING (parent_id = get_my_profile_id());

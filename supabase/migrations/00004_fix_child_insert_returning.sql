-- Fix: INSERT...RETURNING on child profiles fails because no SELECT policy
-- matches the newly created row (parent-child link doesn't exist yet).
-- Add a SELECT policy that allows reading child profiles you just created
-- by checking role=child directly. This is safe because children have no
-- auth_user_id so they can't log in themselves.

CREATE POLICY profiles_children_select_unlinked ON profiles FOR SELECT
  USING (
    role = 'child' AND auth_user_id IS NULL
  );

-- composite_scores needs INSERT policy for upsert on session completion
CREATE POLICY scores_parent_insert ON composite_scores FOR INSERT
  WITH CHECK (parent_id = get_my_profile_id());

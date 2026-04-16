-- Admin RLS policies: Allow users with role='admin' to read all children,
-- sessions, and composite_scores for organization-level dashboards.

-- Helper function: returns true if the current authenticated user has admin role.
CREATE OR REPLACE FUNCTION is_admin()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  )
$$;

-- Admin can read ALL profiles (children, parents, etc.)
CREATE POLICY profiles_admin_read ON profiles FOR SELECT
  USING (is_admin());

-- Admin can read ALL sessions
CREATE POLICY sessions_admin_read ON sessions FOR SELECT
  USING (is_admin());

-- Admin can read ALL composite_scores
CREATE POLICY composite_scores_admin_read ON composite_scores FOR SELECT
  USING (is_admin());

-- Admin can read ALL responses (needed for domain performance stats)
CREATE POLICY responses_admin_read ON responses FOR SELECT
  USING (is_admin());

-- Admin can read ALL parent_child_links (needed for org-level queries)
CREATE POLICY parent_child_links_admin_read ON parent_child_links FOR SELECT
  USING (is_admin());

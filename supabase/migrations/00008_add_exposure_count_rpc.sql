-- RPC to increment item exposure count (called from edge functions)
-- Uses SECURITY DEFINER to bypass RLS (items table is read-only for regular users)

CREATE OR REPLACE FUNCTION increment_exposure_count(item_id_param uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE items
  SET exposure_count = exposure_count + 1
  WHERE id = item_id_param;
$$;

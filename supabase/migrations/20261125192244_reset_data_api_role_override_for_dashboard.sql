-- Applied after the historical override. Keep Data API managed by Supabase Dashboard.
alter role authenticator reset pgrst.db_schemas;
notify pgrst, 'reload config';
notify pgrst, 'reload schema';

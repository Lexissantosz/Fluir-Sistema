alter table public.sessoes_login add column if not exists dispositivo text;
alter table public.sessoes_login add column if not exists ultimo_acesso timestamptz;
alter table public.sessoes_login enable row level security;
revoke all on table public.sessoes_login from anon, authenticated;
